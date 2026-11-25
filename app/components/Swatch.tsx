import { shapePath, type Shape } from "../lib/categories";

/** Legend swatch: the category's map marker shape, with a 1px outline for contrast on any layer. */
export default function Swatch({ color, shape = "square", size = 12 }: { color: string; shape?: Shape; size?: number }) {
  const c = size / 2;
  return (
    <svg aria-hidden="true" focusable="false" width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0 overflow-visible">
      <path d={shapePath(shape, c, c, c - 1)} fill={color} stroke="var(--cds-border-strong-01)" strokeWidth={1} />
    </svg>
  );
}
