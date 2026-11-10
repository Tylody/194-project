import type { CostGroup, FundingPoint } from "../types";

const totalOf = (groups: CostGroup[]) =>
  groups.reduce((s, g) => s + g.items.reduce((t, i) => t + i.amount, 0), 0);

const group = (title: string, items: Record<string, number>): CostGroup => ({
  title,
  items: Object.entries(items).map(([label, amount]) => ({ label, amount })),
});

const dataCenterCosts = (scale: number): CostGroup[] => [
  group("Construction", {
    "Land & site": 60e6 * scale,
    "Building shell": 180e6 * scale,
    "Servers & GPUs": 520e6 * scale,
    "Power & cooling infrastructure": 240e6 * scale,
  }),
  group("Annual upkeep", {
    Electricity: 48e6 * scale,
    Water: 9e6 * scale,
    Cooling: 14e6 * scale,
    Staffing: 11e6 * scale,
    Maintenance: 16e6 * scale,
  }),
];

const districtIT = (scale: number): CostGroup[] => [
  group("IT investment", {
    "Student devices": 22e6 * scale,
    "Network & Wi-Fi": 9e6 * scale,
    "Software licenses": 7e6 * scale,
    "IT support staff": 12e6 * scale,
    Cybersecurity: 3e6 * scale,
  }),
];

function withTotal(p: Omit<FundingPoint, "funding">): FundingPoint {
  return { ...p, funding: p.breakdown ? totalOf(p.breakdown) : 0 };
}

// MOCK DATA — placeholder values for layout only. Replace with real sources.
export async function getPoints(): Promise<FundingPoint[]> {
  return [
    withTotal({ id: "d1", name: "Los Angeles Unified (mock)", category: "district", lat: 34.05, lng: -118.24, year: 2024, source: "mock", breakdown: districtIT(3) }),
    withTotal({ id: "d2", name: "Fresno Unified (mock)", category: "district", lat: 36.74, lng: -119.79, year: 2024, source: "mock", breakdown: districtIT(0.6) }),
    { id: "l1", name: "San Francisco Public Library (mock)", category: "library", lat: 37.78, lng: -122.42, funding: 190_000_000, year: 2024, source: "mock" },
    { id: "l2", name: "Sacramento Public Library (mock)", category: "library", lat: 38.58, lng: -121.49, funding: 45_000_000, year: 2024, source: "mock" },
    withTotal({ id: "c1", name: "Santa Clara data center (mock)", category: "datacenter", lat: 37.35, lng: -121.95, year: 2024, source: "mock", breakdown: dataCenterCosts(1) }),
    withTotal({ id: "c2", name: "Los Angeles data center (mock)", category: "datacenter", lat: 34.03, lng: -118.26, year: 2024, source: "mock", breakdown: dataCenterCosts(0.7) }),
  ];
}
