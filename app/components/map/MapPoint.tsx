import { CATEGORIES } from "../../lib/categories";
import type { FundingPoint } from "../../lib/types";

interface Props {
  point: FundingPoint;
  x: number;
  y: number;
  selected: boolean;
  highlighted?: boolean;
  /** Current zoom factor; dots are counter-scaled to stay a constant screen size. */
  scale?: number;
  onSelect: (id: string) => void;
}

export default function MapPoint({ point, x, y, selected, highlighted, scale = 1, onSelect }: Props) {
  return (
    <circle
      cx={x}
      cy={y}
      r={(selected || highlighted ? 9 : 6) / scale}
      fill={CATEGORIES[point.category].color}
      stroke={selected || highlighted ? "currentColor" : "white"}
      strokeWidth={2 / scale}
      tabIndex={0}
      role="button"
      aria-label={`${CATEGORIES[point.category].label}: ${point.name}`}
      className="cursor-pointer outline-none focus-visible:stroke-black"
      onClick={(e) => {
        e.stopPropagation();
        onSelect(point.id);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(point.id);
        }
      }}
    />
  );
}
