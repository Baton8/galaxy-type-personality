export type QuestionFormat = "接客シチュエーション" | "間接質問";

export type QuestionAxis =
	| "1. 思慮の深さ"
	| "2. アプローチ"
	| "3. 接客のスタンス"
	| "4. アウトプット"
	| "5. 対応スタイル";

export type AnswerLabel =
	| "非常にそう思う"
	| "そう思う"
	| "どちらともいえない"
	| "あまり思わない"
	| "全く思わない";

export type TypeId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type TypeScores = Partial<Record<TypeId, 1 | 2>>;

export interface AnswerOption {
	label: AnswerLabel;
	scores: TypeScores;
}

export interface Question {
	id: string;
	format: QuestionFormat;
	axis: QuestionAxis;
	text: string;
	options: AnswerOption[];
}

export const questions: Question[] = [
	{
		id: "Q1",
		format: "接客シチュエーション",
		axis: "2. アプローチ",
		text: "お客様の要望を聞いたら、まず「課題や条件」を整理したくなる",
		options: [
			{ label: "非常にそう思う", scores: { 1: 2, 6: 2, 8: 2 } },
			{ label: "そう思う", scores: { 1: 1, 6: 1, 8: 1 } },
			{ label: "どちらともいえない", scores: { 4: 1 } },
			{ label: "あまり思わない", scores: { 3: 1, 5: 1 } },
			{ label: "全く思わない", scores: { 3: 2, 5: 2 } },
		],
	},
	{
		id: "Q2",
		format: "接客シチュエーション",
		axis: "4. アウトプット",
		text: "商品やサービスは、専門用語を使わず分かりやすく説明するのが得意だ",
		options: [
			{ label: "非常にそう思う", scores: { 2: 2, 7: 2 } },
			{ label: "そう思う", scores: { 2: 1, 7: 1 } },
			{ label: "どちらともいえない", scores: { 3: 1, 8: 1 } },
			{ label: "あまり思わない", scores: { 1: 1 } },
			{ label: "全く思わない", scores: { 1: 2 } },
		],
	},
	{
		id: "Q3",
		format: "接客シチュエーション",
		axis: "2. アプローチ",
		text: "お客様が不安そうなときは、結論より安心してもらうことを優先する",
		options: [
			{ label: "非常にそう思う", scores: { 3: 2, 8: 2 } },
			{ label: "そう思う", scores: { 3: 1, 8: 1 } },
			{ label: "どちらともいえない", scores: { 7: 1, 2: 1 } },
			{ label: "あまり思わない", scores: { 4: 1, 6: 1 } },
			{ label: "全く思わない", scores: { 4: 2, 6: 2 } },
		],
	},
	{
		id: "Q4",
		format: "接客シチュエーション",
		axis: "1. 思慮の深さ",
		text: "接客では、できるだけ短時間で最適な答えを提示したい",
		options: [
			{ label: "非常にそう思う", scores: { 4: 2, 6: 2 } },
			{ label: "そう思う", scores: { 4: 1, 6: 1 } },
			{ label: "どちらともいえない", scores: { 7: 1 } },
			{ label: "あまり思わない", scores: { 8: 1, 3: 1 } },
			{ label: "全く思わない", scores: { 8: 2, 3: 2 } },
		],
	},
	{
		id: "Q5",
		format: "接客シチュエーション",
		axis: "4. アウトプット",
		text: "言葉で説明するより、実際に触ったり体験してもらう方が伝わると思う",
		options: [
			{ label: "非常にそう思う", scores: { 5: 2 } },
			{ label: "そう思う", scores: { 5: 1 } },
			{ label: "どちらともいえない", scores: { 7: 1, 4: 1 } },
			{ label: "あまり思わない", scores: { 1: 1, 2: 1 } },
			{ label: "全く思わない", scores: { 1: 2, 2: 2 } },
		],
	},
	{
		id: "Q6",
		format: "接客シチュエーション",
		axis: "3. 接客のスタンス",
		text: "お客様が迷っているとき、選択肢を整理して決断を後押しする役回りになる",
		options: [
			{ label: "非常にそう思う", scores: { 1: 2, 6: 2 } },
			{ label: "そう思う", scores: { 1: 1, 6: 1 } },
			{ label: "どちらともいえない", scores: { 4: 1 } },
			{ label: "あまり思わない", scores: { 3: 1, 7: 1 } },
			{ label: "全く思わない", scores: { 3: 2, 7: 2 } },
		],
	},
	{
		id: "Q7",
		format: "接客シチュエーション",
		axis: "5. 対応スタイル",
		text: "相手や状況によって、接客スタイルを自然に切り替えている",
		options: [
			{ label: "非常にそう思う", scores: { 7: 2 } },
			{ label: "そう思う", scores: { 7: 1 } },
			{ label: "どちらともいえない", scores: { 2: 1, 6: 1 } },
			{ label: "あまり思わない", scores: { 1: 1 } },
			{ label: "全く思わない", scores: { 1: 2 } },
		],
	},
	{
		id: "Q8",
		format: "接客シチュエーション",
		axis: "1. 思慮の深さ",
		text: "一度の接客だけでなく、長期的に満足してもらえるかを考えて提案する",
		options: [
			{ label: "非常にそう思う", scores: { 8: 2, 3: 2 } },
			{ label: "そう思う", scores: { 8: 1, 3: 1 } },
			{ label: "どちらともいえない", scores: { 1: 1 } },
			{ label: "あまり思わない", scores: { 4: 1 } },
			{ label: "全く思わない", scores: { 4: 2 } },
		],
	},
	{
		id: "Q9",
		format: "接客シチュエーション",
		axis: "2. アプローチ",
		text: "商品やサービスの魅力を伝えるとき、場の空気を明るくすることを意識している",
		options: [
			{ label: "非常にそう思う", scores: { 2: 2, 5: 2 } },
			{ label: "そう思う", scores: { 2: 1, 5: 1 } },
			{ label: "どちらともいえない", scores: { 7: 1, 3: 1 } },
			{ label: "あまり思わない", scores: { 6: 1 } },
			{ label: "全く思わない", scores: { 6: 2 } },
		],
	},
	{
		id: "Q10",
		format: "接客シチュエーション",
		axis: "3. 接客のスタンス",
		text: "「この人に任せれば大丈夫」と思ってもらえる接客を目指している",
		options: [
			{ label: "非常にそう思う", scores: { 1: 2, 7: 2, 3: 2 } },
			{ label: "そう思う", scores: { 1: 1, 7: 1, 3: 1 } },
			{ label: "どちらともいえない", scores: { 8: 1, 6: 1, 2: 1 } },
			{ label: "あまり思わない", scores: {} },
			{ label: "全く思わない", scores: {} },
		],
	},
	{
		id: "Q11",
		format: "間接質問",
		axis: "5. 対応スタイル",
		text: "旅行や外出の計画は、事前に情報を集めてから動くタイプだ",
		options: [
			{ label: "非常にそう思う", scores: { 1: 2, 8: 2 } },
			{ label: "そう思う", scores: { 1: 1, 8: 1 } },
			{ label: "どちらともいえない", scores: { 3: 1 } },
			{ label: "あまり思わない", scores: { 4: 1, 5: 1 } },
			{ label: "全く思わない", scores: { 4: 2, 5: 2 } },
		],
	},
	{
		id: "Q12",
		format: "間接質問",
		axis: "4. アウトプット",
		text: "人に何かを説明するとき、つい例え話や身近な話を使ってしまう",
		options: [
			{ label: "非常にそう思う", scores: { 2: 2, 7: 2 } },
			{ label: "そう思う", scores: { 2: 1, 7: 1 } },
			{ label: "どちらともいえない", scores: { 5: 1 } },
			{ label: "あまり思わない", scores: { 4: 1, 1: 1 } },
			{ label: "全く思わない", scores: { 4: 2, 1: 2 } },
		],
	},
	{
		id: "Q13",
		format: "間接質問",
		axis: "3. 接客のスタンス",
		text: "誰かが迷っているとき、急かすより見守りたいと思う",
		options: [
			{ label: "非常にそう思う", scores: { 3: 2, 8: 2 } },
			{ label: "そう思う", scores: { 3: 1, 8: 1 } },
			{ label: "どちらともいえない", scores: { 7: 1 } },
			{ label: "あまり思わない", scores: { 6: 1, 4: 1 } },
			{ label: "全く思わない", scores: { 6: 2, 4: 2 } },
		],
	},
	{
		id: "Q14",
		format: "間接質問",
		axis: "4. アウトプット",
		text: "新しいことは、説明書より先に触って試したくなる",
		options: [
			{ label: "非常にそう思う", scores: { 5: 2 } },
			{ label: "そう思う", scores: { 5: 1 } },
			{ label: "どちらともいえない", scores: { 7: 1 } },
			{ label: "あまり思わない", scores: { 1: 1, 8: 1 } },
			{ label: "全く思わない", scores: { 1: 2, 8: 2 } },
		],
	},
	{
		id: "Q15",
		format: "間接質問",
		axis: "3. 接客のスタンス",
		text: "グループで何かを決めるとき、自然と全体をまとめる役になる",
		options: [
			{ label: "非常にそう思う", scores: { 7: 2, 6: 2 } },
			{ label: "そう思う", scores: { 7: 1, 6: 1 } },
			{ label: "どちらともいえない", scores: { 1: 1 } },
			{ label: "あまり思わない", scores: { 3: 1, 5: 1 } },
			{ label: "全く思わない", scores: { 3: 2, 5: 2 } },
		],
	},
	{
		id: "Q16",
		format: "間接質問",
		axis: "1. 思慮の深さ",
		text: "何かを選ぶとき、選択肢が多いとワクワクする",
		options: [
			{ label: "非常にそう思う", scores: { 1: 2, 8: 2 } },
			{ label: "そう思う", scores: { 1: 1, 8: 1 } },
			{ label: "どちらともいえない", scores: { 5: 1 } },
			{ label: "あまり思わない", scores: { 4: 1, 6: 1 } },
			{ label: "全く思わない", scores: { 4: 2, 6: 2 } },
		],
	},
	{
		id: "Q17",
		format: "間接質問",
		axis: "2. アプローチ",
		text: "初対面の人と話すとき、場の空気を和らげる役になることが多い",
		options: [
			{ label: "非常にそう思う", scores: { 2: 2, 3: 2 } },
			{ label: "そう思う", scores: { 2: 1, 3: 1 } },
			{ label: "どちらともいえない", scores: { 7: 1 } },
			{ label: "あまり思わない", scores: { 1: 1, 6: 1 } },
			{ label: "全く思わない", scores: { 1: 2, 6: 2 } },
		],
	},
	{
		id: "Q18",
		format: "間接質問",
		axis: "3. 接客のスタンス",
		text: "迷っている人を見ると、「決めやすくしてあげたい」と思う",
		options: [
			{ label: "非常にそう思う", scores: { 6: 2, 4: 2 } },
			{ label: "そう思う", scores: { 6: 1, 4: 1 } },
			{ label: "どちらともいえない", scores: { 7: 1 } },
			{ label: "あまり思わない", scores: { 3: 1 } },
			{ label: "全く思わない", scores: { 3: 2 } },
		],
	},
	{
		id: "Q19",
		format: "間接質問",
		axis: "5. 対応スタイル",
		text: "新しいことを始めるとき、細かく理解するよりまず動いてみる",
		options: [
			{ label: "非常にそう思う", scores: { 5: 2 } },
			{ label: "そう思う", scores: { 5: 1 } },
			{ label: "どちらともいえない", scores: { 7: 1 } },
			{ label: "あまり思わない", scores: { 1: 1, 8: 1 } },
			{ label: "全く思わない", scores: { 1: 2, 8: 2 } },
		],
	},
	{
		id: "Q20",
		format: "間接質問",
		axis: "5. 対応スタイル",
		text: "グループで話していると、誰が何を考えているか気になる",
		options: [
			{ label: "非常にそう思う", scores: { 3: 2, 7: 2 } },
			{ label: "そう思う", scores: { 3: 1, 7: 1 } },
			{ label: "どちらともいえない", scores: { 1: 1, 8: 1 } },
			{ label: "あまり思わない", scores: { 4: 1 } },
			{ label: "全く思わない", scores: { 4: 2 } },
		],
	},
	{
		id: "Q21",
		format: "接客シチュエーション",
		axis: "1. 思慮の深さ",
		text: "「とりあえずこれ」というおすすめより、複数の選択肢をじっくり見比べたい",
		options: [
			{ label: "非常にそう思う", scores: { 8: 2, 1: 2 } },
			{ label: "そう思う", scores: { 8: 1, 1: 1 } },
			{ label: "どちらともいえない", scores: { 7: 1, 4: 1 } },
			{ label: "あまり思わない", scores: { 6: 1 } },
			{ label: "全く思わない", scores: { 4: 2, 6: 2 } },
		],
	},
	{
		id: "Q22",
		format: "接客シチュエーション",
		axis: "1. 思慮の深さ",
		text: "お客様を待たせるくらいなら、まずは現時点でのベストを素早く伝えたい",
		options: [
			{ label: "非常にそう思う", scores: { 4: 2, 6: 2 } },
			{ label: "そう思う", scores: { 4: 1, 6: 1 } },
			{ label: "どちらともいえない", scores: { 7: 1 } },
			{ label: "あまり思わない", scores: { 8: 1, 1: 1 } },
			{ label: "全く思わない", scores: { 8: 2, 1: 2 } },
		],
	},
	{
		id: "Q23",
		format: "接客シチュエーション",
		axis: "2. アプローチ",
		text: "「なんとなく良さそう」という感覚より、「なぜ良いのか」の根拠を重視する",
		options: [
			{ label: "非常にそう思う", scores: { 1: 2, 6: 2 } },
			{ label: "そう思う", scores: { 1: 1, 6: 1 } },
			{ label: "どちらともいえない", scores: { 8: 1 } },
			{ label: "あまり思わない", scores: { 2: 1, 5: 1, 7: 1 } },
			{ label: "全く思わない", scores: { 2: 2, 5: 2, 7: 2 } },
		],
	},
	{
		id: "Q24",
		format: "接客シチュエーション",
		axis: "2. アプローチ",
		text: "機能の凄さを語るより、生活がどう楽しくなるかを話したい",
		options: [
			{ label: "非常にそう思う", scores: { 2: 2, 5: 2 } },
			{ label: "そう思う", scores: { 2: 1, 5: 1 } },
			{ label: "どちらともいえない", scores: { 3: 1 } },
			{ label: "あまり思わない", scores: { 1: 1, 6: 1 } },
			{ label: "全く思わない", scores: { 1: 2, 6: 2 } },
		],
	},
	{
		id: "Q25",
		format: "接客シチュエーション",
		axis: "4. アウトプット",
		text: "カタログのスペック表を見るよりも、実際に自分で動かして試す方が納得できる",
		options: [
			{ label: "非常にそう思う", scores: { 5: 2, 7: 2 } },
			{ label: "そう思う", scores: { 5: 1, 7: 1 } },
			{ label: "どちらともいえない", scores: { 2: 1 } },
			{ label: "あまり思わない", scores: { 1: 1, 8: 1 } },
			{ label: "全く思わない", scores: { 1: 2, 8: 2 } },
		],
	},
	{
		id: "Q26",
		format: "間接質問",
		axis: "1. 思慮の深さ",
		text: "ランチでお店を選ぶときは、メニューよりも「提供の早さ」が気になる",
		options: [
			{ label: "非常にそう思う", scores: { 4: 2 } },
			{ label: "そう思う", scores: { 4: 1 } },
			{ label: "どちらともいえない", scores: { 6: 1 } },
			{ label: "あまり思わない", scores: { 8: 1, 3: 1, 2: 1 } },
			{ label: "全く思わない", scores: { 8: 2, 3: 2, 2: 2 } },
		],
	},
	{
		id: "Q27",
		format: "間接質問",
		axis: "2. アプローチ",
		text: "友人から悩みを相談されたら、聞き役に徹するより先に解決策を提案したい",
		options: [
			{ label: "非常にそう思う", scores: { 4: 2, 6: 2 } },
			{ label: "そう思う", scores: { 4: 1, 6: 1 } },
			{ label: "どちらともいえない", scores: { 1: 1 } },
			{ label: "あまり思わない", scores: { 3: 1, 8: 1 } },
			{ label: "全く思わない", scores: { 3: 2, 8: 2 } },
		],
	},
	{
		id: "Q28",
		format: "間接質問",
		axis: "3. 接客のスタンス",
		text: "初対面の人とは、たとえ時間がかかっても挨拶や世間話から始めてゆっくり仲良くなりたい",
		options: [
			{ label: "非常にそう思う", scores: { 3: 2, 2: 2 } },
			{ label: "そう思う", scores: { 3: 1, 2: 1 } },
			{ label: "どちらともいえない", scores: { 8: 1 } },
			{ label: "あまり思わない", scores: { 4: 1, 6: 1 } },
			{ label: "全く思わない", scores: { 4: 2, 6: 2 } },
		],
	},
	{
		id: "Q29",
		format: "間接質問",
		axis: "4. アウトプット",
		text: "動画を視聴するときは、倍速再生を使ったりスキップしたりすることが多い",
		options: [
			{ label: "非常にそう思う", scores: { 4: 2 } },
			{ label: "そう思う", scores: { 4: 1 } },
			{ label: "どちらともいえない", scores: { 6: 1 } },
			{ label: "あまり思わない", scores: { 1: 1, 8: 1 } },
			{ label: "全く思わない", scores: { 1: 2, 8: 2 } },
		],
	},
	{
		id: "Q30",
		format: "間接質問",
		axis: "5. 対応スタイル",
		text: "マニュアル通りの手順を守るより、状況に合わせて近道を探す方が好きだ",
		options: [
			{ label: "非常にそう思う", scores: { 7: 2, 6: 2 } },
			{ label: "そう思う", scores: { 7: 1, 6: 1 } },
			{ label: "どちらともいえない", scores: { 4: 1 } },
			{ label: "あまり思わない", scores: { 1: 1, 3: 1 } },
			{ label: "全く思わない", scores: { 1: 2, 3: 2 } },
		],
	},
];

export const questionPoolCount = questions.length;
export const totalQuestions = 10;
