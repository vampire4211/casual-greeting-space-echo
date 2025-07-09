import { supabase } from '@/integrations/supabase/client';

export interface VendorImage {
  vendor_id: number;
  image_url: string;
  uploaded_at: string;
  title?: string;
  description?: string;
}

class ImageService {
  // Get vendor images (mock data)
  async getVendorImages(vendorId: number): Promise<VendorImage[]> {
    // Return mock images
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

  // Save image metadata (mock implementation)
  async saveImageMetadata(vendorId: number, imageUrl: string, title?: string, description?: string): Promise<boolean> {
    // Mock success - in real implementation this would save to database
    console.log('Mock: Saving image metadata', { vendorId, imageUrl, title, description });
    return true;
  }

  // Delete image metadata (mock implementation)
  async deleteImageMetadata(vendorId: number, imageUrl: string): Promise<boolean> {
    // Mock success - in real implementation this would delete from database
    console.log('Mock: Deleting image metadata', { vendorId, imageUrl });
    return true;
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