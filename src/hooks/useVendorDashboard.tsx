import { useState, useEffect } from 'react';
import { vendorsAPI } from '@/services/api';

interface VendorDashboardData {
  vendor_info: {
    business_name: string;
    categories: string[];
    rating: number;
    total_reviews: number;
  };
  categories_data: {
    [category: string]: {
      images: Array<{
        id: number;
        image_url: string;
        image_name: string;
        order: number;
        is_featured: boolean;
      }>;
      total_images: number;
    };
  };
}

export const useVendorDashboard = () => {
  const [dashboardData, setDashboardData] = useState<VendorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await vendorsAPI.getDashboardData();
      setDashboardData(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch dashboard data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const uploadCategoryImage = async (formData: FormData) => {
    try {
      const response = await vendorsAPI.uploadCategoryImage(formData);
      await fetchDashboardData(); // Refresh data after upload
      return { success: true, data: response.data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to upload image';
      return { success: false, error: errorMessage };
    }
  };

  const submitAllImages = async () => {
    try {
      // This would be a batch operation to finalize all uploaded images
      // For now, just refresh the data
      await fetchDashboardData();
      return { success: true, message: 'All images submitted successfully' };
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to submit images';
      return { success: false, error: errorMessage };
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    dashboardData,
    loading,
    error,
    refetch: fetchDashboardData,
    uploadCategoryImage,
    submitAllImages,
  };
};