import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Accounting from "./pages/Accounting";
import Bookings from "./pages/Bookings";
import Employees from "./pages/Employees";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import Reviews from "./pages/Reviews";
import Services from "./pages/Services";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import Vehicles from "./pages/Vehicles";
import NotFound from "./pages/NotFound";
import LoadingOverlay from "./components/LoadingOverlay";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Public login page */}
        <Route path="/auth" element={<Auth />} />
        {/* After login, users can access all pages below. Each page handles its own layout and navigation. */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/accounting" element={<Accounting />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/services" element={<Services />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/users" element={<Users />} />
        <Route path="/vehicles" element={<Vehicles />} />
        {/* Redirect the root to the login page */}
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <LoadingOverlay hidden />
    </HashRouter>
  );
}
