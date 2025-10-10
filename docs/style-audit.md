# مکانیکو — ارزیابی رابط کاربری و سبک‌دهی

## 1. جمع‌بندی سریع
- جدول‌های مدیریتی اکنون از کامپوننت مشترک `<DataTable>` برای اسکرول افقی و حداقل عرض استفاده می‌کنند و در صفحات حسابداری، موجودی و کارکنان پایدار مانده‌اند.【F:src/pages/Accounting.tsx†L203-L355】【F:src/pages/Inventory.tsx†L205-L277】【F:src/pages/Employees.tsx†L277-L336】
- KPIهای عددی (از جمله امتیاز ارائه‌دهندگان) اکنون با helperهای مشترک مانند `formatRating` به‌صورت کامل فارسی نمایش داده می‌شوند.【F:src/lib/utils.ts†L8-L70】【F:src/pages/Reports.tsx†L295-L326】
- کارت‌های درصدی اکنون از `formatPercentage` جدید استفاده می‌کنند و نماد `٪` را به‌صورت یکپارچه نمایش می‌دهند.【F:src/lib/utils.ts†L31-L47】【F:src/pages/Employees.tsx†L193-L309】【F:src/pages/Reports.tsx†L115-L132】
- تعاملات ناوبری و دکمه‌های کنشی بدون وابستگی به `ml-2`/`mr-2` پیاده‌سازی شده‌اند و فاصله‌گذاری در RTL پایدار است.【F:src/components/Layout.tsx†L89-L112】【F:src/pages/Vehicles.tsx†L74-L123】【F:src/components/ui/command.tsx†L34-L80】
- پوسته از ThemeProvider پشتیبانی می‌کند و سویچ تم تیره در صفحه تنظیمات فعال است؛ انیمیشن‌های `page-in` و `card-pop` در لایه اصلی و کارت‌ها حس پویایی ایجاد می‌کنند در حالی‌که کاربر می‌تواند آن‌ها را غیرفعال کند.【F:src/App.tsx†L1-L58】【F:src/pages/Settings.tsx†L20-L220】【F:tailwind.config.ts†L32-L70】

## 2. لایه‌های مشترک و ناوبری
| مورد | وضعیت | پیامد | منبع |
| --- | --- | --- | --- |
| مقداردهی `aria-current` | ✅ حل‌شده؛ NavLink مقدار صحیح مسیر فعال را مدیریت می‌کند. | — | `src/components/Layout.tsx` خطوط 71–98【F:src/components/Layout.tsx†L71-L98】 |
| دکمه خروج در هدر | ✅ با استفاده از `gap` فاصله آیکون منطقی شده و در RTL متقارن است. | — | `src/components/Layout.tsx` خطوط 95–105【F:src/components/Layout.tsx†L95-L105】 |
| Command Input | ✅ آیکون جست‌وجو اکنون با `gap` و `CommandShortcut` با `ms-auto` هم‌راستا شده‌اند. | — | `src/components/ui/command.tsx` خطوط 38–80【F:src/components/ui/command.tsx†L38-L80】 |
| پوشش بارگذاری | ✅ `LoadingOverlay` پیام فارسی و حالت دسترس‌پذیر دارد. | — | `src/components/LoadingOverlay.tsx` خطوط 1–33【F:src/components/LoadingOverlay.tsx†L1-L33】 |

