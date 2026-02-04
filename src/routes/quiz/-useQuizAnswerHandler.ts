import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { questions, totalQuestions } from "@/data/questions";
import { diagnoseAnswers } from "@/lib/diagnosis";
import { useQuiz } from "@/state/quiz";

export function useQuizAnswerHandler() {
	const navigate = useNavigate();
	const { state, dispatch } = useQuiz();

	const selectedQuestions = state.selectedQuestionIds
		.map((id) => questions.find((question) => question.id === id))
		.filter((question): question is (typeof questions)[number] =>
			Boolean(question),
		);

	const questionCount =
		state.selectedQuestionIds.length > 0
			? state.selectedQuestionIds.length
			: totalQuestions;

	return useCallback(
		(questionId: string, optionLabel: string, questionIndex: number) => {
			dispatch({ type: "ANSWER", questionId, optionLabel });

			if (questionIndex + 1 < questionCount) {
				const nextQuestionIndex = questionIndex + 1;
				dispatch({ type: "NEXT_QUESTION", nextQuestionIndex });
				navigate({
					to: "/quiz/$questionId",
					params: { questionId: `${nextQuestionIndex + 1}` },
				});
				return;
			}

			const nextAnswers = {
				...state.answers,
				[questionId]: optionLabel,
			};
			const diagnosis = diagnoseAnswers(nextAnswers, selectedQuestions);
			if (diagnosis.result) {
				dispatch({
					type: "COMPLETE",
					result: diagnosis.result,
					typeScores: diagnosis.scores,
				});
			}
			navigate({
				to: "/result/$typeId",
				params: { typeId: `${diagnosis.winnerTypeId}` },
			});
		},
		[dispatch, navigate, questionCount, selectedQuestions, state.answers],
	);
}
