import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background" dir="rtl">
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mx-auto max-w-2xl space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            پلتفرم مدیریت تعمیرگاه مکانیکو
          </span>
          <h1 className="font-display text-balance mb-4 md:mb-6 text-2xl md:text-3xl font-bold font-display text-balance">کنترل کامل عملیات تعمیرگاه با داشبوردهای زنده و داده‌های فارسی</h1>
          <p className="text-lg text-muted-foreground">
            برای استفاده از نسخه نمایشی، وارد حساب کاربری خود شوید و از جریان کامل رزرو تا صدور فاکتور، مدیریت موجودی، اعلان‌ها و گزارش‌های حسابداری بهره ببرید.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/auth"
              className="rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-primary transition hover:bg-primary/90"
            >
              ورود / ثبت‌نام
            </Link>
            <Link
              to="/dashboard"
              className="rounded-full border border-border px-6 py-3 text-base font-semibold text-foreground transition hover:border-primary hover:text-primary"
            >
              مشاهده داشبورد نمونه
            </Link>
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