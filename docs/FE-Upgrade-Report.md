# Frontend Upgrade Report

## Summary

The upgrade work focused on unblocking the build, enforcing right‑to‑left (RTL) presentation across the application, modernising the navigation components, and establishing a coherent typographic and spacing system. Key changes include:

- **Build fix:** Instances where JSX children were placed outside their parent elements were corrected. A common pattern was `</Button>{…}`, which confused the parser. These were converted to properly nested structures, for example:

  ```tsx
  <Button disabled={isLoading}>
    {isLoading ? 'در حال ورود…' : 'ورود'}
  </Button>
  ```

- **Logical spacing:** Margin and padding utilities that were tied to physical directions (e.g. `ml-auto`) were replaced with logical equivalents (`ms‑auto`) to respect both LTR and RTL flows. Text alignment classes were normalised to `text‑end` rather than `text‑right`.

- **Menu modernisation:** Sub‑menus in the menubar and context menu were refactored so that their children and chevron icons live inside the trigger element instead of being written after the closing tag. This prevents stray JSX outside components and ensures proper keyboard focus behaviour. The chevron icons now use `ms‑auto` to push them to the logical end of the trigger.

- **RTL enforcement:** The root `<html>` element already specifies `dir="rtl"`. Components such as `Layout` and pages now honour this by avoiding hard‑coded left/right classes. Tables and inputs explicitly set `dir="ltr"` only where required (e.g. for e‑mail fields) to improve readability.

- **Typography and theming:** The `Lalezar` display font is loaded with `font‑display: swap` and paired with `Vazirmatn` for body copy. A clear scale of headings and body sizes is defined in `tailwind.config.ts`. Colour tokens and spacing scales remain centralised in CSS custom properties.

- **Chart considerations:** When using Recharts, axis tick labels, legends and tooltips should align to the end (`textAnchor="end"`) and be positioned so that labels do not overlap. Since Recharts lacks native RTL support, margins and paddings were adjusted manually.

## RTL how‑to & logical CSS reference

- Always set `dir="rtl"` on the `<html>` or a top‑level container. This flips the document flow.
- Prefer logical CSS properties/classes (`ms‑auto`, `me‑4`, `ps‑2`, `pe‑4`) over physical ones (`ml‑auto`, `mr‑4`, `pl‑2`, `pr‑4`).
- Use `text‑end` instead of `text‑right` and `float‑end` instead of `float‑right`.
- Icons that indicate direction (chevrons, arrows) should be mirrored in RTL contexts. Use the `rtl:rotate‑180` utility when available, or replace the icon with its mirrored counterpart.
- Keep numeric or Latin strings in LTR contexts by adding `dir="ltr"` to the containing element (e.g. email and phone fields).

## Menu spacing & responsive rules

- Use a consistent spacing scale (e.g. multiples of 4 px). In this project the `container` component has default padding of `1.5rem` on mobile and scales up on larger screens.
- Menu items should be single‑line where possible. Set `gap‑2` between an icon and its label and ensure `py‑1.5`/`px‑4` for hit‑target size.
- On small screens the sidebar collapses into a sheet. The sheet uses `gap‑2` between items and hides the close button for a cleaner look.
- Use `ms‑auto` on actions within cards (e.g. save buttons) so they align to the logical end without assuming a left margin.

## Charts RTL checklist

1. Align axis tick labels to the end: set `textAnchor="end"` or equivalent.
2. Swap the order of left and right margins in chart containers. Increase the left (logical start) margin to accommodate labels that will now appear on the right.
3. Mirror legends: when the legend list appears horizontally, reverse its order or apply `flex‑row‑reverse`.
4. For tooltips, set the `position` offsets so that they expand to the left of the cursor rather than the right.
5. Test all combinations of datasets to ensure labels never overlap in RTL orientation.

## Accessibility & QA checklist

- [x] **Keyboard navigation:** Ensure that all interactive elements (buttons, links, form fields) are focusable in a logical order. Off‑canvas menus and sheets restore focus to the trigger after closing.
- [x] **Focus indicators:** Use visible focus rings (`ring-2 ring-ring ring-offset-2`) on buttons and menu items. Avoid removing outlines without providing an alternative.
- [x] **Colour contrast:** Verified that text meets WCAG AA contrast ratios against the background colours defined in the theme.
- [x] **ARIA roles & labels:** Dialogs, menus and lists expose appropriate roles (e.g. `role="alert"` for error messages) and include `aria-label` attributes where icons are used without text.
- [x] **Responsive layout:** Tested on common breakpoints (sm, md, lg) to ensure menus collapse gracefully and tables remain readable.

The combination of these changes brings the project to a modern, RTL‑aware baseline while preserving accessibility and responsiveness.