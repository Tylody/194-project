"use client";

import { useMemo, useState } from "react";
import { Button, ContainedList, ContainedListItem, Search } from "@carbon/react";
import { CATEGORIES } from "../lib/categories";
import { usd } from "../lib/format";
import type { Category, FundingPoint } from "../lib/types";
import Swatch from "./Swatch";

const PAGE = 10;

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
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState<Partial<Record<Category, number>>>({});

  const byCategory = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = q
      ? points.filter((p) => `${p.name} ${p.subtitle ?? ""}`.toLowerCase().includes(q))
      : points;
    const sorted = [...matches].sort((a, b) => b.funding - a.funding);
    return (Object.keys(CATEGORIES) as Category[]).map((cat) => ({
      cat,
      items: sorted.filter((p) => p.category === cat),
    }));
  }, [points, query]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <p className="type-body-01 text-[var(--cds-text-secondary)]">
          Select a point on the map or from the lists below to compare it with its nearest counterpart.
        </p>
        <Search
          size="lg"
          labelText="Search by name or county"
          placeholder="Search by name or county"
          closeButtonLabelText="Clear search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShown({});
          }}
        />
      </div>
      {byCategory.map(({ cat, items }) => {
        if (items.length === 0) return null;
        const { label, color } = CATEGORIES[cat];
        const limit = shown[cat] ?? PAGE;
        return (
          <div key={cat}>
            <ContainedList
              kind="on-page"
              size="md"
              label={
                <span className="flex items-center gap-2">
                  <Swatch color={color} />
                  {label} ({items.length.toLocaleString()}){items.length > 1 && " · highest funding first"}
                </span>
              }
            >
              {items.slice(0, limit).map((p) => (
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
                    <span>
                      {p.name}
                      {p.subtitle && (
                        <span className="type-helper-01 block">{p.subtitle}</span>
                      )}
                    </span>
                    <span className="type-mono shrink-0 text-[var(--cds-text-secondary)]">
                      {usd.format(p.funding)}
                    </span>
                  </span>
                </ContainedListItem>
              ))}
            </ContainedList>
            {items.length > limit && (
              <Button
                kind="ghost"
                size="sm"
                className="mt-2"
                onClick={() => setShown((s) => ({ ...s, [cat]: limit + 25 }))}
              >
                Show {Math.min(25, items.length - limit)} more of {(items.length - limit).toLocaleString()}
              </Button>
            )}
          </div>
        );
      })}
      {byCategory.every((g) => g.items.length === 0) && (
        <p className="type-body-01 text-[var(--cds-text-secondary)]">No points match “{query}”.</p>
      )}
    </div>
  );
}
