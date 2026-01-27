import { useEffect, useMemo, useState } from "react";
import {
	CartesianGrid,
	LabelList,
	ReferenceLine,
	ResponsiveContainer,
	Scatter,
	ScatterChart,
	Tooltip,
	type TooltipContentProps,
	XAxis,
	YAxis,
} from "recharts";

import { typeResults } from "@/data/type-results";
import { useCentroids } from "@/state/centroids";

interface DebugAxisChartProps {
	x: number;
	y: number;
}

const modelNameById = new Map(
	typeResults.map((type) => [type.id, type.modelName]),
);

const renderTooltip = ({
	active,
	payload,
}: TooltipContentProps<number, string>) => {
	if (!active || !payload?.length) return null;
	const point = payload[0]?.payload as { label: string; x: number; y: number };

	return (
		<div className="surface-panel-plain rounded-lg px-3 py-2 text-xs text-ink-soft shadow-md">
			<div className="font-medium text-ink">{point.label}</div>
			<div className="mt-1">
				X: {point.x} / Y: {point.y}
			</div>
		</div>
	);
};

export default function DebugAxisChart({ x, y }: DebugAxisChartProps) {
	const [mounted, setMounted] = useState(false);
	const { centroids } = useCentroids();

	useEffect(() => {
		setMounted(true);
	}, []);

	const maxAxis = useMemo(
		() =>
			Math.max(...centroids.flatMap((c) => [Math.abs(c.x), Math.abs(c.y)])) + 2,
		[centroids],
	);

	const typePoints = useMemo(
		() =>
			centroids.map((centroid) => ({
				id: centroid.id,
				name: modelNameById.get(centroid.id) ?? `タイプ${centroid.id}`,
				label: modelNameById.get(centroid.id) ?? `タイプ${centroid.id}`,
				x: centroid.x,
				y: centroid.y,
			})),
		[centroids],
	);

	return (
		<div className="debug-axis">
			<div className="debug-axis__header">
				<span>デバッグ: X/Yスコア</span>
				<span className="text-ink">
					X {x} / Y {y}
				</span>
			</div>
			<div className="debug-axis__frame">
				<span className="debug-axis__corner debug-axis__corner--tl">
					<span className="debug-axis__corner-line">Y+ アクション・外交</span>
				</span>
				<span className="debug-axis__corner debug-axis__corner--bl">
					<span className="debug-axis__corner-line">Y- サポート・慎重</span>
					<span className="debug-axis__corner-line">X- 感覚・体験</span>
				</span>
				<span className="debug-axis__corner debug-axis__corner--br">
					<span className="debug-axis__corner-line">X+ 論理・データ</span>
				</span>
				<div className="debug-axis__chart">
					{mounted ? (
						<ResponsiveContainer width="100%" height="100%">
							<ScatterChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
								<CartesianGrid
									strokeDasharray="4 6"
									stroke="rgba(25,25,25,0.18)"
								/>
								<XAxis
									type="number"
									dataKey="x"
									domain={[-maxAxis, maxAxis]}
									tick={false}
									axisLine={false}
									tickLine={false}
									height={0}
								/>
								<YAxis
									type="number"
									dataKey="y"
									domain={[-maxAxis, maxAxis]}
									tick={false}
									axisLine={false}
									tickLine={false}
									width={0}
								/>
								<ReferenceLine x={0} stroke="rgba(25,25,25,0.4)" />
								<ReferenceLine y={0} stroke="rgba(25,25,25,0.4)" />
								<Tooltip
									cursor={{ strokeDasharray: "3 3" }}
									content={renderTooltip}
								/>
								<Scatter
									name="タイプ"
									data={typePoints}
									fill="#1f1f1f"
									fillOpacity={0.7}
									stroke="#1f1f1f"
									strokeWidth={0.5}
								>
									<LabelList
										dataKey="name"
										position="top"
										fill="#1f1f1f"
										fontSize={9}
									/>
								</Scatter>
								<Scatter
									name="現在地"
									data={[{ x, y, label: "現在のスコア" }]}
									fill="#9e361f"
									stroke="#9e361f"
									strokeWidth={0.8}
								/>
							</ScatterChart>
						</ResponsiveContainer>
					) : (
						<div className="debug-axis__loading">グラフを読み込み中...</div>
					)}
				</div>
			</div>
		</div>
	);
}
