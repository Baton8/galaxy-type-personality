import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useReducer,
} from "react";
import { questions, totalQuestions } from "@/data/questions";
import type { TypeResult } from "@/data/type-results";
import type { TypeScoreResult } from "@/lib/diagnosis";
import { selectQuestions } from "@/lib/question-selector";
import { readStorageJson, writeStorageJson } from "@/lib/storage";

export interface QuizState {
	selectedQuestionIds: string[];
	currentQuestionIndex: number;
	answers: Record<string, string>;
	isCompleted: boolean;
	result: TypeResult | null;
	debugMode: boolean;
	typeScores: TypeScoreResult[] | null;
}

export type QuizAction =
	| {
			type: "INITIALIZE";
			selectedQuestionIds: string[];
			debugMode: boolean;
	  }
	| { type: "ANSWER"; questionId: string; optionLabel: string }
	| { type: "NEXT_QUESTION"; nextQuestionIndex: number }
	| { type: "COMPLETE"; result: TypeResult; typeScores: TypeScoreResult[] }
	| { type: "SET_DEBUG"; enabled: boolean }
	| { type: "RESET" };

const storageKey = "sales-quiz-state";

const isFiniteNumber = (value: unknown): value is number => {
	return typeof value === "number" && Number.isFinite(value);
};

const normalizeAnswers = (value: unknown): Record<string, string> => {
	if (!value || typeof value !== "object") return {};

	const sanitized: Record<string, string> = {};
	for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
		if (typeof key !== "string" || typeof raw !== "string") continue;
		sanitized[key] = raw;
	}

	return sanitized;
};

const initialState: QuizState = {
	selectedQuestionIds: [],
	currentQuestionIndex: 0,
	answers: {},
	isCompleted: false,
	result: null,
	debugMode: false,
	typeScores: null,
};

const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
	switch (action.type) {
		case "INITIALIZE":
			return {
				...state,
				selectedQuestionIds: action.selectedQuestionIds,
				debugMode: action.debugMode,
				currentQuestionIndex: 0,
				answers: {},
				isCompleted: false,
				result: null,
				typeScores: null,
			};
		case "ANSWER":
			return {
				...state,
				answers: {
					...state.answers,
					[action.questionId]: action.optionLabel,
				},
				isCompleted: false,
			};
		case "NEXT_QUESTION":
			return {
				...state,
				currentQuestionIndex: action.nextQuestionIndex,
			};
		case "COMPLETE":
			return {
				...state,
				isCompleted: true,
				result: action.result,
				typeScores: action.typeScores,
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

	const questionIdSet = new Set(questions.map((question) => question.id));
	const selectedQuestionIds = Array.isArray(parsed.selectedQuestionIds)
		? parsed.selectedQuestionIds.filter(
				(id): id is string => typeof id === "string" && questionIdSet.has(id),
			)
		: [];

	if (selectedQuestionIds.length !== totalQuestions) {
		return initialState;
	}

	const currentQuestionIndex = isFiniteNumber(parsed.currentQuestionIndex)
		? parsed.currentQuestionIndex
		: initialState.currentQuestionIndex;
	const safeQuestionIndex =
		currentQuestionIndex >= 0 && currentQuestionIndex < totalQuestions
			? currentQuestionIndex
			: initialState.currentQuestionIndex;

	const typeScores = Array.isArray(parsed.typeScores)
		? parsed.typeScores.filter((score) =>
				Boolean(
					score &&
						isFiniteNumber(score.rawScore) &&
						isFiniteNumber(score.appearances) &&
						isFiniteNumber(score.normalizedScore) &&
						isFiniteNumber(score.typeId),
				),
			)
		: null;

	const normalizedAnswers = normalizeAnswers(parsed.answers);
	const filteredAnswers: Record<string, string> = {};
	for (const [key, value] of Object.entries(normalizedAnswers)) {
		if (selectedQuestionIds.includes(key)) {
			filteredAnswers[key] = value;
		}
	}

	return {
		selectedQuestionIds,
		currentQuestionIndex: safeQuestionIndex,
		answers: filteredAnswers,
		isCompleted:
			typeof parsed.isCompleted === "boolean" ? parsed.isCompleted : false,
		result: parsed.result ?? null,
		debugMode: typeof parsed.debugMode === "boolean" ? parsed.debugMode : false,
		typeScores: typeScores && typeScores.length > 0 ? typeScores : null,
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

	useEffect(() => {
		if (state.selectedQuestionIds.length > 0) return;
		const selected = selectQuestions(questions).map((question) => question.id);
		dispatch({
			type: "INITIALIZE",
			selectedQuestionIds: selected,
			debugMode: state.debugMode,
		});
	}, [state.debugMode, state.selectedQuestionIds.length]);

	const value = useMemo(() => {
		const selectedSet = new Set(state.selectedQuestionIds);
		return {
			state,
			dispatch,
			answeredCount: Object.keys(state.answers).filter((id) =>
				selectedSet.has(id),
			).length,
			totalQuestions:
				state.selectedQuestionIds.length > 0
					? state.selectedQuestionIds.length
					: totalQuestions,
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
