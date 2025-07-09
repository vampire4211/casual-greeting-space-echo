import { supabase } from '@/integrations/supabase/client';

export interface VendorImage {
  vendor_id: string;
  image_url: string;
  uploaded_at: string;
  title?: string;
  description?: string;
}

class ImageService {
  // Get vendor images from PostgreSQL
  async getVendorImages(vendorId: string): Promise<VendorImage[]> {
    try {
      const { data, error } = await supabase
        .from('vendor_images')
        .select('*')
        .eq('vendor_id', vendorId)
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.error('Error fetching vendor images:', error);
        return this.getMockImages(vendorId);
      }

      return data?.map(img => ({
        vendor_id: img.vendor_id,
        image_url: img.image_url,
        uploaded_at: img.uploaded_at,
        title: img.title,
        description: img.description
      })) || this.getMockImages(vendorId);
    } catch (error) {
      console.error('Error fetching vendor images:', error);
      return this.getMockImages(vendorId);
    }
  }

  // Mock images fallback
  private getMockImages(vendorId: string): VendorImage[] {
    return [
      {
        vendor_id: vendorId,
        image_url: '/lovable-uploads/1b617e92-9eed-43c3-930b-89645adc6360.png',
        uploaded_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        title: 'Wedding Photography',
        description: 'Beautiful wedding ceremony shots'
      },
      {
        vendor_id: vendorId,
        image_url: '/lovable-uploads/3a0f2692-b04e-4871-bc8b-32f28d04b408.png',
        uploaded_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        title: 'Portrait Session',
        description: 'Professional portrait photography'
      },
      {
        vendor_id: vendorId,
        image_url: '/lovable-uploads/845ac0b0-e94e-4bd1-a2aa-1d4cdf30190f.png',
        uploaded_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        title: 'Event Coverage',
        description: 'Corporate event photography'
      }
    ];
  }

  // Save image metadata to PostgreSQL
  async saveImageMetadata(vendorId: string, imageUrl: string, title?: string, description?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('vendor_images')
        .insert({
          vendor_id: vendorId,
          image_url: imageUrl,
          title,
          description
        });

      if (error) {
        console.error('Error saving image metadata:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving image metadata:', error);
      return false;
    }
  }

  // Delete image metadata from PostgreSQL
  async deleteImageMetadata(vendorId: string, imageUrl: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('vendor_images')
        .delete()
        .eq('vendor_id', vendorId)
        .eq('image_url', imageUrl);

      if (error) {
        console.error('Error deleting image metadata:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting image metadata:', error);
      return false;
    }
  }

  // Upload image to Supabase Storage and save metadata to PostgreSQL
  async uploadVendorImage(
    vendorId: string, 
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

      // Save metadata to PostgreSQL
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