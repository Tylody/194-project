import type { FundingPoint } from "../lib/types";
import DetailCard from "./DetailCard";

interface Props {
  point: FundingPoint | null;
  paired: { point: FundingPoint; km: number } | null;
}

export default function DetailPanel({ point, paired }: Props) {
  if (!point) {
    return (
      <aside className="w-full rounded-lg border border-zinc-200 p-4 text-zinc-500 dark:border-zinc-800">
        Select a point on the map to see its funding and compare it with the nearest counterpart.
      </aside>
    );
  }

  // Always show the data center second (below) so the contrast reads consistently.
  const [left, right] =
    paired && point.category === "datacenter" ? [paired.point, point] : [point, paired?.point];

  return (
    <aside className="w-full md:flex-1">
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
