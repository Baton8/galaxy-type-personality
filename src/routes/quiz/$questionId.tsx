import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import DebugAxisChart from "@/components/DebugAxisChart";
import DebugCentroidEditor from "@/components/DebugCentroidEditor";
import { questions, totalQuestions } from "@/data/questions";
import { calculateAxisScores, diagnoseAnswers } from "@/lib/diagnosis";
import { useCentroids } from "@/state/centroids";
import { useQuiz } from "@/state/quiz";

export const Route = createFileRoute("/quiz/$questionId")({
	component: QuizPage,
});

const options = [
	{ label: "非常にそう思う", score: 2 },
	{ label: "そう思う", score: 1 },
	{ label: "どちらとも言えない", score: 0 },
	{ label: "あまり思わない", score: -1 },
	{ label: "全く思わない", score: -2 },
];

function QuizPage() {
	const navigate = useNavigate();
	const { state, dispatch } = useQuiz();
	const { centroids } = useCentroids();
	const { questionId } = Route.useParams();
	const id = Number(questionId);
	const question = questions.find((item) => item.id === id);
	const selectedScore = state.answers[id];
	const progress = Math.round((id / totalQuestions) * 100);
	const axisScores = calculateAxisScores(state.answers);

	if (!question) {
		return (
			<main className="page-shell">
				<div className="max-w-3xl mx-auto surface-panel rounded-[20px] p-8 text-center">
					<h1 className="font-display text-2xl mb-4">設問が見つかりません</h1>
					<p className="text-ink-soft mb-6">
						診断を最初からやり直してください。
					</p>
					<Link
						to="/"
						className="btn-secondary inline-flex items-center justify-center"
					>
						TOPへ戻る
					</Link>
				</div>
			</main>
		);
	}

	const handleAnswer = (score: number) => {
		const nextAnswers = {
			...state.answers,
			[id]: score,
		};

		dispatch({ type: "ANSWER", questionId: id, score });

		if (id < totalQuestions) {
			const nextQuestionId = id + 1;
			dispatch({ type: "NEXT_QUESTION", nextQuestionId });
			navigate({
				to: "/quiz/$questionId",
				params: { questionId: `${nextQuestionId}` },
			});
			return;
		}

		const diagnosis = diagnoseAnswers(nextAnswers, centroids);
		if (diagnosis.result) {
			dispatch({ type: "COMPLETE", result: diagnosis.result });
		}
		navigate({
			to: "/result/$typeId",
			params: { typeId: `${diagnosis.typeId}` },
		});
	};

	return (
		<main className="page-shell">
			<div className="max-w-4xl mx-auto space-y-6">
				<div className="surface-panel rounded-[20px] p-6 md:p-10 space-y-8">
					<div className="flex items-center justify-between">
						<span className="eyebrow">Question</span>
						<span className="mono text-xs text-ink-soft">
							Q{id} / {totalQuestions}
						</span>
					</div>
					<div className="flex items-center justify-between text-sm text-ink-soft">
						<span>進行状況</span>
						<span className="text-ink">{progress}%</span>
					</div>
					<div className="progress-track">
						<div className="progress-fill" style={{ width: `${progress}%` }} />
					</div>

					<div className="space-y-6">
						<h1 className="quiz-question font-display text-2xl md:text-3xl leading-relaxed text-ink typeset">
							{question.text}
						</h1>

						<div className="grid gap-3">
							{options.map((option) => {
								const isSelected = selectedScore === option.score;
								return (
									<button
										key={option.label}
										type="button"
										onClick={() => handleAnswer(option.score)}
										className={`option-card ${isSelected ? "option-card--active" : ""}`}
									>
										<div className="flex items-center gap-4">
											<span className="option-score">
												{option.score > 0 ? "+" : ""}
												{option.score}
											</span>
											<div className="text-base md:text-lg text-ink">
												{option.label}
											</div>
										</div>
									</button>
								);
							})}
						</div>
					</div>
				</div>

				<div className="flex items-center justify-between text-sm text-ink-soft">
					{id > 1 ? (
						<Link
							to="/quiz/$questionId"
							params={{ questionId: `${id - 1}` }}
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
				{state.debugMode && (
					<div className="space-y-4">
						<DebugAxisChart x={axisScores.x} y={axisScores.y} />
						<DebugCentroidEditor />
					</div>
				)}
			</div>
		</main>
	);
}
