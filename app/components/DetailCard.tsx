import { CATEGORIES } from "../lib/categories";
import { usd } from "../lib/format";
import type { FundingPoint } from "../lib/types";
import CostBreakdown from "./CostBreakdown";

export default function DetailCard({ point }: { point: FundingPoint }) {
  const { label, color } = CATEGORIES[point.category];
  return (
    <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800" style={{ borderTopColor: color, borderTopWidth: 4 }}>
      <p className="text-sm text-zinc-500">{label}</p>
      <h2 className="text-lg font-semibold">{point.name}</h2>
      <p className="mt-2 text-3xl font-bold">{usd.format(point.funding)}</p>
      <p className="text-sm text-zinc-500">
        {point.year} · source: {point.source}
      </p>
      {point.breakdown?.map((g) => (
        <CostBreakdown key={g.title} group={g} color={color} />
      ))}
    </div>
  );
}
