import type { Centroid } from "@/lib/diagnosis";
import { getTypeLabel } from "@/lib/type-utils";

export interface AxisPoint {
	id: number;
	label: string;
	name: string;
	x: number;
	y: number;
}

export const getAxisMax = (centroids: Centroid[]): number => {
	return (
		Math.max(
			...centroids.flatMap((centroid) => [
				Math.abs(centroid.x),
				Math.abs(centroid.y),
			]),
		) + 2
	);
};

export const getAxisPoints = (centroids: Centroid[]): AxisPoint[] => {
	return centroids.map((centroid) => {
		const label = getTypeLabel(centroid.id);
		return {
			id: centroid.id,
			label,
			name: label,
			x: centroid.x,
			y: centroid.y,
		};
	});
};
