"use client";

import { Tile } from "@carbon/react";
import { CATEGORIES } from "../lib/categories";
import { usd } from "../lib/format";
import type { FundingPoint } from "../lib/types";
import CostBreakdown from "./CostBreakdown";
import Swatch from "./Swatch";

export default function DetailCard({ point }: { point: FundingPoint }) {
  const { label, color } = CATEGORIES[point.category];
  return (
    <Tile className="!p-6" style={{ boxShadow: `inset 0 4px 0 ${color}` }}>
      <p className="type-label-01 flex items-center gap-2 text-[var(--cds-text-secondary)]">
        <Swatch color={color} />
        {label}
      </p>
      <h2 className="type-heading-03 mt-2">{point.name}</h2>
      <p className="type-heading-06 mt-4">{usd.format(point.funding)}</p>
      <p className="type-helper-01 mt-1">
        {point.year} · Source: {point.source}
      </p>
      {point.breakdown?.map((g) => (
        <CostBreakdown key={g.title} group={g} color={color} />
      ))}
    </Tile>
  );
}
