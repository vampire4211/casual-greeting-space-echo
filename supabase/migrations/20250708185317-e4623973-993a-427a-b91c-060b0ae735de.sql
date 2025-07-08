-- Create vendor-images storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'vendor-images', 
  'vendor-images', 
  true, 
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Create RLS policies for vendor-images bucket
CREATE POLICY "Vendor images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'vendor-images');

CREATE POLICY "Vendors can upload their own images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'vendor-images' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Vendors can update their own images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'vendor-images' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Vendors can delete their own images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'vendor-images' 
  AND auth.uid() IS NOT NULL
);