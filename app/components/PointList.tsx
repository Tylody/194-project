"use client";

import { ContainedList, ContainedListItem } from "@carbon/react";
import { CATEGORIES } from "../lib/categories";
import { usd } from "../lib/format";
import type { Category, FundingPoint } from "../lib/types";
import Swatch from "./Swatch";

export default function PointList({
  points,
  onSelect,
  hoveredId,
  onHover,
}: {
  points: FundingPoint[];
  onSelect: (id: string) => void;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  return (
    <div className="flex flex-col gap-8">
      <p className="type-body-01 text-[var(--cds-text-secondary)]">
        Select a point on the map or from the list below to compare it with its nearest counterpart.
      </p>
      {(Object.keys(CATEGORIES) as Category[]).map((cat) => {
        const items = points.filter((p) => p.category === cat);
        if (items.length === 0) return null;
        const { label, color } = CATEGORIES[cat];
        return (
          <ContainedList
            key={cat}
            kind="on-page"
            size="md"
            label={
              <span className="flex items-center gap-2">
                <Swatch color={color} />
                {label} ({items.length})
              </span>
            }
          >
            {items.map((p) => (
              <ContainedListItem
                key={p.id}
                onClick={() => onSelect(p.id)}
                // Forwarded to the <li>; keeps hover in sync with the map.
                {...{
                  onMouseEnter: () => onHover(p.id),
                  onMouseLeave: () => onHover(null),
                  onFocus: () => onHover(p.id),
                  onBlur: () => onHover(null),
                }}
                className={hoveredId === p.id ? "bg-[var(--cds-layer-hover-01)]" : undefined}
              >
                <span className="flex w-full items-center justify-between gap-4">
                  <span>{p.name}</span>
                  <span className="type-mono shrink-0 text-[var(--cds-text-secondary)]">
                    {usd.format(p.funding)}
                  </span>
                </span>
              </ContainedListItem>
            ))}
          </ContainedList>
        );
      })}
    </div>
  );
}
