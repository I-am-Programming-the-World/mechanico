import { ReactNode, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Calendar,
  Car,
  Settings as SettingsIcon,
  LogOut,
  Users,
  Star,
  DollarSign,
  Package,
  Menu,
  Wrench,
  BarChart3,
  UserCog,
  Building2,
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const menuItems = [
    // Core Operations
    { icon: LayoutDashboard, label: 'داشبورد', path: '/dashboard', roles: ['customer', 'provider', 'admin'] },
    { icon: Calendar, label: 'رزروها', path: '/bookings', roles: ['customer', 'provider', 'admin'] },
    { icon: Wrench, label: 'خدمات', path: '/services', roles: ['customer', 'provider', 'admin'] },
    { icon: Car, label: 'خودروها', path: '/vehicles', roles: ['customer', 'admin'] },

    // Management & Finance
    { icon: DollarSign, label: 'حسابداری', path: '/accounting', roles: ['provider', 'admin'] },
    { icon: Package, label: 'موجودی انبار', path: '/inventory', roles: ['provider', 'admin'] },
    { icon: BarChart3, label: 'گزارشات', path: '/reports', roles: ['provider', 'admin'] },

    // Administration
    { icon: UserCog, label: 'کاربران', path: '/users', roles: ['admin'] },
    { icon: Building2, label: 'کارکنان', path: '/employees', roles: ['admin'] },
    
    // General
    { icon: Star, label: 'نظرات', path: '/reviews', roles: ['provider', 'admin'] },
    { icon: SettingsIcon, label: 'تنظیمات', path: '/settings', roles: ['customer', 'provider', 'admin'] },
  ];

  const filteredMenu = menuItems.filter(item => user && item.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 skip-link">پرش به محتوای اصلی</a>
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16  items-center justify-between gap-4 px-3 sm:px-4">
          <div className="flex items-center gap-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="باز کردن منوی ناوبری"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <SheetTitle>ناوبری</SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-2" aria-label="منوی موبایل">
                  {filteredMenu.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center justify-between rounded-lg px-4 py-2 text-base transition-colors',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                            isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'
                          )
                        }
                        aria-label={item.label}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="flex items-center gap-3">
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </span>
                      </NavLink>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
            <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
              مکانیکو
            </h1>
            <nav className="hidden md:flex flex-row-reverse overflow-x-auto no-scrollbar flex-row-reverse items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 whitespace-nowrap" aria-label="منوی اصلی">
              {filteredMenu.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2 rounded-full flex-row-reverse px-3 py-2 text-sm md:text-[0.95rem] transition-colors',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                        isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted text-foreground'
                      )
                    }
                    aria-label={item.label}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="max-w-[12ch] overflow-hidden text-ellipsis">{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-right">
              <p className="font-medium" aria-live="polite">{user?.fullName}</p>
              <p className="text-xs text-muted-foreground">
                {user?.role === 'admin' ? 'مدیر' : user?.role === 'provider' ? 'ارائه‌دهنده' : 'مشتری'}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              خروج
            </Button>
          </div>
        </div>
      </header>
      
      <main id="main-content" className="container overflow-x-hidden mx-auto px-3 py-8 sm:px-4">
        {children}
      </main>

      <footer className="border-t border-border bg-card mt-auto">
        <div className="container px-3 py-6 sm:px-4">
          <p className="text-center text-sm text-muted-foreground">
            © ۱۴۰۴ مکانیکو - پلتفرم جامع خدمات خودرو
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;