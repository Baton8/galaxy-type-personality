import { questions } from "@/data/questions";
import { type TypeResult, typeResults } from "@/data/type-results";

export interface AxisScores {
	x: number;
	y: number;
}

export interface DiagnosisResult extends AxisScores {
	typeId: number;
	result: TypeResult | null;
}

export interface ScoreDistributionItem {
	score: number;
	probability: number;
}

export interface AxisNormalization {
	meanX: number;
	meanY: number;
	stdX: number;
	stdY: number;
}

export interface AxisWeights {
	x: number;
	y: number;
}

export interface DeadZoneConfig {
	enabled: boolean;
	threshold: number;
	centerTypeId: number;
}

export type TypeBiases = Record<number, number>;

export interface DiagnosisTuningConfig {
	scoreDistribution: ScoreDistributionItem[];
	axisNormalization: AxisNormalization;
	axisWeights: AxisWeights;
	centroidScale: number;
	deadZone: DeadZoneConfig;
	typeBiases: TypeBiases;
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

const defaultScoreDistribution: ScoreDistributionItem[] = [
	{ score: 2, probability: 0.075 },
	{ score: 1, probability: 0.25 },
	{ score: 0, probability: 0.35 },
	{ score: -1, probability: 0.25 },
	{ score: -2, probability: 0.075 },
];

const getDistributionStats = (distribution: ScoreDistributionItem[]) => {
	const total = distribution.reduce((acc, item) => acc + item.probability, 0);
	const normalizedTotal = total === 0 ? 1 : total;
	const mean = distribution.reduce(
		(acc, item) => acc + item.score * (item.probability / normalizedTotal),
		0,
	);
	const variance = distribution.reduce((acc, item) => {
		const weight = item.probability / normalizedTotal;
		return acc + weight * (item.score - mean) ** 2;
	}, 0);
	return { mean, variance };
};

const buildAxisNormalization = (
	distribution: ScoreDistributionItem[],
): AxisNormalization => {
	const { mean, variance } = getDistributionStats(distribution);
	let meanX = 0;
	let meanY = 0;
	let varianceX = 0;
	let varianceY = 0;

	for (const question of questions) {
		const sign = question.positiveDirection ? 1 : -1;
		const meanContribution = mean * sign;
		const varianceContribution = variance;

		if (question.axis === "X") {
			meanX += meanContribution;
			varianceX += varianceContribution;
		} else {
			meanY += meanContribution;
			varianceY += varianceContribution;
		}
	}

	return {
		meanX,
		meanY,
		stdX: Math.sqrt(varianceX) || 1,
		stdY: Math.sqrt(varianceY) || 1,
	};
};

const defaultTypeBiases: TypeBiases = {
	1: -0.311635,
	2: -0.21924,
	3: -0.0817525,
	4: -0.3836575,
	5: 0.4910225,
	6: -0.545985,
	7: 0.5497225,
	8: 0.501525,
};

export const defaultDiagnosisTuning: DiagnosisTuningConfig = {
	scoreDistribution: defaultScoreDistribution,
	axisNormalization: buildAxisNormalization(defaultScoreDistribution),
	axisWeights: { x: 1, y: 1 },
	centroidScale: 0.6,
	deadZone: { enabled: true, threshold: 0.6, centerTypeId: 7 },
	typeBiases: defaultTypeBiases,
};

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

const normalizeAxisValue = (
	value: number,
	mean: number,
	std: number,
): number => {
	if (!Number.isFinite(std) || std === 0) return value - mean;
	return (value - mean) / std;
};

// ユークリッド距離で最も近いタイプを選択
export const determineTypeId = (
	x: number,
	y: number,
	centroids: Centroid[] = typeCentroids,
	tuning: DiagnosisTuningConfig = defaultDiagnosisTuning,
): number => {
	const {
		axisNormalization,
		axisWeights,
		centroidScale,
		deadZone,
		typeBiases,
	} = tuning;
	const normalizedX = normalizeAxisValue(
		x,
		axisNormalization.meanX,
		axisNormalization.stdX,
	);
	const normalizedY = normalizeAxisValue(
		y,
		axisNormalization.meanY,
		axisNormalization.stdY,
	);
	const weightX = axisWeights.x || 1;
	const weightY = axisWeights.y || 1;
	const shouldExcludeCenter =
		deadZone.enabled &&
		(Math.abs(normalizedX) > deadZone.threshold ||
			Math.abs(normalizedY) > deadZone.threshold);
	const candidates = shouldExcludeCenter
		? centroids.filter((centroid) => centroid.id !== deadZone.centerTypeId)
		: centroids;

	let minDistance = Number.POSITIVE_INFINITY;
	let nearestTypeId = candidates[0]?.id ?? deadZone.centerTypeId;

	for (const centroid of candidates) {
		const centroidX = normalizeAxisValue(
			centroid.x * centroidScale,
			axisNormalization.meanX,
			axisNormalization.stdX,
		);
		const centroidY = normalizeAxisValue(
			centroid.y * centroidScale,
			axisNormalization.meanY,
			axisNormalization.stdY,
		);
		const dx = (normalizedX - centroidX) / weightX;
		const dy = (normalizedY - centroidY) / weightY;
		const bias = typeBiases[centroid.id] ?? 0;
		const distance = Math.sqrt(dx ** 2 + dy ** 2) + bias;
		if (distance < minDistance) {
			minDistance = distance;
			nearestTypeId = centroid.id;
		}
	}

	return nearestTypeId;
};

export const getTypeResultById = (id: number): TypeResult | null => {
	return typeResults.find((type) => type.id === id) ?? null;
};

const fallbackTypeResult =
	typeResults.find((type) => type.id === 7) ?? typeResults[0];

export const resolveTypeResult = (id: number): TypeResult => {
	return getTypeResultById(id) ?? fallbackTypeResult;
};

export const diagnoseAnswers = (
	answers: Record<number, number>,
	centroids?: Centroid[],
	tuning?: DiagnosisTuningConfig,
): DiagnosisResult => {
	const scores = calculateAxisScores(answers);
	const typeId = determineTypeId(scores.x, scores.y, centroids, tuning);
	const result = getTypeResultById(typeId);

	return {
		...scores,
		typeId,
		result,
	};
};
