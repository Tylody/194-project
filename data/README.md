# California school district funding

[`california_district_funding_2025-26.csv`](./california_district_funding_2025-26.csv)
contains **926 district reporting units** and their **2025–26 adopted budget
revenue**, in US dollars, across all funds reported by each district. These are
budget estimates, not actual receipts, expenditure totals, or per-pupil amounts.

## Fields

| Column | Meaning |
| --- | --- |
| `district_cds_code` | 14-character CDE identifier; preserve as text, including leading zeros |
| `county` | County name |
| `district_name` | Reporting entity name from the source extract |
| `district_type` | District classification, including combined reporting units |
| `fiscal_year` | `2025-26` |
| `reporting_basis` | `Adopted budget (BS1/BB)` |
| `fund_scope` | `All reported district funds` |
| `lcff_revenue_usd` | Local Control Funding Formula revenue; SACS objects 8010–8099 |
| `federal_revenue_usd` | Federal revenue; objects 8100–8299 |
| `other_state_revenue_usd` | Other state revenue; objects 8300–8599 |
| `other_local_revenue_usd` | Other local revenue; objects 8600–8799 |
| `total_revenue_usd` | Sum of the four revenue categories |

**LCFF includes both state aid and local property taxes.** Consequently,
`other_state_revenue_usd` and `other_local_revenue_usd` are not the district's
total funding from state and local sources. Negative adjustments are preserved.

## Source and processing

- Financial source: [CDE SACS Data Viewer](https://viewer.sacs-cde.org/), statewide
  `99-00000-0000000_BS1_2025-26_DataExtract.zip`, `UserGLs.csv` and `Entities.csv`.
- Filters: `FullFiscalYear=2025-26`, `ReportingPeriod=BS1`, `ColumnCode=BB`.
- Agency classification and counties: [CDE public district directory](https://www.cde.ca.gov/ds/si/ds/pubschls.asp),
  downloaded November 10, 2026. Matched the first seven CDS digits, selected
  elementary (DOC 52), unified (54), and high school (56) districts, and required
  the last seven CDS digits to be `0000000`.
- Explicitly retained five combined district reporting units and source-period
  Kashia Elementary, absent from the current directory. See coverage below.
- Aggregated `Amount` by district and the four object-code ranges above using
  decimal arithmetic. Included all reported funds. Excluded other object codes,
  such as expenditures, balances, borrowing, and interfund financing transfers.
- Validation checked one submission per included district, unique output IDs,
  exact reconciliation to included source amounts and fund subtotals, and that
  each row's categories sum to its total. Source and output SHA-256 hashes and
  aggregate category totals are in [`funding-metadata.json`](./funding-metadata.json).

The raw archive is not included. It contains unrelated financial records and is
much larger than the prepared dataset. To refresh, download the corresponding
statewide extract, repeat the filters and classification above, aggregate the
same object ranges, and update metadata and coverage together.

## Coverage and interpretation

Separate charter reporters, county offices, joint powers agencies, and state
agencies are excluded. Charter activity already present in a district's own
accounts remains included. The current district directory is not a historical
2025–26 snapshot.

Five rows report combined budgets that cannot be split among their members:

| Reporting CDS code | Reporting unit |
| --- | --- |
| `23763490000000` | Arena Union Elementary / Point Arena Joint Union High |
| `44402610000000` | Santa Cruz City Elementary / High |
| `49402460000000` | Petaluma City Elementary / Joint Union High |
| `49402530000000` | Santa Rosa City Schools |
| `50407170000000` | Modesto City Schools |

[`districts_without_matching_budget.csv`](./districts_without_matching_budget.csv)
lists 16 entities without standalone rows: ten are covered by those combined
reporters; five current districts and the lapsed Green Point district have no
matching budget. Missing data must not be interpreted as zero funding. Do not
copy a combined budget onto both member districts.

All-funds revenue includes capital, debt-service, and special-education
pass-through revenue. Revenue-category interagency transfers remain included.
District totals therefore do not measure unrestricted operating funds, and
summing districts does not produce a statewide total with transfers eliminated.

## Reading the file

The CSV uses UTF-8, LF line endings, and decimal dollar strings with two decimal
places. Keep identifiers as strings. For financial arithmetic, use decimal
arithmetic or integer cents rather than binary floating point.

The `data/` directory is a repository dataset; it is not exposed as a public
Next.js asset. Application integration can load and validate the CSV server-side
when needed.

## District locations

[`district_locations.csv`](./district_locations.csv) gives one map coordinate per
row of the funding file, keyed by `district_cds_code`. Coordinates are the
district office `Latitude`/`Longitude` from the same
[CDE public school directory](https://www.cde.ca.gov/ds/si/ds/pubschls.asp)
(`pubschls.txt`, downloaded November 10, 2026), matched on the full 14-character
CDS code. 921 rows match directly (`location_basis = district office`). The five
combined reporting units use the mean of their two member districts' office
coordinates (`mean of member district offices`). A point marks the office, not
the district boundary or the schools it serves.
