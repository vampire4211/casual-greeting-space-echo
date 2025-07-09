import { useState, useEffect } from 'react';
import { categoriesAPI } from '@/services/api';

interface HomepageImage {
  id: number;
  section: 'hero' | 'trending_carousel';
  slot_number: number;
  image_url: string;
  image_name: string;
  alt_text: string;
  title: string;
  description: string;
  created_at: string;
}

export const useHomepageImages = (section?: string) => {
  const [images, setImages] = useState<HomepageImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await categoriesAPI.getHomepageImages(section);
      setImages(response.data.images || []);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch images';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (formData: FormData) => {
    try {
      const response = await categoriesAPI.uploadHomepageImage(formData);
      await fetchImages(); // Refresh images after upload
      return { success: true, data: response.data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to upload image';
      return { success: false, error: errorMessage };
    }
  };

  const downloadImage = async (imageId: number) => {
    try {
      const response = await categoriesAPI.downloadImage(imageId);
      
      // Create blob URL for download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `image-${imageId}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to download image';
      return { success: false, error: errorMessage };
    }
  };

  useEffect(() => {
    fetchImages();
  }, [section]);

  return {
    images,
    loading,
    error,
    refetch: fetchImages,
    uploadImage,
    downloadImage,
    // Helper functions to get specific sections
    heroImages: images.filter(img => img.section === 'hero'),
    carouselImages: images.filter(img => img.section === 'trending_carousel'),
  };
};