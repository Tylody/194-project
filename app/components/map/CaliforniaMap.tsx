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
import { IconButton, Tile } from "@carbon/react";
import { ZoomIn, ZoomOut, ZoomReset } from "@carbon/icons-react";

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
    <div className="flex flex-col items-start gap-8 md:flex-row">
      <Tile className="relative w-full !p-4 md:w-1/2 md:shrink-0">
        <div className="absolute right-4 top-4 z-10 flex flex-col border border-[var(--cds-border-subtle-01)] bg-[var(--cds-layer-01)]">
          <IconButton kind="ghost" size="md" label="Zoom in" align="left" onClick={() => zoomBy(1.6)}>
            <ZoomIn />
          </IconButton>
          <IconButton kind="ghost" size="md" label="Zoom out" align="left" onClick={() => zoomBy(1 / 1.6)}>
            <ZoomOut />
          </IconButton>
          <IconButton kind="ghost" size="md" label="Reset zoom" align="left" onClick={resetZoom}>
            <ZoomReset />
          </IconButton>
        </div>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full max-h-[70vh] cursor-grab touch-none active:cursor-grabbing"
          onClick={() => setSelectedId(null)}
        >
          <g transform={`translate(${t.x} ${t.y}) scale(${t.k})`}>
          <path d={outline} fill="var(--cds-layer-accent-01)" stroke="var(--cds-border-strong-01)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
          {selected && paired && (
            <line
              x1={project(selected)[0]}
              y1={project(selected)[1]}
              x2={project(paired.point)[0]}
              y2={project(paired.point)[1]}
              stroke="var(--cds-icon-secondary)"
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
              strokeDasharray="4 4"
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
        <div className="mt-4 border-t border-[var(--cds-border-subtle-01)] pt-4">
          <Legend />
        </div>
      </Tile>
      <DetailPanel point={selected} paired={paired} points={points} onSelect={setSelectedId} hoveredId={hoveredId} onHover={setHoveredId} onClear={() => setSelectedId(null)} />
    </div>
  );
}

/** Drawn outside the zoom group, so it keeps a constant size at any zoom level. */
function Tooltip({ text, x, y }: { text: string; x: number; y: number }) {
  const w = text.length * 6.6 + 32;
  const h = 28;
  const cx = Math.min(Math.max(x, w / 2 + 2), WIDTH - w / 2 - 2);
  const top = Math.max(y - 12 - 8 - h, 2);
  return (
    <g pointerEvents="none">
      <rect x={cx - w / 2} y={top} width={w} height={h} rx={2} fill="var(--cds-background-inverse)" />
      <text x={cx} y={top + h / 2} textAnchor="middle" dominantBaseline="central" fontSize={12} fill="var(--cds-text-inverse)" letterSpacing={0.16}>
        {text}
      </text>
    </g>
  );
}
