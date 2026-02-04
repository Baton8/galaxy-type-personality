import { describe, expect, it } from "vitest";
import { questions } from "@/data/questions";
import { selectQuestions } from "@/lib/question-selector";

describe("selectQuestions", () => {
	it("10問を重複なく選び、5軸を最低1問ずつ含む", () => {
		const selected = selectQuestions(questions, () => 0);
		const ids = selected.map((question) => question.id);
		const uniqueIds = new Set(ids);

		expect(selected).toHaveLength(10);
		expect(uniqueIds.size).toBe(10);

		const axes = new Set(selected.map((question) => question.axis));
		expect(axes.has("1. 思慮の深さ")).toBe(true);
		expect(axes.has("2. アプローチ")).toBe(true);
		expect(axes.has("3. 接客のスタンス")).toBe(true);
		expect(axes.has("4. アウトプット")).toBe(true);
		expect(axes.has("5. 対応スタイル")).toBe(true);
	});
});
