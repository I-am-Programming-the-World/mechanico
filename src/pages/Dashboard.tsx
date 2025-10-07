import { useAuth } from '@/contexts/AuthContext';
import { getBookings, getServices, getUsers, getReviews, getVehicles } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, DollarSign, Users, Star, TrendingUp, Car } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Layout from '@/components/Layout';

const Dashboard = () => {
  const { user } = useAuth();
  const bookings = getBookings();
  const services = getServices();
  const users = getUsers();
  const reviews = getReviews();
  const vehicles = getVehicles();

  // Calculate statistics
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const totalRevenue = bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.price, 0);
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  // User-specific stats
  const userBookings = bookings.filter(b => 
    user?.role === 'customer' ? b.customerId === user.id : b.providerId === user.id
  );
  const userRevenue = userBookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.price, 0);
  const userReviews = reviews.filter(r => 
    user?.role === 'provider' ? r.providerId === user.id : r.customerId === user.id
  );

  // Chart data
  const statusData = [
    { name: 'در انتظار', value: bookings.filter(b => b.status === 'pending').length },
    { name: 'تأیید شده', value: bookings.filter(b => b.status === 'confirmed').length },
    { name: 'در حال انجام', value: bookings.filter(b => b.status === 'in-progress').length },
    { name: 'انجام شده', value: bookings.filter(b => b.status === 'completed').length },
    { name: 'لغو شده', value: bookings.filter(b => b.status === 'cancelled').length },
  ];

  const COLORS = ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444'];

  const monthlyData = [
    { month: 'فروردین', bookings: 12, revenue: 15000000 },
    { month: 'اردیبهشت', bookings: 15, revenue: 18500000 },
    { month: 'خرداد', bookings: 18, revenue: 22000000 },
    { month: 'تیر', bookings: 22, revenue: 28000000 },
    { month: 'مرداد', bookings: 25, revenue: 32000000 },
    { month: 'شهریور', bookings: 20, revenue: 26000000 },
  ];

  const servicePopularity = services.map(service => ({
    name: service.name,
    count: bookings.filter(b => b.serviceId === service.id).length,
  })).sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">
            خوش آمدید، {user?.fullName}
          </h1>
          <p className="text-muted-foreground mt-2">
            خلاصه‌ای از فعالیت‌های {user?.role === 'admin' ? 'پلتفرم' : 'شما'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-card hover:shadow-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {user?.role === 'admin' ? 'کل رزروها' : 'رزروهای من'}
              </CardTitle>
              <Calendar className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
                {user?.role === 'admin' ? totalBookings : userBookings.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {completedBookings} رزرو انجام شده
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">درآمد کل</CardTitle>
              <DollarSign className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                {((user?.role === 'admin' ? totalRevenue : userRevenue) / 1000000).toFixed(1)} میلیون
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                تومان
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-primary transition-all">
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
                {user?.role === 'admin' 
                  ? users.length 
                  : user?.role === 'customer'
                    ? vehicles.filter(v => v.ownerId === user.id).length
                    : bookings.filter(b => b.providerId === user?.id && b.status === 'completed').length
                }
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {user?.role === 'admin' ? 'کاربر فعال' : user?.role === 'customer' ? 'خودرو' : 'مشتری راضی'}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">میانگین امتیاز</CardTitle>
              <Star className="h-5 w-5 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning flex items-center gap-1">
                {averageRating}
                <Star className="h-6 w-6 fill-warning" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                از {user?.role === 'admin' ? reviews.length : userReviews.length} نظر
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Monthly Bookings */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                روند رزروها
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="bookings" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="تعداد رزرو"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Booking Status */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>وضعیت رزروها</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Service Popularity */}
          <Card className="shadow-card md:col-span-2">
            <CardHeader>
              <CardTitle>محبوب‌ترین خدمات</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={servicePopularity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="count" 
                    fill="hsl(var(--secondary))" 
                    name="تعداد رزرو"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;