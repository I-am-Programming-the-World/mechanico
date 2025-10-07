import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getBookings, getUsers, getServices, getVehicles, saveBookings } from '@/lib/storage';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Car, User, Phone, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState(getBookings());
  const users = getUsers();
  const services = getServices();
  const vehicles = getVehicles();

  const userBookings = bookings.filter(b => 
    user?.role === 'customer' ? b.customerId === user.id : b.providerId === user.id
  );

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: any; label: string }> = {
      'pending': { variant: 'secondary', label: 'در انتظار تأیید' },
      'confirmed': { variant: 'default', label: 'تأیید شده' },
      'in-progress': { variant: 'default', label: 'در حال انجام' },
      'completed': { variant: 'default', label: 'انجام شده' },
      'cancelled': { variant: 'destructive', label: 'لغو شده' },
    };
    const config = statusMap[status] || statusMap['pending'];
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    const updatedBookings = bookings.map(b =>
      b.id === bookingId ? { ...b, status: newStatus as any } : b
    );
    setBookings(updatedBookings);
    saveBookings(updatedBookings);
    toast.success('وضعیت رزرو به‌روزرسانی شد');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">رزروها</h1>
          <p className="text-muted-foreground mt-2">
            مدیریت و پیگیری رزروهای {user?.role === 'customer' ? 'شما' : 'مشتریان'}
          </p>
        </div>

        <div className="grid gap-4">
          {userBookings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">هنوز رزروی ثبت نشده است</p>
              </CardContent>
            </Card>
          ) : (
            userBookings.map((booking) => {
              const service = services.find(s => s.id === booking.serviceId);
              const vehicle = vehicles.find(v => v.id === booking.vehicleId);
              const customer = users.find(u => u.id === booking.customerId);
              const provider = users.find(u => u.id === booking.providerId);

              return (
                <Card key={booking.id} className="shadow-card hover:shadow-primary transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          {service?.icon} {service?.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          رزرو شماره #{booking.id}
                        </p>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{formatDate(booking.scheduledAt)}</span>
                        </div>
                        {service && (
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-primary" />
                            <span>{service.duration} دقیقه</span>
                          </div>
                        )}
                        {vehicle && (
                          <div className="flex items-center gap-2 text-sm">
                            <Car className="h-4 w-4 text-primary" />
                            <span>{vehicle.make} {vehicle.model} - {vehicle.licensePlate}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        {user?.role === 'provider' && customer && (
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-secondary" />
                            <span>{customer.fullName}</span>
                          </div>
                        )}
                        {user?.role === 'customer' && provider && (
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-secondary" />
                            <span>{provider.fullName}</span>
                          </div>
                        )}
                        {user?.role === 'provider' && customer && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-secondary" />
                            <span dir="ltr">{customer.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm font-semibold text-success">
                          <DollarSign className="h-4 w-4" />
                          <span>{booking.price.toLocaleString('fa-IR')} تومان</span>
                        </div>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm">{booking.notes}</p>
                      </div>
                    )}

                    {user?.role === 'provider' && booking.status === 'pending' && (
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(booking.id, 'confirmed')}
                        >
                          تأیید رزرو
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(booking.id, 'cancelled')}
                        >
                          رد کردن
                        </Button>
                      </div>
                    )}

                    {user?.role === 'provider' && booking.status === 'confirmed' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(booking.id, 'in-progress')}
                      >
                        شروع خدمت
                      </Button>
                    )}

                    {user?.role === 'provider' && booking.status === 'in-progress' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(booking.id, 'completed')}
                      >
                        اتمام خدمت
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Bookings;