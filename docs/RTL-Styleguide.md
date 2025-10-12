# RTL Styleguide

This styleguide summarises best practices for building right‑to‑left (RTL) user interfaces using React, Tailwind CSS and the existing design system.

## General principles

1. **Set the document direction** – Always specify `dir="rtl"` on the `<html>` element or on the highest container rendered by React. This instructs the browser to flip the flow direction.
2. **Use logical properties** – Avoid physical utilities such as `ml-4` or `pr-8`. Instead use logical counterparts:

   | Purpose                | Physical class | Logical class (RTL/LTR aware) |
   |-----------------------|---------------|--------------------------------|
   | Start margin          | `ml-*`        | `ms-*`                         |
   | End margin            | `mr-*`        | `me-*`                         |
   | Start padding         | `pl-*`        | `ps-*`                         |
   | End padding           | `pr-*`        | `pe-*`                         |
   | Text alignment        | `text-right`  | `text-end`                    |
   | Float                 | `float-right` | `float-end`                   |
   | Left/right spacing    | `space-x-*`   | `space-s-*`/`space-e-*`       |

3. **Mirror directional icons** – Icons like arrows or chevrons should be flipped in RTL. Use the `rtl:rotate-180` utility or choose an icon that natively points in the desired direction.
4. **Localised LTR content** – Wrap Latin text (e.g. e‑mail addresses, numbers) in an element with `dir="ltr"` to preserve its natural orientation inside an RTL document.
5. **Consistent spacing** – Stick to a spacing scale (4 px increments) across margins and paddings. This ensures visual rhythm regardless of direction.

## Typography setup

- **Display font:** Import the *Lalezar* typeface for headings. It provides bold, friendly shapes well‑suited for Persian titles. The import in `index.html` already requests `display=swap` to prevent Flash of Invisible Text (FOIT).
- **Body font:** Use *Vazirmatn* with a fallback of `system-ui, sans-serif` for body copy. This ensures readability and proper shaping of Arabic script across platforms.
- **Heading scale:** Define heading sizes in Tailwind configuration (e.g. `text‑3xl`, `text‑2xl`, `text‑xl`) and apply consistently. Line‑height should be generous (`leading-tight` for headings, `leading-relaxed` for paragraphs).
- **Numerals and dates:** When displaying numbers or dates, ensure they adopt the correct direction. Persian or Arabic numerals follow RTL context, whereas Western numerals may remain LTR via `dir="ltr"`.

## Icon mirroring guidance

- **Chevrons and arrows:** Use one icon component and apply Tailwind’s `rtl:rotate-180` to mirror the direction. For example:

  ```tsx
  <ChevronRight className="h-4 w-4 rtl:rotate-180" />
  ```

  This keeps the code DRY and automatically flips the icon in RTL contexts.
- **Progression icons:** Icons that imply forward/back (e.g. `ArrowLeft`, `ArrowRight`) should be chosen based on the logical direction rather than the physical left or right. Use `ArrowRight` to denote the next step in both LTR and RTL by rotating it conditionally.

## Do & Don’t

- **Do**:
  - Use `ms-auto` on action buttons in cards so they align to the logical end.
  - Wrap LTR content such as emails in `<span dir="ltr">…</span>` to avoid mixed‑direction rendering issues.
  - Test components in both LTR and RTL to catch layout regressions early.

- **Don’t**:
  - Hard‑code `margin-left`/`margin-right` or `text-right`; these break in RTL.
  - Insert JSX children after a closing tag (e.g. `</Button>{children}`). Always nest children inside the opening and closing tags.
  - Assume icons orient themselves; explicitly mirror them when necessary.

By following these guidelines you ensure that RTL support is not an afterthought but an integral part of the design system.