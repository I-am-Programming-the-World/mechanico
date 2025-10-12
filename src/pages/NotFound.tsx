export default function NotFound() {
  return (
    <div className="min-h-[60vh] grid place-items-center text-center">
      <div className="space-y-3">
        <p className="text-7xl font-display leading-none">۴۰۴</p>
        <h2 className="text-xl">صفحه مورد نظر یافت نشد</h2>
        <p className="text-muted-foreground">آدرس را بررسی کنید یا به داشبورد بازگردید.</p>
        <a href="#/dashboard" className="btn btn-primary inline-block mt-2">بازگشت به داشبورد</a>
      </div>
    </div>
  );
}
