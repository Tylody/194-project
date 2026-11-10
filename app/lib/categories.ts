import type { Category } from "./types";

export const CATEGORIES: Record<Category, { label: string; color: string }> = {
  district: { label: "School district", color: "#2563eb" },
  library: { label: "Library", color: "#16a34a" },
  datacenter: { label: "Data center / AI", color: "#dc2626" },
};
