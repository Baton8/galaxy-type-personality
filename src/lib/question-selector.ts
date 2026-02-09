import type {
	Question,
	QuestionAxis,
	QuestionFormat,
	TypeId,
} from "@/data/questions";
import { totalQuestions } from "@/data/questions";

const axes: QuestionAxis[] = [
	"1. 思慮の深さ",
	"2. アプローチ",
	"3. 接客のスタンス",
	"4. アウトプット",
	"5. 対応スタイル",
];

const formats: QuestionFormat[] = ["接客シチュエーション", "間接質問"];

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

const pickRandom = <T>(items: T[], random: () => number): T | null => {
	if (items.length === 0) return null;
	const index = Math.floor(random() * items.length);
	return items[index] ?? null;
};

export const selectQuestions = (
	allQuestions: Question[],
	random: () => number = Math.random,
): Question[] => {
	const selected: Question[] = [];
	const selectedIds = new Set<string>();
	const formatCounts = new Map<QuestionFormat, number>(
		formats.map((format) => [format, 0]),
	);
	const typeCounts = new Map<TypeId, number>(
		([1, 2, 3, 4, 5, 6, 7, 8] as TypeId[]).map((id) => [id, 0]),
	);
	const questionTypeMap = new Map<string, TypeId[]>(
		allQuestions.map((question) => [question.id, getQuestionTypeIds(question)]),
	);

	const selectQuestion = (question: Question) => {
		selected.push(question);
		selectedIds.add(question.id);
		formatCounts.set(
			question.format,
			(formatCounts.get(question.format) ?? 0) + 1,
		);
		const typeIds = questionTypeMap.get(question.id) ?? [];
		for (const id of typeIds) {
			typeCounts.set(id, (typeCounts.get(id) ?? 0) + 1);
		}
	};

	const shuffledAxes = [...axes];
	for (let i = shuffledAxes.length - 1; i > 0; i--) {
		const j = Math.floor(random() * (i + 1));
		[shuffledAxes[i], shuffledAxes[j]] = [shuffledAxes[j], shuffledAxes[i]];
	}

	for (const axis of shuffledAxes) {
		const candidates = allQuestions.filter(
			(question) => question.axis === axis && !selectedIds.has(question.id),
		);
		const picked = pickRandom(candidates, random);
		if (picked) {
			selectQuestion(picked);
		}
	}

	while (
		selected.length < totalQuestions &&
		selected.length < allQuestions.length
	) {
		const [firstFormat, secondFormat] = formats;
		const firstCount = formatCounts.get(firstFormat) ?? 0;
		const secondCount = formatCounts.get(secondFormat) ?? 0;
		let targetFormat: QuestionFormat = firstFormat;
		if (secondCount < firstCount) {
			targetFormat = secondFormat;
		} else if (secondCount === firstCount) {
			targetFormat = random() < 0.5 ? firstFormat : secondFormat;
		}

		const pool = allQuestions.filter(
			(question) => !selectedIds.has(question.id),
		);
		const formatPool = pool.filter(
			(question) => question.format === targetFormat,
		);
		const candidates = formatPool.length > 0 ? formatPool : pool;
		if (candidates.length === 0) break;

		let minCount = Number.POSITIVE_INFINITY;
		let bestCandidates: Question[] = [];
		for (const candidate of candidates) {
			const typeIds = questionTypeMap.get(candidate.id) ?? [];
			const candidateMin = Math.min(
				...typeIds.map((id) => typeCounts.get(id) ?? 0),
			);
			if (candidateMin < minCount) {
				minCount = candidateMin;
				bestCandidates = [candidate];
			} else if (candidateMin === minCount) {
				bestCandidates = [...bestCandidates, candidate];
			}
		}

		const picked = pickRandom(bestCandidates, random) ?? bestCandidates[0];
		if (picked) {
			selectQuestion(picked);
		} else {
			break;
		}
	}

	return selected.slice(0, totalQuestions);
};
