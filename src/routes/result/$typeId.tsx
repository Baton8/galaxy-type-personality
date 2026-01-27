import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { typeResults } from "@/data/type-results";
import { getTypeResultById } from "@/lib/diagnosis";
import { useQuiz } from "@/state/quiz";

const baseUrl = "https://example.com";
const description = "QuizKnock × baton タイプ診断";

export const Route = createFileRoute("/result/$typeId")({
	component: ResultPage,
	head: ({ params }) => {
		const id = Number(params.typeId);
		const result = getTypeResultById(id) ?? typeResults[6];
		const title = `あなたの販売員タイプは${result.typeName}です | 販売員タイプ診断`;
		const ogTitle = `あなたは${result.typeName}タイプ！ | 販売員タイプ診断`;
		const url = `${baseUrl}/result/${result.id}`;

		return {
			meta: [
				{ title },
				{ name: "description", content: description },
				{ property: "og:title", content: ogTitle },
				{ property: "og:description", content: description },
				{ property: "og:image", content: result.ogpImageUrl },
				{ property: "og:url", content: url },
				{ name: "twitter:card", content: "summary_large_image" },
			],
		};
	},
});

function ResultPage() {
	const { typeId } = Route.useParams();
	const [copied, setCopied] = useState(false);
	const { dispatch } = useQuiz();
	const result = useMemo(() => {
		const id = Number(typeId);
		return getTypeResultById(id) ?? typeResults[6];
	}, [typeId]);

	const shareText = `あなたは${result.typeName}でした！`;

	const handleSaveImage = async () => {
		try {
			const response = await fetch(result.imageUrl);
			const blob = await response.blob();

			const isMobile =
				/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) &&
				"ontouchstart" in window;

			// スマホのみ: ネイティブ共有UIで画像を保存
			if (isMobile && navigator.share && navigator.canShare) {
				const file = new File([blob], `${result.typeName}.png`, {
					type: "image/png",
				});
				if (navigator.canShare({ files: [file] })) {
					await navigator.share({
						files: [file],
						title: shareText,
					});
					return;
				}
			}

			// PC・デスクトップ: 自動ダウンロード
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `${result.typeName}.png`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} catch {
			// フォールバック: 新しいタブで画像を開く
			window.open(result.imageUrl, "_blank");
		}
	};

	const handleCopyText = async () => {
		if (typeof navigator === "undefined") return;

		if (navigator.clipboard?.writeText) {
			await navigator.clipboard.writeText(shareText);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		}
	};

	return (
		<main className="page-shell">
			<div className="max-w-5xl mx-auto space-y-8">
				<div className="surface-panel rounded-[22px] p-8 md:p-12">
					<div className="grid gap-10 md:grid-cols-[1.05fr_0.95fr] items-center">
						<div className="space-y-5">
							<p className="eyebrow">Result</p>
							<h1 className="font-display text-3xl md:text-4xl">
								あなたの販売員タイプは
							</h1>
							<h2 className="font-display text-5xl md:text-6xl text-accent">
								{result.typeName}
							</h2>
							<p className="text-ink-soft">モデル: {result.modelName}</p>
							<p className="text-lg text-ink-soft leading-relaxed">
								{result.catchCopy}
							</p>
							<div className="flex flex-wrap gap-2">
								<span className="tag">Type {result.id}</span>
								<span className="tag">8 types</span>
							</div>
						</div>
						<div className="result-media">
							<div
								className="result-media__glow"
								style={{
									background: `url(${result.imageUrl}) center/cover`,
								}}
							/>
							<div className="result-media__frame">
								<img
									src={result.imageUrl}
									alt={`${result.typeName}のイメージ`}
								/>
							</div>
							<div className="result-media__reflection" />
						</div>
					</div>
				</div>

				<div className="grid gap-6 md:grid-cols-3">
					<div className="result-card">
						<p className="eyebrow">Style</p>
						<h3 className="font-display text-xl mt-4">接客スタイル</h3>
						<p className="text-ink-soft leading-relaxed mt-3">
							{result.description}
						</p>
					</div>
					<div className="result-card">
						<p className="eyebrow">Strengths</p>
						<h3 className="font-display text-xl mt-4">強み・魅力</h3>
						<p className="text-ink-soft leading-relaxed mt-3">
							{result.strengths}
						</p>
					</div>
					<div className="result-card">
						<p className="eyebrow">Next Step</p>
						<h3 className="font-display text-xl mt-4">明日からの一歩</h3>
						<p className="text-ink-soft leading-relaxed mt-3">
							{result.actionItems}
						</p>
					</div>
				</div>

				<div className="share-panel flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
					<div>
						<p className="text-lg font-medium text-ink">結果を保存する</p>
						<p className="text-sm text-ink-soft">
							画像や文章を保存してシェアできます。
						</p>
					</div>
					<div className="flex flex-wrap gap-3">
						<button
							type="button"
							onClick={handleSaveImage}
							className="btn-primary"
						>
							画像を保存
						</button>
						<button
							type="button"
							onClick={handleCopyText}
							className="btn-secondary"
						>
							{copied ? "コピーしました" : "文章をコピー"}
						</button>
					</div>
				</div>

				<div className="text-center">
					<Link
						to="/"
						onClick={() => dispatch({ type: "RESET" })}
						className="btn-primary inline-flex items-center justify-center"
					>
						もう一度診断する
					</Link>
				</div>
			</div>
		</main>
	);
}
