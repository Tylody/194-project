import type { Category } from "./types";

export type Shape = "circle" | "square" | "diamond";

// Carbon data-visualization categorical palette. Colors are CSS custom properties
// (defined per theme in globals.css) so each one keeps >= 3:1 contrast against the map
// in both light and dark mode (WCAG 1.4.11). Each category also gets its own shape so
// they're distinguishable without relying on color alone (WCAG 1.4.1).
export const CATEGORIES: Record<Category, { label: string; color: string; shape: Shape }> = {
  district: { label: "School district", color: "var(--cat-district)", shape: "circle" },
  library: { label: "Library", color: "var(--cat-library)", shape: "square" },
  datacenter: { label: "Data center / AI", color: "var(--cat-datacenter)", shape: "diamond" },
};

/** SVG path for a marker of the given shape, centered on (x, y), roughly `r` in radius. */
export function shapePath(shape: Shape, x: number, y: number, r: number): string {
  switch (shape) {
    case "square": {
      const s = r * 0.9; // visually balances area against the circle
      return `M${x - s},${y - s}h${2 * s}v${2 * s}h${-2 * s}Z`;
    }
    case "diamond": {
      const d = r * 1.25;
      return `M${x},${y - d}L${x + d},${y}L${x},${y + d}L${x - d},${y}Z`;
    }
    default:
      return `M${x - r},${y}a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0`;
  }
}
