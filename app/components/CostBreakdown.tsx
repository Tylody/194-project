import { usd } from "../lib/format";
import type { CostGroup } from "../lib/types";

export default function CostBreakdown({ group, color }: { group: CostGroup; color: string }) {
  const total = group.items.reduce((s, i) => s + i.amount, 0);
  return (
    <section className="mt-6 border-t border-[var(--cds-border-subtle-01)] pt-4">
      <h3 className="type-heading-compact-01 flex justify-between">
        <span>{group.title}</span>
        <span className="type-mono">{usd.format(total)}</span>
      </h3>
      <ul className="mt-3 flex flex-col gap-3">
        {group.items.map((item) => (
          <li key={item.label} className="type-body-01">
            <div className="flex justify-between gap-4">
              <span>{item.label}</span>
              <span className="type-mono text-[var(--cds-text-secondary)]">{usd.format(item.amount)}</span>
            </div>
            <div
              className="mt-1 h-2 bg-[var(--cds-layer-accent-01)]"
              role="meter"
              aria-label={item.label}
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={item.amount}
            >
              <div className="h-full" style={{ width: `${(item.amount / total) * 100}%`, background: color }} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
