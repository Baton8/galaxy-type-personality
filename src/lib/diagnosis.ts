import { questions } from "@/data/questions";
import { typeResults } from "@/data/type-results";

export interface AxisScores {
	x: number;
	y: number;
}

// 各タイプの中心座標
export const typeCentroids = [
	{ id: 1, x: 4, y: 4 }, // コンサルタント型（須貝）
	{ id: 2, x: 2, y: 6 }, // プレゼンター型（鶴崎）
	{ id: 3, x: 4, y: -4 }, // サポーター型（山本）
	{ id: 4, x: 6, y: 2 }, // スピード対応型（東問）
	{ id: 5, x: -5, y: 5 }, // デモンストレーター型（ふくらP）
	{ id: 6, x: 6, y: -5 }, // クロージング型（東言）
	{ id: 7, x: 0, y: 0 }, // バランス型（伊沢）
	{ id: 8, x: -5, y: -5 }, // アドバイザー型（河村）
];

export const calculateAxisScores = (
	answers: Record<number, number>,
): AxisScores => {
	return questions.reduce<AxisScores>(
		(acc, question) => {
			const score = answers[question.id] ?? 0;
			const delta = question.positiveDirection ? score : -score;

			if (question.axis === "X") {
				acc.x += delta;
			} else {
				acc.y += delta;
			}

			return acc;
		},
		{ x: 0, y: 0 },
	);
};

export interface Centroid {
	id: number;
	x: number;
	y: number;
}

// ユークリッド距離で最も近いタイプを選択
export const determineTypeId = (
	x: number,
	y: number,
	centroids: Centroid[] = typeCentroids,
): number => {
	let minDistance = Number.POSITIVE_INFINITY;
	let nearestTypeId = 7;

	for (const centroid of centroids) {
		const distance = Math.sqrt(
			(x - centroid.x) ** 2 + (y - centroid.y) ** 2,
		);
		if (distance < minDistance) {
			minDistance = distance;
			nearestTypeId = centroid.id;
		}
	}

	return nearestTypeId;
};

export const getTypeResultById = (id: number) => {
	return typeResults.find((type) => type.id === id) ?? null;
};

export const diagnoseAnswers = (
	answers: Record<number, number>,
	centroids?: Centroid[],
) => {
	const scores = calculateAxisScores(answers);
	const typeId = determineTypeId(scores.x, scores.y, centroids);
	const result = getTypeResultById(typeId);

	return {
		...scores,
		typeId,
		result,
	};
};
