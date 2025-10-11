import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const Sparkline: React.FC<{ data: any[]; dataKey: string }> = ({ data, dataKey }) => (
  <div className="h-10 w-24">
    <RC2 width="100%" height="100%">
      <AC2 data={data}>
        <A2 type="monotone" dataKey={dataKey} stroke="hsl(var(--primary))" fill="hsl(var(--primary))/30" />
      </AC2>
    </RC2>
  </div>
)

import { Calendar, DollarSign, Users, Star, TrendingUp, Car } from 'lucide-react';
import { BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ResponsiveContainer as RC2, Area as A2, AreaChart as AC2 } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import Layout from '@/components/Layout';
import { formatMillions, formatNumber } from '@/lib/utils';
import { formatNumberFa, formatCurrencyFa } from '@/lib/intl';

const Dashboard = () => {
  const { user } = useAuth();
  const { bookings, services, users, reviews, vehicles } = useData();

  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const totalRevenue = bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.price, 0);
  const averageRatingValue = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const userBookings = bookings.filter(b =>
    user?.role === 'customer' ? b.customerId === user.id : b.providerId === user.id
  );
  const userRevenue = userBookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.price, 0);
  const userReviews = reviews.filter(r =>
    user?.role === 'provider' ? r.providerId === user.id : r.customerId === user.id
  );

  const statusData = useMemo(() => ([
    { name: 'در انتظار', value: bookings.filter(b => b.status === 'pending').length, fill: 'hsl(var(--warning))' },
    { name: 'تأیید شده', value: bookings.filter(b => b.status === 'confirmed').length, fill: 'hsl(var(--primary))' },
    { name: 'در حال انجام', value: bookings.filter(b => b.status === 'in-progress').length, fill: 'hsl(var(--secondary))' },
    { name: 'انجام شده', value: bookings.filter(b => b.status === 'completed').length, fill: 'hsl(var(--success))' },
    { name: 'لغو شده', value: bookings.filter(b => b.status === 'cancelled').length, fill: 'hsl(var(--destructive))' },
  ]), [bookings]);

  const monthlyData = useMemo(() => ([
    { month: 'فروردین', bookings: 12, revenue: 15000000 },
    { month: 'اردیبهشت', bookings: 15, revenue: 18500000 },
    { month: 'خرداد', bookings: 18, revenue: 22000000 },
    { month: 'تیر', bookings: 22, revenue: 28000000 },
    { month: 'مرداد', bookings: 25, revenue: 32000000 },
    { month: 'شهریور', bookings: 20, revenue: 26000000 },
  ]), []);

  const servicePopularity = useMemo(() => (
    services.map(service => ({
      name: service.name,
      count: bookings.filter(b => b.serviceId === service.id).length,
    })).sort((a, b) => b.count - a.count).slice(0, 5)
  ), [bookings, services]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <p className="font-medium">{label}</p>
          {payload.map((p: any) => (
            <p key={p.dataKey} style={{ color: p.color }}>
              {`${p.name}: ${formatNumberFa(p.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  const PieCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <p className="font-medium">{`${data.name}: ${formatNumberFa(data.value)} (${formatNumberFa((payload[0].percent * 100), { maximumFractionDigits: 0 })}٪)`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
<h1 className="font-display text-balance text-2xl md:text-3xl font-bold font-display text-balance font-display text-balance">
            خوش آمدید، {user?.fullName}
          </h1>
          <p className="text-muted-foreground mt-2">
            خلاصه‌ای از فعالیت‌های {user?.role === 'admin' ? 'پلتفرم' : 'شما'}
          </p>
        </div>

        <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{duration:0.35}}><Card className="transition hover:-translate-y-0.5 hover:shadow-lg transition hover:-translate-y-0.5 hover:shadow-lg shadow-card transition-all hover:scale-[1.02] hover:shadow-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {user?.role === 'admin' ? 'کل رزروها' : 'رزروهای من'}
              </CardTitle>
              <Calendar className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
                {formatNumberFa(user?.role === 'admin' ? totalBookings : userBookings.length)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatNumberFa(completedBookings)} رزرو انجام شده
              </p>
            </CardContent>
          </Card>

          <Card className="transition hover:-translate-y-0.5 hover:shadow-lg transition hover:-translate-y-0.5 hover:shadow-lg shadow-card transition-all hover:scale-[1.02] hover:shadow-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">درآمد کل</CardTitle>
              <DollarSign className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                {formatMillions(user?.role === 'admin' ? totalRevenue : userRevenue)} م
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                تومان
              </p>
            </CardContent>
          </Card>

          <Card className="transition hover:-translate-y-0.5 hover:shadow-lg transition hover:-translate-y-0.5 hover:shadow-lg shadow-card transition-all hover:scale-[1.02] hover:shadow-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {user?.role === 'admin' ? 'کاربران' : user?.role === 'customer' ? 'خودروهای من' : 'مشتریان'}
              </CardTitle>
              {user?.role === 'customer' ? (
                <Car className="h-5 w-5 text-secondary" />
              ) : (
                <Users className="h-5 w-5 text-secondary" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">
                {formatNumberFa(user?.role === 'admin'
                  ? users.length
                  : user?.role === 'customer'
                    ? vehicles.filter(v => v.ownerId === user.id).length
                    : bookings.filter(b => b.providerId === user?.id && b.status === 'completed').length)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {user?.role === 'admin' ? 'کاربر فعال' : user?.role === 'customer' ? 'خودرو' : 'مشتری راضی'}
              </p>
            </CardContent>
          </Card>

          <Card className="transition hover:-translate-y-0.5 hover:shadow-lg transition hover:-translate-y-0.5 hover:shadow-lg shadow-card transition-all hover:scale-[1.02] hover:shadow-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">میانگین امتیاز</CardTitle>
              <Star className="h-5 w-5 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning flex items-center gap-1">
                {formatNumberFa(averageRatingValue, { maximumFractionDigits: 1, minimumFractionDigits: 1 })}
                <Star className="h-6 w-6 fill-warning" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                از {formatNumberFa(user?.role === 'admin' ? reviews.length : userReviews.length)} نظر
              </p>
            </CardContent>
          </Card></motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="transition hover:-translate-y-0.5 hover:shadow-lg transition hover:-translate-y-0.5 hover:shadow-lg shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" aria-hidden />
                روند رزروها
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer>
        <ResponsiveContainer width="100%" height={300}>
                <AreaChart margin={{ right: 24, left: 8, top: 8, bottom: 0 }} data={monthlyData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis tick={{textAnchor: "end", fill: 'hsl(var(--muted-foreground))'}}  dataKey="month" axisLine={false} tickLine={false}  />
                  <YAxis tick={{textAnchor: "end", fill: 'hsl(var(--muted-foreground))'}}  tickFormatter={value => formatNumberFa(value)} axisLine={false} tickLine={false}  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="bookings"
                    stroke="hsl(var(--primary))"
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                    name="تعداد رزرو"
                  />
                </AreaChart>
              </ResponsiveContainer>
      </ChartContainer>
            </CardContent>
          </Card>

          <Card className="transition hover:-translate-y-0.5 hover:shadow-lg transition hover:-translate-y-0.5 hover:shadow-lg shadow-card">
            <CardHeader>
              <CardTitle>وضعیت رزروها</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer>
        <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      innerRadius={70}
                      paddingAngle={5}
                      fill="#8884d8"
                      dataKey="value"
                      stroke="hsl(var(--background))"
                      strokeWidth={2}
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieCustomTooltip />} />
                    <Legend verticalAlign="top" align="right" />
                  </PieChart>
              </ResponsiveContainer>
      </ChartContainer>
            </CardContent>
          </Card>

          <Card className="transition hover:-translate-y-0.5 hover:shadow-lg transition hover:-translate-y-0.5 hover:shadow-lg shadow-card md:col-span-2">
            <CardHeader>
              <CardTitle>محبوب‌ترین خدمات</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer>
        <ResponsiveContainer width="100%" height={300}>
                <BarChart data={servicePopularity}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis tick={{textAnchor: "end", fill: 'hsl(var(--muted-foreground))'}}  dataKey="name" axisLine={false} tickLine={false}  />
                  <YAxis tick={{textAnchor: "end", fill: 'hsl(var(--muted-foreground))'}}  tickFormatter={value => formatNumberFa(value)} axisLine={false} tickLine={false}  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }}/>
                  <Legend verticalAlign="top" align="right" />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--secondary))"
                    name="تعداد رزرو"
                    radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
      </ChartContainer>
            </CardContent>
          </Card></motion.div>
      </div>
    </Layout>
  );
};

export default Dashboard;