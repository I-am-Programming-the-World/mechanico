import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { useData } from '@/contexts/DataContext';
import { useTheme } from '@/components/ThemeProvider';

const Settings = () => {
  const { user } = useAuth();
  const { resetDemoData } = useData();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });

  const handleSave = () => {
    toast.success('تنظیمات با موفقیت ذخیره شد');
  };

  const handleResetData = () => {
    resetDemoData();
    toast.success('داده‌های نمونه بازنشانی شد و صفحه دوباره بارگذاری می‌شود.', {
      description: 'لطفاً چند لحظه صبر کنید...',
      duration: 3000,
      onDismiss: () => window.location.reload(),
      onAutoClose: () => window.location.reload(),
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 font-display text-balance">
            <SettingsIcon className="h-8 w-8" />
            تنظیمات
          </h1>
          <p className="text-muted-foreground mt-2">مدیریت تنظیمات حساب و سیستم</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="flex flex-wrap gap-2 h-auto justify-start">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              پروفایل
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              اعلان‌ها
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              امنیت
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="h-4 w-4" />
              ظاهر
            </TabsTrigger>
            <TabsTrigger value="system" className="gap-2">
              <Globe className="h-4 w-4" />
              سیستم
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card className="transition hover:-translate-y-0.5 hover:shadow-lg shadow-card">
              <CardHeader className="text-right">
                <CardTitle>اطلاعات شخصی</CardTitle>
                <CardDescription>به‌روزرسانی اطلاعات پروفایل</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-right">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>نام کامل</Label>
                    <Input defaultValue={user?.fullName} />
                  </div>
                  <div className="space-y-2">
                    <Label>ایمیل</Label>
                    <Input type="email" defaultValue={user?.email} dir="ltr" />
                  </div>
                  <div className="space-y-2">
                    <Label>شماره تلفن</Label>
                    <Input defaultValue={user?.phone} dir="ltr" />
                  </div>
                  <div className="space-y-2">
                    <Label>نقش</Label>
                    <Input disabled value={user?.role === 'admin' ? 'مدیر' : user?.role === 'provider' ? 'ارائه‌دهنده' : 'مشتری'} />
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>آدرس</Label>
                  <Input placeholder="آدرس کامل خود را وارد کنید" />
                </div>
                <div className="space-y-2">
                  <Label>بیوگرافی</Label>
                  <Input placeholder="درباره خود بنویسید..." />
                </div>
                <Button onClick={handleSave} className="ml-auto block">ذخیره تغییرات</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card className="transition hover:-translate-y-0.5 hover:shadow-lg shadow-card">
              <CardHeader className="text-right">
                <CardTitle>تنظیمات اعلان‌ها</CardTitle>
                <CardDescription>مدیریت نحوه دریافت اعلان‌ها</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-0.5 text-right">
                    <Label>اعلان‌های ایمیل</Label>
                    <p className="text-sm text-muted-foreground">دریافت اعلان‌ها از طریق ایمیل</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                  />
                </div>
                <Separator />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-0.5 text-right">
                    <Label>اعلان‌های پیامکی</Label>
                    <p className="text-sm text-muted-foreground">دریافت اعلان‌ها از طریق پیامک</p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                  />
                </div>
                <Separator />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-0.5 text-right">
                    <Label>اعلان‌های Push</Label>
                    <p className="text-sm text-muted-foreground">دریافت اعلان‌های فوری در مرورگر</p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                  />
                </div>
                <Separator />
                <div className="space-y-4 text-right">
                  <h4 className="font-medium">اعلان درباره:</h4>
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <Label>رزروهای جدید</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <Label>تغییر وضعیت رزروها</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <Label>نظرات جدید</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <Label>یادآوری سرویس</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                <Button onClick={handleSave} className="ml-auto block">ذخیره تغییرات</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card className="transition hover:-translate-y-0.5 hover:shadow-lg shadow-card">
              <CardHeader className="text-right">
                <CardTitle>امنیت حساب</CardTitle>
                <CardDescription>مدیریت رمز عبور و امنیت</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-right">
                <div className="space-y-2">
                  <Label>رمز عبور فعلی</Label>
                  <Input type="password" placeholder="رمز عبور فعلی" />
                </div>
                <div className="space-y-2">
                  <Label>رمز عبور جدید</Label>
                  <Input type="password" placeholder="رمز عبور جدید" />
                </div>
                <div className="space-y-2">
                  <Label>تکرار رمز عبور جدید</Label>
                  <Input type="password" placeholder="تکرار رمز عبور جدید" />
                </div>
                <Button className="ml-auto block">تغییر رمز عبور</Button>
                <Separator />
                <div className="space-y-4">
                  <h4 className="font-medium">احراز هویت دو مرحله‌ای</h4>
                  <p className="text-sm text-muted-foreground">
                    امنیت حساب خود را با فعال‌سازی احراز هویت دو مرحله‌ای افزایش دهید
                  </p>
                  <Button variant="outline" className="ml-auto block">فعال‌سازی</Button>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h4 className="font-medium">جلسات فعال</h4>
                  <p className="text-sm text-muted-foreground">
                    دستگاه‌هایی که در حال حاضر به حساب شما متصل هستند
                  </p>
                  <Button variant="destructive" className="ml-auto block">خروج از همه دستگاه‌ها</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <Card className="transition hover:-translate-y-0.5 hover:shadow-lg shadow-card">
              <CardHeader className="text-right">
                <CardTitle>تنظیمات ظاهری</CardTitle>
                <CardDescription>سفارشی‌سازی ظاهر برنامه</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 text-right">
                <div className="space-y-2">
                  <Label>تم رنگی</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب تم" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">روشن</SelectItem>
                      <SelectItem value="dark">تیره</SelectItem>
                      <SelectItem value="system">خودکار (سیستم)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>اندازه فونت</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">کوچک</SelectItem>
                      <SelectItem value="medium">متوسط</SelectItem>
                      <SelectItem value="large">بزرگ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>انیمیشن‌ها</Label>
                    <p className="text-sm text-muted-foreground">نمایش انیمیشن‌های رابط کاربری</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Button onClick={handleSave} className="ml-auto block">ذخیره تغییرات</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card className="transition hover:-translate-y-0.5 hover:shadow-lg shadow-card">
              <CardHeader className="text-right">
                <CardTitle>تنظیمات سیستم</CardTitle>
                <CardDescription>تنظیمات عمومی سیستم</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 text-right">
                <div className="space-y-2">
                  <Label>زبان</Label>
                  <Select defaultValue="fa">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fa">فارسی</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>منطقه زمانی</Label>
                  <Select defaultValue="asia-tehran">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia-tehran">تهران (GMT+3:30)</SelectItem>
                      <SelectItem value="asia-dubai">دبی (GMT+4:00)</SelectItem>
                      <SelectItem value="europe-london">لندن (GMT+0:00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>واحد پول</Label>
                  <Select defaultValue="irr">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="irr">ریال (IRR)</SelectItem>
                      <SelectItem value="usd">دلار (USD)</SelectItem>
                      <SelectItem value="eur">یورو (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>پشتیبان‌گیری خودکار</Label>
                    <p className="text-sm text-muted-foreground">پشتیبان‌گیری روزانه از داده‌ها</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>بازنشانی داده‌های آزمایشی</Label>
                  <p className="text-sm text-muted-foreground">
                    تمام داده‌های نمونه ذخیره‌شده در مرورگر را پاک کرده و از ابتدا شروع کنید.
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button type="button" variant="destructive">
                        بازنشانی داده‌ها
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>آیا مطمئن هستید؟</AlertDialogTitle>
                        <AlertDialogDescription>
                          این عمل تمام داده‌های برنامه را حذف و با مقادیر اولیه جایگزین می‌کند. این کار قابل بازگشت نیست.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>انصراف</AlertDialogCancel>
                        <AlertDialogAction onClick={handleResetData}>
                          بله، بازنشانی کن
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <Button onClick={handleSave} className="ml-auto block">ذخیره تغییرات</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;