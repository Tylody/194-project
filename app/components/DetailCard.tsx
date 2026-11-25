"use client";

import type { Ref } from "react";
import { Tile } from "@carbon/react";
import { CATEGORIES } from "../lib/categories";
import { usd } from "../lib/format";
import type { FundingPoint } from "../lib/types";
import CostBreakdown from "./CostBreakdown";
import Swatch from "./Swatch";

export default function DetailCard({ point, headingRef }: { point: FundingPoint; headingRef?: Ref<HTMLHeadingElement> }) {
  const { label, color, shape } = CATEGORIES[point.category];
  return (
    <Tile role="article" aria-labelledby={`detail-${point.id}`} className="!p-6" style={{ boxShadow: `inset 0 4px 0 ${color}` }}>
      <p className="type-label-01 flex items-center gap-2 text-[var(--cds-text-secondary)]">
        <Swatch color={color} shape={shape} />
        {label}
      </p>
      <h2 id={`detail-${point.id}`} ref={headingRef} tabIndex={-1} className="type-heading-03 mt-2 focus:outline-none focus-visible:outline-2 focus-visible:outline-[var(--cds-focus)]">{point.name}</h2>
      {point.subtitle && <p className="type-body-01 text-[var(--cds-text-secondary)]">{point.subtitle}</p>}
      <p className="type-heading-06 mt-4">
        <span className="cds--visually-hidden">Funding: </span>
        {usd.format(point.funding)}
      </p>
      <p className="type-helper-01 mt-1">
        {point.period} · Source: {point.source}
      </p>
      {point.breakdown?.map((g) => (
        <CostBreakdown key={g.title} group={g} color={color} />
      ))}
    </Tile>
  );
}
