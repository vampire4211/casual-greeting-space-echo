-- Create vendor_images table
CREATE TABLE public.vendor_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL,
  vendor_id UUID NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('customer', 'vendor')),
  message TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key constraints
ALTER TABLE public.vendor_images 
ADD CONSTRAINT vendor_images_vendor_id_fkey 
FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE CASCADE;

ALTER TABLE public.chat_messages 
ADD CONSTRAINT chat_messages_customer_id_fkey 
FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;

ALTER TABLE public.chat_messages 
ADD CONSTRAINT chat_messages_vendor_id_fkey 
FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE public.vendor_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for vendor_images
CREATE POLICY "Everyone can view vendor images" 
ON public.vendor_images 
FOR SELECT 
USING (true);

CREATE POLICY "Vendors can manage their own images" 
ON public.vendor_images 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.vendors 
  WHERE vendors.id = vendor_images.vendor_id 
  AND vendors.user_id = auth.uid()
));

-- Create RLS policies for chat_messages
CREATE POLICY "Users can view their own chat messages" 
ON public.chat_messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.customers 
    WHERE customers.id = chat_messages.customer_id 
    AND customers.user_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM public.vendors 
    WHERE vendors.id = chat_messages.vendor_id 
    AND vendors.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their own chat messages" 
ON public.chat_messages 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.customers 
    WHERE customers.id = chat_messages.customer_id 
    AND customers.user_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM public.vendors 
    WHERE vendors.id = chat_messages.vendor_id 
    AND vendors.user_id = auth.uid()
  )
);

-- Create triggers for updated_at
CREATE TRIGGER update_vendor_images_updated_at
BEFORE UPDATE ON public.vendor_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample vendor data
INSERT INTO public.vendors (vendor_name, business_name, email, phone_number, address, categories, pan, aadhar, gst) VALUES
('Rajesh Photography', 'Rajesh Studio', 'rajesh@photo.com', '+91-9876543210', 'MG Road, Bangalore', ARRAY['Photography'], 'ABCDE1234F', '123456789012', '29ABCDE1234F1Z5'),
('Meera Catering', 'Meera Foods', 'meera@catering.com', '+91-9876543211', 'Brigade Road, Bangalore', ARRAY['Catering'], 'FGHIJ5678K', '123456789013', '29FGHIJ5678K1Z6'),
('Arjun Music', 'Arjun Band', 'arjun@music.com', '+91-9876543212', 'Koramangala, Bangalore', ARRAY['Music'], 'LMNOP9012Q', '123456789014', '29LMNOP9012Q1Z7'),
('Priya Decorations', 'Priya Events', 'priya@decor.com', '+91-9876543213', 'Indiranagar, Bangalore', ARRAY['Decoration'], 'RSTUV3456W', '123456789015', '29RSTUV3456W1Z8'),
('Vikram DJ', 'Vikram Sounds', 'vikram@dj.com', '+91-9876543214', 'Whitefield, Bangalore', ARRAY['DJ'], 'XYZAB7890C', '123456789016', '29XYZAB7890C1Z9'),
('Sneha Makeup', 'Sneha Beauty', 'sneha@makeup.com', '+91-9876543215', 'Jayanagar, Bangalore', ARRAY['Makeup'], 'DEFGH1234I', '123456789017', '29DEFGH1234I1Z0');

-- Insert vendor details with ratings and reviews
INSERT INTO public.vendor_details (vendor_id, overall_gr, review, subscription, email, no_of_images, question_com) 
SELECT 
  v.id,
  (RANDOM() * 2 + 3)::NUMERIC(3,1), -- Rating between 3.0 and 5.0
  CASE 
    WHEN ROW_NUMBER() OVER () % 6 = 1 THEN 'Excellent service, highly professional and delivered amazing results!'
    WHEN ROW_NUMBER() OVER () % 6 = 2 THEN 'Great quality work, very satisfied with the outcome.'
    WHEN ROW_NUMBER() OVER () % 6 = 3 THEN 'Good service, would recommend to others.'
    WHEN ROW_NUMBER() OVER () % 6 = 4 THEN 'Professional approach and timely delivery.'
    WHEN ROW_NUMBER() OVER () % 6 = 5 THEN 'Amazing creativity and attention to detail.'
    ELSE 'Wonderful experience, exceeded expectations!'
  END,
  CASE 
    WHEN ROW_NUMBER() OVER () % 3 = 1 THEN 'Premium'
    WHEN ROW_NUMBER() OVER () % 3 = 2 THEN 'Standard'
    ELSE 'Basic'
  END,
  v.email,
  (RANDOM() * 50 + 10)::INTEGER, -- 10-60 images
  'Available for bookings, contact for custom packages and pricing.'
FROM public.vendors v;

-- Insert sample vendor images
INSERT INTO public.vendor_images (vendor_id, image_url, title, description)
SELECT 
  v.id,
  CASE 
    WHEN ROW_NUMBER() OVER () % 3 = 1 THEN '/lovable-uploads/1b617e92-9eed-43c3-930b-89645adc6360.png'
    WHEN ROW_NUMBER() OVER () % 3 = 2 THEN '/lovable-uploads/3a0f2692-b04e-4871-bc8b-32f28d04b408.png'
    ELSE '/lovable-uploads/845ac0b0-e94e-4bd1-a2aa-1d4cdf30190f.png'
  END,
  CASE 
    WHEN v.categories && ARRAY['Photography'] THEN 'Wedding Photography Portfolio'
    WHEN v.categories && ARRAY['Catering'] THEN 'Catering Service Gallery'
    WHEN v.categories && ARRAY['Music'] THEN 'Live Performance'
    WHEN v.categories && ARRAY['Decoration'] THEN 'Event Decoration Setup'
    WHEN v.categories && ARRAY['DJ'] THEN 'DJ Setup & Equipment'
    ELSE 'Service Portfolio'
  END,
  CASE 
    WHEN v.categories && ARRAY['Photography'] THEN 'Professional wedding and event photography'
    WHEN v.categories && ARRAY['Catering'] THEN 'Delicious food and catering services'
    WHEN v.categories && ARRAY['Music'] THEN 'Live music performance for events'
    WHEN v.categories && ARRAY['Decoration'] THEN 'Beautiful event decorations and themes'
    WHEN v.categories && ARRAY['DJ'] THEN 'Professional DJ services and sound systems'
    ELSE 'Professional service portfolio'
  END
FROM public.vendors v;

-- Insert additional images for variety
INSERT INTO public.vendor_images (vendor_id, image_url, title, description)
SELECT 
  v.id,
  CASE 
    WHEN ROW_NUMBER() OVER () % 3 = 1 THEN '/lovable-uploads/3a0f2692-b04e-4871-bc8b-32f28d04b408.png'
    WHEN ROW_NUMBER() OVER () % 3 = 2 THEN '/lovable-uploads/845ac0b0-e94e-4bd1-a2aa-1d4cdf30190f.png'
    ELSE '/lovable-uploads/1b617e92-9eed-43c3-930b-89645adc6360.png'
  END,
  'Recent Work Sample',
  'Recent project showcasing our professional services'
FROM public.vendors v;