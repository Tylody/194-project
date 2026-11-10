import { CATEGORIES } from "../../lib/categories";
import type { FundingPoint } from "../../lib/types";

/** Radius (screen px) of the invisible click/hover target around each dot. */
const HIT_RADIUS = 14;

interface Props {
  point: FundingPoint;
  x: number;
  y: number;
  selected: boolean;
  highlighted?: boolean;
  hovered?: boolean;
  onHover: (id: string | null) => void;
  /** Current zoom factor; dots are counter-scaled to stay a constant screen size. */
  scale?: number;
  onSelect: (id: string) => void;
}

export default function MapPoint({ point, x, y, selected, highlighted, hovered, scale = 1, onSelect, onHover }: Props) {
  const { label, color } = CATEGORIES[point.category];
  const emphasized = selected || highlighted;
  return (
    <g
      tabIndex={0}
      role="button"
      aria-label={`${label}: ${point.name}`}
      className="group cursor-pointer outline-none"
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
      onMouseEnter={() => onHover(point.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(point.id)}
      onBlur={() => onHover(null)}
    >
      {/* Invisible, fixed-size hit target so hover doesn't depend on the dot's visual size. */}
      <circle cx={x} cy={y} r={HIT_RADIUS / scale} fill="transparent" />
      <circle
        cx={x}
        cy={y}
        r={(hovered ? 12 : emphasized ? 9 : 6) / scale}
        fill={color}
        stroke={emphasized ? "var(--cds-text-primary)" : "var(--cds-background)"}
        strokeWidth={2 / scale}
        className="group-focus-visible:stroke-[var(--cds-focus)]"
        pointerEvents="none"
      />
    </g>
  );
}
