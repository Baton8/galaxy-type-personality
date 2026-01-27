export interface TypeResult {
	id: number;
	typeName: string;
	modelName: string;
	catchCopy: string;
	description: string;
	strengths: string;
	actionItems: string;
	imageUrl: string;
	ogpImageUrl: string;
}

const ogpBaseUrl = "https://example.com/ogp";
const imageBaseUrl = "/images";

export const typeResults: TypeResult[] = [
	{
		id: 1,
		typeName: "コンサルタント型",
		modelName: "須貝駿貴",
		catchCopy: "論理で信頼を勝ち取る司令塔",
		description:
			"情報を整理して本質的な課題にフォーカスし、最短距離で納得感をつくるタイプです。",
		strengths: "要点の抽出と筋の通った提案で、安心感と説得力を両立できる。",
		actionItems: "最初に結論と根拠を示し、最後に具体的な次の一手を添える。",
		imageUrl: `${imageBaseUrl}/type-1.png`,
		ogpImageUrl: `${ogpBaseUrl}/type-1.png`,
	},
	{
		id: 2,
		typeName: "プレゼンター型",
		modelName: "鶴崎修功",
		catchCopy: "楽しく・分かりやすく解説する知識王",
		description:
			"情報の噛み砕きが得意で、相手の理解に合わせて説明を変えられるタイプです。",
		strengths: "難しい話でも明快に伝え、場の空気を前向きにする。",
		actionItems:
			"例え話とビフォーアフターを用意して、理解度に合わせて切り替える。",
		imageUrl: `${imageBaseUrl}/type-2.png`,
		ogpImageUrl: `${ogpBaseUrl}/type-2.png`,
	},
	{
		id: 3,
		typeName: "サポーター型",
		modelName: "山本祥彰",
		catchCopy: "優しさと安定感で寄り添う安心メーカー",
		description:
			"相手の不安に寄り添い、丁寧に選択肢を整理して支えるタイプです。",
		strengths: "信頼関係づくりが得意で、安心して任せられる存在になれる。",
		actionItems: "判断の根拠を一緒に並べ、相手のペースで比較できる場を作る。",
		imageUrl: `${imageBaseUrl}/type-3.png`,
		ogpImageUrl: `${ogpBaseUrl}/type-3.png`,
	},
	{
		id: 4,
		typeName: "スピード対応型",
		modelName: "東問",
		catchCopy: "知的スピードで最短解を出す合理派",
		description:
			"結論までの道筋を素早く見抜き、短時間で意思決定を後押しするタイプです。",
		strengths: "テンポの良い提案で、時間コストを最小化できる。",
		actionItems: "比較軸を2〜3点に絞り、即決しやすい候補に整える。",
		imageUrl: `${imageBaseUrl}/type-4.png`,
		ogpImageUrl: `${ogpBaseUrl}/type-4.png`,
	},
	{
		id: 5,
		typeName: "デモンストレーター型",
		modelName: "ふくらP",
		catchCopy: "体験で魅力を伝える実演スペシャリスト",
		description: "体験価値を重視し、実演や具体例で魅力を伝えるタイプです。",
		strengths: "記憶に残る体験を作り、納得感とワクワクを同時に生む。",
		actionItems: "五感に訴えるミニ体験を1つ用意し、その場で試せる導線を作る。",
		imageUrl: `${imageBaseUrl}/type-5.png`,
		ogpImageUrl: `${ogpBaseUrl}/type-5.png`,
	},
	{
		id: 6,
		typeName: "クロージング型",
		modelName: "東言",
		catchCopy: "冷静に決断を後押しするまとめ役",
		description:
			"要点を整理し、判断のタイミングを見極めて背中を押すタイプです。",
		strengths: "迷いを減らす言語化が得意で、決断まで導ける。",
		actionItems: "最終確認のチェックリストを提示し、不安を明文化して解消する。",
		imageUrl: `${imageBaseUrl}/type-6.png`,
		ogpImageUrl: `${ogpBaseUrl}/type-6.png`,
	},
	{
		id: 7,
		typeName: "バランス型",
		modelName: "伊沢拓司",
		catchCopy: "臨機応変に場を回すオールラウンダー",
		description:
			"論理と体験、行動と慎重さを状況に合わせて使い分けるタイプです。",
		strengths: "相手や状況に合わせて提案をチューニングできる。",
		actionItems: "相手の反応に合わせて「説明→体験→整理」を柔軟に並べ替える。",
		imageUrl: `${imageBaseUrl}/type-7.png`,
		ogpImageUrl: `${ogpBaseUrl}/type-7.png`,
	},
	{
		id: 8,
		typeName: "アドバイザー型",
		modelName: "河村拓哉",
		catchCopy: "最適プランをじっくり探すアドバイザー",
		description:
			"丁寧に状況を聞き取り、納得できる選択肢を一緒に探すタイプです。",
		strengths: "慎重さと寄り添いで、長期的な信頼を築ける。",
		actionItems: "選択の優先順位を言語化し、比較表で見える化する。",
		imageUrl: `${imageBaseUrl}/type-8.png`,
		ogpImageUrl: `${ogpBaseUrl}/type-8.png`,
	},
];
