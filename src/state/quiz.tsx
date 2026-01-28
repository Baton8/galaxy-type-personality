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

const isFiniteNumber = (value: unknown): value is number => {
	return typeof value === "number" && Number.isFinite(value);
};

const normalizeAnswers = (value: unknown): Record<number, number> => {
	if (!value || typeof value !== "object") return {};

	const sanitized: Record<number, number> = {};
	for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
		const id = Number(key);
		if (!Number.isFinite(id)) continue;
		if (!isFiniteNumber(raw)) continue;
		sanitized[id] = raw;
	}

	return sanitized;
};

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
	const parsed = readStorageJson<Partial<QuizState>>("session", storageKey);
	if (!parsed || typeof parsed !== "object") return initialState;

	const currentQuestion = isFiniteNumber(parsed.currentQuestion)
		? parsed.currentQuestion
		: initialState.currentQuestion;

	return {
		currentQuestion,
		answers: normalizeAnswers(parsed.answers),
		isCompleted:
			typeof parsed.isCompleted === "boolean" ? parsed.isCompleted : false,
		result: parsed.result ?? null,
		debugMode: typeof parsed.debugMode === "boolean" ? parsed.debugMode : false,
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
