import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { Vehicle } from '@/lib/storage';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Car, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useData } from '@/contexts/DataContext';
import { formatNumber } from '@/lib/utils';

const Vehicles = () => {
  const { user } = useAuth();
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    color: '',
    mileage: 0,
  });

  const userVehicles = vehicles.filter(v => v.ownerId === user?.id);

  const handleSave = () => {
    if (!user) return;

    if (editingVehicle) {
      updateVehicle(editingVehicle.id, formData);
      toast.success('خودرو به‌روزرسانی شد');
    } else {
      const newVehicle: Vehicle = {
        ownerId: user.id,
        ...formData,
        id: crypto.randomUUID(),
      };
      addVehicle(newVehicle);
      toast.success('خودرو جدید اضافه شد');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (vehicleId: string) => {
    deleteVehicle(vehicleId);
    toast.success('خودرو حذف شد');
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      licensePlate: vehicle.licensePlate,
      color: vehicle.color,
      mileage: vehicle.mileage,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingVehicle(null);
    setFormData({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      licensePlate: '',
      color: '',
      mileage: 0,
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-balance mb-4 md:mb-6 text-2xl md:text-3xl font-bold font-display text-balance">خودروهای من</h1>
            <p className="text-muted-foreground mt-2">
              مدیریت اطلاعات خودروهای خود
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                افزودن خودرو
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingVehicle ? 'ویرایش خودرو' : 'افزودن خودرو جدید'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="make">سازنده</Label>
                    <Input
                      id="make"
                      value={formData.make}
                      onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                      placeholder="ایران خودرو"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">مدل</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      placeholder="پژو ۲۰۶"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="year">سال ساخت</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">رنگ</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="سفید"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licensePlate">پلاک</Label>
                  <Input
                    id="licensePlate"
                    value={formData.licensePlate}
                    onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                    placeholder="۱۲ ب ۳۴۵ ایران ۶۷"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mileage">کارکرد (کیلومتر)</Label>
                  <Input
                    id="mileage"
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) })}
                  />
                </div>
                <Button onClick={handleSave} className="w-full">
                  {editingVehicle ? 'به‌روزرسانی' : 'افزودن'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {userVehicles.length === 0 ? (
            <Card className="md:col-span-2">
              <CardContent className="py-12 text-center">
                <img src="/placeholder.svg" alt="No vehicles" className="mx-auto h-24 w-24 text-muted-foreground opacity-50 mb-4" />
                <p className="text-muted-foreground">هنوز خودرویی اضافه نشده است</p>
              </CardContent>
            </Card>
          ) : (
            userVehicles.map((vehicle) => (
              <Card key={vehicle.id} className="shadow-card hover:shadow-primary transition-all">
                <CardHeader>
                  <CardTitle className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Car className="h-5 w-5 text-primary" />
                      {vehicle.make} {vehicle.model}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(vehicle)} aria-label={`ویرایش ${vehicle.make} ${vehicle.model}`}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" aria-label={`حذف ${vehicle.make} ${vehicle.model}`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>آیا مطمئن هستید؟</AlertDialogTitle>
                            <AlertDialogDescription>
                              این عمل قابل بازگشت نیست. این خودرو برای همیشه حذف خواهد شد.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>انصراف</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(vehicle.id)}>
                              حذف
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid gap-2 text-sm md:grid-cols-2">
                    <div>
                      <span className="text-muted-foreground">سال ساخت:</span>
                      <p className="font-medium">{formatNumber(vehicle.year)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">رنگ:</span>
                      <p className="font-medium">{vehicle.color}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">پلاک:</span>
                      <p className="font-medium text-lg">{vehicle.licensePlate}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">کارکرد:</span>
                      <p className="font-medium">{formatNumber(vehicle.mileage)} کیلومتر</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Vehicles;