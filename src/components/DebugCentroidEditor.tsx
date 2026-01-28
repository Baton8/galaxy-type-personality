import { useEffect, useState } from "react";
import { CentroidImportModal } from "@/components/CentroidImportModal";
import { CentroidRow } from "@/components/CentroidRow";
import { readStorageJson, writeStorageJson } from "@/lib/storage";
import { useCentroids } from "@/state/centroids";

const STORAGE_KEY = "debug-centroid-editor-open";

export default function DebugCentroidEditor() {
	const { centroids, updateCentroid, resetToDefaults, importCentroids } =
		useCentroids();
	const [showImportModal, setShowImportModal] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const stored = readStorageJson<boolean>("local", STORAGE_KEY);
		if (stored) {
			setIsOpen(true);
		}
	}, []);

	const toggleOpen = () => {
		const next = !isOpen;
		setIsOpen(next);
		writeStorageJson("local", STORAGE_KEY, next);
	};

	const handleExport = async () => {
		if (typeof navigator === "undefined") return;

		const json = JSON.stringify(centroids, null, 2);
		if (navigator.clipboard?.writeText) {
			try {
				await navigator.clipboard.writeText(json);
			} catch {}
		}
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
				<CentroidImportModal
					onClose={() => setShowImportModal(false)}
					onImport={importCentroids}
				/>
			)}
		</div>
	);
}
