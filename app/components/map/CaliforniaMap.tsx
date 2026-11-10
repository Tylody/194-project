"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { select } from "d3-selection";
import "d3-transition";
import { zoom, zoomIdentity, type ZoomBehavior } from "d3-zoom";
import { geoMercator, geoPath } from "d3-geo";
import type { Feature } from "geojson";
import california from "../../lib/data/california.json";
import type { FundingPoint } from "../../lib/types";
import { nearestCounterpart } from "../../lib/geo";
import DetailPanel from "../DetailPanel";
import Legend from "../Legend";
import MapPoint from "./MapPoint";

const WIDTH = 600;
const HEIGHT = 700;

export default function CaliforniaMap({ points }: { points: FundingPoint[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [t, setT] = useState({ x: 0, y: 0, k: 1 });

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const behavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 12])
      .translateExtent([[0, 0], [WIDTH, HEIGHT]])
      .on("zoom", (e) => setT({ x: e.transform.x, y: e.transform.y, k: e.transform.k }));
    zoomRef.current = behavior;
    select(svg).call(behavior);
    return () => {
      select(svg).on(".zoom", null);
    };
  }, []);

  const zoomBy = (factor: number) => {
    if (svgRef.current && zoomRef.current)
      select(svgRef.current).transition().duration(200).call(zoomRef.current.scaleBy, factor);
  };
  const resetZoom = () => {
    if (svgRef.current && zoomRef.current)
      select(svgRef.current).transition().duration(300).call(zoomRef.current.transform, zoomIdentity);
  };

  const { outline, project } = useMemo(() => {
    const feature = california as Feature;
    const projection = geoMercator().fitSize([WIDTH, HEIGHT], feature);
    return {
      outline: geoPath(projection)(feature) ?? "",
      project: (p: FundingPoint) => projection([p.lng, p.lat]) ?? [0, 0],
    };
  }, []);

  const hovered = points.find((p) => p.id === hoveredId) ?? null;
  const selected = points.find((p) => p.id === selectedId) ?? null;
  const paired = useMemo(
    () => (selected ? nearestCounterpart(selected, points) : null),
    [selected, points],
  );

  return (
    <div className="flex flex-col items-start gap-6 md:flex-row">
      <div className="relative w-full md:w-1/2 md:shrink-0">
        <div className="absolute right-2 top-2 flex flex-col gap-1 text-lg">
          <ZoomButton label="+" aria="Zoom in" onClick={() => zoomBy(1.6)} />
          <ZoomButton label="−" aria="Zoom out" onClick={() => zoomBy(1 / 1.6)} />
          <ZoomButton label="⟲" aria="Reset zoom" onClick={resetZoom} />
        </div>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full max-h-[70vh] cursor-grab touch-none active:cursor-grabbing"
          onClick={() => setSelectedId(null)}
        >
          <g transform={`translate(${t.x} ${t.y}) scale(${t.k})`}>
          <path d={outline} className="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-800" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
          {selected && paired && (
            <line
              x1={project(selected)[0]}
              y1={project(selected)[1]}
              x2={project(paired.point)[0]}
              y2={project(paired.point)[1]}
              className="stroke-zinc-500"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
              strokeDasharray="6 4"
              pointerEvents="none"
            />
          )}
          {points.map((p) => {
            const [x, y] = project(p);
            return (
              <MapPoint key={p.id} point={p} x={x} y={y} selected={p.id === selectedId} highlighted={p.id === paired?.point.id} scale={t.k} hovered={p.id === hoveredId} onHover={setHoveredId} onSelect={setSelectedId} />
            );
          })}
          </g>
          {hovered && <Tooltip text={hovered.name} x={project(hovered)[0] * t.k + t.x} y={project(hovered)[1] * t.k + t.y} />}
        </svg>
        <Legend />
      </div>
      <DetailPanel point={selected} paired={paired} points={points} onSelect={setSelectedId} hoveredId={hoveredId} onHover={setHoveredId} onClear={() => setSelectedId(null)} />
    </div>
  );
}

function ZoomButton({ label, aria, onClick }: { label: string; aria: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={aria}
      onClick={onClick}
      className="h-8 w-8 cursor-pointer rounded border border-zinc-300 bg-white hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
    >
      {label}
    </button>
  );
}

/** Drawn outside the zoom group, so it keeps a constant size at any zoom level. */
function Tooltip({ text, x, y }: { text: string; x: number; y: number }) {
  const w = text.length * 6.6 + 16;
  const h = 22;
  const cx = Math.min(Math.max(x, w / 2 + 2), WIDTH - w / 2 - 2);
  const top = Math.max(y - 12 - 8 - h, 2);
  return (
    <g pointerEvents="none">
      <rect x={cx - w / 2} y={top} width={w} height={h} rx={4} className="fill-zinc-900 dark:fill-zinc-100" />
      <text x={cx} y={top + h / 2} textAnchor="middle" dominantBaseline="central" fontSize={12} className="fill-white dark:fill-zinc-900">
        {text}
      </text>
    </g>
  );
}
