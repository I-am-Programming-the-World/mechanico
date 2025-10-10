import { useMemo, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, TrendingUp, Users, Star, DollarSign } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useData } from '@/contexts';
import { formatMillions, formatNumber, formatPercentage, formatRating } from '@/lib/utils';

const Reports = () => {
  const [period, setPeriod] = useState('monthly');
  const { bookings, invoices, expenses, reviews, users } = useData();

  const totalRevenue = useMemo(() => invoices.filter((invoice) => invoice.status === 'paid').reduce((sum, invoice) => sum + invoice.total, 0), [invoices]);
  const totalExpensesValue = useMemo(() => expenses.reduce((sum, expense) => sum + expense.amount, 0), [expenses]);
  const totalCustomers = useMemo(() => users.filter((user) => user.role === 'customer').length, [users]);
  const averageRatingValue = useMemo(() => reviews.length ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) : 0, [reviews]);
  const repeatRate = useMemo(() => {
    const customerBookingCounts = bookings.reduce<Record<string, number>>((acc, booking) => {
      acc[booking.customerId] = (acc[booking.customerId] ?? 0) + 1;
      return acc;
    }, {});
    const repeatCustomers = Object.values(customerBookingCounts).filter((count) => count > 1).length;
    const base = Object.keys(customerBookingCounts).length || 1;
    return Math.round((repeatCustomers / base) * 100);
  }, [bookings]);

  const salesData = [
    { month: 'فروردین', revenue: 12500000, bookings: 42, customers: 28 },
    { month: 'اردیبهشت', revenue: 15800000, bookings: 55, customers: 35 },
    { month: 'خرداد', revenue: 18200000, bookings: 63, customers: 41 },
    { month: 'تیر', revenue: 22000000, bookings: 78, customers: 52 },
    { month: 'مرداد', revenue: 25600000, bookings: 89, customers: 61 },
    { month: 'شهریور', revenue: 20400000, bookings: 71, customers: 48 },
  ];

  const servicePerformance = [
    { service: 'تعویض روغن', revenue: 34000000, count: 89, rating: 4.8 },
    { service: 'سرویس کامل', revenue: 28500000, count: 52, rating: 4.9 },
    { service: 'تعمیر ترمز', revenue: 21200000, count: 38, rating: 4.7 },
    { service: 'بالانس چرخ', revenue: 16800000, count: 71, rating: 4.6 },
    { service: 'شست‌وشو', revenue: 12400000, count: 95, rating: 4.5 },
  ];

  const customerSegments = [
    { name: 'مشتریان وفادار', value: 45, color: 'hsl(var(--primary))' },
    { name: 'مشتریان جدید', value: 30, color: 'hsl(var(--secondary))' },
    { name: 'مشتریان غیرفعال', value: 25, color: 'hsl(var(--muted))' },
  ];

  const providerPerformance = [
    { name: 'علی محمدی', bookings: 89, revenue: 42500000, rating: 4.9 },
    { name: 'حسین رضایی', bookings: 52, revenue: 28300000, rating: 4.7 },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">گزارشات و تحلیل‌ها</h1>
            <p className="text-muted-foreground mt-2">گزارش‌های جامع کسب‌وکار</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">هفتگی</SelectItem>
                <SelectItem value="monthly">ماهانه</SelectItem>
                <SelectItem value="quarterly">فصلی</SelectItem>
                <SelectItem value="yearly">سالانه</SelectItem>
              </SelectContent>
            </Select>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              دانلود PDF
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-card hover:shadow-primary transition-all" aria-label="گزارش فروش کل">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">فروش کل</CardTitle>
              <TrendingUp className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{formatMillions(totalRevenue)} م</div>
              <p className="text-xs text-muted-foreground mt-1">درآمد حاصل از فاکتورهای پرداخت‌شده</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-primary transition-all" aria-label="تعداد مشتریان">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">کل مشتریان</CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{formatNumber(totalCustomers)}</div>
              <p className="text-xs text-muted-foreground mt-1">کاربران با نقش مشتری فعال</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-primary transition-all" aria-label="میانگین رضایت">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">میانگین امتیاز</CardTitle>
              <Star className="h-5 w-5 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{formatNumber(averageRatingValue, { maximumFractionDigits: 1, minimumFractionDigits: 1 })}</div>
              <p className="text-xs text-muted-foreground mt-1">از {formatNumber(reviews.length)} نظر ثبت‌شده</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-primary transition-all" aria-label="نرخ بازگشت مشتری">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">نرخ تکرار</CardTitle>
              <DollarSign className="h-5 w-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">{formatPercentage(repeatRate, { maximumFractionDigits: 0 })}</div>
              <p className="text-xs text-muted-foreground mt-1">نسبت مشتریانی که بیش از یک بار رزرو داشته‌اند</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sales" className="space-y-4">
          <TabsList className="flex flex-wrap gap-2">
            <TabsTrigger value="sales">فروش و درآمد</TabsTrigger>
            <TabsTrigger value="services">خدمات</TabsTrigger>
            <TabsTrigger value="customers">مشتریان</TabsTrigger>
            <TabsTrigger value="providers">ارائه‌دهندگان</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-6">
            <div className="rounded-lg border border-border bg-card/40 p-4 text-sm text-muted-foreground">
              درآمد خالص این دوره برابر با {formatNumber(totalRevenue - totalExpensesValue)} تومان است؛ مجموع هزینه‌ها {formatNumber(totalExpensesValue)} تومان و درآمد تایید شده {formatNumber(totalRevenue)} تومان بوده است.
            </div>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>روند فروش و درآمد</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={formatNumber} />
                    <Tooltip formatter={(value: number) => `${formatNumber(value)} تومان`} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} name="درآمد" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>تعداد رزروها</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={formatNumber} />
                      <Tooltip formatter={(value: number) => formatNumber(value)} />
                      <Bar dataKey="bookings" fill="hsl(var(--secondary))" name="رزروها" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>مشتریان جدید</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={formatNumber} />
                      <Tooltip formatter={(value: number) => formatNumber(value)} />
                      <Bar dataKey="customers" fill="hsl(var(--accent))" name="مشتریان" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>عملکرد خدمات</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={servicePerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="service" />
                    <YAxis tickFormatter={formatNumber} />
                    <Tooltip
                      formatter={(value: number, name: string) =>
                        name === 'درآمد' ? `${formatNumber(value)} تومان` : formatNumber(value)
                      }
                    />
                    <Legend />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" name="درآمد" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="count" fill="hsl(var(--secondary))" name="تعداد" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>تقسیم‌بندی مشتریان</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={customerSegments}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${formatNumber(entry.value)}٪`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {customerSegments.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${formatNumber(value)}٪`} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>آمار رضایت مشتریان</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm">عالی (5 ستاره)</span>
                      <span className="font-bold text-success">{formatNumber(72)}٪</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-success h-2 rounded-full" style={{width: '72%'}}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm">خوب (4 ستاره)</span>
                      <span className="font-bold text-primary">{formatNumber(21)}٪</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{width: '21%'}}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm">متوسط (3 ستاره)</span>
                      <span className="font-bold text-warning">{formatNumber(5)}٪</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-warning h-2 rounded-full" style={{width: '5%'}}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm">ضعیف (1-2 ستاره)</span>
                      <span className="font-bold text-destructive">{formatNumber(2)}٪</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-destructive h-2 rounded-full" style={{width: '2%'}}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="providers" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>عملکرد ارائه‌دهندگان</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {providerPerformance.map((provider, idx) => (
                    <div key={idx} className="space-y-3 rounded-lg border p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-bold text-lg">{provider.name}</h3>
                        <div className="flex items-center gap-1 text-warning">
                          <Star className="h-4 w-4 fill-warning" />
                          <span className="font-bold">{formatRating(provider.rating)}</span>
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-sm text-muted-foreground">تعداد رزروها</p>
                          <p className="text-2xl font-bold text-primary">{formatNumber(provider.bookings)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">درآمد کل</p>
                          <p className="text-2xl font-bold text-success">{formatMillions(provider.revenue)} م</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Reports;
