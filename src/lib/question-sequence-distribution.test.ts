import { describe, expect, it } from "vitest";
import { type QuestionAxis, questions } from "@/data/questions";
import { selectQuestions } from "@/lib/question-selector";

const ITERATIONS = 10_000;
const TOTAL_QUESTIONS = 10;
const PHASE1_QUESTION_COUNT = 5;
const PHASE1_TOLERANCE = 0.35;

const createPositionCounts = () =>
	Array.from({ length: TOTAL_QUESTIONS }, () => new Map<string, number>());

const sumCounts = (counts: Map<string, number>) =>
	Array.from(counts.values()).reduce((sum, value) => sum + value, 0);

const formatDistributionTable = (positionCounts: Map<string, number>[]) => {
	const questionIds = questions
		.map((question) => question.id)
		.sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));

	const headers = [
		"設問ID",
		...Array.from({ length: TOTAL_QUESTIONS }, (_, index) => `${index + 1}問目`),
	];
	const divider = headers.map(() => "---");
	const rows = questionIds.map((questionId) => {
		const counts = positionCounts.map(
			(countsAtPosition) => countsAtPosition.get(questionId) ?? 0,
		);
		return `| ${[questionId, ...counts].join(" | ")} |`;
	});

	return [
		"| " + headers.join(" | ") + " |",
		"| " + divider.join(" | ") + " |",
		...rows,
	].join("\n");
};

const formatPositionSummaryTable = (positionCounts: Map<string, number>[]) => {
	const questionIds = questions.map((question) => question.id);
	const rows = positionCounts.map((counts, index) => {
		const entries = questionIds
			.map((questionId) => [questionId, counts.get(questionId) ?? 0] as const)
			.sort((a, b) => b[1] - a[1]);
		const most = entries[0];
		const least = entries.at(-1);
		const ratio =
			most && least && least[1] > 0
				? (most[1] / least[1]).toFixed(2)
				: "N/A";

		return `| ${index + 1}問目 | ${least?.[0]} (${least?.[1]}) | ${most?.[0]} (${most?.[1]}) | ${ratio} |`;
	});

	return [
		"| 位置 | 最少 | 最大 | 最大/最少 |",
		"| --- | --- | --- | ---: |",
		...rows,
	].join("\n");
};

describe("selectQuestions sequence distribution", () => {
	it("1万回の通し実行で設問分布を集計し、先頭5問の分布がほぼ均等である", () => {
		const positionCounts = createPositionCounts();
		const axisPoolSize = new Map<QuestionAxis, number>();

		for (const question of questions) {
			axisPoolSize.set(question.axis, (axisPoolSize.get(question.axis) ?? 0) + 1);
		}

		for (let i = 0; i < ITERATIONS; i++) {
			const selected = selectQuestions(questions);
			expect(selected).toHaveLength(TOTAL_QUESTIONS);

			for (let position = 0; position < TOTAL_QUESTIONS; position++) {
				const questionId = selected[position]?.id;
				if (!questionId) continue;

				const counts = positionCounts[position];
				counts.set(questionId, (counts.get(questionId) ?? 0) + 1);
			}
		}

		for (const counts of positionCounts) {
			expect(sumCounts(counts)).toBe(ITERATIONS);
		}

		for (let position = 0; position < PHASE1_QUESTION_COUNT; position++) {
			const counts = positionCounts[position];
			for (const question of questions) {
				const observed = counts.get(question.id) ?? 0;
				const poolSize = axisPoolSize.get(question.axis);
				if (!poolSize) {
					throw new Error(`axis pool not found: ${question.axis}`);
				}

				const expected = ITERATIONS / PHASE1_QUESTION_COUNT / poolSize;
				expect(
					observed,
					`${position + 1}問目 ${question.id} の出現回数: ${observed}（期待値 ${expected.toFixed(
						2,
					)}）`,
				).toBeGreaterThanOrEqual(expected * (1 - PHASE1_TOLERANCE));
				expect(
					observed,
					`${position + 1}問目 ${question.id} の出現回数: ${observed}（期待値 ${expected.toFixed(
						2,
					)}）`,
				).toBeLessThanOrEqual(expected * (1 + PHASE1_TOLERANCE));
			}
		}

		console.info(
			`\n[1万回・設問位置分布]\n${formatDistributionTable(positionCounts)}`,
		);
		console.info(
			`\n[位置ごとの偏りサマリー]\n${formatPositionSummaryTable(positionCounts)}`,
		);
	});
});
