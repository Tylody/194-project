"use client";

import { useEffect, useRef } from "react";
import { Button, Tag } from "@carbon/react";
import { ArrowLeft } from "@carbon/icons-react";
import type { FundingPoint } from "../lib/types";
import PointList from "./PointList";
import DetailCard from "./DetailCard";

interface Props {
  point: FundingPoint | null;
  paired: { point: FundingPoint; km: number } | null;
  points: FundingPoint[];
  onSelect: (id: string) => void;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onClear: () => void;
}

export default function DetailPanel({ point, paired, points, onSelect, hoveredId, onHover, onClear }: Props) {
  const listRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Selecting a point swaps the list for the detail view, which would otherwise drop
  // keyboard focus onto <body>. Move it to the new content instead (WCAG 2.4.3).
  useEffect(() => {
    if (point) headingRef.current?.focus();
  }, [point]);

  const handleClear = () => {
    const id = point?.id;
    onClear();
    // Return focus to the item the user came from, falling back to the search field.
    requestAnimationFrame(() => {
      const list = listRef.current;
      const target =
        (id && list?.querySelector<HTMLElement>(`[data-point-id="${CSS.escape(id)}"] button`)) ||
        list?.querySelector<HTMLElement>("input");
      target?.focus();
    });
  };

  // Always show the data center second (below) so the contrast reads consistently.
  const [left, right] =
    point && paired && point.category === "datacenter" ? [paired.point, point] : [point, paired?.point];

  return (
    <aside aria-label={point ? "Selected location details" : "Locations"} className="w-full md:flex-1">
      {/* Kept mounted (just hidden) so the search query and paging survive viewing a point. */}
      <div ref={listRef} hidden={!!point}>
        <PointList points={points} onSelect={onSelect} hoveredId={hoveredId} onHover={onHover} />
      </div>
      {point && left && (
        <>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <Button kind="ghost" size="sm" renderIcon={ArrowLeft} onClick={handleClear}>
              Back to all locations
            </Button>
            {paired && (
              <Tag type="gray" size="md">
                Nearest {point.category === "datacenter" ? "school/library" : "data center"}:{" "}
                {Math.round(paired.km * 0.621371)} mi away
              </Tag>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <DetailCard point={left} headingRef={left.id === point.id ? headingRef : undefined} />
            {right && <DetailCard point={right} headingRef={right.id === point.id ? headingRef : undefined} />}
          </div>
        </>
      )}
    </aside>
  );
}
