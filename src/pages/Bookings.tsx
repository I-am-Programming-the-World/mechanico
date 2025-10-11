import { useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { Booking } from '@/lib/storage';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Car, User, Phone, DollarSign, Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useData } from '@/contexts/DataContext';
import { formatDurationMinutes } from '@/lib/utils';
import { toast } from 'sonner';

const Bookings = () => {
  const { user } = useAuth();
  const { bookings, services, users, vehicles, addBooking, updateBookingStatus, deleteBooking } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    serviceId: '',
    customerId: user?.role === 'customer' ? user.id : '',
    providerId: user?.role === 'provider' ? user.id : '',
    vehicleId: '',
    scheduledDate: '',
    scheduledTime: '',
    price: '',
    notes: '',
  });

  const userBookings = bookings.filter(b =>
    user?.role === 'customer' ? b.customerId === user.id : b.providerId === user.id
  );

  const statusConfig: Record<
    Booking['status'],
    { variant: NonNullable<BadgeProps['variant']>; label: string; className?: string }
  > = {
    pending: { variant: 'secondary', label: 'در انتظار تأیید' },
    confirmed: { variant: 'outline', label: 'تأیید شده', className: 'border-primary/40 bg-primary/10 text-primary' },
    'in-progress': { variant: 'outline', label: 'در حال انجام', className: 'border-warning/40 bg-warning/10 text-warning' },
    completed: { variant: 'outline', label: 'انجام شده', className: 'border-success/40 bg-success/10 text-success' },
    cancelled: { variant: 'destructive', label: 'لغو شده' },
  };

  const getStatusBadge = (status: Booking['status']) => {
    const config = statusConfig[status] ?? statusConfig.pending;
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  const handleStatusChange = (bookingId: string, newStatus: Booking['status']) => {
    updateBookingStatus(bookingId, newStatus);
    toast.success('وضعیت رزرو به‌روزرسانی شد');
  };

  const availableCustomers = useMemo(() => users.filter((u) => u.role === 'customer'), [users]);
  const availableProviders = useMemo(() => users.filter((u) => u.role === 'provider'), [users]);
  const customerVehicles = useMemo(() => (
    formState.customerId
      ? vehicles.filter((vehicle) => vehicle.ownerId === formState.customerId)
      : vehicles
  ), [formState.customerId, vehicles]);

  const resetForm = () => {
    setFormState({
      serviceId: '',
      customerId: user?.role === 'customer' ? user.id : '',
      providerId: user?.role === 'provider' ? user.id : '',
      vehicleId: '',
      scheduledDate: '',
      scheduledTime: '',
      price: '',
      notes: '',
    });
    setFormError(null);
  };

  const handleCreateBooking = () => {
    if (!formState.serviceId || !formState.customerId || !formState.providerId || !formState.vehicleId || !formState.scheduledDate || !formState.scheduledTime) {
      setFormError('لطفاً همه فیلدهای ضروری را تکمیل کنید.');
      return;
    }

    const selectedService = services.find((service) => service.id === formState.serviceId);
    const scheduledAt = new Date(`${formState.scheduledDate}T${formState.scheduledTime}`);

    const newBooking = addBooking({
      customerId: formState.customerId,
      providerId: formState.providerId,
      vehicleId: formState.vehicleId,
      serviceId: formState.serviceId,
      scheduledAt: scheduledAt.toISOString(),
      status: 'pending',
      price: Number(formState.price || selectedService?.basePrice || 0),
      notes: formState.notes,
    });

    toast.success(`رزرو جدید با کد ${newBooking.id} ثبت شد`);
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDeleteBooking = (bookingId: string) => {
    deleteBooking(bookingId);
    toast.success('رزرو حذف شد');
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
          <h1 className="text-3xl font-bold font-display text-balance">رزروها</h1>
          <p className="text-muted-foreground mt-2">
            مدیریت و پیگیری رزروهای {user?.role === 'customer' ? 'شما' : 'مشتریان'}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <p className="text-muted-foreground">
            مشاهده و مدیریت رزروها بر اساس نقش شما
          </p>
          {(user?.role === 'provider' || user?.role === 'admin' || user?.role === 'customer') && (
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                resetForm();
              }
            }}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  رزرو جدید
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>ثبت رزرو جدید</DialogTitle>
                  <DialogDescription>
                    اطلاعات زیر به صورت آزمایشی و بدون نیاز به بک‌اند ذخیره می‌شود.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {formError && (
                    <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive" role="alert" aria-live="assertive">
                      {formError}
                    </div>
                  )}
                  {user?.role !== 'customer' && (
                    <div className="space-y-2">
                      <Label htmlFor="customerId">مشتری</Label>
                      <Select
                        value={formState.customerId}
                        onValueChange={(value) => setFormState((prev) => ({ ...prev, customerId: value, vehicleId: '' }))}
                      >
                        <SelectTrigger id="customerId">
                          <SelectValue placeholder="انتخاب مشتری" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableCustomers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.fullName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {user?.role !== 'provider' && (
                    <div className="space-y-2">
                      <Label htmlFor="providerId">ارائه‌دهنده</Label>
                      <Select
                        value={formState.providerId}
                        onValueChange={(value) => setFormState((prev) => ({ ...prev, providerId: value }))}
                      >
                        <SelectTrigger id="providerId">
                          <SelectValue placeholder="انتخاب ارائه‌دهنده" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableProviders.map((provider) => (
                            <SelectItem key={provider.id} value={provider.id}>
                              {provider.fullName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="serviceId">خدمت</Label>
                    <Select
                      value={formState.serviceId}
                      onValueChange={(value) => {
                        const service = services.find((s) => s.id === value);
                        setFormState((prev) => ({
                          ...prev,
                          serviceId: value,
                          price: service ? service.basePrice.toString() : prev.price,
                        }));
                      }}
                    >
                      <SelectTrigger id="serviceId">
                        <SelectValue placeholder="انتخاب خدمت" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicleId">خودرو</Label>
                    <Select
                      value={formState.vehicleId}
                      onValueChange={(value) => setFormState((prev) => ({ ...prev, vehicleId: value }))}
                    >
                      <SelectTrigger id="vehicleId">
                        <SelectValue placeholder="انتخاب خودرو" />
                      </SelectTrigger>
                      <SelectContent>
                        {customerVehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="scheduledDate">تاریخ</Label>
                      <Input
                        id="scheduledDate"
                        type="date"
                        value={formState.scheduledDate}
                        onChange={(event) => setFormState((prev) => ({ ...prev, scheduledDate: event.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scheduledTime">ساعت</Label>
                      <Input
                        id="scheduledTime"
                        type="time"
                        value={formState.scheduledTime}
                        onChange={(event) => setFormState((prev) => ({ ...prev, scheduledTime: event.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">هزینه (تومان)</Label>
                    <Input
                      id="price"
                      type="number"
                      inputMode="numeric"
                      min="0"
                      value={formState.price}
                      onChange={(event) => setFormState((prev) => ({ ...prev, price: event.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">توضیحات</Label>
                    <Textarea
                      id="notes"
                      value={formState.notes}
                      onChange={(event) => setFormState((prev) => ({ ...prev, notes: event.target.value }))}
                      rows={3}
                      placeholder="جزئیات مورد نیاز برای تیم فنی"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={handleCreateBooking}>
                      ثبت رزرو
                    </Button>
                    <Button type="button" variant="outline" className="flex-1" onClick={resetForm}>
                      پاک‌سازی فرم
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="grid gap-4">
          {userBookings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <img src="/placeholder.svg" alt="No bookings" className="mx-auto h-24 w-24 text-muted-foreground opacity-50 mb-4" />
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
                      <div className="flex items-center gap-2">
                        {getStatusBadge(booking.status)}
                        {(user?.role === 'admin' || user?.id === booking.customerId) && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive"
                                aria-label={`حذف رزرو ${booking.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>آیا مطمئن هستید؟</AlertDialogTitle>
                                <AlertDialogDescription>
                                  این عمل قابل بازگشت نیست. این رزرو برای همیشه حذف خواهد شد.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>انصراف</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteBooking(booking.id)}>
                                  حذف
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
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
                            <span>{formatDurationMinutes(service.duration)}</span>
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