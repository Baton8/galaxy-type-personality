(function() {
	function applyStickyFooterLayout() {
		if (typeof document === "undefined") return;
		var body = document.body;
		var contentsArea = document.getElementById("contents-area");
		var footerBreadcrumbs = document.getElementById("footer-breadcrumbs-2019");
		var footer = document.getElementById("footer-2019");
		if (!body || !contentsArea) return;

		body.style.minHeight = "100vh";
		body.style.display = "flex";
		body.style.flexDirection = "column";

		contentsArea.style.flex = "1 0 auto";
		if (footerBreadcrumbs) footerBreadcrumbs.style.flexShrink = "0";
		if (footer) footer.style.flexShrink = "0";
	}

	function adjustContentsAreaHeight() {
		if (typeof window === "undefined" || typeof document === "undefined") return;
		var contentsArea = document.getElementById("contents-area");
		var footer = document.getElementById("footer-2019");
		if (!contentsArea || !footer) return;

		contentsArea.style.minHeight = "0px";
		var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
		var footerBottom = footer.getBoundingClientRect().bottom;
		var diff = viewportHeight - footerBottom;
		if (diff <= 0) return;

		contentsArea.style.minHeight = contentsArea.offsetHeight + diff + "px";
	}

	function scheduleAdjust() {
		if (typeof window === "undefined") return;
		if (typeof window.requestAnimationFrame === "function") {
			window.requestAnimationFrame(adjustContentsAreaHeight);
			return;
		}
		window.setTimeout(adjustContentsAreaHeight, 0);
	}

	function observeAppLayout() {
		if (typeof window === "undefined" || typeof document === "undefined") return;

		window.addEventListener("load", scheduleAdjust);
		window.addEventListener("resize", scheduleAdjust);

		if (typeof MutationObserver === "undefined") return;
		var appRoot = document.getElementById("galaxy-type-app");
		if (!appRoot) return;

		var scheduled = false;
		var observer = new MutationObserver(function() {
			if (scheduled) return;
			scheduled = true;
			var flush = function() {
				scheduled = false;
				adjustContentsAreaHeight();
			};
			if (typeof window.requestAnimationFrame === "function") {
				window.requestAnimationFrame(flush);
				return;
			}
			window.setTimeout(flush, 0);
		});

		observer.observe(appRoot, {
			childList: true,
			subtree: true,
			attributes: true,
			characterData: true
		});
	}

	function mountApp() {
		applyStickyFooterLayout();

		if (!window.GALAXY_TYPE || !window.GALAXY_TYPE.ui) {
			scheduleAdjust();
			return;
		}
		window.GALAXY_TYPE.ui.mount("galaxy-type-app");
		scheduleAdjust();
	}

	if (typeof document === "undefined") return;
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", function() {
			mountApp();
			observeAppLayout();
		});
		return;
	}
	mountApp();
	observeAppLayout();
})();
