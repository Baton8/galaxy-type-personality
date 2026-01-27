type StorageKind = "local" | "session";

const getStorage = (kind: StorageKind): Storage | null => {
	if (typeof window === "undefined") return null;
	try {
		return kind === "local" ? window.localStorage : window.sessionStorage;
	} catch {
		return null;
	}
};

export const readStorageJson = <T>(
	kind: StorageKind,
	key: string,
): T | null => {
	const storage = getStorage(kind);
	if (!storage) return null;

	try {
		const raw = storage.getItem(key);
		if (!raw) return null;
		return JSON.parse(raw) as T;
	} catch {
		return null;
	}
};

export const writeStorageJson = (
	kind: StorageKind,
	key: string,
	value: unknown,
): void => {
	const storage = getStorage(kind);
	if (!storage) return;
	try {
		storage.setItem(key, JSON.stringify(value));
	} catch {
		// ignore storage failures (private mode, quota, policy)
	}
};
