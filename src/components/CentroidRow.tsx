import { typeResults } from "@/data/type-results";

const typeNameById = new Map(
	typeResults.map((type) => [type.id, type.modelName]),
);

interface CentroidRowProps {
	id: number;
	x: number;
	y: number;
	onChange: (id: number, x: number, y: number) => void;
}

export function CentroidRow({ id, x, y, onChange }: CentroidRowProps) {
	const name = typeNameById.get(id) ?? `Type ${id}`;

	return (
		<div className="centroid-row">
			<div className="centroid-row__header">
				<span className="centroid-row__id">{id}</span>
				<span className="centroid-row__name">{name}</span>
			</div>
			<div className="centroid-row__inputs">
				<label className="centroid-input">
					<span className="centroid-input__label">X</span>
					<input
						type="number"
						inputMode="numeric"
						value={x}
						onChange={(e) => onChange(id, Number(e.target.value) || 0, y)}
						className="centroid-input__field"
						min={-10}
						max={10}
					/>
					<input
						type="range"
						value={x}
						onChange={(e) => onChange(id, Number(e.target.value), y)}
						className="centroid-input__slider"
						min={-10}
						max={10}
						step={1}
					/>
				</label>
				<label className="centroid-input">
					<span className="centroid-input__label">Y</span>
					<input
						type="number"
						inputMode="numeric"
						value={y}
						onChange={(e) => onChange(id, x, Number(e.target.value) || 0)}
						className="centroid-input__field"
						min={-10}
						max={10}
					/>
					<input
						type="range"
						value={y}
						onChange={(e) => onChange(id, x, Number(e.target.value))}
						className="centroid-input__slider"
						min={-10}
						max={10}
						step={1}
					/>
				</label>
			</div>
		</div>
	);
}
