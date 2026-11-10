"use client";

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
  if (!point) {
    return (
      <aside className="w-full md:flex-1">
        <PointList points={points} onSelect={onSelect} hoveredId={hoveredId} onHover={onHover} />
      </aside>
    );
  }

  // Always show the data center second (below) so the contrast reads consistently.
  const [left, right] =
    paired && point.category === "datacenter" ? [paired.point, point] : [point, paired?.point];

  return (
    <aside className="w-full md:flex-1">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <Button kind="ghost" size="sm" renderIcon={ArrowLeft} iconDescription="Back" onClick={onClear}>
          All points
        </Button>
        {paired && (
          <Tag type="gray" size="md">
            Nearest {point.category === "datacenter" ? "school/library" : "data center"}:{" "}
            {Math.round(paired.km * 0.621371)} mi away
          </Tag>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <DetailCard point={left} />
        {right && <DetailCard point={right} />}
      </div>
    </aside>
  );
}
