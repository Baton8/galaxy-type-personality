import { lazy, Suspense, useEffect, useState } from "react";

import { StaticAxisPreview } from "./StaticAxisPreview";

const AxisPreviewChart = lazy(() => import("./AxisPreviewChart"));

/**
 * 初期表示は StaticAxisPreview（軽量SVG）を使い、
 * クライアントサイドでアイドル時に Recharts 版に切り替える
 */
export function LazyAxisChart() {
	const [shouldLoadRecharts, setShouldLoadRecharts] = useState(false);

	useEffect(() => {
		// requestIdleCallback でメインスレッドがアイドルになってから読み込み
		if (typeof requestIdleCallback === "function") {
			const id = requestIdleCallback(
				() => setShouldLoadRecharts(true),
				{ timeout: 2000 }, // 最大2秒待機
			);
			return () => cancelIdleCallback(id);
		}
		// フォールバック: 少し遅延させて読み込み
		const timer = setTimeout(() => setShouldLoadRecharts(true), 100);
		return () => clearTimeout(timer);
	}, []);

	if (!shouldLoadRecharts) {
		return <StaticAxisPreview />;
	}

	return (
		<Suspense fallback={<StaticAxisPreview />}>
			<AxisPreviewChart />
		</Suspense>
	);
}
