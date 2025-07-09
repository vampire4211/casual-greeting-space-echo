
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useVendors } from '@/hooks/useVendors';

const VendorManagement = () => {
  const { vendors, loading } = useVendors();

  const vendorsData = vendors.slice(0, 10).map(vendor => ({
    id: vendor.id,
    name: vendor.business_name || vendor.vendor_name || 'Unknown Vendor',
    category: vendor.categories?.[0] || 'Unknown',
    status: 'Active',
    rating: vendor.rating || 4.5,
    joinDate: new Date(vendor.created_at || '').toLocaleDateString()
  }));

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vendor Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading vendors...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendor Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {vendorsData.map((vendor) => (
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
