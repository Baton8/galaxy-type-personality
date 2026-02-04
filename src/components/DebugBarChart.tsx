import { useEffect, useMemo, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	LabelList,
	Legend,
	ResponsiveContainer,
	Tooltip,
	type TooltipContentProps,
	XAxis,
	YAxis,
} from "recharts";
import type { TypeId } from "@/data/questions";
import { typeResults } from "@/data/type-results";
import type { TypeScoreResult } from "@/lib/diagnosis";

interface DebugBarChartProps {
	scores: TypeScoreResult[];
}

const renderTooltip = ({
	active,
	payload,
}: TooltipContentProps<number, string>) => {
	if (!active || !payload?.length) return null;
	const item = payload[0]?.payload as {
		name: string;
		rawScore: number;
		normalizedScore: number;
		appearances: number;
	};

	return (
		<div className="surface-panel-plain rounded-lg px-3 py-2 text-xs text-ink-soft shadow-md">
			<div className="font-medium text-ink">{item.name}</div>
			<div className="mt-1 space-y-1">
				<div>生スコア: {item.rawScore}</div>
				<div>登場数: {item.appearances}</div>
				<div>正規化: {Number(item.normalizedScore).toFixed(2)}</div>
			</div>
		</div>
	);
};

export default function DebugBarChart({ scores }: DebugBarChartProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const data = useMemo(() => {
		const scoreById = new Map(scores.map((score) => [score.typeId, score]));
		return typeResults.map((type) => {
			const score = scoreById.get(type.id as TypeId);
			return {
				name: type.typeName,
				rawScore: score?.rawScore ?? 0,
				appearances: score?.appearances ?? 0,
				normalizedScore: score?.normalizedScore ?? 0,
			};
		});
	}, [scores]);

	return (
		<div className="debug-axis">
			<div className="debug-axis__header">
				<span>デバッグ: タイプ加点</span>
				<span className="text-ink">生スコア / 正規化</span>
			</div>
			<div className="debug-axis__frame">
				<div className="debug-axis__chart">
					{mounted ? (
						<ResponsiveContainer width="100%" height="100%">
							<BarChart
								data={data}
								margin={{ top: 16, right: 24, bottom: 12, left: 12 }}
							>
								<CartesianGrid
									strokeDasharray="4 6"
									stroke="rgba(25,25,25,0.18)"
								/>
								<XAxis
									dataKey="name"
									interval={0}
									tick={{ fontSize: 10 }}
									axisLine={false}
									tickLine={false}
									angle={-18}
									textAnchor="end"
									height={48}
								/>
								<YAxis
									yAxisId="raw"
									tick={{ fontSize: 10 }}
									axisLine={false}
									tickLine={false}
									width={32}
								/>
								<YAxis
									yAxisId="normalized"
									orientation="right"
									tick={{ fontSize: 10 }}
									axisLine={false}
									tickLine={false}
									width={36}
								/>
								<Tooltip
									cursor={{ fill: "rgba(25,25,25,0.05)" }}
									content={renderTooltip}
								/>
								<Legend verticalAlign="bottom" height={28} />
								<Bar
									name="生スコア"
									dataKey="rawScore"
									fill="#1f1f1f"
									yAxisId="raw"
									barSize={18}
								>
									<LabelList
										dataKey="rawScore"
										position="top"
										fontSize={9}
										fill="#1f1f1f"
									/>
								</Bar>
								<Bar
									name="正規化"
									dataKey="normalizedScore"
									fill="#9e361f"
									yAxisId="normalized"
									barSize={18}
								>
									<LabelList
										dataKey="normalizedScore"
										position="top"
										fontSize={9}
										formatter={(value) =>
											typeof value === "number"
												? value.toFixed(2)
												: String(value ?? "")
										}
										fill="#9e361f"
									/>
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					) : (
						<div className="debug-axis__loading">グラフを読み込み中...</div>
					)}
				</div>
			</div>
		</div>
	);
}
