import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useReducer,
} from "react";
import { questions } from "@/data/questions";
import type { TypeResult } from "@/data/type-results";
import { readStorageJson, writeStorageJson } from "@/lib/storage";

export interface QuizState {
	currentQuestion: number;
	answers: Record<number, number>;
	isCompleted: boolean;
	result: TypeResult | null;
	debugMode: boolean;
}

export type QuizAction =
	| { type: "ANSWER"; questionId: number; score: number }
	| { type: "NEXT_QUESTION"; nextQuestionId: number }
	| { type: "COMPLETE"; result: TypeResult }
	| { type: "SET_DEBUG"; enabled: boolean }
	| { type: "RESET" };

const storageKey = "sales-quiz-state";

const initialState: QuizState = {
	currentQuestion: 1,
	answers: {},
	isCompleted: false,
	result: null,
	debugMode: false,
};

const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
	switch (action.type) {
		case "ANSWER":
			return {
				...state,
				answers: {
					...state.answers,
					[action.questionId]: action.score,
				},
				isCompleted: false,
			};
		case "NEXT_QUESTION":
			return {
				...state,
				currentQuestion: action.nextQuestionId,
			};
		case "COMPLETE":
			return {
				...state,
				isCompleted: true,
				result: action.result,
			};
		case "SET_DEBUG":
			return {
				...state,
				debugMode: action.enabled,
			};
		case "RESET":
			return initialState;
		default:
			return state;
	}
};

const loadState = (): QuizState => {
	const parsed = readStorageJson<QuizState>("session", storageKey);
	if (!parsed || typeof parsed !== "object") return initialState;

	return {
		currentQuestion: parsed.currentQuestion ?? 1,
		answers: parsed.answers ?? {},
		isCompleted: parsed.isCompleted ?? false,
		result: parsed.result ?? null,
		debugMode: parsed.debugMode ?? false,
	};
};

interface QuizContextValue {
	state: QuizState;
	dispatch: React.Dispatch<QuizAction>;
	answeredCount: number;
	totalQuestions: number;
}

const QuizContext = createContext<QuizContextValue | null>(null);

export const QuizProvider = ({ children }: { children: React.ReactNode }) => {
	const [state, dispatch] = useReducer(quizReducer, initialState, loadState);

	const value = useMemo(() => {
		return {
			state,
			dispatch,
			answeredCount: Object.keys(state.answers).length,
			totalQuestions: questions.length,
		};
	}, [state]);

	useEffect(() => {
		writeStorageJson("session", storageKey, state);
	}, [state]);

	return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

export const useQuiz = () => {
	const context = useContext(QuizContext);
	if (!context) {
		throw new Error("useQuiz must be used within QuizProvider");
	}
	return context;
};
