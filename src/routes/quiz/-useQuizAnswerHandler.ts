import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { totalQuestions } from "@/data/questions";
import { diagnoseAnswers } from "@/lib/diagnosis";
import { useCentroids } from "@/state/centroids";
import { useQuiz } from "@/state/quiz";

export function useQuizAnswerHandler() {
	const navigate = useNavigate();
	const { state, dispatch } = useQuiz();
	const { centroids } = useCentroids();

	return useCallback(
		(questionId: number, score: number) => {
			dispatch({ type: "ANSWER", questionId, score });

			if (questionId < totalQuestions) {
				const nextQuestionId = questionId + 1;
				dispatch({ type: "NEXT_QUESTION", nextQuestionId });
				navigate({
					to: "/quiz/$questionId",
					params: { questionId: `${nextQuestionId}` },
				});
				return;
			}

			const nextAnswers = {
				...state.answers,
				[questionId]: score,
			};
			const diagnosis = diagnoseAnswers(nextAnswers, centroids);
			if (diagnosis.result) {
				dispatch({ type: "COMPLETE", result: diagnosis.result });
			}
			navigate({
				to: "/result/$typeId",
				params: { typeId: `${diagnosis.typeId}` },
			});
		},
		[centroids, dispatch, navigate, state.answers],
	);
}
