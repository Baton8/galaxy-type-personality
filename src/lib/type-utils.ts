import { typeResults } from "@/data/type-results";

export const typeLabelById = new Map(
	typeResults.map((type) => [type.id, type.modelName]),
);

export const getTypeLabel = (id: number): string => {
	return typeLabelById.get(id) ?? `タイプ${id}`;
};
