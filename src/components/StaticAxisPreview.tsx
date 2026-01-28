import { useId } from "react";

import { typeCentroids } from "@/lib/diagnosis";
import { getTypeLabel } from "@/lib/type-utils";

const SIZE = 200;
const PADDING = 16;
const CHART_SIZE = SIZE - PADDING * 2;

// Calculate axis max from centroids
const maxCoord = Math.max(
	...typeCentroids.flatMap((c) => [Math.abs(c.x), Math.abs(c.y)]),
);
const AXIS_MAX = maxCoord + 2;

// Convert data coordinates to SVG coordinates
const toSvgX = (x: number) =>
	PADDING + ((x + AXIS_MAX) / (2 * AXIS_MAX)) * CHART_SIZE;
const toSvgY = (y: number) =>
	PADDING + ((AXIS_MAX - y) / (2 * AXIS_MAX)) * CHART_SIZE;

// Generate grid lines
const gridLines = [-4, -2, 0, 2, 4]
	.filter((v) => Math.abs(v) <= AXIS_MAX)
	.map((v) => ({
		x: toSvgX(v),
		y: toSvgY(v),
	}));

// Transform centroids to SVG points
const points = typeCentroids.map((c) => ({
	id: c.id,
	label: getTypeLabel(c.id),
	cx: toSvgX(c.x),
	cy: toSvgY(c.y),
}));

export function StaticAxisPreview() {
	const titleId = useId();
	const centerX = toSvgX(0);
	const centerY = toSvgY(0);

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
			<svg
				viewBox={`0 0 ${SIZE} ${SIZE}`}
				className="w-full h-full"
				role="img"
				aria-labelledby={titleId}
			>
				<title id={titleId}>タイプ分布図</title>
				{/* Grid lines */}
				{gridLines.map((line) => (
					<g key={`grid-${line.x}-${line.y}`}>
						<line
							x1={PADDING}
							y1={line.y}
							x2={SIZE - PADDING}
							y2={line.y}
							stroke="rgba(25,25,25,0.16)"
							strokeDasharray="2 8"
						/>
						<line
							x1={line.x}
							y1={PADDING}
							x2={line.x}
							y2={SIZE - PADDING}
							stroke="rgba(25,25,25,0.16)"
							strokeDasharray="2 8"
						/>
					</g>
				))}

				{/* Axis lines */}
				<line
					x1={centerX}
					y1={PADDING}
					x2={centerX}
					y2={SIZE - PADDING}
					stroke="rgba(25,25,25,0.4)"
				/>
				<line
					x1={PADDING}
					y1={centerY}
					x2={SIZE - PADDING}
					y2={centerY}
					stroke="rgba(25,25,25,0.4)"
				/>

				{/* Data points with labels */}
				{points.map((point) => (
					<g key={point.id}>
						<circle
							cx={point.cx}
							cy={point.cy}
							r={4}
							fill="#1f1f1f"
							fillOpacity={0.7}
							stroke="#1f1f1f"
							strokeWidth={0.5}
						/>
						<text
							x={point.cx}
							y={point.cy - 8}
							textAnchor="middle"
							fill="#2f2f2f"
							fontSize={9}
							fontFamily="inherit"
						>
							{point.label}
						</text>
					</g>
				))}
			</svg>
		</div>
	);
}
