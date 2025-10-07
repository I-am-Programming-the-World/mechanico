import { useState } from 'react';
import { getInvoices, getExpenses, getBookings, saveInvoices, saveExpenses } from '@/lib/storage';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, TrendingUp, TrendingDown, FileText, Plus, Download } from 'lucide-react';
import { toast } from 'sonner';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Accounting = () => {
  const [invoices, setInvoices] = useState(getInvoices());
  const [expenses, setExpenses] = useState(getExpenses());
  const bookings = getBookings();
  const [newExpense, setNewExpense] = useState({
    category: '',
    description: '',
    amount: 0,
    paymentMethod: '',
  });

  const totalIncome = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalIncome - totalExpenses;
  const pendingPayments = invoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((sum, i) => sum + i.total, 0);

  const monthlyData = [
    { month: 'فروردین', income: 12500000, expense: 8200000, profit: 4300000 },
    { month: 'اردیبهشت', income: 15800000, expense: 9500000, profit: 6300000 },
    { month: 'خرداد', income: 18200000, expense: 10800000, profit: 7400000 },
    { month: 'تیر', income: 22000000, expense: 12500000, profit: 9500000 },
    { month: 'مرداد', income: 25600000, expense: 14200000, profit: 11400000 },
    { month: 'شهریور', income: 20400000, expense: 11800000, profit: 8600000 },
  ];

  const handleAddExpense = () => {
    if (!newExpense.category || !newExpense.description || newExpense.amount <= 0) {
      toast.error('لطفاً تمام فیلدها را پر کنید');
      return;
    }

    const expense = {
      id: Date.now().toString(),
      ...newExpense,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const updatedExpenses = [...expenses, expense];
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
    setNewExpense({ category: '', description: '', amount: 0, paymentMethod: '' });
    toast.success('هزینه با موفقیت ثبت شد');
  };

  const getInvoiceStatus = (status: string) => {
    const variants: Record<string, any> = {
      paid: 'default',
      sent: 'secondary',
      overdue: 'destructive',
      draft: 'outline',
      cancelled: 'destructive',
    };
    return variants[status] || 'secondary';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      paid: 'پرداخت شده',
      sent: 'ارسال شده',
      overdue: 'معوق',
      draft: 'پیش‌نویس',
      cancelled: 'لغو شده',
    };
    return labels[status] || status;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">حسابداری مالی</h1>
            <p className="text-muted-foreground mt-2">مدیریت درآمد، هزینه‌ها و صورتحساب‌ها</p>
          </div>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            دانلود گزارش
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-card hover:shadow-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">درآمد کل</CardTitle>
              <TrendingUp className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                {(totalIncome / 1000000).toFixed(1)} م
              </div>
              <p className="text-xs text-muted-foreground mt-1">تومان</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">هزینه‌ها</CardTitle>
              <TrendingDown className="h-5 w-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">
                {(totalExpenses / 1000000).toFixed(1)} م
              </div>
              <p className="text-xs text-muted-foreground mt-1">تومان</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">سود خالص</CardTitle>
              <DollarSign className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {(netProfit / 1000000).toFixed(1)} م
              </div>
              <p className="text-xs text-muted-foreground mt-1">تومان</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">در انتظار دریافت</CardTitle>
              <FileText className="h-5 w-5 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">
                {(pendingPayments / 1000000).toFixed(1)} م
              </div>
              <p className="text-xs text-muted-foreground mt-1">تومان</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>روند مالی ماهانه</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="hsl(var(--success))" strokeWidth={2} name="درآمد" />
                  <Line type="monotone" dataKey="expense" stroke="hsl(var(--destructive))" strokeWidth={2} name="هزینه" />
                  <Line type="monotone" dataKey="profit" stroke="hsl(var(--primary))" strokeWidth={2} name="سود" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>مقایسه درآمد و هزینه</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="hsl(var(--success))" name="درآمد" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="expense" fill="hsl(var(--destructive))" name="هزینه" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="invoices" className="space-y-4">
          <TabsList>
            <TabsTrigger value="invoices">صورتحساب‌ها</TabsTrigger>
            <TabsTrigger value="expenses">هزینه‌ها</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>صورتحساب‌ها</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>شماره فاکتور</TableHead>
                      <TableHead>تاریخ</TableHead>
                      <TableHead>سررسید</TableHead>
                      <TableHead>مبلغ</TableHead>
                      <TableHead>وضعیت</TableHead>
                      <TableHead>عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                        <TableCell>{new Date(invoice.date).toLocaleDateString('fa-IR')}</TableCell>
                        <TableCell>{new Date(invoice.dueDate).toLocaleDateString('fa-IR')}</TableCell>
                        <TableCell>{invoice.total.toLocaleString()} تومان</TableCell>
                        <TableCell>
                          <Badge variant={getInvoiceStatus(invoice.status)}>
                            {getStatusLabel(invoice.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            مشاهده
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses">
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>هزینه‌ها</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      ثبت هزینه جدید
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>ثبت هزینه جدید</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>دسته‌بندی</Label>
                        <Select value={newExpense.category} onValueChange={(v) => setNewExpense({...newExpense, category: v})}>
                          <SelectTrigger>
                            <SelectValue placeholder="انتخاب دسته‌بندی" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="قطعات">قطعات</SelectItem>
                            <SelectItem value="اجاره">اجاره</SelectItem>
                            <SelectItem value="برق و آب">برق و آب</SelectItem>
                            <SelectItem value="حقوق">حقوق</SelectItem>
                            <SelectItem value="نگهداری">نگهداری</SelectItem>
                            <SelectItem value="سایر">سایر</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>توضیحات</Label>
                        <Input 
                          value={newExpense.description}
                          onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                          placeholder="توضیحات هزینه"
                        />
                      </div>
                      <div>
                        <Label>مبلغ (تومان)</Label>
                        <Input 
                          type="number"
                          value={newExpense.amount || ''}
                          onChange={(e) => setNewExpense({...newExpense, amount: Number(e.target.value)})}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label>روش پرداخت</Label>
                        <Select value={newExpense.paymentMethod} onValueChange={(v) => setNewExpense({...newExpense, paymentMethod: v})}>
                          <SelectTrigger>
                            <SelectValue placeholder="انتخاب روش پرداخت" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="نقدی">نقدی</SelectItem>
                            <SelectItem value="کارت بانکی">کارت بانکی</SelectItem>
                            <SelectItem value="چک">چک</SelectItem>
                            <SelectItem value="انتقال بانکی">انتقال بانکی</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleAddExpense} className="w-full">
                        ثبت هزینه
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>دسته‌بندی</TableHead>
                      <TableHead>توضیحات</TableHead>
                      <TableHead>مبلغ</TableHead>
                      <TableHead>تاریخ</TableHead>
                      <TableHead>روش پرداخت</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>
                          <Badge variant="outline">{expense.category}</Badge>
                        </TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell className="font-medium">{expense.amount.toLocaleString()} تومان</TableCell>
                        <TableCell>{new Date(expense.date).toLocaleDateString('fa-IR')}</TableCell>
                        <TableCell>{expense.paymentMethod}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Accounting;
