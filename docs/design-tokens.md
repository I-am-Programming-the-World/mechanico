# مکانیکو — Design Tokens & UI Helpers

## تایپوگرافی
- **فونت اصلی:** Lalezar با fallback فارسی (Vazirmatn و IRANSans) و سیستمی؛ در `src/index.css` تعریف شده و روی کلاس‌های `font-sans` اعمال می‌شود تا متن‌های فارسی خوانا و هم‌راستا با هویت بصری برند رندر شود.【F:src/index.css†L1-L47】【F:tailwind.config.ts†L35-L47】
- **اندازه‌های تیتر:** `text-3xl` برای سرفصل صفحات مدیریتی و `text-2xl` برای کارت‌های KPI مطابق الگوی موجود در داشبورد و مدیریت کاربران.【F:src/pages/Dashboard.tsx†L41-L123】【F:src/pages/Users.tsx†L68-L126】

## رنگ و سایه
- **سایه کارت‌ها:** کلاس سفارشی `shadow-card` در `src/index.css` برای کارت‌های مدیریتی استفاده می‌شود و تضاد کافی با پس‌زمینه ایجاد می‌کند.【F:src/index.css†L100-L142】
- **گرادیان برند:** کلاس‌های `gradient-primary` و `gradient-hero` برای صفحه اصلی و نوارهای برجسته موجود است تا برند در تمام صفحات سازگار باشد.【F:src/index.css†L100-L118】

## قالب‌بندی اعداد و تاریخ
- **اعداد عمومی:** `formatNumber` و `formatMillions` برای نمایش مقادیر با ارقام فارسی و جداکننده هزار در داشبورد، حسابداری و کارت‌های کاربران استفاده می‌شوند.【F:src/lib/utils.ts†L8-L70】【F:src/pages/Accounting.tsx†L60-L133】【F:src/pages/Users.tsx†L68-L126】
- **مبالغ:** `formatCurrency` برای نمایش تومان با Precision ثابت در کارت‌های مالی استفاده می‌شود.【F:src/lib/utils.ts†L20-L28】【F:src/pages/Accounting.tsx†L60-L133】
- **درصد و امتیاز:** `formatPercentage` و `formatRating` خروجی فارسی با نماد `٪` و اعداد اعشاری مدیریت‌شده تولید می‌کنند که در گزارش‌ها و کارت عملکرد کارکنان به‌کار می‌رود.【F:src/lib/utils.ts†L31-L47】【F:src/pages/Employees.tsx†L174-L232】【F:src/pages/Reports.tsx†L96-L149】
- **مدت‌زمان:** `formatDurationMinutes` مدت‌زمان سرویس‌ها و رزروها را با ترکیب ساعت و دقیقه فارسی نمایش می‌دهد.【F:src/lib/utils.ts†L49-L70】【F:src/pages/Bookings.tsx†L325-L420】

## کامپوننت‌های مشترک
- **DataTable:** برای جدول‌های مدیریتی از `DataTable` استفاده کنید تا اسکرول افقی و حداقل عرض 960px به صورت خودکار اعمال شود؛ این الگو جایگزین utility پراکنده شده و واکنش‌گرایی پایدار را تضمین می‌کند.【F:src/components/DataTable.tsx†L1-L24】【F:src/pages/Accounting.tsx†L203-L355】
- **LoadingOverlay:** جهت نمایش حالت بارگذاری تمام‌صفحه با پیام فارسی قابل استفاده است و در محافظت احراز هویت فعال شده است.【F:src/components/LoadingOverlay.tsx†L1-L33】【F:src/components/Layout.tsx†L48-L107】

## انیمیشن و تعامل
- **Floating Accent:** کلاس `animate-float` در `src/index.css` برای المان‌های تزئینی صفحه اصلی به‌کار می‌رود و حرکت لطیفی ایجاد می‌کند.【F:src/index.css†L120-L142】【F:src/pages/Index.tsx†L1-L120】
- **Page & Card Motion:** انیمیشن‌های `page-in` و `card-pop` در Tailwind تعریف شده‌اند و به ترتیب روی لایه اصلی (`Layout`) و کامپوننت `Card` اعمال می‌شوند تا ورود صفحات و کارت‌ها پویا و سازگار باشد.【F:tailwind.config.ts†L32-L70】【F:src/components/Layout.tsx†L38-L118】【F:src/components/ui/card.tsx†L5-L21】
- **Skip Link:** کلاس‌های `skip-link` در `src/index.css` لینک دسترسی سریع به محتوای اصلی را پشتیبانی می‌کند و باید در صفحات جدید هم حفظ شود.【F:src/index.css†L68-L115】【F:src/App.tsx†L24-L58】

## حالت تیره و کنترل انیمیشن
- **Theme Provider:** لایه `ThemeProvider` مبتنی بر `next-themes` در `src/App.tsx` قرار دارد و کلاس `dark` را روی عنصر `<html>` اعمال می‌کند. هنگام افزودن کامپوننت تازه مطمئن شوید رنگ‌ها از متغیرهای HSL استفاده می‌کنند.【F:src/App.tsx†L1-L58】【F:src/components/ThemeProvider.tsx†L1-L17】
- **Dark Palette:** مقادیر تم تیره در `src/index.css` تعریف شده‌اند؛ هر رنگ جدید باید برای هر دو تم روشن و تیره مقدار داشته باشد.【F:src/index.css†L12-L63】
- **Animation Toggle:** صفت `data-animations="off"` روی `<html>` از طریق صفحه تنظیمات کنترل می‌شود و تمام انیمیشن‌ها/ترنزیشن‌ها را غیرفعال می‌کند؛ هر انیمیشن تازه باید با این مکانیزم سازگار باشد.【F:src/index.css†L52-L64】【F:src/pages/Settings.tsx†L20-L220】

## دستورالعمل استفاده
1. در زمان افزودن صفحه جدید، پیش از استفاده از جدول، `DataTable` را وارد و جدول را داخل آن قرار دهید تا رفتار واکنش‌گرا بدون تکرار utility تضمین شود.
2. همه مقادیر عددی را با یکی از helperهای فوق قالب‌بندی کنید؛ تنها در صورت نیاز به قالب جدید helper تازه‌ای در `src/lib/utils.ts` اضافه شود.
3. جهت یکپارچگی برند، از کلاس‌های فونت و گرادیان معرفی‌شده بهره ببرید و در صورت افزودن تم یا رنگ جدید، ابتدا به این سند اضافه کنید.
