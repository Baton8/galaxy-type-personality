import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Button } from "@/components/Button";
import { resolveTypeResult } from "@/lib/diagnosis";
import { publicBaseUrl } from "@/lib/site-config";
import { useQuiz } from "@/state/quiz";

const baseUrl = publicBaseUrl;
const description = "QuizKnock × baton タイプ診断";

export const Route = createFileRoute("/result/$typeId")({
	component: ResultPage,
	head: ({ params }) => {
		const id = Number(params.typeId);
		const result = resolveTypeResult(id);
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
		return resolveTypeResult(id);
	}, [typeId]);

	const shareText = `あなたは${result.typeName}でした！`;

	const handleSaveImage = async () => {
		if (
			typeof window === "undefined" ||
			typeof navigator === "undefined" ||
			typeof document === "undefined"
		) {
			return;
		}

		try {
			const response = await fetch(result.imageUrl);
			if (!response.ok) {
				throw new Error("Failed to fetch image");
			}
			const blob = await response.blob();

			const userAgent = navigator.userAgent ?? "";
			const isMobile =
				/iPhone|iPad|iPod|Android/i.test(userAgent) && "ontouchstart" in window;

			// スマホのみ: ネイティブ共有UIで画像を保存
			if (
				isMobile &&
				typeof navigator.share === "function" &&
				typeof navigator.canShare === "function"
			) {
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
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `${result.typeName}.png`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch {
			// フォールバック: 新しいタブで画像を開く
			try {
				window.open(result.imageUrl, "_blank");
			} catch {}
		}
	};

	const handleCopyText = async () => {
		if (typeof navigator === "undefined" || typeof window === "undefined") {
			return;
		}

		if (navigator.clipboard?.writeText) {
			try {
				await navigator.clipboard.writeText(shareText);
				setCopied(true);
				window.setTimeout(() => setCopied(false), 2000);
			} catch {}
		}
	};

	return (
		<main className="page-shell">
			<div className="max-w-5xl mx-auto space-y-8">
				<div className="surface-panel rounded-[22px] p-8 md:p-12">
					<div className="grid gap-10 md:grid-cols-[1.05fr_0.95fr] items-center">
						<div className="space-y-5">
							<p className="eyebrow">Result</p>
							<h1 className="font-display text-[1.7rem] md:text-4xl typeset">
								あなたの販売員タイプは
							</h1>
							<h2 className="font-display text-[2.8rem] md:text-6xl text-accent typeset">
								{result.typeName}
							</h2>
							<p className="text-ink-soft">モデル: {result.modelName}</p>
							<p className="text-lg text-ink-soft leading-relaxed typeset">
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
						<h3 className="font-display text-lg md:text-xl mt-4 typeset">
							接客スタイル
						</h3>
						<p className="text-ink-soft leading-relaxed mt-3 typeset">
							{result.description}
						</p>
					</div>
					<div className="result-card">
						<p className="eyebrow">Strengths</p>
						<h3 className="font-display text-lg md:text-xl mt-4 typeset">
							強み・魅力
						</h3>
						<p className="text-ink-soft leading-relaxed mt-3 typeset">
							{result.strengths}
						</p>
					</div>
					<div className="result-card">
						<p className="eyebrow">Next Step</p>
						<h3 className="font-display text-lg md:text-xl mt-4 typeset">
							明日からの一歩
						</h3>
						<p className="text-ink-soft leading-relaxed mt-3 typeset">
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
						<Button type="button" onClick={handleSaveImage} variant="primary">
							画像を保存
						</Button>
						<Button type="button" onClick={handleCopyText} variant="secondary">
							{copied ? "コピーしました" : "文章をコピー"}
						</Button>
					</div>
				</div>

				<div className="text-center">
					<Link
						to="/"
						onClick={() => dispatch({ type: "RESET" })}
						className="btn-primary"
					>
						もう一度診断する
					</Link>
				</div>
			</div>
		</main>
	);
}
