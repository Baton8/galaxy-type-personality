import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useMemo, useState } from "react";

import { Button } from "@/components/Button";

const DebugBarChart = lazy(() => import("@/components/DebugBarChart"));

import { questions } from "@/data/questions";
import { calculateTypeScores, resolveTypeResult } from "@/lib/diagnosis";
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
	const { state, dispatch } = useQuiz();
	const result = useMemo(() => {
		const id = Number(typeId);
		return resolveTypeResult(id);
	}, [typeId]);
	const selectedQuestions = useMemo(
		() =>
			state.selectedQuestionIds
				.map((id) => questions.find((question) => question.id === id))
				.filter((question): question is (typeof questions)[number] =>
					Boolean(question),
				),
		[state.selectedQuestionIds],
	);
	const typeScores = useMemo(() => {
		if (state.typeScores) return state.typeScores;
		if (selectedQuestions.length === 0) return null;
		return calculateTypeScores(state.answers, selectedQuestions);
	}, [selectedQuestions, state.answers, state.typeScores]);

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
				const file = new File([blob], `${result.typeName}.webp`, {
					type: "image/webp",
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
			link.download = `${result.typeName}.webp`;
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
		<main className="result-page">
			<div className="result-container">
				{/* Hero Section */}
				<section className="result-hero reveal reveal-1">
					<div className="result-hero__badge">
						<span className="result-hero__badge-text">Your Type</span>
					</div>
					<div className="result-hero__content">
						<div className="result-hero__info">
							<p className="result-hero__label">あなたの販売員タイプは</p>
							<h1 className="result-hero__type">{result.typeName}</h1>
							<p className="result-hero__model">
								<span className="result-hero__model-prefix">Model:</span>
								{result.modelName}
							</p>
						</div>
						<div className="result-hero__visual">
							<div className="result-hero__image-container">
								<div
									className="result-hero__glow"
									style={{
										background: `url(${result.imageUrl}) center/cover`,
									}}
								/>
								<img
									src={result.imageUrl}
									alt={`${result.typeName}のイメージ`}
									className="result-hero__image"
								/>
							</div>
						</div>
					</div>
				</section>

				{/* Quote Section */}
				<section className="result-quote reveal reveal-2">
					<div className="result-quote__mark">"</div>
					<blockquote className="result-quote__text">
						{result.characterQuote}
					</blockquote>
					<cite className="result-quote__cite">— {result.modelName}</cite>
				</section>

				{/* Description Section */}
				<section className="result-description reveal reveal-3">
					<p className="eyebrow">Diagnosis</p>
					<p className="result-description__text">{result.description}</p>
				</section>

				{/* Action Tip Section */}
				<section className="result-action reveal reveal-4">
					<p className="eyebrow">Next Step</p>
					<p className="result-action__text">{result.actionTip}</p>
				</section>

				{/* Share Section */}
				<section className="result-share">
					<div className="result-share__content">
						<h3 className="result-share__title">結果を保存する</h3>
						<p className="result-share__subtitle">
							画像や文章を保存してシェアできます
						</p>
					</div>
					<div className="result-share__buttons">
						<Button type="button" onClick={handleSaveImage} variant="primary">
							画像を保存
						</Button>
						<Button type="button" onClick={handleCopyText} variant="secondary">
							{copied ? "コピーしました" : "文章をコピー"}
						</Button>
					</div>
				</section>

				{/* Restart Button */}
				<div className="result-restart">
					<Link
						to="/"
						onClick={() => dispatch({ type: "RESET" })}
						className="btn-primary"
					>
						もう一度診断する
					</Link>
				</div>

				{/* Debug Section */}
				{state.debugMode && typeScores && (
					<Suspense fallback={<div>Loading debug tools...</div>}>
						<div className="surface-panel rounded-[20px] p-6 md:p-8">
							<DebugBarChart scores={typeScores} />
						</div>
					</Suspense>
				)}
			</div>
		</main>
	);
}
