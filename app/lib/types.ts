export type Category = "district" | "library" | "datacenter";

export interface FundingPoint {
  id: string;
  name: string;
  category: Category;
  lat: number;
  lng: number;
  /** Funding in US dollars. */
  funding: number;
  year: number;
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
