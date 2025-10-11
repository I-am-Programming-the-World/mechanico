import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Car } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        toast.success('ورود موفقیت‌آمیز بود');
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'خطا در ورود');
      }
    } catch (error) {
      toast.error('خطا در برقراری ارتباط');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (role: 'admin' | 'provider' | 'customer') => {
    const credentials = {
      admin: { email: 'admin@mechanico.ir', password: 'admin123' },
      provider: { email: 'mechanic@mechanico.ir', password: 'mechanic123' },
      customer: { email: 'customer@mechanico.ir', password: 'customer123' },
    };
    setEmail(credentials[role].email);
    setPassword(credentials[role].password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-4" dir="rtl">
      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-full gradient-primary flex items-center justify-center mb-4">
            <Car className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold">
            <span className="gradient-primary bg-clip-text text-transparent">مکانیکو</span>
          </CardTitle>
          <CardDescription className="text-base">
            وصل شو، تعمیر شو، برو
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">ایمیل</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@mechanico.ir"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                dir="ltr"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">رمز عبور</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                dir="ltr"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'در حال ورود...' : 'ورود'}
            </Button>
          </form>

          <div className="space-y-2">
            <p className="text-sm text-center text-muted-foreground">
              ورود سریع با حساب نمونه:
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fillDemoCredentials('admin')}
              >
                مدیر
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fillDemoCredentials('provider')}
              >
                مکانیک
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fillDemoCredentials('customer')}
              >
                مشتری
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;