import { HashRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import LoadingOverlay from "./components/LoadingOverlay";

function Navbar() {
  const links = [
    { to: "/dashboard", label: "داشبورد" },
    { to: "/reports", label: "گزارش‌ها" },
    { to: "/settings", label: "تنظیمات" },
  ];
  return (
    <header className="border-b border-border sticky top-0 z-40 bg-background/80 backdrop-blur">
      <div className="container h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-display text-2xl leading-none">مکانیکو</span>
        </div>
        <nav className="flex items-center gap-2 md:gap-3">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `nav-link ${isActive ? "nav-link-active" : "text-foreground"}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-rows-[auto,1fr,auto]">
      <Navbar />
      <main className="container py-6 text-right">{children}</main>
      <footer className="border-t border-border">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          © ۱۴۰۴ مکانیکو - همه حقوق محفوظ است
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      <LoadingOverlay hidden />
    </HashRouter>
  );
}
