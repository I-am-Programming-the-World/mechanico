## UI Modernization (This patch)

- Added **Lalezar** display font and Tailwind `font-display` utility.
- Tightened **top nav** item spacing and ensured single-line layout with `whitespace-nowrap` and responsive gaps.
- Ensured **Tabs** lists align to the right (`justify-end`) and content respects RTL.
- Introduced a **Recharts** wrapper (`components/ui/chart.tsx`) with theme-friendly container and tooltip.
- Kept everything **RTL-first**; global `dir="rtl"` styling reinforced in CSS.
