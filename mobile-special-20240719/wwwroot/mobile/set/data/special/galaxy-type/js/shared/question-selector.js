window.GALAXY_TYPE = window.GALAXY_TYPE || {};

(function(ns) {
	var axes = [
		"1. 思慮の深さ",
		"2. アプローチ",
		"3. 接客のスタンス",
		"4. アウトプット",
		"5. 対応スタイル",
	];
	var formats = ["接客シチュエーション", "間接質問"];
	var typeIds = [1, 2, 3, 4, 5, 6, 7, 8];

	function getQuestionTypeIds(question) {
		var ids = {};
		var keys = [];
		for (var i = 0; i < question.options.length; i++) {
			var option = question.options[i];
			for (var key in option.scores) {
				if (!Object.prototype.hasOwnProperty.call(option.scores, key)) continue;
				var id = Number(key);
				if (!Number.isFinite(id)) continue;
				if (!ids[id]) {
					ids[id] = true;
					keys.push(id);
				}
			}
		}
		return keys;
	}

	function pickRandom(items, random) {
		if (!items || items.length === 0) return null;
		var index = Math.floor(random() * items.length);
		return items[index] || null;
	}

	function selectQuestions(allQuestions, random) {
		var rand = typeof random === "function" ? random : Math.random;
		var totalQuestions = Number(ns.totalQuestions) || 10;
		var selected = [];
		var selectedIds = {};
		var formatCounts = {};
		var questionTypeMap = {};
		var typeCounts = {};
		var i;

		for (i = 0; i < formats.length; i++) {
			formatCounts[formats[i]] = 0;
		}
		for (i = 0; i < typeIds.length; i++) {
			typeCounts[typeIds[i]] = 0;
		}
		for (i = 0; i < allQuestions.length; i++) {
			questionTypeMap[allQuestions[i].id] = getQuestionTypeIds(allQuestions[i]);
		}

		function commit(question) {
			selected.push(question);
			selectedIds[question.id] = true;
			formatCounts[question.format] = (formatCounts[question.format] || 0) + 1;
			var qTypes = questionTypeMap[question.id] || [];
			for (var j = 0; j < qTypes.length; j++) {
				var qTypeId = qTypes[j];
				typeCounts[qTypeId] = (typeCounts[qTypeId] || 0) + 1;
			}
		}

		var shuffledAxes = axes.slice();
		for (i = shuffledAxes.length - 1; i > 0; i--) {
			var j2 = Math.floor(rand() * (i + 1));
			var tmp = shuffledAxes[i];
			shuffledAxes[i] = shuffledAxes[j2];
			shuffledAxes[j2] = tmp;
		}

		for (i = 0; i < shuffledAxes.length; i++) {
			var axis = shuffledAxes[i];
			var axisCandidates = [];
			for (var ai = 0; ai < allQuestions.length; ai++) {
				var aq = allQuestions[ai];
				if (aq.axis === axis && !selectedIds[aq.id]) {
					axisCandidates.push(aq);
				}
			}
			var picked = pickRandom(axisCandidates, rand);
			if (picked) commit(picked);
		}

		while (selected.length < totalQuestions && selected.length < allQuestions.length) {
			var firstFormat = formats[0];
			var secondFormat = formats[1];
			var firstCount = formatCounts[firstFormat] || 0;
			var secondCount = formatCounts[secondFormat] || 0;
			var targetFormat = firstFormat;
			if (secondCount < firstCount) {
				targetFormat = secondFormat;
			} else if (secondCount === firstCount) {
				targetFormat = rand() < 0.5 ? firstFormat : secondFormat;
			}

			var pool = [];
			for (i = 0; i < allQuestions.length; i++) {
				if (!selectedIds[allQuestions[i].id]) pool.push(allQuestions[i]);
			}
			if (pool.length === 0) break;

			var formatPool = [];
			for (i = 0; i < pool.length; i++) {
				if (pool[i].format === targetFormat) formatPool.push(pool[i]);
			}
			var candidates = formatPool.length > 0 ? formatPool : pool;

			var minCount = Number.POSITIVE_INFINITY;
			var bestCandidates = [];
			for (i = 0; i < candidates.length; i++) {
				var candidate = candidates[i];
				var candidateTypeIds = questionTypeMap[candidate.id] || [];
				var candidateMin = Number.POSITIVE_INFINITY;
				for (var t = 0; t < candidateTypeIds.length; t++) {
					var cnt = typeCounts[candidateTypeIds[t]] || 0;
					if (cnt < candidateMin) candidateMin = cnt;
				}
				if (!Number.isFinite(candidateMin)) candidateMin = 0;

				if (candidateMin < minCount) {
					minCount = candidateMin;
					bestCandidates = [candidate];
				} else if (candidateMin === minCount) {
					bestCandidates.push(candidate);
				}
			}

			var best = pickRandom(bestCandidates, rand) || bestCandidates[0];
			if (!best) break;
			commit(best);
		}

		return selected.slice(0, totalQuestions);
	}

	ns.questionSelector = {
		selectQuestions: selectQuestions,
	};
})(window.GALAXY_TYPE);
