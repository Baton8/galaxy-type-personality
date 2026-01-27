import { createFileRoute, Link } from "@tanstack/react-router";

import AxisPreviewChart from "@/components/AxisPreviewChart";
import { useQuiz } from "@/state/quiz";

export const Route = createFileRoute("/")({ component: App });

function App() {
	const { dispatch } = useQuiz();

	return (
		<main className="page-shell">
			<header className="max-w-6xl mx-auto border-b border-line pb-6 md:pb-8">
				<div className="flex flex-wrap items-center gap-3 text-[0.6rem] uppercase tracking-[0.35em] text-ink-soft">
					<span className="mono text-[0.6rem] text-ink">
						Sales Type Diagnostics
					</span>
					<span className="dot-separator" />
					<span>QuizKnock × baton</span>
				</div>
				<div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-ink-soft">
					<span className="meta-pill">10 Questions</span>
					<span className="meta-pill">~3 min</span>
					<span className="meta-pill">8 types / 2 axes</span>
				</div>
			</header>

			<section className="mt-10 md:mt-16">
				<div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-[1.1fr_0.9fr] items-start">
					<div className="space-y-8">
						<div className="space-y-4">
							<p className="eyebrow">Sales personality diagnostic</p>
							<h1 className="hero-title reveal reveal-1 typeset">販売員タイプ診断</h1>
							<p className="hero-lead reveal reveal-2 typeset">
								10問の回答から接客スタイルを2軸で可視化。論理と体験、アクションと慎重さのバランスを読み解いて、強みの活かし方を見つけます。
							</p>
						</div>

						<div className="flex flex-col gap-2 reveal reveal-3">
							<div className="flex flex-col sm:flex-row gap-3">
								<Link
									to="/quiz/$questionId"
									params={{ questionId: "1" }}
									onClick={() => dispatch({ type: "RESET" })}
									className="btn-primary"
								>
									診断をスタートする
								</Link>
								<Link
									to="/quiz/$questionId"
									params={{ questionId: "1" }}
									onClick={() => {
										dispatch({ type: "RESET" });
										dispatch({ type: "SET_DEBUG", enabled: true });
									}}
									className="btn-secondary"
								>
									デバッグで開始
								</Link>
							</div>
							<p className="text-[0.65rem] text-ink-soft/60 tracking-wide">
								* 「デバッグで開始」ではスコアグラフと数値調整UIが表示されます
							</p>
						</div>
						<div className="spec-grid reveal reveal-4">
							<div className="spec-card">
								<span className="spec-label">Format</span>
								<span className="spec-value">5段階 / 10問</span>
							</div>
							<div className="spec-card">
								<span className="spec-label">Axes</span>
								<span className="spec-value">論理×体験 / 行動×慎重</span>
							</div>
							<div className="spec-card">
								<span className="spec-label">Output</span>
								<span className="spec-value">8タイプ / 行動提案</span>
							</div>
						</div>
					</div>

					<div className="hero-media reveal reveal-2">
						<div className="hero-media__content">
							<div className="axis-card">
								<div className="axis-card__header">
									<p className="hero-media__label">Axis Map / 2D</p>
									<span className="meta-pill">8 types</span>
								</div>
								<div className="axis-card__frame">
									<AxisPreviewChart />
								</div>
								<div className="axis-card__notes">
									<span>X: 感覚・体験 &lt;-&gt; 論理・データ</span>
									<span>Y: サポート・慎重 &lt;-&gt; アクション・外交</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="mt-14 md:mt-20">
				<div className="max-w-6xl mx-auto space-y-8">
					<div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
						<div className="surface-panel rounded-[20px] p-6 md:p-10 space-y-6">
							<div className="flex items-center justify-between">
								<p className="eyebrow">Axis Reading</p>
								<span className="mono text-xs text-ink-soft">X / Y</span>
							</div>
							<h2 className="section-title typeset">2軸で読み解く接客スタイル</h2>
							<p className="section-lead typeset">
								「理屈で納得させるか」「体験で魅了するか」、そして「自分から動くか」「慎重に支えるか」。この2軸で、あなたの接客スタイルがどこに位置するかを見つけます。
							</p>
							<div className="axis-rails">
								<div className="axis-rail">
									<span className="axis-rail__label">X Axis</span>
									<div className="axis-rail__bar" />
									<div className="axis-rail__ends">
										<span>感覚・体験</span>
										<span>論理・データ</span>
									</div>
								</div>
								<div className="axis-rail">
									<span className="axis-rail__label">Y Axis</span>
									<div className="axis-rail__bar" />
									<div className="axis-rail__ends">
										<span>サポート・慎重</span>
										<span>アクション・外交</span>
									</div>
								</div>
							</div>
						</div>

						<div className="surface-panel rounded-[20px] p-6 md:p-10 space-y-6">
							<div className="flex items-center justify-between">
								<p className="eyebrow">Flow</p>
								<span className="mono text-xs text-ink-soft">01-03</span>
							</div>
							<h2 className="section-title typeset">診断の流れ</h2>
							<ol className="flow-steps text-ink-soft">
								<li className="flow-step">
									<span className="flow-step__index">01</span>
									<span>10問に直感で回答します。</span>
								</li>
								<li className="flow-step">
									<span className="flow-step__index">02</span>
									<span>2軸スコアを集計し、タイプを判定。</span>
								</li>
								<li className="flow-step">
									<span className="flow-step__index">03</span>
									<span>強みと明日からのアクションを提示。</span>
								</li>
							</ol>
						</div>
					</div>
				</div>
			</section>

			<section className="mt-12 md:mt-20">
				<div className="max-w-6xl mx-auto space-y-6">
					<div className="flex flex-wrap items-end justify-between gap-3">
						<div>
							<p className="eyebrow">Outcome</p>
							<h2 className="section-title typeset">診断で分かること</h2>
						</div>
						<span className="meta-pill">Output</span>
					</div>
					<div className="grid gap-6 md:grid-cols-3">
						<div className="result-card">
							<p className="eyebrow">Insight 01</p>
							<h3 className="font-display text-xl md:text-2xl mt-4">接客の温度</h3>
							<p className="text-ink-soft mt-3 leading-relaxed text-[0.95rem]">
								相手に合わせた距離感と熱量。納得させる力か、体験で惹きつける力かが見えてきます。
							</p>
						</div>
						<div className="result-card">
							<p className="eyebrow">Insight 02</p>
							<h3 className="font-display text-xl md:text-2xl mt-4">主導か伴走か</h3>
							<p className="text-ink-soft mt-3 leading-relaxed text-[0.95rem]">
								自分から動くタイプか、慎重に支えるタイプか。行動のテンポと癖を可視化します。
							</p>
						</div>
						<div className="result-card">
							<p className="eyebrow">Insight 03</p>
							<h3 className="font-display text-xl md:text-2xl mt-4">伸ばす一手</h3>
							<p className="text-ink-soft mt-3 leading-relaxed text-[0.95rem]">
								強みを活かすための次の一歩が明確に。明日から変えられる行動を提案します。
							</p>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
