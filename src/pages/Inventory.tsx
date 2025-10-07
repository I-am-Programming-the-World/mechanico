import { useState } from 'react';
import { getInventory, saveInventory } from '@/lib/storage';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Package, AlertTriangle, TrendingUp, Boxes } from 'lucide-react';

const Inventory = () => {
  const [inventory] = useState(getInventory());

  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = inventory.filter(item => item.quantity <= item.minQuantity).length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  const getStockStatus = (item: typeof inventory[0]) => {
    const percentage = (item.quantity / item.minQuantity) * 100;
    if (percentage <= 50) return { label: 'خطر', variant: 'destructive' as const, color: 'text-destructive' };
    if (percentage <= 100) return { label: 'کم', variant: 'secondary' as const, color: 'text-warning' };
    return { label: 'کافی', variant: 'default' as const, color: 'text-success' };
  };

  const categoryData = [
    { 
      name: 'روغنیات', 
      count: inventory.filter(i => i.category === 'روغنیات').length,
      value: inventory.filter(i => i.category === 'روغنیات').reduce((s, i) => s + (i.quantity * i.unitPrice), 0)
    },
    { 
      name: 'فیلتر', 
      count: inventory.filter(i => i.category === 'فیلتر').length,
      value: inventory.filter(i => i.category === 'فیلتر').reduce((s, i) => s + (i.quantity * i.unitPrice), 0)
    },
    { 
      name: 'ترمز', 
      count: inventory.filter(i => i.category === 'ترمز').length,
      value: inventory.filter(i => i.category === 'ترمز').reduce((s, i) => s + (i.quantity * i.unitPrice), 0)
    },
    { 
      name: 'برقی', 
      count: inventory.filter(i => i.category === 'برقی').length,
      value: inventory.filter(i => i.category === 'برقی').reduce((s, i) => s + (i.quantity * i.unitPrice), 0)
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">مدیریت موجودی انبار</h1>
            <p className="text-muted-foreground mt-2">قطعات و مواد مصرفی</p>
          </div>
          <Button className="gap-2">
            <Package className="h-4 w-4" />
            افزودن قطعه
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-card hover:shadow-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">کل اقلام</CardTitle>
              <Boxes className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{inventory.length}</div>
              <p className="text-xs text-muted-foreground mt-1">{totalItems} عدد موجودی</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">کمبود موجودی</CardTitle>
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{lowStockItems}</div>
              <p className="text-xs text-muted-foreground mt-1">قلم نیاز به سفارش</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ارزش کل</CardTitle>
              <TrendingUp className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                {(totalValue / 1000000).toFixed(1)} م
              </div>
              <p className="text-xs text-muted-foreground mt-1">تومان</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">دسته‌بندی‌ها</CardTitle>
              <Package className="h-5 w-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">{categoryData.length}</div>
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
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">تعداد اقلام:</span>
                  <span className="font-medium">{cat.count}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ارزش:</span>
                  <span className="font-medium">{(cat.value / 1000000).toFixed(1)} م</span>
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
                          <div className={`font-bold ${status.color}`}>{item.quantity} عدد</div>
                          <Progress value={stockPercentage} className="w-24" />
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{item.minQuantity} عدد</TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell>{item.unitPrice.toLocaleString()} ت</TableCell>
                      <TableCell className="text-sm">{item.supplier}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.location}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(item.lastRestocked).toLocaleDateString('fa-IR')}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Inventory;
