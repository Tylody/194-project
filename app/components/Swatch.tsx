/** Carbon-style legend swatch: a small square with a 1px border for contrast on any layer. */
export default function Swatch({ color, size = 12 }: { color: string; size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-block shrink-0 border border-[var(--cds-border-subtle-01)]"
      style={{ background: color, width: size, height: size }}
    />
  );
}
