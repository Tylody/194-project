import type { FundingPoint } from "../lib/types";
import PointList from "./PointList";
import DetailCard from "./DetailCard";

interface Props {
  point: FundingPoint | null;
  paired: { point: FundingPoint; km: number } | null;
  points: FundingPoint[];
  onSelect: (id: string) => void;
  onClear: () => void;
}

export default function DetailPanel({ point, paired, points, onSelect, onClear }: Props) {
  if (!point) {
    return (
      <aside className="w-full md:flex-1">
        <PointList points={points} onSelect={onSelect} />
      </aside>
    );
  }

  // Always show the data center second (below) so the contrast reads consistently.
  const [left, right] =
    paired && point.category === "datacenter" ? [paired.point, point] : [point, paired?.point];

  return (
    <aside className="w-full md:flex-1">
      <button type="button" onClick={onClear} className="mb-3 cursor-pointer text-sm text-zinc-500 hover:underline">
        ← All points
      </button>
      {paired && (
        <p className="mb-3 text-sm text-zinc-500">
          Nearest {point.category === "datacenter" ? "school/library" : "data center"}:{" "}
          {Math.round(paired.km * 0.621371)} mi away
        </p>
      )}
      <div className="flex flex-col gap-4">
        <DetailCard point={left} />
        {right && <DetailCard point={right} />}
      </div>
    </aside>
  );
}
