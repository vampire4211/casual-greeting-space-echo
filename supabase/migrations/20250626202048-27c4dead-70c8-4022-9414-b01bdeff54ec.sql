
-- Create hero section images table
CREATE TABLE public.hero_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create carousel images table
CREATE TABLE public.carousel_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customer profiles table
CREATE TABLE public.customer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  phone_number TEXT,
  location TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vendor visits tracking table
CREATE TABLE public.vendor_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customer_profiles(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES public.vendor_profiles(id) ON DELETE CASCADE,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  page_type TEXT DEFAULT 'profile'
);

-- Create chat initiations tracking table
CREATE TABLE public.chat_initiations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customer_profiles(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES public.vendor_profiles(id) ON DELETE CASCADE,
  initiated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(customer_id, vendor_id)
);

-- Create booking interactions table
CREATE TABLE public.booking_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customer_profiles(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES public.vendor_profiles(id) ON DELETE CASCADE,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '10 days'),
  customer_response TEXT CHECK (customer_response IN ('yes', 'no', 'pending')) DEFAULT 'pending',
  responded_at TIMESTAMP WITH TIME ZONE,
  whatsapp_number TEXT,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(customer_id, vendor_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.hero_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carousel_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_initiations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_interactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for hero_images (admin only for modifications, public for viewing)
CREATE POLICY "Everyone can view hero images" ON public.hero_images FOR SELECT USING (true);
CREATE POLICY "Admin can manage hero images" ON public.hero_images FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND user_type = 'admin')
);

-- RLS policies for carousel_images (admin only for modifications, public for viewing)
CREATE POLICY "Everyone can view carousel images" ON public.carousel_images FOR SELECT USING (true);
CREATE POLICY "Admin can manage carousel images" ON public.carousel_images FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND user_type = 'admin')
);

-- RLS policies for customer_profiles
CREATE POLICY "Customers can view their own profile" ON public.customer_profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND user_type = 'customer') AND
  user_id = auth.uid()
);
CREATE POLICY "Customers can update their own profile" ON public.customer_profiles FOR UPDATE USING (
  user_id = auth.uid()
);
CREATE POLICY "Customers can insert their own profile" ON public.customer_profiles FOR INSERT WITH CHECK (
  user_id = auth.uid()
);

-- RLS policies for vendor_visits
CREATE POLICY "Customers can view their own visits" ON public.vendor_visits FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.customer_profiles WHERE id = customer_id AND user_id = auth.uid())
);
CREATE POLICY "Customers can insert their own visits" ON public.vendor_visits FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.customer_profiles WHERE id = customer_id AND user_id = auth.uid())
);
CREATE POLICY "Vendors can view visits to their profile" ON public.vendor_visits FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.vendor_profiles WHERE id = vendor_id AND user_id = auth.uid())
);

-- RLS policies for chat_initiations
CREATE POLICY "Users can view their own chat initiations" ON public.chat_initiations FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.customer_profiles WHERE id = customer_id AND user_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.vendor_profiles WHERE id = vendor_id AND user_id = auth.uid())
);
CREATE POLICY "Customers can insert chat initiations" ON public.chat_initiations FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.customer_profiles WHERE id = customer_id AND user_id = auth.uid())
);

-- RLS policies for booking_interactions
CREATE POLICY "Users can view their own booking interactions" ON public.booking_interactions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.customer_profiles WHERE id = customer_id AND user_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.vendor_profiles WHERE id = vendor_id AND user_id = auth.uid())
);
CREATE POLICY "Customers can manage their booking interactions" ON public.booking_interactions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.customer_profiles WHERE id = customer_id AND user_id = auth.uid())
);

-- Update the handle_new_user function to also create customer profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'customer')
  );
  
  -- If user is a vendor, create vendor profile
  IF COALESCE(NEW.raw_user_meta_data->>'user_type', 'customer') = 'vendor' THEN
    INSERT INTO public.vendor_profiles (user_id, business_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'business_name', ''));
  END IF;
  
  -- If user is a customer, create customer profile
  IF COALESCE(NEW.raw_user_meta_data->>'user_type', 'customer') = 'customer' THEN
    INSERT INTO public.customer_profiles (user_id)
    VALUES (NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically expire booking interactions
CREATE OR REPLACE FUNCTION public.expire_booking_interactions()
RETURNS void AS $$
BEGIN
  UPDATE public.booking_interactions 
  SET customer_response = 'no', 
      responded_at = NOW(),
      is_active = false
  WHERE expires_at < NOW() 
    AND customer_response = 'pending' 
    AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample hero images
INSERT INTO public.hero_images (title, image_url, alt_text, display_order) VALUES
('Wedding Planning', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop', 'Beautiful wedding setup', 1),
('Corporate Events', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop', 'Professional event planning', 2);

-- Insert sample carousel images
INSERT INTO public.carousel_images (title, subtitle, image_url, alt_text, category, display_order) VALUES
('Royal Photography', 'Capturing your precious moments', 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop', 'Wedding photography', 'Photography', 1),
('Elegant Catering', 'Delicious food for every occasion', 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop', 'Catering service', 'Catering', 2),
('Dream Venues', 'Perfect locations for your events', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop', 'Event venue', 'Venue', 3);
