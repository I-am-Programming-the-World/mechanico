import { useState } from 'react';
import { getUsers, saveUsers } from '@/lib/storage';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, User, Shield, Wrench } from 'lucide-react';
import { toast } from 'sonner';

const Users = () => {
  const [users, setUsers] = useState(getUsers());

  const handleApprove = (userId: string) => {
    const updatedUsers = users.map(u =>
      u.id === userId ? { ...u, isApproved: true } : u
    );
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
    toast.success('کاربر تأیید شد');
  };

  const handleReject = (userId: string) => {
    const updatedUsers = users.map(u =>
      u.id === userId ? { ...u, isApproved: false } : u
    );
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
    toast.success('تأیید کاربر لغو شد');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'provider':
        return <Wrench className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'مدیر',
      provider: 'ارائه‌دهنده',
      customer: 'مشتری',
    };
    return labels[role] || role;
  };

  const getRoleBadgeVariant = (role: string): any => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'provider':
        return 'default';
      default:
        return 'secondary';
    }
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
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-sm text-muted-foreground">کل کاربران</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <User className="h-8 w-8 text-secondary mx-auto" />
                <p className="text-2xl font-bold">{users.filter(u => u.role === 'customer').length}</p>
                <p className="text-sm text-muted-foreground">مشتریان</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <Wrench className="h-8 w-8 text-accent mx-auto" />
                <p className="text-2xl font-bold">{users.filter(u => u.role === 'provider').length}</p>
                <p className="text-sm text-muted-foreground">ارائه‌دهندگان</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <CheckCircle className="h-8 w-8 text-success mx-auto" />
                <p className="text-2xl font-bold">{users.filter(u => u.isApproved).length}</p>
                <p className="text-sm text-muted-foreground">تأیید شده</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardContent className="p-0">
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
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Users;