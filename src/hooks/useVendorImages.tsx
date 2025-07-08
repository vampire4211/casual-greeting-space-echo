import { useState, useEffect } from 'react';
import { imageService, VendorImage } from '@/services/imageService';

export const useVendorImages = (vendorId: number) => {
  const [images, setImages] = useState<VendorImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Fetch vendor images
  const fetchImages = async () => {
    if (!vendorId) return;
    
    try {
      setLoading(true);
      const vendorImages = await imageService.getVendorImages(vendorId);
      setImages(vendorImages);
    } catch (error) {
      console.error('Error fetching vendor images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [vendorId]);

  // Upload new image
  const uploadImage = async (file: File, title?: string, description?: string) => {
    try {
      setUploading(true);
      const result = await imageService.uploadVendorImage(vendorId, file, title, description);
      
      if (result.success) {
        // Refresh images list
        await fetchImages();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error uploading image:', error);
      return false;
    } finally {
      setUploading(false);
    }
  };

  // Delete image
  const deleteImage = async (imageUrl: string) => {
    try {
      const success = await imageService.deleteImageMetadata(vendorId, imageUrl);
      
      if (success) {
        // Remove from local state
        setImages(prev => prev.filter(img => img.image_url !== imageUrl));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  };

  return {
    images,
    loading,
    uploading,
    uploadImage,
    deleteImage,
    refetch: fetchImages
  };
};