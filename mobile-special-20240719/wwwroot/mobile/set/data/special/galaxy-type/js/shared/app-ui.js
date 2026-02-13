window.GALAXY_TYPE = window.GALAXY_TYPE || {};

(function(ns) {
	var APP_BASE = "/mobile/special/galaxy-type";

	function escapeHtml(value) {
		return String(value)
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/\"/g, "&quot;")
			.replace(/'/g, "&#39;");
	}

	function getPathname() {
		if (typeof window === "undefined" || !window.location) return "";
		return window.location.pathname || "";
	}

	function getPageKind(pathname) {
		if (pathname.indexOf(APP_BASE + "/diagnosis") === 0) {
			return { kind: "diagnosis" };
		}
		if (pathname.indexOf(APP_BASE + "/result/") === 0) {
			var rest = pathname.slice((APP_BASE + "/result/").length);
			var slug = rest.split("/")[0] || "";
			return { kind: "result", slug: slug };
		}
		return { kind: "top" };
	}

	function navigate(path) {
		if (typeof window === "undefined" || !window.location) return;
		window.location.href = path;
	}

	function renderTop(root) {
		var stateApi = ns.appState;
		var state = stateApi.getState();
		var hasProgress = Object.keys(state.answers || {}).length > 0 && !state.isCompleted;

		root.innerHTML = [
			'<section class="gt-card">',
			'<p class="gt-kicker">販売員タイプ診断</p>',
			'<h1 class="gt-title">あなたの接客スタイルを診断</h1>',
			'<p class="gt-text">10問であなたの強みを可視化し、8タイプから最適な販売員タイプを判定します。</p>',
			'<div class="gt-actions">',
			'<button type="button" class="gt-btn gt-btn-primary" data-gt-start>診断をはじめる</button>',
			hasProgress
				? '<button type="button" class="gt-btn gt-btn-ghost" data-gt-resume>続きから再開</button>'
				: "",
			"</div>",
			"</section>",
		].join("");

		var start = root.querySelector("[data-gt-start]");
		if (start) {
			start.addEventListener("click", function() {
				stateApi.resetState();
				navigate(APP_BASE + "/diagnosis/");
			});
		}
		var resume = root.querySelector("[data-gt-resume]");
		if (resume) {
			resume.addEventListener("click", function() {
				navigate(APP_BASE + "/diagnosis/");
			});
		}
	}

	function renderDiagnosis(root) {
		var stateApi = ns.appState;
		var diag = ns.diagnosis;
		var state = stateApi.getState();
		var selectedQuestions = stateApi.getSelectedQuestions(state);

		if (selectedQuestions.length === 0) {
			state = stateApi.resetState();
			selectedQuestions = stateApi.getSelectedQuestions(state);
		}

		var total = selectedQuestions.length;
		var index = state.currentQuestionIndex;
		if (index < 0) index = 0;
		if (index >= total) index = total - 1;
		if (index < 0) {
			root.innerHTML = '<section class="gt-card"><p class="gt-text">設問の準備に失敗しました。</p></section>';
			return;
		}

		var question = selectedQuestions[index];
		var progress = Math.round(((index + 1) / total) * 100);

		root.innerHTML = [
			'<section class="gt-card">',
			'<p class="gt-kicker">Question ' + (index + 1) + " / " + total + "</p>",
			'<div class="gt-progress"><span style="width:' + progress + '%"></span></div>',
			'<h1 class="gt-question">' + escapeHtml(question.text) + "</h1>",
			'<div class="gt-options">',
			question.options.map(function(option) {
				return '<button type="button" class="gt-option" data-option="' + escapeHtml(option.label) + '">' + escapeHtml(option.label) + "</button>";
			}).join(""),
			"</div>",
			'<div class="gt-actions">',
			'<button type="button" class="gt-btn gt-btn-ghost" data-gt-restart>最初からやり直す</button>',
			"</div>",
			"</section>",
		].join("");

		var optionButtons = root.querySelectorAll("[data-option]");
		for (var i = 0; i < optionButtons.length; i++) {
			optionButtons[i].addEventListener("click", function(e) {
				var label = e.currentTarget.getAttribute("data-option") || "";
				state.answers[question.id] = label;

				if (index + 1 < total) {
					state.currentQuestionIndex = index + 1;
					stateApi.setState(state);
					renderDiagnosis(root);
					return;
				}

				var diagnosis = diag.diagnoseAnswers(state.answers, selectedQuestions);
				var winnerSlug = diag.getTypeSlugById(diagnosis.winnerTypeId);
				state.currentQuestionIndex = total - 1;
				state.isCompleted = true;
				state.winnerTypeId = diagnosis.winnerTypeId;
				state.winnerSlug = winnerSlug;
				stateApi.setState(state);
				navigate(APP_BASE + "/result/" + winnerSlug + "/");
			});
		}

		var restart = root.querySelector("[data-gt-restart]");
		if (restart) {
			restart.addEventListener("click", function() {
				stateApi.resetState();
				renderDiagnosis(root);
			});
		}
	}

	function renderResult(root, slug) {
		var stateApi = ns.appState;
		var diag = ns.diagnosis;
		var result = diag.resolveTypeResultBySlug(slug);
		if (!result) {
			root.innerHTML = '<section class="gt-card"><p class="gt-text">結果データが見つかりませんでした。</p></section>';
			return;
		}

		var state = stateApi.getState();
		state.isCompleted = true;
		state.winnerTypeId = result.id;
		state.winnerSlug = result.slug;
		stateApi.setState(state);

		root.innerHTML = [
			'<section class="gt-card">',
			'<p class="gt-kicker">診断結果</p>',
			'<h1 class="gt-title">' + escapeHtml(result.typeName) + "</h1>",
			'<p class="gt-model">モデル: ' + escapeHtml(result.modelName) + "</p>",
			'<blockquote class="gt-quote">' + escapeHtml(result.characterQuote) + "</blockquote>",
			'<p class="gt-text">' + escapeHtml(result.description) + "</p>",
			'<p class="gt-tip"><strong>アクション:</strong> ' + escapeHtml(result.actionTip) + "</p>",
			'<div class="gt-actions">',
			'<button type="button" class="gt-btn gt-btn-primary" data-gt-retry>もう一度診断する</button>',
			'<a class="gt-btn gt-btn-ghost" href="' + APP_BASE + '/">トップへ戻る</a>',
			"</div>",
			"</section>",
		].join("");

		var retry = root.querySelector("[data-gt-retry]");
		if (retry) {
			retry.addEventListener("click", function() {
				stateApi.resetState();
				navigate(APP_BASE + "/diagnosis/");
			});
		}
	}

	function mount(rootId) {
		if (typeof document === "undefined") return;
		var root = document.getElementById(rootId);
		if (!root) return;

		var pathInfo = getPageKind(getPathname());
		if (pathInfo.kind === "diagnosis") {
			renderDiagnosis(root);
			return;
		}
		if (pathInfo.kind === "result") {
			renderResult(root, pathInfo.slug);
			return;
		}
		renderTop(root);
	}

	ns.ui = {
		mount: mount,
	};
})(window.GALAXY_TYPE);
