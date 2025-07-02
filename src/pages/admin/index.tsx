
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import DashboardStats from './components/DashboardStats';
import VendorManagement from './components/VendorManagement';
import CategoryManagement from './components/CategoryManagement';
import UserManagement from './components/UserManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminPanel = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-foreground mb-8">Admin Panel</h1>
          
          <DashboardStats />
          
          <Tabs defaultValue="vendors" className="mt-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="vendors">Vendors</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="vendors" className="mt-6">
              <VendorManagement />
            </TabsContent>
            
            <TabsContent value="users" className="mt-6">
              <UserManagement />
            </TabsContent>
            
            <TabsContent value="categories" className="mt-6">
              <CategoryManagement />
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-6">
              <div className="text-center py-20">
                <h3 className="text-2xl font-semibold mb-4">Analytics Dashboard</h3>
                <p className="text-muted-foreground">Detailed analytics and reporting tools</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
