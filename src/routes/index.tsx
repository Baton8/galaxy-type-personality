import { createFileRoute, Link } from "@tanstack/react-router";

import { LazyAxisChart } from "@/components/LazyAxisChart";
import { useQuiz } from "@/state/quiz";

const getRevealClass = (step: number) => `reveal reveal-${step}`;

interface AxisRailProps {
	label: string;
	left: string;
	right: string;
}

function AxisRail({ label, left, right }: AxisRailProps) {
	return (
		<div className="axis-rail">
			<span className="axis-rail__label">{label}</span>
			<div className="axis-rail__bar" />
			<div className="axis-rail__ends">
				<span>{left}</span>
				<span>{right}</span>
			</div>
		</div>
	);
}

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
							Sales Personality Diagnostic v1.28
						</p>

						<h1 className={`hero-title ${getRevealClass(1)} typeset`}>
							販売員タイプ診断
						</h1>

						<p className={`hero-lead ${getRevealClass(2)} typeset`}>
							10問の回答から接客スタイルを2軸で可視化。
							<br className="hidden sm:block" />
							強みの活かし方を見つけます。
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
								デバッグではスコアグラフと数値調整UIが表示されます
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

					{/* Right: Axis Preview */}
					<div
						className={`hero-media hero-media--compact ${getRevealClass(2)}`}
					>
						<div className="hero-media__content">
							<div className="axis-card">
								<div className="axis-card__frame">
									<LazyAxisChart />
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

						{/* Axes Explanation */}
						<div className="surface-panel rounded-[20px] p-6 md:p-8 space-y-5">
							<p className="eyebrow">2 Axes</p>
							<h2 className="section-title typeset">読み解く2つの軸</h2>
							<p className="section-lead typeset">
								「理屈で納得させるか、体験で魅了するか」と「自分から動くか、慎重に支えるか」。この2軸であなたのスタイルを可視化します。
							</p>
							<div className="axis-rails">
								<AxisRail
									label="X Axis"
									left="感覚・体験"
									right="論理・データ"
								/>
								<AxisRail
									label="Y Axis"
									left="サポート・慎重"
									right="アクション・外交"
								/>
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
