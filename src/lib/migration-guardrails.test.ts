import { describe, expect, it } from "vitest";
import { type Question, questions, totalQuestions } from "@/data/questions";
import {
	calculateTypeScores,
	determineWinnerType,
	diagnoseAnswers,
	resolveTypeResult,
} from "@/lib/diagnosis";
import { selectQuestions } from "@/lib/question-selector";

const sampleQuestions: Question[] = [
	{
		id: "Q1",
		format: "接客シチュエーション",
		axis: "1. 思慮の深さ",
		text: "",
		options: [
			{ label: "非常にそう思う", scores: { 1: 2, 2: 1 } },
			{ label: "そう思う", scores: { 1: 1 } },
			{ label: "どちらともいえない", scores: {} },
			{ label: "あまり思わない", scores: { 2: 1 } },
			{ label: "全く思わない", scores: { 2: 2 } },
		],
	},
	{
		id: "Q2",
		format: "間接質問",
		axis: "2. アプローチ",
		text: "",
		options: [
			{ label: "非常にそう思う", scores: { 2: 2 } },
			{ label: "そう思う", scores: { 2: 1 } },
			{ label: "どちらともいえない", scores: { 1: 1 } },
			{ label: "あまり思わない", scores: {} },
			{ label: "全く思わない", scores: {} },
		],
	},
];

const createDeterministicRandom = (values: number[]) => {
	let index = 0;
	return () => {
		const value = values[index % values.length];
		index += 1;
		return value;
	};
};

describe("migration guardrails: diagnosis", () => {
	it("calculateTypeScores は常に8タイプを返し、未知ラベルは加点しない", () => {
		const scores = calculateTypeScores(
			{
				Q1: "存在しないラベル",
				Q2: "どちらともいえない",
			},
			sampleQuestions,
		);

		expect(scores).toHaveLength(8);
		const ids = scores.map((score) => score.typeId);
		expect(ids).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);

		const type1 = scores.find((score) => score.typeId === 1);
		const type2 = scores.find((score) => score.typeId === 2);
		const type8 = scores.find((score) => score.typeId === 8);

		expect(type1?.rawScore).toBe(1);
		expect(type2?.rawScore).toBe(0);
		expect(type1?.appearances).toBe(2);
		expect(type2?.appearances).toBe(2);
		expect(type8?.appearances).toBe(0);
		expect(type8?.normalizedScore).toBe(0);
	});

	it("determineWinnerType は空配列でも 1 を返す", () => {
		expect(determineWinnerType([])).toBe(1);
	});

	it("diagnoseAnswers は winnerTypeId と result を整合させる", () => {
		const diagnosis = diagnoseAnswers(
			{ Q1: "非常にそう思う", Q2: "非常にそう思う" },
			sampleQuestions,
		);

		expect(diagnosis.winnerTypeId).toBe(determineWinnerType(diagnosis.scores));
		expect(diagnosis.result?.id).toBe(diagnosis.winnerTypeId);
	});

	it("resolveTypeResult は不正ID時にバランス型(7)へフォールバックする", () => {
		expect(resolveTypeResult(999).id).toBe(7);
	});
});

describe("migration guardrails: question selection", () => {
	it("selectQuestions は10問を重複なく返し、先頭5問で5軸を網羅する", () => {
		const random = createDeterministicRandom([0.13, 0.77, 0.24, 0.91, 0.58]);
		const selected = selectQuestions(questions, random);
		const ids = selected.map((question) => question.id);
		const uniqueIds = new Set(ids);
		const firstFiveAxes = new Set(
			selected.slice(0, 5).map((question) => question.axis),
		);

		expect(selected).toHaveLength(totalQuestions);
		expect(uniqueIds.size).toBe(totalQuestions);
		expect(firstFiveAxes.size).toBe(5);
	});

	it("selectQuestions の出題形式は最終的に偏りが1問以内", () => {
		const random = createDeterministicRandom([0.04, 0.89, 0.37, 0.62, 0.15]);
		const selected = selectQuestions(questions, random);
		const situationCount = selected.filter(
			(question) => question.format === "接客シチュエーション",
		).length;
		const indirectCount = selected.filter(
			(question) => question.format === "間接質問",
		).length;

		expect(Math.abs(situationCount - indirectCount)).toBeLessThanOrEqual(1);
	});
});
