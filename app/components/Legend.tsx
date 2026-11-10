import { CATEGORIES } from "../lib/categories";

export default function Legend() {
  return (
    <ul className="flex flex-wrap gap-4 text-sm">
      {Object.values(CATEGORIES).map((c) => (
        <li key={c.label} className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full" style={{ background: c.color }} />
          {c.label}
        </li>
      ))}
    </ul>
  );
}
