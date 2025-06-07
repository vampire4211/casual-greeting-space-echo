
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const UserManagement = () => {
  const users = [
    {
      id: 1,
      name: "Priya Sharma",
      email: "priya@example.com",
      type: "Customer",
      status: "Active",
      joinDate: "2023-01-15"
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      type: "Vendor",
      status: "Active",
      joinDate: "2023-02-20"
    }
  ];

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