## 3. صفحه‌ها و قابلیت‌های کلیدی
| صفحه/ویژگی | وضعیت فعلی | پیامد در UI | منبع |
| --- | --- | --- | --- |
| صفحه ورود (Auth) | ✅ دکمه‌های ورود سریع در موبایل تک‌ستونه و خوانا هستند. | — | `src/pages/Auth.tsx` خطوط 99–150【F:src/pages/Auth.tsx†L99-L150】 |
| صفحه اصلی (Index) | ✅ بخش قهرمان و فراخوان‌ها با تایپوگرافی فارسی هم‌راستا هستند. | — | `src/pages/Index.tsx` خطوط 1–36【F:src/pages/Index.tsx†L1-L36】 |
| داشبورد | ✅ نمودارها و کارت‌ها از `formatNumber` استفاده می‌کنند و در کارت‌های KPI تضاد رنگی مناسب دارند. | — | `src/pages/Dashboard.tsx` خطوط 1–200【F:src/pages/Dashboard.tsx†L1-L200】 |
| رزروها (Bookings) | ✅ کارت‌های رزرو از helperهای مدت‌زمان و قالب تاریخ فارسی استفاده می‌کنند. | — | `src/pages/Bookings.tsx` خطوط 325–420【F:src/pages/Bookings.tsx†L325-L420】 |
| گزارشات (Reports) | ✅ کارت «نرخ تکرار» با helper جدید درصد را با نماد فارسی `٪` نشان می‌دهد. | — | `src/pages/Reports.tsx` خطوط 115–132【F:src/pages/Reports.tsx†L115-L132】 |
| حسابداری | ✅ جدول‌ها با `<DataTable>` و فرمت فارسی اعداد رندر می‌شوند. | — | `src/pages/Accounting.tsx` خطوط 203–355【F:src/pages/Accounting.tsx†L203-L355】 |
| موجودی | ✅ کارت‌های خلاصه و جدول اصلی با `<DataTable>` و قالب فارسی نمایش داده می‌شوند. | — | `src/pages/Inventory.tsx` خطوط 139–277【F:src/pages/Inventory.tsx†L139-L277】 |
| خدمات | ✅ کارت خدمات و دیالوگ رزرو از `formatDurationMinutes` و شبکه واکنش‌گرا استفاده می‌کنند. | — | `src/pages/Services.tsx` خطوط 60–210【F:src/pages/Services.tsx†L60-L210】 |
| خودروها (Vehicles) | ✅ دکمه افزودن خودرو با `gap` و آیکون بدون margin ثابت نمایش داده می‌شود. | — | `src/pages/Vehicles.tsx` خطوط 84–140【F:src/pages/Vehicles.tsx†L84-L140】 |
| کارکنان | ✅ کارت عملکرد و ردیف‌های جدول با helper جدید درصد را به‌شکل فارسی `٪` نمایش می‌دهند. | — | `src/pages/Employees.tsx` خطوط 193–309【F:src/pages/Employees.tsx†L193-L309】 |
| کاربران | ✅ کارت‌های خلاصه و جدول تأیید با `<DataTable>` و نشان‌گر نقش‌های رنگی هماهنگ هستند. | — | `src/pages/Users.tsx` خطوط 40–170【F:src/pages/Users.tsx†L40-L170】 |
| تنظیمات | ✅ زبانه‌ها در موبایل قابل اسکرول بوده و فرم‌ها شبکه واکنش‌گرا دارند. | — | `src/pages/Settings.tsx` خطوط 20–240【F:src/pages/Settings.tsx†L20-L240】 |
| نظرات | ✅ اواتارهای fallback فارسی و تاریخ‌های جلالی نمایش داده می‌شوند. | — | `src/pages/Reviews.tsx` خطوط 1–120【F:src/pages/Reviews.tsx†L1-L120】 |
| صفحه ۴۰۴ | ✅ رنگ‌بندی و کپی کاملاً فارسی و هم‌راستا با برند است. | — | `src/pages/NotFound.tsx` خطوط 1–38【F:src/pages/NotFound.tsx†L1-L38】 |

## 4. توصیه‌های تکمیلی و گام‌های بعدی
1. **تست‌های دسترس‌پذیری و بصری:** اجرای تست صفحه‌خوان برای جدول‌های پهن و snapshot برای کارت‌های رزرو جهت جلوگیری از بازگشت مشکلات RTL توصیه می‌شود.【F:src/pages/Bookings.tsx†L325-L420】【F:src/pages/Accounting.tsx†L203-L355】
2. **مستندسازی Design Tokens:** helperهای جدید (`formatDurationMinutes`, `formatRating`, `formatPercentage`, `formatNumber`) و قواعد فونت Lalezar را در راهنمای طراحی ثبت کنید تا توسعه‌دهندگان آینده از استانداردها مطلع باشند.【F:src/lib/utils.ts†L8-L70】【F:src/index.css†L1-L99】
3. **پایش مداوم جداول:** در صورت افزودن جدول‌های جدید، از `<DataTable>` و حداقل عرض مناسب استفاده شود تا یکپارچگی واکنش‌گرایی حفظ گردد.【F:src/components/DataTable.tsx†L1-L24】
