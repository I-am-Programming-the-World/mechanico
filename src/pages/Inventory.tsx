import { useMemo, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Package, AlertTriangle, TrendingUp, Boxes, Plus, Minus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';
import { formatMillions, formatNumber } from '@/lib/utils';

const Inventory = () => {
  const { inventory, addInventoryItem, adjustInventoryQuantity } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    quantity: '',
    minQuantity: '',
    unitPrice: '',
    supplier: '',
    location: '',
  });

  const totalItems = useMemo(() => inventory.reduce((sum, item) => sum + item.quantity, 0), [inventory]);
  const lowStockItems = useMemo(() => inventory.filter(item => item.quantity <= item.minQuantity).length, [inventory]);
  const totalValue = useMemo(() => inventory.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0), [inventory]);

  const getStockStatus = (item: typeof inventory[0]) => {
    const percentage = (item.quantity / item.minQuantity) * 100;
    if (percentage <= 50) return { label: 'خطر', variant: 'destructive' as const, color: 'text-destructive' };
    if (percentage <= 100) return { label: 'کم', variant: 'secondary' as const, color: 'text-warning' };
    return { label: 'کافی', variant: 'default' as const, color: 'text-success' };
  };

  const handleAddInventoryItem = () => {
    if (!newItem.name || !newItem.category || !newItem.quantity || !newItem.minQuantity || !newItem.unitPrice) {
      toast.error('همه فیلدهای ضروری را تکمیل کنید');
      return;
    }

    addInventoryItem({
      name: newItem.name,
      category: newItem.category,
      quantity: Number(newItem.quantity),
      minQuantity: Number(newItem.minQuantity),
      unitPrice: Number(newItem.unitPrice),
      supplier: newItem.supplier,
      location: newItem.location,
      lastRestocked: new Date().toISOString(),
    });

    toast.success('قطعه جدید به انبار اضافه شد');
    setNewItem({ name: '', category: '', quantity: '', minQuantity: '', unitPrice: '', supplier: '', location: '' });
    setIsDialogOpen(false);
  };

  const categoryData = useMemo(() => {
    const categories = Array.from(new Set(inventory.map((item) => item.category)));
    return categories.map((category) => ({
      name: category,
      count: inventory.filter((item) => item.category === category).length,
      value: inventory
        .filter((item) => item.category === category)
        .reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
    }));
  }, [inventory]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            \1\2 font-display text-balance mb-4 md:mb-6\3>مدیریت موجودی انبار</h1>
            <p className="text-muted-foreground mt-2">قطعات و مواد مصرفی</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Package className="h-4 w-4" />
                افزودن قطعه
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>افزودن موجودی جدید</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>نام قطعه</Label>
                    <Input value={newItem.name} onChange={(event) => setNewItem((prev) => ({ ...prev, name: event.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>دسته‌بندی</Label>
                    <Input value={newItem.category} onChange={(event) => setNewItem((prev) => ({ ...prev, category: event.target.value }))} />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>موجودی</Label>
                    <Input type="number" inputMode="numeric" value={newItem.quantity} onChange={(event) => setNewItem((prev) => ({ ...prev, quantity: event.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>حداقل موجودی</Label>
                    <Input type="number" inputMode="numeric" value={newItem.minQuantity} onChange={(event) => setNewItem((prev) => ({ ...prev, minQuantity: event.target.value }))} />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>قیمت واحد (تومان)</Label>
                    <Input type="number" inputMode="numeric" value={newItem.unitPrice} onChange={(event) => setNewItem((prev) => ({ ...prev, unitPrice: event.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>تأمین‌کننده</Label>
                    <Input value={newItem.supplier} onChange={(event) => setNewItem((prev) => ({ ...prev, supplier: event.target.value }))} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>محل نگهداری</Label>
                  <Input value={newItem.location} onChange={(event) => setNewItem((prev) => ({ ...prev, location: event.target.value }))} />
                </div>

                <Button onClick={handleAddInventoryItem} className="w-full">
                  ثبت قطعه
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-card hover:shadow-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">کل اقلام</CardTitle>
              <Boxes className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{formatNumber(inventory.length)}</div>
              <p className="text-xs text-muted-foreground mt-1">{formatNumber(totalItems)} عدد موجودی</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">کمبود موجودی</CardTitle>
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{formatNumber(lowStockItems)}</div>
              <p className="text-xs text-muted-foreground mt-1">قلم نیاز به سفارش</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ارزش کل</CardTitle>
              <TrendingUp className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{formatMillions(totalValue)} م</div>
              <p className="text-xs text-muted-foreground mt-1">تومان</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">دسته‌بندی‌ها</CardTitle>
              <Package className="h-5 w-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">{formatNumber(categoryData.length)}</div>
              <p className="text-xs text-muted-foreground mt-1">دسته فعال</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {categoryData.map((cat) => (
            <Card key={cat.name} className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base">{cat.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="text-muted-foreground">تعداد اقلام:</span>
                  <span className="font-medium">{formatNumber(cat.count)}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="text-muted-foreground">ارزش:</span>
                  <span className="font-medium">{formatMillions(cat.value)} م</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>موجودی انبار</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>نام قطعه</TableHead>
                    <TableHead>دسته‌بندی</TableHead>
                    <TableHead>موجودی</TableHead>
                    <TableHead>حداقل</TableHead>
                    <TableHead>وضعیت</TableHead>
                    <TableHead>قیمت واحد</TableHead>
                    <TableHead>تأمین‌کننده</TableHead>
                    <TableHead>محل انبار</TableHead>
                    <TableHead>آخرین خرید</TableHead>
                    <TableHead>عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => {
                    const status = getStockStatus(item);
                    const stockPercentage = (item.quantity / (item.minQuantity * 2)) * 100;
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className={`font-bold ${status.color}`}>{formatNumber(item.quantity)} عدد</div>
                            <Progress value={stockPercentage} className="w-24" />
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{formatNumber(item.minQuantity)} عدد</TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                        <TableCell>{formatNumber(item.unitPrice)} تومان</TableCell>
                        <TableCell className="text-sm">{item.supplier}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{item.location}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(item.lastRestocked).toLocaleDateString('fa-IR')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => adjustInventoryQuantity(item.id, -1)}
                              aria-label={`کاهش موجودی ${item.name}`}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              onClick={() => adjustInventoryQuantity(item.id, 1)}
                              aria-label={`افزایش موجودی ${item.name}`}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </DataTable>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Inventory;