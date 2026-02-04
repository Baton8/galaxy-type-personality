import { describe, expect, it } from "vitest";
import type { Question } from "@/data/questions";
import { calculateTypeScores, determineWinnerType } from "@/lib/diagnosis";

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

describe("calculateTypeScores", () => {
	it("生スコアと正規化スコアを算出する", () => {
		const answers = {
			Q1: "非常にそう思う",
			Q2: "どちらともいえない",
		};
		const scores = calculateTypeScores(answers, sampleQuestions);
		const type1 = scores.find((score) => score.typeId === 1);
		const type2 = scores.find((score) => score.typeId === 2);

		expect(type1?.rawScore).toBe(3);
		expect(type1?.appearances).toBe(2);
		expect(type1?.normalizedScore).toBeCloseTo(1.5, 4);

		expect(type2?.rawScore).toBe(1);
		expect(type2?.appearances).toBe(2);
		expect(type2?.normalizedScore).toBeCloseTo(0.5, 4);
	});
});

describe("determineWinnerType", () => {
	it("正規化スコアが同点なら生スコア、さらに同点ならIDで判定する", () => {
		const winnerByRaw = determineWinnerType([
			{ typeId: 1, rawScore: 2, appearances: 1, normalizedScore: 1 },
			{ typeId: 2, rawScore: 3, appearances: 1, normalizedScore: 1 },
		]);
		expect(winnerByRaw).toBe(2);

		const winnerById = determineWinnerType([
			{ typeId: 1, rawScore: 2, appearances: 1, normalizedScore: 1 },
			{ typeId: 3, rawScore: 2, appearances: 1, normalizedScore: 1 },
		]);
		expect(winnerById).toBe(1);
	});
});
