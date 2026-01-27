import { useEffect, useState } from "react";
import { typeResults } from "@/data/type-results";
import { type Centroid, useCentroids } from "@/state/centroids";

const STORAGE_KEY = "debug-centroid-editor-open";

const typeNameById = new Map(
	typeResults.map((type) => [type.id, type.modelName]),
);

interface CentroidRowProps {
	id: number;
	x: number;
	y: number;
	onChange: (id: number, x: number, y: number) => void;
}

function CentroidRow({ id, x, y, onChange }: CentroidRowProps) {
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

interface ImportModalProps {
	onClose: () => void;
	onImport: (centroids: Centroid[]) => void;
}

function ImportModal({ onClose, onImport }: ImportModalProps) {
	const [text, setText] = useState("");
	const [error, setError] = useState<string | null>(null);

	const handleImport = () => {
		try {
			const parsed = JSON.parse(text);
			if (!Array.isArray(parsed) || parsed.length !== 8) {
				setError("8つのセントロイドが必要です");
				return;
			}
			for (const item of parsed) {
				if (
					typeof item.id !== "number" ||
					typeof item.x !== "number" ||
					typeof item.y !== "number"
				) {
					setError("各項目に id, x, y が必要です");
					return;
				}
			}
			onImport(parsed as Centroid[]);
			onClose();
		} catch {
			setError("JSONの形式が正しくありません");
		}
	};

	return (
		// biome-ignore lint/a11y/useSemanticElements: オーバーレイ背景として使用
		<div
			className="centroid-modal-overlay"
			role="button"
			tabIndex={0}
			onClick={onClose}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					onClose();
				}
			}}
		>
			<div
				className="centroid-modal"
				role="dialog"
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
			>
				<div className="centroid-modal__header">
					<span className="centroid-modal__title">Import JSON</span>
					<button
						type="button"
						onClick={onClose}
						className="centroid-modal__close"
					>
						✕
					</button>
				</div>
				<textarea
					className="centroid-modal__textarea"
					placeholder='[{"id":1,"x":4,"y":4},...]'
					value={text}
					onChange={(e) => {
						setText(e.target.value);
						setError(null);
					}}
				/>
				{error && <p className="centroid-modal__error">{error}</p>}
				<div className="centroid-modal__actions">
					<button
						type="button"
						onClick={onClose}
						className="centroid-editor__btn"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={handleImport}
						className="centroid-editor__btn centroid-editor__btn--primary"
					>
						Import
					</button>
				</div>
			</div>
		</div>
	);
}

export default function DebugCentroidEditor() {
	const { centroids, updateCentroid, resetToDefaults, importCentroids } =
		useCentroids();
	const [showImportModal, setShowImportModal] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === "true") {
			setIsOpen(true);
		}
	}, []);

	const toggleOpen = () => {
		const next = !isOpen;
		setIsOpen(next);
		localStorage.setItem(STORAGE_KEY, String(next));
	};

	const handleExport = () => {
		const json = JSON.stringify(centroids, null, 2);
		navigator.clipboard.writeText(json);
	};

	return (
		<div className="centroid-editor">
			<button
				type="button"
				className={`centroid-editor__header centroid-editor__header--toggle ${isOpen ? "centroid-editor__header--expanded" : ""}`}
				onClick={toggleOpen}
			>
				<span className="centroid-editor__title">
					<span
						className={`centroid-editor__chevron ${isOpen ? "centroid-editor__chevron--open" : ""}`}
					>
						▶
					</span>
					診断チューニング
				</span>
				{isOpen && (
					// biome-ignore lint/a11y/noStaticElementInteractions: イベント伝播防止のため
					<div
						className="centroid-editor__actions"
						role="presentation"
						onClick={(e) => e.stopPropagation()}
						onKeyDown={(e) => e.stopPropagation()}
					>
						<button
							type="button"
							onClick={handleExport}
							className="centroid-editor__btn"
						>
							Export
						</button>
						<button
							type="button"
							onClick={() => setShowImportModal(true)}
							className="centroid-editor__btn"
						>
							Import
						</button>
						<button
							type="button"
							onClick={resetToDefaults}
							className="centroid-editor__btn centroid-editor__btn--reset"
						>
							Reset
						</button>
					</div>
				)}
			</button>
			{isOpen && (
				<div className="centroid-editor__list">
					{centroids.map((c) => (
						<CentroidRow
							key={c.id}
							id={c.id}
							x={c.x}
							y={c.y}
							onChange={updateCentroid}
						/>
					))}
				</div>
			)}
			{showImportModal && (
				<ImportModal
					onClose={() => setShowImportModal(false)}
					onImport={importCentroids}
				/>
			)}
		</div>
	);
}
