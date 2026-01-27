import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { TypesettingProvider } from "@/components/TypesettingProvider";
import { CentroidsProvider } from "@/state/centroids";
import { QuizProvider } from "@/state/quiz";

import appCss from "../styles.css?url";
import paltCss from "palt-typesetting/dist/typesetter.css?url";

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
				title: "販売員タイプ診断",
			},
			{
				name: "description",
				content: "QuizKnock × baton タイプ診断",
			},
		],
		links: [
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
				<a
					href="/"
					className="btn-secondary inline-flex items-center justify-center"
				>
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
			</head>
			<body>
				<TypesettingProvider>
					<CentroidsProvider>
						<QuizProvider>{children}</QuizProvider>
					</CentroidsProvider>
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
