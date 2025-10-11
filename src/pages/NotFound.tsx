import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-background" dir="rtl">
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <div className="space-y-4">
          <span className="inline-flex items-center justify-center rounded-full bg-destructive/10 px-4 py-2 text-sm font-semibold text-destructive">
            خطای ۴۰۴
          </span>
          \1\2 font-display text-balance mb-4 md:mb-6\3>صفحه مورد نظر یافت نشد</h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            مسیر <span className="font-mono text-sm text-foreground/70">{location.pathname}</span> در نسخه نمایشی مکانیکو موجود نیست. از لینک‌های زیر برای ادامه استفاده کنید.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-primary transition hover:bg-primary/90"
            >
              رفتن به داشبورد
            </Link>
            <Link
              to="/auth"
              className="rounded-full border border-border px-6 py-3 text-base font-semibold text-foreground transition hover:border-primary hover:text-primary"
            >
              بازگشت به ورود
            </Link>
          </div>
        </div>
      </main>
      <footer className="border-t border-border bg-card px-6 py-4 text-center text-sm text-muted-foreground">
        © ۱۴۰۴ مکانیکو
      </footer>
    </div>
  );
};

export default NotFound;