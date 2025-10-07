import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Calendar, 
  Car, 
  Settings as SettingsIcon, 
  LogOut, 
  Users, 
  FileText,
  Star,
  DollarSign,
  Package
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'داشبورد', path: '/dashboard', roles: ['customer', 'provider', 'admin'] },
    { icon: Calendar, label: 'رزروها', path: '/bookings', roles: ['customer', 'provider', 'admin'] },
    { icon: DollarSign, label: 'حسابداری', path: '/accounting', roles: ['provider', 'admin'] },
    { icon: FileText, label: 'گزارشات', path: '/reports', roles: ['provider', 'admin'] },
    { icon: Users, label: 'کارکنان', path: '/employees', roles: ['admin'] },
    { icon: Package, label: 'موجودی انبار', path: '/inventory', roles: ['provider', 'admin'] },
    { icon: Car, label: 'خودروها', path: '/vehicles', roles: ['customer', 'admin'] },
    { icon: SettingsIcon, label: 'خدمات', path: '/services', roles: ['customer', 'provider', 'admin'] },
    { icon: Users, label: 'کاربران', path: '/users', roles: ['admin'] },
    { icon: Star, label: 'نظرات', path: '/reviews', roles: ['provider', 'admin'] },
    { icon: SettingsIcon, label: 'تنظیمات', path: '/settings', roles: ['customer', 'provider', 'admin'] },
  ];

  const filteredMenu = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
              مکانیکو
            </h1>
            <nav className="hidden md:flex gap-1">
              {filteredMenu.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => navigate(item.path)}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <p className="font-medium">{user?.fullName}</p>
              <p className="text-xs text-muted-foreground">
                {user?.role === 'admin' ? 'مدیر' : user?.role === 'provider' ? 'ارائه‌دهنده' : 'مشتری'}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              خروج
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden border-b border-border bg-card">
        <div className="container flex overflow-x-auto px-4 py-2 gap-2">
          {filteredMenu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate(item.path)}
                className="gap-2 whitespace-nowrap"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="container px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © ۱۴۰۴ مکانیکو - پلتفرم جامع خدمات خودرو
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;