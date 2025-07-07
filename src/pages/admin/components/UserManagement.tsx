
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCustomers } from '@/hooks/useCustomers';
import { useVendors } from '@/hooks/useVendors';

const UserManagement = () => {
  const { customers, loading: customersLoading } = useCustomers();
  const { vendors, loading: vendorsLoading } = useVendors();

  const users = [
    ...customers.map(customer => ({
      id: customer.id,
      name: customer.name || 'Unknown Customer',
      email: customer.email,
      type: 'Customer',
      status: 'Active',
      joinDate: new Date(customer.created_at || '').toLocaleDateString()
    })),
    ...vendors.slice(0, 10).map(vendor => ({
      id: vendor.id,
      name: vendor.vendor_name || vendor.business_name || 'Unknown Vendor',
      email: vendor.email,
      type: 'Vendor',
      status: 'Active',
      joinDate: new Date(vendor.created_at || '').toLocaleDateString()
    }))
  ];

  if (customersLoading || vendorsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading users...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground">Joined: {user.joinDate}</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={user.type === 'Vendor' ? 'default' : 'secondary'}>
                  {user.type}
                </Badge>
                <Badge variant={user.status === 'Active' ? 'default' : 'destructive'}>
                  {user.status}
                </Badge>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">View</Button>
                  <Button size="sm" variant="outline">Edit</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
