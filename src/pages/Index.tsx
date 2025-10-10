import { Link } from 'react-router-dom';
import HeroIllustration from '@/components/HeroIllustration';

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background" dir="rtl">
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-6 text-center lg:text-right">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary motion-safe:animate-card-pop">
              پلتفرم مدیریت تعمیرگاه مکانیکو
            </span>
            <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              کنترل کامل عملیات تعمیرگاه با داشبوردهای زنده و داده‌های فارسی
            </h1>
            <p className="text-lg text-muted-foreground">
              برای استفاده از نسخه نمایشی، وارد حساب کاربری خود شوید و از جریان کامل رزرو تا صدور فاکتور، مدیریت موجودی، اعلان‌ها و گزارش‌های حسابداری بهره ببرید.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Link
                to="/auth"
                className="rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-primary transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                ورود / ثبت‌نام
              </Link>
              <Link
                to="/dashboard"
                className="rounded-full border border-border px-6 py-3 text-base font-semibold text-foreground transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                مشاهده داشبورد نمونه
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground sm:grid-cols-4">
              <div className="rounded-2xl border border-border bg-card/60 px-4 py-3 text-right shadow-sm backdrop-blur motion-safe:animate-card-pop">
                <p className="text-xs text-primary">نرخ تکمیل سرویس</p>
                <p className="text-2xl font-bold text-foreground">۹۸٪</p>
              </div>
              <div className="rounded-2xl border border-border bg-card/60 px-4 py-3 text-right shadow-sm backdrop-blur motion-safe:animate-card-pop">
                <p className="text-xs text-secondary">میانگین زمان تحویل</p>
                <p className="text-2xl font-bold text-foreground">۴ ساعت</p>
              </div>
              <div className="rounded-2xl border border-border bg-card/60 px-4 py-3 text-right shadow-sm backdrop-blur motion-safe:animate-card-pop">
                <p className="text-xs text-accent">رضایت مشتری</p>
                <p className="text-2xl font-bold text-foreground">۴٫۹</p>
              </div>
              <div className="rounded-2xl border border-border bg-card/60 px-4 py-3 text-right shadow-sm backdrop-blur motion-safe:animate-card-pop">
                <p className="text-xs text-primary">صرفه‌جویی ماهانه</p>
                <p className="text-2xl font-bold text-foreground">٪۳۲</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-xl">
              <div className="gradient-hero absolute inset-0 rounded-[3rem] opacity-40 blur-3xl" aria-hidden />
              <HeroIllustration className="relative z-10" />
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t border-border bg-card px-6 py-4 text-center text-sm text-muted-foreground">
        © ۱۴۰۴ مکانیکو - تمامی حقوق محفوظ است.
      </footer>
    </div>
  );
};

export default Index;
