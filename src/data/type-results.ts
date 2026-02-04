import { publicBaseUrl } from "../lib/site-config";

export interface TypeResult {
	id: number;
	typeName: string;
	modelName: string;
	description: string;
	actionTip: string;
	characterQuote: string;
	imageUrl: string;
	ogpImageUrl: string;
}

const imageBaseUrl = "/images";
const ogpBaseUrl = `${publicBaseUrl}${imageBaseUrl}`;

export const typeResults: TypeResult[] = [
	{
		id: 1,
		typeName: "コンサルタント型",
		modelName: "須貝駿貴",
		description:
			"あなたは論理と構造で信頼を築くコンサルタント型。お客様の要望を丁寧に整理し、最適な解を導く力に長けています。感覚的な説明に頼らず、理由や根拠を示しながら提案できるため、「この人に任せたい」と思わせる説得力があります。複雑な条件でも冷静に整理できる司令塔タイプで、比較検討が必要な場面ほど真価を発揮します。",
		actionTip:
			"提案前に「重視する点は3つありますか？」と条件を言語化してもらいましょう。整理された会話が、あなたの強みをさらに引き出します。",
		characterQuote: "結局、判断基準はどこにありますか？",
		imageUrl: `${imageBaseUrl}/type-1.webp`,
		ogpImageUrl: `${ogpBaseUrl}/type-1.png`,
	},
	{
		id: 2,
		typeName: "プレゼンター型",
		modelName: "鶴崎修功",
		description:
			"あなたは知識を『分かりやすく楽しく』届けるプレゼンター型。難しい内容でも噛み砕いて説明でき、お客様の「なるほど！」を引き出す力があります。場の雰囲気を明るくしながら、商品理解を深められるのが最大の武器。知識量と表現力を活かし、初めてのお客様にも安心感を与える解説役です。",
		actionTip:
			"説明の冒頭で「30秒で言うと…」と要点をまとめてみましょう。理解スピードが上がり、会話がさらにスムーズになります。",
		characterQuote: "これ、例えると〇〇みたいな感じなんです！",
		imageUrl: `${imageBaseUrl}/type-2.webp`,
		ogpImageUrl: `${ogpBaseUrl}/type-2.png`,
	},
	{
		id: 3,
		typeName: "サポーター型",
		modelName: "山本祥彰",
		description:
			"あなたは優しさと安定感で寄り添うサポーター型。お客様の不安や迷いにいち早く気づき、安心して相談できる空気を作るのが得意です。無理に結論を急がず、相手のペースを尊重する姿勢が信頼につながります。「話しやすい」「相談しやすい」と感じてもらえる存在です。",
		actionTip:
			"提案前に「今いちばん不安な点はどこですか？」と一言聞いてみましょう。寄り添い力がさらに活きます。",
		characterQuote: "ゆっくりで大丈夫ですよ、一緒に考えましょう。",
		imageUrl: `${imageBaseUrl}/type-3.webp`,
		ogpImageUrl: `${ogpBaseUrl}/type-3.png`,
	},
	{
		id: 4,
		typeName: "スピード対応型",
		modelName: "東問",
		description:
			"あなたは知的スピードで最短解を導く合理派。要点把握が早く、迷いの原因を瞬時に見抜いてシンプルな答えを提示できます。時間をかけずに満足度を高める接客ができるため、忙しいお客様や即決志向の方と相性抜群。無駄のない提案が信頼につながるタイプです。",
		actionTip:
			"最初に「結論を先に知りたいですか？」と確認しましょう。相手の温度感に合わせたスピード調整ができます。",
		characterQuote: "要するに、解決策はこれ一点ですね。",
		imageUrl: `${imageBaseUrl}/type-4.webp`,
		ogpImageUrl: `${ogpBaseUrl}/type-4.png`,
	},
	{
		id: 5,
		typeName: "デモンストレーター型",
		modelName: "ふくらP",
		description:
			"あなたは体験を通じて魅力を伝える実演スペシャリスト型。実際に触ってもらうことで、言葉以上の説得力を生み出します。お客様の反応を見ながら進めるデモは、理解と納得を同時に高める力があります。ワクワク感を共有できる、体験重視の接客が強みです。",
		actionTip:
			"説明前に「実際に触ってみますか？」と必ず一言添えてみましょう。体験へのハードルが一気に下がります。",
		characterQuote: "説明するより、一度やってみた方が早いですよ！",
		imageUrl: `${imageBaseUrl}/type-5.webp`,
		ogpImageUrl: `${ogpBaseUrl}/type-5.png`,
	},
	{
		id: 6,
		typeName: "クロージング型",
		modelName: "東言",
		description:
			"あなたは冷静に決断を後押しするクロージング型。迷っているポイントを整理し、選択肢を絞ることでスムーズな意思決定を導けます。感情に流されず、事実とメリットを端的に伝えられるのが特徴。最後のひと押しを安心感のある形で担える、頼れるまとめ役です。",
		actionTip:
			"「今決める場合のメリット」「後で決める場合の違い」を並べて伝えてみましょう。判断が一気に楽になります。",
		characterQuote: "決まらない理由は、価格ですか？性能ですか？",
		imageUrl: `${imageBaseUrl}/type-6.webp`,
		ogpImageUrl: `${ogpBaseUrl}/type-6.png`,
	},
	{
		id: 7,
		typeName: "バランス型",
		modelName: "伊沢拓司",
		description:
			"あなたは臨機応変に場を回すオールラウンダー型。説明・傾聴・提案を状況に応じて切り替えられる柔軟さがあります。相手のタイプや空気を読む力が高く、どんなお客様にも対応可能。全体を俯瞰しながら最適な役割を選べる、非常に実践向きな接客タイプです。",
		actionTip:
			"会話の途中で「今は詳しく聞きたいか／結論を知りたいか」を見極め、役割を意識的に切り替えてみましょう。",
		characterQuote: "あ、今は詳しく聞くより結論が欲しい感じかな？",
		imageUrl: `${imageBaseUrl}/type-7.webp`,
		ogpImageUrl: `${ogpBaseUrl}/type-7.png`,
	},
	{
		id: 8,
		typeName: "アドバイザー型",
		modelName: "河村拓哉",
		description:
			"あなたは最適解をじっくり探すアドバイザー型。短期的な売りよりも、長期的な満足を重視した提案ができます。お客様の生活背景や使い方を深く理解し、一緒に考える姿勢が信頼につながります。相談パートナーとして選ばれやすい、伴走型の接客が魅力です。",
		actionTip:
			"「2年後も使っているとしたら、どんな使い方が理想ですか？」と未来視点の質問を投げてみましょう。",
		characterQuote: "長く使うものだから、後悔はしてほしくないんです。",
		imageUrl: `${imageBaseUrl}/type-8.webp`,
		ogpImageUrl: `${ogpBaseUrl}/type-8.png`,
	},
];
