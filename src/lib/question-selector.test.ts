import { describe, expect, it } from "vitest";
import { type QuestionAxis, questions } from "@/data/questions";
import { selectQuestions } from "@/lib/question-selector";

const axes: QuestionAxis[] = [
	"1. 思慮の深さ",
	"2. アプローチ",
	"3. 接客のスタンス",
	"4. アウトプット",
	"5. 対応スタイル",
];

describe("selectQuestions", () => {
	it("10問を重複なく選び、5軸を最低1問ずつ含む", () => {
		const selected = selectQuestions(questions, () => 0);
		const ids = selected.map((question) => question.id);
		const uniqueIds = new Set(ids);

		expect(selected).toHaveLength(10);
		expect(uniqueIds.size).toBe(10);

		const selectedAxes = new Set(selected.map((question) => question.axis));
		expect(selectedAxes.has("1. 思慮の深さ")).toBe(true);
		expect(selectedAxes.has("2. アプローチ")).toBe(true);
		expect(selectedAxes.has("3. 接客のスタンス")).toBe(true);
		expect(selectedAxes.has("4. アウトプット")).toBe(true);
		expect(selectedAxes.has("5. 対応スタイル")).toBe(true);
	});

	describe("分布検証（1万回試行）", () => {
		const ITERATIONS = 10_000;

		it("Phase 1 で各軸の設問が均一に選ばれる（期待値 ±30%）", () => {
			// Phase 1（最初の5問: 各軸1問）のみを対象に均一性を検証
			// Phase 2 はタイプカバレッジ優先で選択するため均一にはならない
			const axisCounts = new Map<QuestionAxis, Map<string, number>>();
			for (const axis of axes) {
				axisCounts.set(axis, new Map());
			}

			for (let i = 0; i < ITERATIONS; i++) {
				const selected = selectQuestions(questions);
				for (const q of selected.slice(0, 5)) {
					const counts = axisCounts.get(q.axis);
					if (counts) {
						counts.set(q.id, (counts.get(q.id) ?? 0) + 1);
					}
				}
			}

			for (const axis of axes) {
				const counts = axisCounts.get(axis);
				if (!counts) continue;
				const poolSize = questions.filter((q) => q.axis === axis).length;
				const expected = ITERATIONS / poolSize;
				const tolerance = 0.3;

				for (const [questionId, count] of counts) {
					expect(
						count,
						`${axis} の設問 ${questionId}: ${count}回（期待値 ${Math.round(expected)}±30%）`,
					).toBeGreaterThanOrEqual(expected * (1 - tolerance));
					expect(
						count,
						`${axis} の設問 ${questionId}: ${count}回（期待値 ${Math.round(expected)}±30%）`,
					).toBeLessThanOrEqual(expected * (1 + tolerance));
				}
			}
		});

		it("Phase 1 の軸出現順序がランダム化されている", () => {
			const firstQuestionAxisCounts = new Map<QuestionAxis, number>();
			for (const axis of axes) {
				firstQuestionAxisCounts.set(axis, 0);
			}
			let nonCoveringCount = 0;

			for (let i = 0; i < ITERATIONS; i++) {
				const selected = selectQuestions(questions);

				// 最初の5問の軸がすべてユニークであることを集計
				const first5Axes = new Set(selected.slice(0, 5).map((q) => q.axis));
				if (first5Axes.size !== 5) {
					nonCoveringCount++;
				}

				// 問1の軸をカウント
				const firstAxis = selected[0].axis;
				firstQuestionAxisCounts.set(
					firstAxis,
					(firstQuestionAxisCounts.get(firstAxis) ?? 0) + 1,
				);
			}

			// 全試行で最初の5問が5軸をカバーしていること
			expect(
				nonCoveringCount,
				`最初の5問で5軸を網羅しない試行が${nonCoveringCount}回あった`,
			).toBe(0);

			// 問1の軸が5種類すべて出現し、期待値 2000 ±20% に収まること
			const expected = ITERATIONS / axes.length;
			const tolerance = 0.2;

			for (const axis of axes) {
				const count = firstQuestionAxisCounts.get(axis) ?? 0;
				expect(
					count,
					`問1の軸 ${axis}: ${count}回（期待値 ${expected}±20%）`,
				).toBeGreaterThanOrEqual(expected * (1 - tolerance));
				expect(
					count,
					`問1の軸 ${axis}: ${count}回（期待値 ${expected}±20%）`,
				).toBeLessThanOrEqual(expected * (1 + tolerance));
			}
		});
	});
});
