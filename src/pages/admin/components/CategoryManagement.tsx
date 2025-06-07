
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';

const CategoryManagement = () => {
  const categories = [
    { id: 1, name: "Photography", vendorCount: 45, description: "Professional photography services" },
    { id: 2, name: "Catering", vendorCount: 32, description: "Food and beverage services" },
    { id: 3, name: "Decoration", vendorCount: 28, description: "Event decoration and styling" },
    { id: 4, name: "Venues", vendorCount: 15, description: "Event venues and locations" }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Category Management</CardTitle>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
                <p className="text-xs text-muted-foreground">{category.vendorCount} vendors</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryManagement;
