import { useMemo, useState } from 'react';
import type { Employee as EmployeeRecord } from '@/lib/storage';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { BadgeProps } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Users, UserPlus, TrendingUp, Award, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';
import { formatMillions, formatNumber, formatPercentage } from '@/lib/utils';

const Employees = () => {
  const { employees, users, addEmployee, updateEmployeeStatus } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    userId: '',
    position: '',
    department: '',
    salary: '',
    hireDate: '',
    skills: '',
  });

  const getEmployeeUser = (userId: string) => {
    return users.find(u => u.id === userId);
  };

  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const avgPerformance = employees.length
    ? employees.reduce((sum, e) => sum + e.performance, 0) / employees.length
    : 0;
  const totalSalary = employees.reduce((sum, e) => sum + e.salary, 0);
  const averageTenureYears = useMemo(() => {
    if (!employees.length) {
      return 0;
    }
    const totalYears = employees.reduce((years, employee) => {
      const hireDate = new Date(employee.hireDate);
      const diffInYears = (Date.now() - hireDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      return Number.isFinite(diffInYears) ? years + diffInYears : years;
    }, 0);
    return totalYears / employees.length;
  }, [employees]);

  const departmentData = useMemo(() => {
    const counts = employees.reduce<Record<string, number>>((acc, employee) => {
      acc[employee.department] = (acc[employee.department] ?? 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [employees]);

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))'];

  const statusVariants: Record<
    EmployeeRecord['status'],
    NonNullable<BadgeProps['variant']>
  > = {
    active: 'default',
    inactive: 'secondary',
    'on-leave': 'outline',
  };

  const getStatusBadge = (status: EmployeeRecord['status']) => {
    return statusVariants[status] ?? 'secondary';
  };

  const statusLabels: Record<EmployeeRecord['status'], string> = {
    active: 'فعال',
    inactive: 'غیرفعال',
    'on-leave': 'مرخصی',
  };

  const getStatusLabel = (status: EmployeeRecord['status']) => {
    return statusLabels[status] ?? status;
  };

  const handleAddEmployee = () => {
    if (!newEmployee.userId || !newEmployee.position || !newEmployee.department || !newEmployee.salary || !newEmployee.hireDate) {
      toast.error('لطفاً تمام فیلدهای ضروری را تکمیل کنید');
      return;
    }

    addEmployee({
      userId: newEmployee.userId,
      position: newEmployee.position,
      department: newEmployee.department,
      salary: Number(newEmployee.salary),
      hireDate: newEmployee.hireDate,
      skills: newEmployee.skills ? newEmployee.skills.split(',').map((skill) => skill.trim()) : [],
      status: 'active',
      performance: 70,
    });

    toast.success('کارمند جدید اضافه شد');
    setNewEmployee({ userId: '', position: '', department: '', salary: '', hireDate: '', skills: '' });
    setIsDialogOpen(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-balance mb-4 md:mb-6 text-2xl md:text-3xl font-bold font-display text-balance font-display text-balance">مدیریت کارکنان</h1>
            <p className="text-muted-foreground mt-2">اطلاعات و عملکرد کارکنان</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                افزودن کارمند
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>ثبت کارمند جدید</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>کاربر مرتبط</Label>
                  <Select value={newEmployee.userId} onValueChange={(value) => setNewEmployee((prev) => ({ ...prev, userId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب کاربر" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.filter((u) => u.role !== 'admin').map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>سمت</Label>
                    <Input value={newEmployee.position} onChange={(event) => setNewEmployee((prev) => ({ ...prev, position: event.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>بخش</Label>
                    <Input value={newEmployee.department} onChange={(event) => setNewEmployee((prev) => ({ ...prev, department: event.target.value }))} />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>حقوق (تومان)</Label>
                    <Input type="number" inputMode="numeric" value={newEmployee.salary} onChange={(event) => setNewEmployee((prev) => ({ ...prev, salary: event.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>تاریخ استخدام</Label>
                    <Input type="date" value={newEmployee.hireDate} onChange={(event) => setNewEmployee((prev) => ({ ...prev, hireDate: event.target.value }))} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>مهارت‌ها (با کاما جدا کنید)</Label>
                  <Textarea rows={3} value={newEmployee.skills} onChange={(event) => setNewEmployee((prev) => ({ ...prev, skills: event.target.value }))} />
                </div>

                <Button onClick={handleAddEmployee} className="w-full">
                  ثبت کارمند
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="transition hover:-translate-y-0.5 hover:shadow-lg shadow-card hover:shadow-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">کل کارکنان</CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{formatNumber(employees.length)}</div>
              <p className="text-xs text-muted-foreground mt-1">{formatNumber(activeEmployees)} نفر فعال</p>
            </CardContent>
          </Card>

          <Card className="transition hover:-translate-y-0.5 hover:shadow-lg shadow-card hover:shadow-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">میانگین عملکرد</CardTitle>
              <TrendingUp className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{formatPercentage(avgPerformance, { maximumFractionDigits: 0 })}</div>
              <Progress value={avgPerformance} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="transition hover:-translate-y-0.5 hover:shadow-lg shadow-card hover:shadow-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">هزینه حقوق ماهانه</CardTitle>
              <Award className="h-5 w-5 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{formatMillions(totalSalary)} م</div>
              <p className="text-xs text-muted-foreground mt-1">تومان</p>
            </CardContent>
          </Card>

          <Card className="transition hover:-translate-y-0.5 hover:shadow-lg shadow-card hover:shadow-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">میانگین سابقه</CardTitle>
              <Clock className="h-5 w-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">{formatNumber(averageTenureYears, { maximumFractionDigits: 1, minimumFractionDigits: 1 })}</div>
              <p className="text-xs text-muted-foreground mt-1">سال</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="transition hover:-translate-y-0.5 hover:shadow-lg shadow-card">
            <CardHeader>
              <CardTitle>توزیع بخش‌ها</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer>
        <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${formatNumber(entry.value)}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatNumber(value)} />
                  <Legend verticalAlign="top" align="right" />
                </PieChart>
              </ResponsiveContainer>
      </ChartContainer>
            </CardContent>
          </Card>

          <Card className="transition hover:-translate-y-0.5 hover:shadow-lg shadow-card">
            <CardHeader>
              <CardTitle>عملکرد کارکنان</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {employees.map((employee) => {
                const user = getEmployeeUser(employee.userId);
                return (
                  <div key={employee.id} className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                      <span className="font-medium">{user?.fullName}</span>
                      <span className="text-muted-foreground">{formatPercentage(employee.performance, { maximumFractionDigits: 0 })}</span>
                    </div>
                    <Progress value={employee.performance} />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <Card className="transition hover:-translate-y-0.5 hover:shadow-lg shadow-card">
          <CardHeader>
            <CardTitle>لیست کارکنان</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable>
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>نام و نام خانوادگی</TableHead>
                  <TableHead>سمت</TableHead>
                  <TableHead>بخش</TableHead>
                  <TableHead>حقوق</TableHead>
                  <TableHead>تاریخ استخدام</TableHead>
                  <TableHead>عملکرد</TableHead>
                  <TableHead>مهارت‌ها</TableHead>
                  <TableHead>وضعیت</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => {
                  const user = getEmployeeUser(employee.userId);
                  return (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{user?.fullName}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{formatMillions(employee.salary)} میلیون</TableCell>
                      <TableCell>{new Date(employee.hireDate).toLocaleDateString('fa-IR')}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={employee.performance} className="w-16" />
                          <span className="text-sm">{formatPercentage(employee.performance, { maximumFractionDigits: 0 })}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {employee.skills.slice(0, 2).map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {employee.skills.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{formatNumber(employee.skills.length - 2)}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={employee.status}
                          onValueChange={(value: EmployeeRecord['status']) => updateEmployeeStatus(employee.id, value)}
                          <SelectTrigger className="w-32">
                            <SelectValue>
                              <Badge variant={getStatusBadge(employee.status)}>
                                {getStatusLabel(employee.status)}
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">فعال</SelectItem>
                            <SelectItem value="inactive">غیرفعال</SelectItem>
                            <SelectItem value="on-leave">مرخصی</SelectItem>
                          </SelectContent>
                        </Select>
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

export default Employees;