import { createFileRoute, Link } from "@tanstack/react-router";

import { useQuiz } from "@/state/quiz";

const getRevealClass = (step: number) => `reveal reveal-${step}`;

export const Route = createFileRoute("/")({ component: App });

function App() {
	const { dispatch } = useQuiz();

	return (
		<main className="page-shell">
			{/* Hero Section - Clean & Focused */}
			<section className="hero-section">
				<div className="max-w-6xl mx-auto grid gap-12 lg:gap-16 lg:grid-cols-[1fr_0.85fr] items-center">
					{/* Left: Content */}
					<div className="hero-content">
						<p className={`eyebrow ${getRevealClass(1)}`}>
							Sales Personality Diagnostic v2.0
						</p>

						<h1 className={`hero-title ${getRevealClass(1)} typeset`}>
							販売員タイプ診断
						</h1>

						<p className={`hero-lead ${getRevealClass(2)} typeset`}>
							30問から10問を選出し、8タイプに直接加点して判定。
							<br className="hidden sm:block" />
							偏りを抑えたスコアで強みを見つけます。
						</p>

						<div className={`hero-cta ${getRevealClass(3)}`}>
							<div className="hero-cta__actions">
								<Link
									to="/quiz/$questionId"
									params={{ questionId: "1" }}
									onClick={() => dispatch({ type: "RESET" })}
									className="btn-primary"
								>
									通常プレイ
								</Link>

								<Link
									to="/quiz/$questionId"
									params={{ questionId: "1" }}
									onClick={() => {
										dispatch({ type: "RESET" });
										dispatch({ type: "SET_DEBUG", enabled: true });
									}}
									className="btn-primary btn-primary--alt"
								>
									デバッグプレイ
								</Link>
							</div>

							<p className="hero-cta__note">
								デバッグではタイプ別の棒グラフが表示されます
							</p>

							<div className="hero-meta">
								<span>10問</span>
								<span className="hero-meta__dot" />
								<span>約3分</span>
								<span className="hero-meta__dot" />
								<span>8タイプ</span>
							</div>
						</div>
					</div>

					{/* Right: Score Preview */}
					<div
						className={`hero-media hero-media--compact ${getRevealClass(2)}`}
					>
						<div className="hero-media__content">
							<div className="surface-panel rounded-[20px] p-6 space-y-4">
								<p className="eyebrow">Score Balance</p>
								<div className="space-y-3">
									<div className="flex items-center justify-between text-sm">
										<span>タイプ加点</span>
										<span className="text-ink-soft">+1 / +2</span>
									</div>
									<div className="progress-track">
										<div className="progress-fill" style={{ width: "68%" }} />
									</div>
									<div className="flex items-center justify-between text-sm">
										<span>正規化スコア</span>
										<span className="text-ink-soft">期待値で比較</span>
									</div>
									<div className="progress-track">
										<div className="progress-fill" style={{ width: "42%" }} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* How it works */}
			<section className="mt-20 md:mt-28">
				<div className="max-w-6xl mx-auto">
					<div className="grid gap-6 lg:grid-cols-2">
						{/* Flow */}
						<div className="surface-panel rounded-[20px] p-6 md:p-8 space-y-5">
							<p className="eyebrow">Flow</p>
							<h2 className="section-title typeset">診断の流れ</h2>
							<ol className="flow-steps text-ink-soft">
								<li className="flow-step">
									<span className="flow-step__index">01</span>
									<span>30問から10問が選ばれます。</span>
								</li>
								<li className="flow-step">
									<span className="flow-step__index">02</span>
									<span>8タイプへ加点してスコアを集計。</span>
								</li>
								<li className="flow-step">
									<span className="flow-step__index">03</span>
									<span>正規化スコアで最も近いタイプを判定。</span>
								</li>
							</ol>
						</div>

						{/* Scoring Explanation */}
						<div className="surface-panel rounded-[20px] p-6 md:p-8 space-y-5">
							<p className="eyebrow">Scoring</p>
							<h2 className="section-title typeset">採点のしくみ</h2>
							<p className="section-lead typeset">
								設問ごとに加点されるタイプと点数が決まっています。登場回数の差を埋めるため、期待値で正規化して判定します。
							</p>
							<div className="grid gap-3 text-sm text-ink-soft">
								<div className="flex items-center justify-between">
									<span>加点方式</span>
									<span className="text-ink">+1 / +2</span>
								</div>
								<div className="flex items-center justify-between">
									<span>タイプ数</span>
									<span className="text-ink">8タイプ</span>
								</div>
								<div className="flex items-center justify-between">
									<span>正規化</span>
									<span className="text-ink">獲得点 ÷ 登場数</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Outcomes */}
			<section className="mt-16 md:mt-24">
				<div className="max-w-6xl mx-auto space-y-8">
					<div>
						<p className="eyebrow">Outcome</p>
						<h2 className="section-title typeset mt-2">診断で分かること</h2>
					</div>
					<div className="grid gap-5 md:grid-cols-3">
						<div className="result-card">
							<span className="result-card__num">01</span>
							<h3 className="font-display text-lg md:text-xl mt-3">
								接客の温度
							</h3>
							<p className="text-ink-soft mt-2 leading-relaxed text-sm">
								相手に合わせた距離感と熱量。納得させる力か、体験で惹きつける力かが見えてきます。
							</p>
						</div>
						<div className="result-card">
							<span className="result-card__num">02</span>
							<h3 className="font-display text-lg md:text-xl mt-3">
								主導か伴走か
							</h3>
							<p className="text-ink-soft mt-2 leading-relaxed text-sm">
								自分から動くタイプか、慎重に支えるタイプか。行動のテンポと癖を可視化します。
							</p>
						</div>
						<div className="result-card">
							<span className="result-card__num">03</span>
							<h3 className="font-display text-lg md:text-xl mt-3">
								伸ばす一手
							</h3>
							<p className="text-ink-soft mt-2 leading-relaxed text-sm">
								強みを活かすための次の一歩が明確に。明日から変えられる行動を提案します。
							</p>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
