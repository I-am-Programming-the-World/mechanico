import { useState } from "react";

function Tabs({
  tabs,
  value,
  onChange,
}: {
  tabs: { id: string; title: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="w-full">
      <div className="flex justify-end gap-2 mb-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`rounded-full px-4 py-2 text-sm border ${value === t.id ? "bg-primary text-primary-foreground" : "hover:bg-accent/60"}`}
          >
            {t.title}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [tab, setTab] = useState("overview");
  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="font-display text-3xl">داشبورد</h1>
      </header>

      <Tabs
        tabs={[
          { id: "overview", title: "نما کلی" },
          { id: "activity", title: "فعالیت‌ها" },
          { id: "reports", title: "گزارش‌ها" },
        ]}
        value={tab}
        onChange={setTab}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card p-5">
          <h3 className="font-medium mb-2">سفارش‌های امروز</h3>
          <p className="text-2xl font-display leading-none">۲۴</p>
        </div>
        <div className="card p-5">
          <h3 className="font-medium mb-2">درآمد این هفته</h3>
          <p className="text-2xl font-display leading-none">۱۶٬۵۰۰٬۰۰۰ تومان</p>
        </div>
        <div className="card p-5">
          <h3 className="font-medium mb-2">میانگین امتیاز</h3>
          <p className="text-2xl font-display leading-none">۴٫۸</p>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-medium mb-4">نمودار نمونه</h3>
        <div className="h-40 w-full rounded-xl bg-gradient-to-l from-accent to-transparent relative overflow-hidden">
          <div className="absolute inset-0 animate-[float_6s_ease-in-out_infinite] opacity-60">
            <svg viewBox="0 0 600 200" className="w-full h-full">
              <path d="M0 150 C 150 50, 250 180, 400 100 S 550 180, 600 120" fill="none" stroke="currentColor" strokeWidth="3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
