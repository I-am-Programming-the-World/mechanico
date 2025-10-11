import type { User as UserRecord } from '@/lib/storage';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { BadgeProps } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, User, Shield, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { useData } from '@/contexts/DataContext';
import { formatNumber } from '@/lib/utils';

const Users = () => {
  const { users, updateUserApproval } = useData();

  const handleApprove = (userId: string) => {
    updateUserApproval(userId, true);
    toast.success('کاربر تأیید شد');
  };

  const handleReject = (userId: string) => {
    updateUserApproval(userId, false);
    toast.success('تأیید کاربر لغو شد');
  };

  const getRoleIcon = (role: UserRecord['role']) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'provider':
        return <Wrench className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleLabel = (role: UserRecord['role']) => {
    const labels: Record<UserRecord['role'], string> = {
      admin: 'مدیر',
      provider: 'ارائه‌دهنده',
      customer: 'مشتری',
    };
    return labels[role] || role;
  };

  const roleBadgeVariants: Record<UserRecord['role'], NonNullable<BadgeProps['variant']>> = {
    admin: 'destructive',
    provider: 'default',
    customer: 'secondary',
  };

  const getRoleBadgeVariant = (role: UserRecord['role']) => {
    return roleBadgeVariants[role];
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">مدیریت کاربران</h1>
          <p className="text-muted-foreground mt-2">
            مدیریت و تأیید کاربران پلتفرم
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <User className="h-8 w-8 text-primary mx-auto" />
                <p className="text-2xl font-bold">{formatNumber(users.length)}</p>
                <p className="text-sm text-muted-foreground">کل کاربران</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <User className="h-8 w-8 text-secondary mx-auto" />
                <p className="text-2xl font-bold">{formatNumber(users.filter(u => u.role === 'customer').length)}</p>
                <p className="text-sm text-muted-foreground">مشتریان</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <Wrench className="h-8 w-8 text-accent mx-auto" />
                <p className="text-2xl font-bold">{formatNumber(users.filter(u => u.role === 'provider').length)}</p>
                <p className="text-sm text-muted-foreground">ارائه‌دهندگان</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <CheckCircle className="h-8 w-8 text-success mx-auto" />
                <p className="text-2xl font-bold">{formatNumber(users.filter(u => u.isApproved).length)}</p>
                <p className="text-sm text-muted-foreground">تأیید شده</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardContent className="p-0">
            <DataTable>
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>نام کامل</TableHead>
                  <TableHead>ایمیل</TableHead>
                  <TableHead>تلفن</TableHead>
                  <TableHead>نقش</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.fullName}</TableCell>
                    <TableCell dir="ltr" className="text-right">{user.email}</TableCell>
                    <TableCell dir="ltr" className="text-right">{user.phone}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)} className="gap-1">
                        {getRoleIcon(user.role)}
                        {getRoleLabel(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.isApproved ? (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          تأیید شده
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <XCircle className="h-3 w-3" />
                          در انتظار
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.role !== 'admin' && (
                        <div className="flex gap-2">
                          {!user.isApproved && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApprove(user.id)}
                            >
                              تأیید
                            </Button>
                          )}
                          {user.isApproved && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(user.id)}
                            >
                              لغو تأیید
                            </Button>
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              </Table>
            </DataTable>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Users;
