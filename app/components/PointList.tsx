import { CATEGORIES } from "../lib/categories";
import { usd } from "../lib/format";
import type { Category, FundingPoint } from "../lib/types";

export default function PointList({
  points,
  onSelect,
}: {
  points: FundingPoint[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-zinc-500">Select a point on the map or from the list below to compare it with its nearest counterpart.</p>
      {(Object.keys(CATEGORIES) as Category[]).map((cat) => {
        const items = points.filter((p) => p.category === cat);
        if (items.length === 0) return null;
        const { label, color } = CATEGORIES[cat];
        return (
          <section key={cat}>
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <span className="inline-block h-3 w-3 rounded-full" style={{ background: color }} />
              {label} ({items.length})
            </h2>
            <ul className="mt-2 divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
              {items.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(p.id)}
                    className="flex w-full cursor-pointer items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <span>{p.name}</span>
                    <span className="shrink-0 text-zinc-500">{usd.format(p.funding)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
