import { memo } from "react";
import { CATEGORIES, shapePath } from "../../lib/categories";
import type { FundingPoint } from "../../lib/types";

/** Radius (screen px) of the invisible click/hover target around each dot. */
const HIT_RADIUS = 8;
/** Districts are dense (900+), so they draw smaller than the sparse categories. */
const BASE_RADIUS = { district: 3.5, library: 5, datacenter: 5 } as const;

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

/**
 * A pointer-only map marker. With 1,000+ points, putting each one in the tab order would
 * force keyboard users through 1,000+ tab stops, so keyboard and screen reader users
 * pick points from the equivalent searchable lists instead (WCAG 2.1.1, 2.4.3).
 */
function MapPoint({ point, x, y, selected, highlighted, hovered, scale = 1, onSelect, onHover }: Props) {
  const { color, shape } = CATEGORIES[point.category];
  const emphasized = selected || highlighted;
  const r = (hovered ? 9 : emphasized ? 7 : BASE_RADIUS[point.category]) / scale;
  return (
    <g
      className="cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        onSelect(point.id);
      }}
      onMouseEnter={() => onHover(point.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Invisible, fixed-size hit target so hover doesn't depend on the dot's visual size. */}
      <circle cx={x} cy={y} r={HIT_RADIUS / scale} fill="transparent" />
      <path
        d={shapePath(shape, x, y, r)}
        fill={color}
        stroke={emphasized ? "var(--cds-text-primary)" : "var(--cds-background)"}
        strokeWidth={(emphasized || hovered ? 2 : 1) / scale}
        pointerEvents="none"
      />
    </g>
  );
}

export default memo(MapPoint);
