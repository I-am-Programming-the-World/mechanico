import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, getCurrentUser, login as loginUser, logout as logoutUser, initializeDummyData } from '@/lib/storage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize dummy data on first load
    initializeDummyData();
    
    // Check for existing session
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const loggedInUser = loginUser(email, password);
      if (loggedInUser) {
        if (!loggedInUser.isApproved && loggedInUser.role === 'provider') {
          return { success: false, error: 'حساب کاربری شما هنوز تأیید نشده است' };
        }
        setUser(loggedInUser);
        return { success: true };
      }
      return { success: false, error: 'ایمیل یا رمز عبور اشتباه است' };
    } catch (error) {
      return { success: false, error: 'خطا در ورود به سیستم' };
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};