import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { Booking } from '@/lib/storage';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, DollarSign, Calendar, Car } from 'lucide-react';
import { toast } from 'sonner';
import { useData } from '@/contexts/DataContext';
import { formatDurationMinutes } from '@/lib/utils';

const Services = () => {
  const { user } = useAuth();
  const { services, vehicles, addBooking, users } = useData();
  const defaultProviderId = user?.role === 'provider'
    ? user.id
    : users.find((u) => u.role === 'provider')?.id ?? user?.id ?? '';
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [bookingForm, setBookingForm] = useState({
    vehicleId: '',
    scheduledDate: '',
    scheduledTime: '',
    notes: '',
  });

  const navigate = useNavigate();

  const userVehicles = vehicles.filter(v => v.ownerId === user?.id);

  const handleBookService = () => {
    if (!user || !selectedService || !bookingForm.vehicleId) {
      toast.error('لطفاً تمام فیلدها را پر کنید');
      return;
    }

    const service = services.find(s => s.id === selectedService);
    if (!service) return;

    const scheduledAt = new Date(`${bookingForm.scheduledDate}T${bookingForm.scheduledTime}`);
    
    const newBooking: Booking = addBooking({
      customerId: user.id,
      providerId: defaultProviderId,
      vehicleId: bookingForm.vehicleId,
      serviceId: selectedService,
      scheduledAt: scheduledAt.toISOString(),
      status: 'pending',
      price: service.basePrice,
      notes: bookingForm.notes,
    });

    toast.success(`رزرو ${newBooking.id} با موفقیت ثبت شد`);
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedService('');
    setBookingForm({
      vehicleId: '',
      scheduledDate: '',
      scheduledTime: '',
      notes: '',
    });
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      mechanical: 'مکانیکی',
      tire: 'لاستیک و چرخ',
      maintenance: 'سرویس و نگهداری',
      wash: 'شست‌وشو',
      brake: 'ترمز',
      electrical: 'برق',
    };
    return labels[category] || category;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">خدمات</h1>
          <p className="text-muted-foreground mt-2">
            {user?.role === 'customer' 
              ? 'انتخاب و رزرو خدمات مورد نیاز'
              : 'خدمات ارائه شده'}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className="shadow-card hover:shadow-primary transition-all">
              <CardHeader>
                <div className="text-4xl mb-2">{service.icon}</div>
                <CardTitle>{service.name}</CardTitle>
                <CardDescription>{getCategoryLabel(service.category)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>زمان</span>
                    </div>
                    <span className="font-medium">{formatDurationMinutes(service.duration)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>قیمت</span>
                    </div>
                    <span className="font-semibold text-success">
                      {service.basePrice.toLocaleString('fa-IR')} تومان
                    </span>
                  </div>
                </div>

                {user?.role === 'customer' && (
                  <Dialog open={isDialogOpen && selectedService === service.id} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (open) setSelectedService(service.id);
                    else resetForm();
                  }}>
                    <DialogTrigger asChild>
                      <Button className="w-full">رزرو خدمت</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>رزرو {service.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>انتخاب خودرو</Label>
                          <Select
                            value={bookingForm.vehicleId}
                            onValueChange={(value) =>
                              setBookingForm({ ...bookingForm, vehicleId: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="خودرو را انتخاب کنید" />
                            </SelectTrigger>
                            <SelectContent>
                              {userVehicles.map((vehicle) => (
                                <SelectItem key={vehicle.id} value={vehicle.id}>
                                  {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>تاریخ</Label>
                            <Input
                              type="date"
                              value={bookingForm.scheduledDate}
                              onChange={(e) => setBookingForm({ ...bookingForm, scheduledDate: e.target.value })}
                              min={new Date().toISOString().split('T')[0]}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>ساعت</Label>
                            <Input
                              type="time"
                              value={bookingForm.scheduledTime}
                              onChange={(e) => setBookingForm({ ...bookingForm, scheduledTime: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>توضیحات (اختیاری)</Label>
                          <Textarea
                            value={bookingForm.notes}
                            onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                            placeholder="توضیحات اضافی خود را وارد کنید..."
                            rows={3}
                          />
                        </div>

                        <div className="p-4 bg-muted rounded-lg space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>قیمت خدمت:</span>
                            <span className="font-semibold">{service.basePrice.toLocaleString('fa-IR')} تومان</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>مدت زمان:</span>
                            <span className="font-semibold">{formatDurationMinutes(service.duration)}</span>
                          </div>
                        </div>

                        {/*
                         * Submit the booking form. We call `handleBookService` to
                         * validate and create a new booking.
                         */
                        <Button onClick={handleBookService} className="w-full">
                          تأیید رزرو
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {user?.role === 'customer' && userVehicles.length === 0 && (
          <Card className="border-warning">
            <CardContent className="py-8 text-center">
              <Car className="h-12 w-12 text-warning mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                برای رزرو خدمات، ابتدا باید خودرو خود را اضافه کنید
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate('/vehicles')}
              >
                افزودن خودرو
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Services;