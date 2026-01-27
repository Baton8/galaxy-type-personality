import { useState } from "react";
import type { Centroid } from "@/state/centroids";

interface CentroidImportModalProps {
	onClose: () => void;
	onImport: (centroids: Centroid[]) => void;
}

export function CentroidImportModal({
	onClose,
	onImport,
}: CentroidImportModalProps) {
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
