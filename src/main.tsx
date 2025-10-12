import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Import required providers to supply authentication, data and theming contexts.
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

// Mount the React application and wrap it in necessary context providers.
createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light">
    <AuthProvider>
      <DataProvider>
        <App />
        {/* The Toaster component enables toast notifications throughout the app. */}
        <Toaster />
      </DataProvider>
    </AuthProvider>
  </ThemeProvider>,
);