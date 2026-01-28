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

import { getAxisMax, getAxisPoints } from "@/lib/axis-chart";
import { useCentroids } from "@/state/centroids";

const renderTooltip = ({
	active,
	payload,
}: TooltipContentProps<number, string>) => {
	if (!active || !payload?.length) return null;
	const point = payload[0]?.payload as { name: string; label: string };

	return (
		<div className="axis-tooltip">
			<div className="axis-tooltip__title">{point.label}</div>
			<div>{point.name}</div>
		</div>
	);
};

export default function AxisPreviewChart() {
	const [mounted, setMounted] = useState(false);
	const { centroids } = useCentroids();

	useEffect(() => {
		setMounted(true);
	}, []);
	const maxAxis = useMemo(() => getAxisMax(centroids), [centroids]);
	const typePoints = useMemo(() => getAxisPoints(centroids), [centroids]);

	return (
		<div className="axis-chart">
			<span className="axis-chart__corner axis-chart__corner--tl">
				<span className="axis-chart__corner-line">Y+ アクション・外交</span>
			</span>
			<span className="axis-chart__corner axis-chart__corner--bl">
				<span className="axis-chart__corner-line">Y- サポート・慎重</span>
				<span className="axis-chart__corner-line">X- 感覚・体験</span>
			</span>
			<span className="axis-chart__corner axis-chart__corner--br">
				<span className="axis-chart__corner-line">X+ 論理・データ</span>
			</span>
			{mounted ? (
				<ResponsiveContainer width="100%" height="100%">
					<ScatterChart margin={{ top: 12, right: 12, bottom: 12, left: 12 }}>
						<CartesianGrid strokeDasharray="2 8" stroke="rgba(25,25,25,0.16)" />
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
							cursor={{ strokeDasharray: "3 6" }}
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
								dataKey="label"
								position="top"
								fill="#2f2f2f"
								fontSize={9}
							/>
						</Scatter>
					</ScatterChart>
				</ResponsiveContainer>
			) : (
				<div className="axis-chart__placeholder">Axis Map</div>
			)}
		</div>
	);
}
