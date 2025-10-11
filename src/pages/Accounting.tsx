import { useMemo, useState } from 'react';
import type { Invoice, Expense } from '@/lib/storage';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { BadgeProps } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, TrendingUp, TrendingDown, FileText, Plus, Download, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { useData } from '@/contexts/DataContext';
import { formatCurrency, formatMillions } from '@/lib/utils';

const Accounting = () => {
  const { invoices, expenses, addExpense, updateInvoiceStatus } = useData();
  type NewExpenseForm = Pick<Expense, 'category' | 'description' | 'amount' | 'paymentMethod'>;
  const [newExpense, setNewExpense] = useState<NewExpenseForm>({
    category: '',
    description: '',
    amount: 0,
    paymentMethod: '',
  });

  const totalIncome = useMemo(() => invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0), [invoices]);
  const totalExpenses = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
  const netProfit = totalIncome - totalExpenses;
  const pendingPayments = useMemo(
    () => invoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((sum, i) => sum + i.total, 0),
    [invoices]
  );

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

    addExpense({
      ...newExpense,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      invoiceNumber: '',
      providerId: undefined,
    });
    setNewExpense({ category: '', description: '', amount: 0, paymentMethod: '' });
    toast.success('هزینه با موفقیت ثبت شد');
  };

  const handleMarkInvoiceAsPaid = (invoiceId: string) => {
    updateInvoiceStatus(invoiceId, 'paid');
    toast.success('وضعیت صورتحساب به پرداخت‌شده تغییر کرد');
  };

  const invoiceStatusVariants: Record<
    Invoice['status'],
    NonNullable<BadgeProps['variant']>
  > = {
    paid: 'default',
    sent: 'secondary',
    overdue: 'destructive',
    draft: 'outline',
    cancelled: 'destructive',
  };

  const getInvoiceStatus = (status: Invoice['status']) => {
    return invoiceStatusVariants[status] ?? 'secondary';
  };

  const invoiceStatusLabels: Record<Invoice['status'], string> = {
    paid: 'پرداخت شده',
    sent: 'ارسال شده',
    overdue: 'معوق',
    draft: 'پیش‌نویس',
    cancelled: 'لغو شده',
  };

  const getStatusLabel = (status: Invoice['status']) => {
    return invoiceStatusLabels[status] ?? status;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-balance mb-4 md:mb-6 text-2xl md:text-3xl font-bold font-display text-balance font-display text-balance">حسابداری مالی</h1>
            <p className="text-muted-foreground mt-2">مدیریت درآمد، هزینه‌ها و صورتحساب‌ها</p>
          </div>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            دانلود گزارش
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="transition hover:-translate-y-0.5 hover:shadow-lg shadow-card hover:shadow-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">درآمد کل</CardTitle>
              <TrendingUp className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{formatMillions(totalIncome)} م</div>
              <p className="text-xs text-muted-foreground mt-1">تومان</p>
            </CardContent>
          </Card>

          <Card className="transition hover:-translate-y-0.5 hover:shadow-lg shadow-card hover:shadow-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">هزینه‌ها</CardTitle>
              <TrendingDown className="h-5 w-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{formatMillions(totalExpenses)} م</div>
              <p className="text-xs text-muted-foreground mt-1">تومان</p>
            </CardContent>
          </Card>

          <Card className="transition hover:-translate-y-0.5 hover:shadow-lg shadow-card hover:shadow-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">سود خالص</CardTitle>
              <DollarSign className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{formatMillions(netProfit)} م</div>
              <p className="text-xs text-muted-foreground mt-1">تومان</p>
            </CardContent>
          </Card>

          <Card className="transition hover:-translate-y-0.5 hover:shadow-lg shadow-card hover:shadow-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">در انتظار دریافت</CardTitle>
              <FileText className="h-5 w-5 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{formatMillions(pendingPayments)} م</div>
              <p className="text-xs text-muted-foreground mt-1">تومان</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="transition hover:-translate-y-0.5 hover:shadow-lg shadow-card">
            <CardHeader>
              <CardTitle>روند مالی ماهانه</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer>
        <ResponsiveContainer width="100%" height={300}>
                {/*
                  Render the line chart in a left‑to‑right context to prevent
                  tooltip misplacement in RTL containers. We set
                  `reversed` on the X axis so months render from right to left
                  (فروردین to شهریور) while maintaining visual consistency. The
                  Y axis is moved to the right side using `orientation="right"`.
                */}
                <LineChart margin={{ right: 24, left: 8, top: 8, bottom: 0 }} data={monthlyData} style={{ direction: 'ltr' }}>
                  <defs>
  <linearGradient id="gradPrimary" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
  </linearGradient>
</defs>
<CartesianGrid strokeDasharray="3 3" />
                  <XAxis tick={{ textAnchor: "end" }} dataKey="month" reversed />
                  <YAxis tick={{ textAnchor: "end" }} tickFormatter={formatCurrency} orientation="right" />
                  <Tooltip formatter={(value: number) => `${formatCurrency(value)} تومان`} />
                  <Legend verticalAlign="top" align="right" />
                  <Line type="monotone" dataKey="income" stroke="hsl(var(--success))" strokeWidth={2} name="درآمد" />
                  <Line type="monotone" dataKey="expense" stroke="hsl(var(--destructive))" strokeWidth={2} name="هزینه" />
                  <Line type="monotone" dataKey="profit" stroke="hsl(var(--primary))" strokeWidth={2} name="سود" />
                </LineChart>
              </ResponsiveContainer>
      </ChartContainer>
            </CardContent>
          </Card>

          <Card className="transition hover:-translate-y-0.5 hover:shadow-lg shadow-card">
            <CardHeader>
              <CardTitle>مقایسه درآمد و هزینه</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer>
        <ResponsiveContainer width="100%" height={300}>
                {/*
                  Bar chart adjusted for RTL: set `direction: 'ltr'` on the
                  container to fix internal tooltip positioning, reverse the
                  horizontal axis and move the vertical axis to the right.
                */}
                <BarChart data={monthlyData} style={{ direction: 'ltr' }}>
                  <defs>
  <linearGradient id="gradPrimary" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
  </linearGradient>
</defs>
<CartesianGrid strokeDasharray="3 3" />
                  <XAxis tick={{ textAnchor: "end" }} dataKey="month" reversed />
                  <YAxis tick={{ textAnchor: "end" }} tickFormatter={formatCurrency} orientation="right" />
                  <Tooltip formatter={(value: number) => `${formatCurrency(value)} تومان`} />
                  <Legend verticalAlign="top" align="right" />
                  <Bar dataKey="income" fill="hsl(var(--success))" name="درآمد" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="expense" fill="hsl(var(--destructive))" name="هزینه" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
      </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="invoices" className="space-y-4">
        {/*
          Align tab triggers to the right for RTL languages. Using
          `justify-end` places the first tab flush against the right edge of
          the container, which matches Persian reading order. Without this the
          tab list would default to centering content or left‑aligning,
          producing an awkward layout under `dir="rtl"`.
        */}
        <TabsList className="flex flex-wrap justify-end gap-2">
            <TabsTrigger value="invoices">صورتحساب‌ها</TabsTrigger>
            <TabsTrigger value="expenses">هزینه‌ها</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices">
            <Card className="transition hover:-translate-y-0.5 hover:shadow-lg shadow-card">
              <CardHeader>
                <CardTitle>صورتحساب‌ها</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable>
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
                        <TableCell>{formatCurrency(invoice.total)} تومان</TableCell>
                        <TableCell>
                          <Badge variant={getInvoiceStatus(invoice.status)}>
                            {getStatusLabel(invoice.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              مشاهده
                            
  {invoice.status !== 'paid' && (
                              <Button
                                size="sm"
                                className="gap-1"
                                onClick={() => handleMarkInvoiceAsPaid(invoice.id)}
</Button>
                                <CheckCircle2 className="h-4 w-4" />
                                تسویه
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  </Table>
                </DataTable>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses">
            <Card className="transition hover:-translate-y-0.5 hover:shadow-lg shadow-card">
              <CardHeader className="flex flex-wrap items-center justify-between gap-4">
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
                <DataTable>
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
                        <TableCell className="font-medium">{formatCurrency(expense.amount)} تومان</TableCell>
                        <TableCell>{new Date(expense.date).toLocaleDateString('fa-IR')}</TableCell>
                        <TableCell>{expense.paymentMethod}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  </Table>
                </DataTable>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Accounting;