
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const VendorManagement = () => {
  const vendors = [
    {
      id: 1,
      name: "Royal Photography Studio",
      category: "Photography",
      status: "Active",
      rating: 4.8,
      joinDate: "2023-01-15"
    },
    {
      id: 2,
      name: "Elegant Decor Solutions",
      category: "Decoration",
      status: "Pending",
      rating: 4.6,
      joinDate: "2023-02-20"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendor Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">{vendor.name}</h3>
                <p className="text-sm text-muted-foreground">{vendor.category}</p>
                <p className="text-xs text-muted-foreground">Joined: {vendor.joinDate}</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={vendor.status === 'Active' ? 'default' : 'secondary'}>
                  {vendor.status}
                </Badge>
                <span className="text-sm">⭐ {vendor.rating}</span>
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

export default VendorManagement;
