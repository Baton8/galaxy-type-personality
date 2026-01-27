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

const loadCentroids = (): Centroid[] => {
	const parsed = readStorageJson<Centroid[]>("local", storageKey);
	if (!parsed || !Array.isArray(parsed) || parsed.length !== 8) {
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
		setCentroids(newCentroids);
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
