import type { Category } from "./types";

// Carbon data-visualization categorical palette (cyan 50, teal 70, magenta 70).
// Applied in palette order to maximize contrast between neighbouring categories.
export const CATEGORIES: Record<Category, { label: string; color: string }> = {
  district: { label: "School district", color: "#1192e8" },
  library: { label: "Library", color: "#005d5d" },
  datacenter: { label: "Data center / AI", color: "#9f1853" },
};
