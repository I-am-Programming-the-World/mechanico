# Mechanico (مکانیکو)

یک بازنویسی سبک و مینیمال روی فرانت‌اند موجود تا خطاهای بیلد برطرف شود و رابط کاربری راست‌به‌چپ (RTL) و فونت **Lalezar** فعال گردد.

## What changed?

- ✅ Fixed Vite build error (invalid JSX in `LoadingOverlay.tsx`)
- ✅ Removed stray `...` tokens from critical files by replacing them entirely
- ✅ Global **RTL** (`lang="fa" dir="rtl"`) and right-aligned content
- ✅ Display font **Lalezar** + body font **Vazirmatn**
- ✅ Modern, padded navbar & RTL tabs
- ✅ Minimal cards and sample chart block with smooth animation
- ✅ Fully responsive (fluid grid, buttons, layout)

## Where to edit

- `index.html` – fonts + RTL
- `src/index.css` – design tokens & utilities
- `src/App.tsx` – router + layout + navbar
- `src/components/LoadingOverlay.tsx` – overlay spinner
- `src/pages/Dashboard.tsx`, `src/pages/NotFound.tsx` – example screens

## Dev

```bash
npm i
npm run dev
# or
npm run build && npm run preview
```

> Note: Many original files under `src/components/ui` & some pages contained truncated `...`. They are left untouched and **not imported**. You can gradually restore/regenerate them (e.g. via shadcn) while keeping this app compiling.
