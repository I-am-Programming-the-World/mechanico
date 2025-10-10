import { useEffect, useState, type ReactNode } from "react";

import { AuthContext, type AuthContextValue } from "./auth-context";
import { initializeDummyData, getCurrentUser, login as loginUser, logout as logoutUser, type User } from "@/lib/storage";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeDummyData();
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login: AuthContextValue["login"] = async (email, password) => {
    try {
      const loggedInUser = loginUser(email, password);
      if (loggedInUser) {
        if (!loggedInUser.isApproved && loggedInUser.role === "provider") {
          return { success: false, error: "حساب کاربری شما هنوز تأیید نشده است" };
        }
        setUser(loggedInUser);
        return { success: true };
      }
      return { success: false, error: "ایمیل یا رمز عبور اشتباه است" };
    } catch (error) {
      return { success: false, error: "خطا در ورود به سیستم" };
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>;
};
