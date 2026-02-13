window.GALAXY_TYPE = window.GALAXY_TYPE || {};

(function(ns) {
	var storageKey = "galaxy-type-session-v1";
	var memoryState = null;

	function getDefaultState() {
		var questions = ns.questions || [];
		var selector = ns.questionSelector;
		var selected = selector && typeof selector.selectQuestions === "function"
			? selector.selectQuestions(questions)
			: [];
		var selectedIds = [];
		for (var i = 0; i < selected.length; i++) {
			selectedIds.push(selected[i].id);
		}
		return {
			version: 1,
			selectedQuestionIds: selectedIds,
			currentQuestionIndex: 0,
			answers: {},
			isCompleted: false,
			winnerTypeId: null,
			winnerSlug: null,
		};
	}

	function canUseSessionStorage() {
		return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
	}

	function readStorage() {
		if (canUseSessionStorage()) {
			try {
				var raw = window.sessionStorage.getItem(storageKey);
				return raw ? JSON.parse(raw) : null;
			} catch (_e) {}
		}
		return memoryState;
	}

	function writeStorage(value) {
		if (canUseSessionStorage()) {
			try {
				window.sessionStorage.setItem(storageKey, JSON.stringify(value));
				return;
			} catch (_e) {}
		}
		memoryState = value;
	}

	function normalizeState(state) {
		if (!state || typeof state !== "object") return getDefaultState();
		if (!Array.isArray(state.selectedQuestionIds) || state.selectedQuestionIds.length === 0) {
			return getDefaultState();
		}
		if (!state.answers || typeof state.answers !== "object") state.answers = {};
		if (typeof state.currentQuestionIndex !== "number" || state.currentQuestionIndex < 0) {
			state.currentQuestionIndex = 0;
		}
		if (typeof state.isCompleted !== "boolean") state.isCompleted = false;
		if (typeof state.winnerTypeId !== "number") state.winnerTypeId = null;
		if (typeof state.winnerSlug !== "string") state.winnerSlug = null;
		return state;
	}

	function getState() {
		var state = normalizeState(readStorage());
		writeStorage(state);
		return state;
	}

	function setState(state) {
		writeStorage(state);
		return state;
	}

	function resetState() {
		return setState(getDefaultState());
	}

	function getSelectedQuestions(state) {
		var list = ns.questions || [];
		var map = {};
		for (var i = 0; i < list.length; i++) {
			map[list[i].id] = list[i];
		}
		var selected = [];
		for (var j = 0; j < state.selectedQuestionIds.length; j++) {
			var q = map[state.selectedQuestionIds[j]];
			if (q) selected.push(q);
		}
		return selected;
	}

	ns.appState = {
		storageKey: storageKey,
		getState: getState,
		setState: setState,
		resetState: resetState,
		getSelectedQuestions: getSelectedQuestions,
	};
})(window.GALAXY_TYPE);
