export type Category = "district" | "library" | "datacenter";

export interface FundingPoint {
  id: string;
  name: string;
  /** Secondary line under the name, e.g. district type and county. */
  subtitle?: string;
  category: Category;
  lat: number;
  lng: number;
  /** Funding in US dollars. */
  funding: number;
  /** Period the figure covers, e.g. "2025-26 adopted budget". */
  period: string;
  source: string;
  /** Optional itemized costs shown in the detail panel. */
  breakdown?: CostGroup[];
}

export interface CostItem {
  label: string;
  amount: number;
}

export interface CostGroup {
  title: string;
  items: CostItem[];
}
