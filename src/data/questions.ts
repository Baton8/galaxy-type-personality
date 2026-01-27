export type Axis = "X" | "Y";

export interface Question {
	id: number;
	text: string;
	axis: Axis;
	positiveDirection: boolean;
}

export const questions: Question[] = [
	{
		id: 1,
		text: "接客では、感情に訴えるよりも「客観的なスペック比較」が重要だと思う",
		axis: "X",
		positiveDirection: true,
	},
	{
		id: 2,
		text: "新しい商品は、まず自分で触って体験してから説明する",
		axis: "X",
		positiveDirection: false,
	},
	{
		id: 3,
		text: "説明は結論から短く端的に伝える方だ",
		axis: "Y",
		positiveDirection: true,
	},
	{
		id: 4,
		text: "お客様が迷っているときは、聞き役に回るより自分から提案を畳み掛けるほうだ",
		axis: "Y",
		positiveDirection: true,
	},
	{
		id: 5,
		text: "データや根拠が揃わない提案は避けたい",
		axis: "X",
		positiveDirection: true,
	},
	{
		id: 6,
		text: "会話の空気感を読むのが得意だ",
		axis: "X",
		positiveDirection: false,
	},
	{
		id: 7,
		text: "場の流れが停滞したら自分が前に出て進める",
		axis: "Y",
		positiveDirection: true,
	},
	{
		id: 8,
		text: "慎重に選択肢を比較し、お客様のペースを守りたい",
		axis: "Y",
		positiveDirection: false,
	},
	{
		id: 9,
		text: "体験談や実演の方が説得力があると思う",
		axis: "X",
		positiveDirection: false,
	},
	{
		id: 10,
		text: "売場のルールや手順を守ることで信頼を得られる",
		axis: "Y",
		positiveDirection: false,
	},
];

export const totalQuestions = questions.length;
