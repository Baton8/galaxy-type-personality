import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import {
	type Centroid,
	typeCentroids as defaultCentroids,
} from "@/lib/diagnosis";
import { readStorageJson, writeStorageJson } from "@/lib/storage";

export type { Centroid } from "@/lib/diagnosis";

interface CentroidsContextValue {
	centroids: Centroid[];
	updateCentroid: (id: number, x: number, y: number) => void;
	resetToDefaults: () => void;
	importCentroids: (centroids: Centroid[]) => void;
}

const storageKey = "debug-centroids";

const CentroidsContext = createContext<CentroidsContextValue | null>(null);

const isFiniteNumber = (value: unknown): value is number => {
	return typeof value === "number" && Number.isFinite(value);
};

const isValidCentroid = (value: unknown): value is Centroid => {
	if (!value || typeof value !== "object") return false;
	const centroid = value as Centroid;
	return (
		isFiniteNumber(centroid.id) &&
		isFiniteNumber(centroid.x) &&
		isFiniteNumber(centroid.y)
	);
};

const isValidCentroidList = (value: unknown): value is Centroid[] => {
	return (
		Array.isArray(value) &&
		value.length === defaultCentroids.length &&
		value.every(isValidCentroid)
	);
};

const loadCentroids = (): Centroid[] => {
	const parsed = readStorageJson<Centroid[]>("local", storageKey);
	if (!isValidCentroidList(parsed)) {
		return defaultCentroids;
	}
	return parsed;
};

export const CentroidsProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [centroids, setCentroids] = useState<Centroid[]>(defaultCentroids);

	useEffect(() => {
		setCentroids(loadCentroids());
	}, []);

	useEffect(() => {
		writeStorageJson("local", storageKey, centroids);
	}, [centroids]);

	const updateCentroid = useCallback((id: number, x: number, y: number) => {
		setCentroids((prev) => prev.map((c) => (c.id === id ? { ...c, x, y } : c)));
	}, []);

	const resetToDefaults = useCallback(() => {
		setCentroids(defaultCentroids);
	}, []);

	const importCentroids = useCallback((newCentroids: Centroid[]) => {
		setCentroids(
			isValidCentroidList(newCentroids) ? newCentroids : defaultCentroids,
		);
	}, []);

	const value = useMemo(
		() => ({ centroids, updateCentroid, resetToDefaults, importCentroids }),
		[centroids, updateCentroid, resetToDefaults, importCentroids],
	);

	return (
		<CentroidsContext.Provider value={value}>
			{children}
		</CentroidsContext.Provider>
	);
};

export const useCentroids = () => {
	const context = useContext(CentroidsContext);
	if (!context) {
		throw new Error("useCentroids must be used within CentroidsProvider");
	}
	return context;
};
