window.GALAXY_TYPE = window.GALAXY_TYPE || {};

(function(ns) {
	var TYPE_IDS = [1, 2, 3, 4, 5, 6, 7, 8];

	function getQuestionTypeIds(question) {
		var idMap = {};
		var ids = [];
		for (var i = 0; i < question.options.length; i++) {
			var option = question.options[i];
			for (var key in option.scores) {
				if (!Object.prototype.hasOwnProperty.call(option.scores, key)) continue;
				var id = Number(key);
				if (!Number.isFinite(id)) continue;
				if (!idMap[id]) {
					idMap[id] = true;
					ids.push(id);
				}
			}
		}
		return ids;
	}

	function calculateTypeScores(answers, selectedQuestions) {
		var baseScores = {};
		for (var i = 0; i < TYPE_IDS.length; i++) {
			baseScores[TYPE_IDS[i]] = { rawScore: 0, appearances: 0 };
		}

		for (var q = 0; q < selectedQuestions.length; q++) {
			var question = selectedQuestions[q];
			var questionTypeIds = getQuestionTypeIds(question);
			for (var t = 0; t < questionTypeIds.length; t++) {
				var typeId = questionTypeIds[t];
				if (baseScores[typeId]) baseScores[typeId].appearances += 1;
			}

			var selectedLabel = answers[question.id];
			if (!selectedLabel) continue;
			var selectedOption = null;
			for (var oi = 0; oi < question.options.length; oi++) {
				if (question.options[oi].label === selectedLabel) {
					selectedOption = question.options[oi];
					break;
				}
			}
			if (!selectedOption) continue;

			for (var key in selectedOption.scores) {
				if (!Object.prototype.hasOwnProperty.call(selectedOption.scores, key)) continue;
				var scoreTypeId = Number(key);
				if (!baseScores[scoreTypeId]) continue;
				baseScores[scoreTypeId].rawScore += selectedOption.scores[key];
			}
		}

		var results = [];
		for (var i2 = 0; i2 < TYPE_IDS.length; i2++) {
			var id = TYPE_IDS[i2];
			var entry = baseScores[id] || { rawScore: 0, appearances: 0 };
			var normalized = entry.appearances > 0 ? entry.rawScore / entry.appearances : 0;
			results.push({
				typeId: id,
				rawScore: entry.rawScore,
				appearances: entry.appearances,
				normalizedScore: normalized,
			});
		}
		return results;
	}

	function determineWinnerType(scores) {
		var sorted = scores.slice().sort(function(a, b) {
			if (b.normalizedScore !== a.normalizedScore) {
				return b.normalizedScore - a.normalizedScore;
			}
			if (b.rawScore !== a.rawScore) {
				return b.rawScore - a.rawScore;
			}
			return a.typeId - b.typeId;
		});
		return sorted[0] ? sorted[0].typeId : 1;
	}

	function getTypeResultById(id) {
		var list = ns.typeResults || [];
		for (var i = 0; i < list.length; i++) {
			if (list[i].id === id) return list[i];
		}
		return null;
	}

	function getTypeResultBySlug(slug) {
		var list = ns.typeResults || [];
		for (var i = 0; i < list.length; i++) {
			if (list[i].slug === slug) return list[i];
		}
		return null;
	}

	function getFallbackTypeResult() {
		return getTypeResultById(7) || (ns.typeResults && ns.typeResults[0]) || null;
	}

	function resolveTypeResult(id) {
		return getTypeResultById(id) || getFallbackTypeResult();
	}

	function resolveTypeResultBySlug(slug) {
		return getTypeResultBySlug(slug) || getFallbackTypeResult();
	}

	function getTypeSlugById(id) {
		var result = resolveTypeResult(id);
		return result ? result.slug : "all-rounder";
	}

	function diagnoseAnswers(answers, selectedQuestions) {
		var scores = calculateTypeScores(answers, selectedQuestions);
		var winnerTypeId = determineWinnerType(scores);
		var result = getTypeResultById(winnerTypeId);
		return {
			scores: scores,
			winnerTypeId: winnerTypeId,
			result: result,
		};
	}

	ns.diagnosis = {
		calculateTypeScores: calculateTypeScores,
		determineWinnerType: determineWinnerType,
		getTypeResultById: getTypeResultById,
		resolveTypeResult: resolveTypeResult,
		getTypeResultBySlug: getTypeResultBySlug,
		resolveTypeResultBySlug: resolveTypeResultBySlug,
		getTypeSlugById: getTypeSlugById,
		diagnoseAnswers: diagnoseAnswers,
	};
})(window.GALAXY_TYPE);
