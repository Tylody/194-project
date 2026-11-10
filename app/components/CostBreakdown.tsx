import { usd } from "../lib/format";
import type { CostGroup } from "../lib/types";

export default function CostBreakdown({ group, color }: { group: CostGroup; color: string }) {
  const total = group.items.reduce((s, i) => s + i.amount, 0);
  return (
    <section className="mt-5">
      <h3 className="flex justify-between text-sm font-semibold">
        <span>{group.title}</span>
        <span>{usd.format(total)}</span>
      </h3>
      <ul className="mt-2 space-y-2">
        {group.items.map((item) => (
          <li key={item.label} className="text-sm">
            <div className="flex justify-between">
              <span>{item.label}</span>
              <span className="text-zinc-500">{usd.format(item.amount)}</span>
            </div>
            <div className="mt-1 h-1.5 rounded bg-zinc-200 dark:bg-zinc-800">
              <div className="h-full rounded" style={{ width: `${(item.amount / total) * 100}%`, background: color }} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
