import type { Question, TypeId } from "@/data/questions";
import {
	type TypeResult,
	type TypeSlug,
	typeResults,
} from "@/data/type-results";

export interface TypeScoreResult {
	typeId: TypeId;
	rawScore: number;
	appearances: number;
	normalizedScore: number;
}

export interface DiagnosisResult {
	scores: TypeScoreResult[];
	winnerTypeId: TypeId;
	result: TypeResult | null;
}

const getQuestionTypeIds = (question: Question): TypeId[] => {
	const ids = new Set<TypeId>();
	for (const option of question.options) {
		for (const key of Object.keys(option.scores)) {
			const id = Number(key) as TypeId;
			if (Number.isFinite(id)) {
				ids.add(id);
			}
		}
	}
	return Array.from(ids);
};

export const calculateTypeScores = (
	answers: Record<string, string>,
	selectedQuestions: Question[],
): TypeScoreResult[] => {
	const baseScores = new Map<TypeId, { rawScore: number; appearances: number }>(
		([1, 2, 3, 4, 5, 6, 7, 8] as TypeId[]).map((typeId) => [
			typeId,
			{ rawScore: 0, appearances: 0 },
		]),
	);

	for (const question of selectedQuestions) {
		const typeIds = getQuestionTypeIds(question);
		for (const typeId of typeIds) {
			const entry = baseScores.get(typeId);
			if (entry) {
				entry.appearances += 1;
			}
		}

		const selectedLabel = answers[question.id];
		if (!selectedLabel) continue;
		const selectedOption = question.options.find(
			(option) => option.label === selectedLabel,
		);
		if (!selectedOption) continue;

		for (const [key, value] of Object.entries(selectedOption.scores)) {
			const typeId = Number(key) as TypeId;
			const entry = baseScores.get(typeId);
			if (!entry) continue;
			entry.rawScore += value;
		}
	}

	return ([1, 2, 3, 4, 5, 6, 7, 8] as TypeId[]).map((typeId) => {
		const entry = baseScores.get(typeId) ?? { rawScore: 0, appearances: 0 };
		const normalizedScore =
			entry.appearances > 0 ? entry.rawScore / entry.appearances : 0;
		return {
			typeId,
			rawScore: entry.rawScore,
			appearances: entry.appearances,
			normalizedScore,
		};
	});
};

export const determineWinnerType = (scores: TypeScoreResult[]): TypeId => {
	const sorted = [...scores].sort((a, b) => {
		if (b.normalizedScore !== a.normalizedScore) {
			return b.normalizedScore - a.normalizedScore;
		}
		if (b.rawScore !== a.rawScore) {
			return b.rawScore - a.rawScore;
		}
		return a.typeId - b.typeId;
	});
	return sorted[0]?.typeId ?? 1;
};

export const getTypeResultById = (id: number): TypeResult | null => {
	return typeResults.find((type) => type.id === id) ?? null;
};

const fallbackTypeResult =
	typeResults.find((type) => type.id === 7) ?? typeResults[0];

export const resolveTypeResult = (id: number): TypeResult => {
	return getTypeResultById(id) ?? fallbackTypeResult;
};

export const getTypeResultBySlug = (slug: string): TypeResult | null => {
	return typeResults.find((type) => type.slug === slug) ?? null;
};

export const resolveTypeResultBySlug = (slug: string): TypeResult => {
	return getTypeResultBySlug(slug) ?? fallbackTypeResult;
};

export const getTypeSlugById = (id: TypeId): TypeSlug => {
	return resolveTypeResult(id).slug;
};

export const diagnoseAnswers = (
	answers: Record<string, string>,
	selectedQuestions: Question[],
): DiagnosisResult => {
	const scores = calculateTypeScores(answers, selectedQuestions);
	const winnerTypeId = determineWinnerType(scores);
	const result = getTypeResultById(winnerTypeId);

	return {
		scores,
		winnerTypeId,
		result,
	};
};
