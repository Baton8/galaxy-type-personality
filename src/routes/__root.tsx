import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import paltCss from "palt-typesetting/dist/typesetter.css?url";
import { TypesettingProvider } from "@/components/TypesettingProvider";
import { QuizProvider } from "@/state/quiz";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				name: "robots",
				content: "noindex, nofollow",
			},
			{
				title: "販売員タイプ診断",
			},
			{
				name: "description",
				content: "QuizKnock × baton タイプ診断",
			},
		],
		links: [
			// Preconnect: フォントCSS配信元（最優先）
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com",
			},
			// Preconnect: フォントファイル配信元（CORS必要）
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous",
			},
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "stylesheet",
				href: paltCss,
			},
		],
	}),

	shellComponent: RootDocument,
	notFoundComponent: NotFound,
});

const showDevtools = import.meta.env.DEV;

function NotFound() {
	return (
		<div className="page-shell flex items-center justify-center">
			<div className="text-center surface-panel rounded-[20px] p-8 md:p-10">
				<h1 className="font-display text-4xl mb-4">ページが見つかりません</h1>
				<p className="text-ink-soft mb-6">
					お探しのページは存在しないか、移動した可能性があります。
				</p>
				<a href="/" className="btn-secondary">
					トップページへ戻る
				</a>
			</div>
		</div>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ja">
			<head>
				<HeadContent />
				{/*
				 * Non-blocking Google Fonts loading
				 *
				 * 1. preconnect は head() で先行確立（CSS/Font配信元の両方）
				 * 2. preload でフォントCSSを先読み（as="style"）
				 * 3. media="print" で初期レンダリングをブロックしない
				 * 4. link要素の直後のscriptでonloadを設定（タイミング重要）
				 */}
				<link
					rel="preload"
					as="style"
					href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400&family=Space+Grotesk:wght@400;600&display=swap"
				/>
				{/* biome-ignore lint/correctness/useUniqueElementIds: フォント読み込み用の固定ID */}
				<link
					rel="stylesheet"
					id="gf"
					href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400&family=Space+Grotesk:wght@400;600&display=swap"
					media="print"
				/>
				<script
					// biome-ignore lint/security/noDangerouslySetInnerHtml: フォント非同期読み込みに必要
					dangerouslySetInnerHTML={{
						__html: `(function(){var l=document.getElementById('gf');if(l.sheet)l.media='all';else l.onload=function(){this.media='all'}})()`,
					}}
				/>
				<noscript>
					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400&family=Space+Grotesk:wght@400;600&display=swap"
					/>
				</noscript>
			</head>
			<body>
				<TypesettingProvider>
					<QuizProvider>{children}</QuizProvider>
				</TypesettingProvider>
				{showDevtools && (
					<TanStackDevtools
						config={{
							position: "bottom-right",
						}}
						plugins={[
							{
								name: "Tanstack Router",
								render: <TanStackRouterDevtoolsPanel />,
							},
						]}
					/>
				)}
				<Scripts />
			</body>
		</html>
	);
}
