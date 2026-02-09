import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useMemo } from "react";
import { questions } from "@/data/questions";

const DebugBarChart = lazy(() => import("@/components/DebugBarChart"));

import { calculateTypeScores } from "@/lib/diagnosis";
import { useQuizAnswerHandler } from "@/routes/quiz/-useQuizAnswerHandler";
import { useQuiz } from "@/state/quiz";

export const Route = createFileRoute("/quiz/$questionId")({
	component: QuizPage,
});

function QuizPage() {
	const { state, totalQuestions } = useQuiz();
	const { questionId } = Route.useParams();
	const index = Number(questionId) - 1;
	const selectedQuestions = useMemo(
		() =>
			state.selectedQuestionIds
				.map((id) => questions.find((question) => question.id === id))
				.filter((question): question is (typeof questions)[number] =>
					Boolean(question),
				),
		[state.selectedQuestionIds],
	);
	const question = selectedQuestions[index];
	const selectedLabel = question ? state.answers[question.id] : undefined;
	const progress =
		index >= 0 ? Math.round(((index + 1) / totalQuestions) * 100) : 0;
	const typeScores = useMemo(() => {
		if (!question) return null;
		return calculateTypeScores(state.answers, selectedQuestions);
	}, [question, selectedQuestions, state.answers]);
	const handleAnswer = useQuizAnswerHandler();

	if (state.selectedQuestionIds.length === 0) {
		return (
			<main className="page-shell">
				<div className="max-w-3xl mx-auto surface-panel rounded-[20px] p-8 text-center">
					<h1 className="font-display text-2xl mb-4">診断の準備中です</h1>
					<p className="text-ink-soft mb-6">まもなく設問が表示されます。</p>
				</div>
			</main>
		);
	}

	if (!question || !Number.isFinite(index)) {
		return (
			<main className="page-shell">
				<div className="max-w-3xl mx-auto surface-panel rounded-[20px] p-8 text-center">
					<h1 className="font-display text-2xl mb-4">設問が見つかりません</h1>
					<p className="text-ink-soft mb-6">
						診断を最初からやり直してください。
					</p>
					<Link to="/" className="btn-secondary">
						TOPへ戻る
					</Link>
				</div>
			</main>
		);
	}

	return (
		<main className="page-shell">
			<div className="max-w-4xl mx-auto space-y-6">
				<div className="surface-panel rounded-[20px] p-6 md:p-10 space-y-8">
					<div className="flex items-center justify-between">
						<span className="eyebrow">Question</span>
						<span className="mono text-xs text-ink-soft">
							Q{index + 1} / {totalQuestions}
						</span>
					</div>
					<div className="flex items-center justify-between text-sm text-ink-soft">
						<span>進行状況</span>
						<span className="text-ink">{progress}%</span>
					</div>
					<div className="progress-track">
						<div className="progress-fill" style={{ width: `${progress}%` }} />
					</div>
					{state.debugMode && (
						<div className="rounded-xl border border-white/30 bg-white/55 px-4 py-3">
							<p className="mono text-[11px] uppercase tracking-[0.12em] text-ink-soft">
								Debug: Question Meta
							</p>
							<div className="mt-2 grid gap-1 text-sm text-ink-soft md:grid-cols-3">
								<p>
									<span className="text-ink">クイズID:</span> {question.id}
								</p>
								<p>
									<span className="text-ink">軸:</span> {question.axis}
								</p>
								<p>
									<span className="text-ink">format:</span> {question.format}
								</p>
							</div>
						</div>
					)}

					<div className="space-y-6">
						<h1 className="quiz-question font-display text-2xl md:text-3xl leading-relaxed text-ink typeset">
							{question.text}
						</h1>

						<div className="grid gap-3">
							{question.options.map((option) => {
								const isSelected = selectedLabel === option.label;
								return (
									<button
										key={option.label}
										type="button"
										onClick={() =>
											handleAnswer(question.id, option.label, index)
										}
										className={`option-card ${isSelected ? "option-card--active" : ""}`}
									>
										<div className="text-base md:text-lg text-ink">
											{option.label}
										</div>
									</button>
								);
							})}
						</div>
					</div>
				</div>

				<div className="flex items-center justify-between text-sm text-ink-soft">
					{index > 0 ? (
						<Link
							to="/quiz/$questionId"
							params={{ questionId: `${index}` }}
							className="btn-ghost"
						>
							前の設問へ
						</Link>
					) : (
						<span />
					)}
					<Link to="/" className="link-underline">
						診断を中断してTOPへ
					</Link>
				</div>
				{state.debugMode && typeScores && (
					<Suspense fallback={<div>Loading debug tools...</div>}>
						<div className="space-y-4">
							<DebugBarChart scores={typeScores} />
						</div>
					</Suspense>
				)}
			</div>
		</main>
	);
}
