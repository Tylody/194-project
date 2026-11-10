import { readFileSync } from "node:fs";
import path from "node:path";
import type { FundingPoint } from "../types";

const DATA_DIR = path.join(process.cwd(), "data");
const FUNDING_CSV = "california_district_funding_2025-26.csv";
const LOCATIONS_CSV = "district_locations.csv";

const REVENUE_COLUMNS = [
  ["lcff_revenue_usd", "LCFF (state aid + local property tax)"],
  ["federal_revenue_usd", "Federal"],
  ["other_state_revenue_usd", "Other state"],
  ["other_local_revenue_usd", "Other local"],
] as const;

/** Minimal RFC 4180 parser: handles quoted fields with commas and escaped quotes. */
function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  const endField = () => {
    row.push(field);
    field = "";
  };
  const endRow = () => {
    endField();
    rows.push(row);
    row = [];
  };
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        quoted = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      endField();
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      endRow();
    } else {
      field += ch;
    }
  }
  if (field || row.length) endRow();
  const [header, ...body] = rows;
  return body.map((cells) => {
    if (cells.length !== header.length) throw new Error(`CSV row has ${cells.length} fields, expected ${header.length}`);
    return Object.fromEntries(header.map((h, i) => [h, cells[i]]));
  });
}

const read = (file: string) => parseCsv(readFileSync(path.join(DATA_DIR, file), "utf-8"));

/** "1234.56" -> 123456 cents, exactly (no binary floating point on the way in). */
function toCents(s: string): number {
  const m = /^(-?)(\d+)\.(\d{2})$/.exec(s);
  if (!m) throw new Error(`Bad dollar amount: ${s}`);
  const cents = Number(m[2]) * 100 + Number(m[3]);
  return m[1] ? -cents : cents;
}

export function getDistricts(): FundingPoint[] {
  const locations = new Map(read(LOCATIONS_CSV).map((r) => [r.district_cds_code, r]));
  return read(FUNDING_CSV).map((r) => {
    const loc = locations.get(r.district_cds_code);
    if (!loc) throw new Error(`No location for district ${r.district_cds_code}`);
    const items = REVENUE_COLUMNS.map(([col, label]) => ({ label, cents: toCents(r[col]) }));
    const totalCents = toCents(r.total_revenue_usd);
    if (items.reduce((s, i) => s + i.cents, 0) !== totalCents)
      throw new Error(`Revenue categories don't sum to total for ${r.district_cds_code}`);
    return {
      id: `district-${r.district_cds_code}`,
      name: r.district_name.trim(),
      subtitle: `${r.district_type} · ${r.county} County`,
      category: "district",
      lat: Number(loc.latitude),
      lng: Number(loc.longitude),
      funding: totalCents / 100,
      period: `${r.fiscal_year} adopted budget`,
      source: "CDE SACS (BS1), all funds",
      breakdown: [
        { title: "Revenue by source", items: items.map((i) => ({ label: i.label, amount: i.cents / 100 })) },
      ],
    };
  });
}
