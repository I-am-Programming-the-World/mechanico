import { useState } from 'react';
import { getEmployees, getUsers, saveEmployees } from '@/lib/storage';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Users, UserPlus, TrendingUp, Award, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const Employees = () => {
  const [employees] = useState(getEmployees());
  const users = getUsers();

  const getEmployeeUser = (userId: string) => {
    return users.find(u => u.id === userId);
  };

  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const avgPerformance = employees.reduce((sum, e) => sum + e.performance, 0) / employees.length;
  const totalSalary = employees.reduce((sum, e) => sum + e.salary, 0);

  const departmentData = [
    { name: 'فنی', value: employees.filter(e => e.department === 'فنی').length },
    { name: 'مدیریت', value: 1 },
    { name: 'خدمات', value: 2 },
  ];

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))'];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: 'default',
      inactive: 'secondary',
      'on-leave': 'outline',
    };
    return variants[status] || 'secondary';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: 'فعال',
      inactive: 'غیرفعال',
      'on-leave': 'مرخصی',
    };
    return labels[status] || status;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">مدیریت کارکنان</h1>
            <p className="text-muted-foreground mt-2">اطلاعات و عملکرد کارکنان</p>
          </div>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            افزودن کارمند
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-card hover:shadow-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">کل کارکنان</CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{employees.length}</div>
              <p className="text-xs text-muted-foreground mt-1">{activeEmployees} نفر فعال</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">میانگین عملکرد</CardTitle>
              <TrendingUp className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{avgPerformance.toFixed(0)}%</div>
              <Progress value={avgPerformance} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">هزینه حقوق ماهانه</CardTitle>
              <Award className="h-5 w-5 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">
                {(totalSalary / 1000000).toFixed(1)} م
              </div>
              <p className="text-xs text-muted-foreground mt-1">تومان</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">میانگین سابقه</CardTitle>
              <Clock className="h-5 w-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">1.8</div>
              <p className="text-xs text-muted-foreground mt-1">سال</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>توزیع بخش‌ها</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>عملکرد کارکنان</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {employees.map((employee) => {
                const user = getEmployeeUser(employee.userId);
                return (
                  <div key={employee.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{user?.fullName}</span>
                      <span className="text-muted-foreground">{employee.performance}%</span>
                    </div>
                    <Progress value={employee.performance} />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>لیست کارکنان</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
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
                      <TableCell>{(employee.salary / 1000000).toFixed(1)} میلیون</TableCell>
                      <TableCell>{new Date(employee.hireDate).toLocaleDateString('fa-IR')}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={employee.performance} className="w-16" />
                          <span className="text-sm">{employee.performance}%</span>
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
                              +{employee.skills.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(employee.status)}>
                          {getStatusLabel(employee.status)}
                        </Badge>
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

export default Employees;
