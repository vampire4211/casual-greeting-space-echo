
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Store, Calendar, DollarSign } from 'lucide-react';

const DashboardStats = () => {
  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      icon: Users,
      change: "+12%"
    },
    {
      title: "Active Vendors",
      value: "456",
      icon: Store,
      change: "+8%"
    },
    {
      title: "Events This Month",
      value: "89",
      icon: Calendar,
      change: "+23%"
    },
    {
      title: "Revenue",
      value: "₹2,34,567",
      icon: DollarSign,
      change: "+15%"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{stat.change}</span> from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
