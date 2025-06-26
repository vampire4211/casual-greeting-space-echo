
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardStats from './components/DashboardStats';
import UserManagement from './components/UserManagement';
import VendorManagement from './components/VendorManagement';
import CategoryManagement from './components/CategoryManagement';
import ImageManagement from './components/ImageManagement';
import { BarChart3, Users, Building2, Tags, Image } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="vendors" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Vendors
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Tags className="w-4 h-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            Images
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <DashboardStats />
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="vendors" className="space-y-6">
          <VendorManagement />
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <CategoryManagement />
        </TabsContent>

        <TabsContent value="images" className="space-y-6">
          <ImageManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
