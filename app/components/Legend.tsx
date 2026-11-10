import { CATEGORIES } from "../lib/categories";
import Swatch from "./Swatch";

export default function Legend() {
  return (
    <ul className="type-label-01 flex flex-wrap gap-x-6 gap-y-2 text-[var(--cds-text-secondary)]">
      {Object.values(CATEGORIES).map((c) => (
        <li key={c.label} className="flex items-center gap-2">
          <Swatch color={c.color} />
          {c.label}
        </li>
      ))}
    </ul>
  );
}
