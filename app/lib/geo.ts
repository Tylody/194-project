import type { FundingPoint } from "./types";

const R_KM = 6371;
const rad = (d: number) => (d * Math.PI) / 180;

export function distanceKm(a: FundingPoint, b: FundingPoint): number {
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R_KM * Math.asin(Math.sqrt(h));
}

/**
 * Nearest point on the "other side" of the contrast: data centers pair with
 * the nearest school district or library; districts/libraries pair with the
 * nearest data center.
 */
export function nearestCounterpart(
  point: FundingPoint,
  all: FundingPoint[],
): { point: FundingPoint; km: number } | null {
  const isDC = point.category === "datacenter";
  let best: { point: FundingPoint; km: number } | null = null;
  for (const p of all) {
    if ((p.category === "datacenter") === isDC) continue;
    const km = distanceKm(point, p);
    if (!best || km < best.km) best = { point: p, km };
  }
  return best;
}
