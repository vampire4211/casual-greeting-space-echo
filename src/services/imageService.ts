import { supabase } from '@/integrations/supabase/client';

export interface VendorImage {
  vendor_id: number;
  image_url: string;
  uploaded_at: string;
  title?: string;
  description?: string;
}

class ImageService {
  // Get all images for a vendor from MongoDB
  async getVendorImages(vendorId: number): Promise<VendorImage[]> {
    try {
      const response = await fetch(`https://mwjrrhluqiuchczgzzld.supabase.co/functions/v1/mongodb-images?vendor_id=${vendorId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13anJyaGx1cWl1Y2hjemd6emxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NjQ2NzUsImV4cCI6MjA2NjU0MDY3NX0.edj3Fr98TQJEeOalOntC4FUZgsrm0QvJXsf5Bz3zB9Y`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch vendor images');
      
      const data = await response.json();
      return data.images || [];
    } catch (error) {
      console.error('Error fetching vendor images:', error);
      return [];
    }
  }

  // Save image metadata to MongoDB
  async saveImageMetadata(vendorId: number, imageUrl: string, title?: string, description?: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('mongodb-images', {
        body: {
          vendor_id: vendorId,
          image_url: imageUrl,
          title,
          description
        }
      });

      if (error) throw error;
      
      return data.success;
    } catch (error) {
      console.error('Error saving image metadata:', error);
      return false;
    }
  }

  // Delete image metadata from MongoDB
  async deleteImageMetadata(vendorId: number, imageUrl: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('mongodb-images', {
        body: {
          vendor_id: vendorId,
          image_url: imageUrl
        }
      });

      if (error) throw error;
      
      return data.success;
    } catch (error) {
      console.error('Error deleting image metadata:', error);
      return false;
    }
  }

  // Upload image to Supabase Storage and save metadata to MongoDB
  async uploadVendorImage(
    vendorId: number, 
    file: File, 
    title?: string, 
    description?: string
  ): Promise<{ success: boolean; imageUrl?: string }> {
    try {
      // Upload to Supabase Storage
      const fileName = `${vendorId}/${Date.now()}_${file.name}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('vendor-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('vendor-images')
        .getPublicUrl(fileName);

      // Save metadata to MongoDB
      const metadataSaved = await this.saveImageMetadata(vendorId, publicUrl, title, description);

      if (!metadataSaved) {
        // If metadata save fails, delete the uploaded file
        await supabase.storage.from('vendor-images').remove([fileName]);
        throw new Error('Failed to save image metadata');
      }

      return { success: true, imageUrl: publicUrl };
    } catch (error) {
      console.error('Error uploading vendor image:', error);
      return { success: false };
    }
  }
}

export const imageService = new ImageService();