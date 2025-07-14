-- Drop existing triggers and functions if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_user_registration();

-- Create categories table first
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customers table
CREATE TABLE public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    gender VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customer login history
CREATE TABLE public.login_cus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    login_time TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vendors table
CREATE TABLE public.vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    vendor_name VARCHAR(100),
    business_name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    age INT,
    gender VARCHAR(10),
    aadhar VARCHAR(20),
    pan VARCHAR(20),
    gst VARCHAR(20),
    address TEXT,
    categories TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vendor login history
CREATE TABLE public.login_ven (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
    login_time TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vendor details
CREATE TABLE public.vendor_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
    email VARCHAR(100),
    question_com TEXT,
    no_of_images INT DEFAULT 0,
    review TEXT,
    subscription TEXT,
    overall_gr DECIMAL(3,2)
);

-- Create vendor products/services
CREATE TABLE public.vendor_pro (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
    product_details TEXT,
    category_display TEXT
);

-- Create chat mapping table
CREATE TABLE public.chat (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
    chat_start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create matrix tables with JSONB
CREATE TABLE public.booking_matrix (
    customer_id UUID PRIMARY KEY REFERENCES public.customers(id) ON DELETE CASCADE,
    data JSONB DEFAULT '{}'
);

CREATE TABLE public.visiting_matrix (
    customer_id UUID PRIMARY KEY REFERENCES public.customers(id) ON DELETE CASCADE,
    data JSONB DEFAULT '{}'
);

CREATE TABLE public.chat_matrix (
    customer_id UUID PRIMARY KEY REFERENCES public.customers(id) ON DELETE CASCADE,
    data JSONB DEFAULT '{}'
);

CREATE TABLE public.reply_matrix (
    customer_id UUID PRIMARY KEY REFERENCES public.customers(id) ON DELETE CASCADE,
    data JSONB DEFAULT '{}'
);

CREATE TABLE public.review_matrix (
    vendor_id UUID PRIMARY KEY REFERENCES public.vendors(id) ON DELETE CASCADE,
    reviews JSONB DEFAULT '[]'
);

-- Create vendor payment table
CREATE TABLE public.payment_table (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
    amount DECIMAL(10,2),
    plan_selected VARCHAR(50),
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customer profiles table
CREATE TABLE public.customer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_cus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_ven ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_pro ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_matrix ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visiting_matrix ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_matrix ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reply_matrix ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_matrix ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for categories
CREATE POLICY "Everyone can view categories" ON public.categories FOR SELECT TO authenticated USING (true);

-- Create RLS policies for customers
CREATE POLICY "Users can view their own customer data" ON public.customers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own customer data" ON public.customers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own customer data" ON public.customers FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for vendors
CREATE POLICY "Users can view their own vendor data" ON public.vendors FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own vendor data" ON public.vendors FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own vendor data" ON public.vendors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Everyone can view vendor data for browsing" ON public.vendors FOR SELECT TO authenticated USING (true);

-- Create RLS policies for customer profiles
CREATE POLICY "Users can view their own customer profile" ON public.customer_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own customer profile" ON public.customer_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own customer profile" ON public.customer_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for vendor details
CREATE POLICY "Vendors can manage their own details" ON public.vendor_details FOR ALL USING (
    EXISTS (SELECT 1 FROM public.vendors WHERE id = vendor_id AND user_id = auth.uid())
);
CREATE POLICY "Everyone can view vendor details" ON public.vendor_details FOR SELECT TO authenticated USING (true);

-- Create RLS policies for vendor products
CREATE POLICY "Vendors can manage their own products" ON public.vendor_pro FOR ALL USING (
    EXISTS (SELECT 1 FROM public.vendors WHERE id = vendor_id AND user_id = auth.uid())
);
CREATE POLICY "Everyone can view vendor products" ON public.vendor_pro FOR SELECT TO authenticated USING (true);

-- Create RLS policies for chat
CREATE POLICY "Users can view their own chats" ON public.chat FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.customers WHERE id = customer_id AND user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.vendors WHERE id = vendor_id AND user_id = auth.uid())
);

-- Create RLS policies for matrix tables
CREATE POLICY "Customers can manage their own booking matrix" ON public.booking_matrix FOR ALL USING (
    EXISTS (SELECT 1 FROM public.customers WHERE id = customer_id AND user_id = auth.uid())
);

CREATE POLICY "Customers can manage their own visiting matrix" ON public.visiting_matrix FOR ALL USING (
    EXISTS (SELECT 1 FROM public.customers WHERE id = customer_id AND user_id = auth.uid())
);

CREATE POLICY "Customers can manage their own chat matrix" ON public.chat_matrix FOR ALL USING (
    EXISTS (SELECT 1 FROM public.customers WHERE id = customer_id AND user_id = auth.uid())
);

CREATE POLICY "Customers can manage their own reply matrix" ON public.reply_matrix FOR ALL USING (
    EXISTS (SELECT 1 FROM public.customers WHERE id = customer_id AND user_id = auth.uid())
);

CREATE POLICY "Vendors can manage their own review matrix" ON public.review_matrix FOR ALL USING (
    EXISTS (SELECT 1 FROM public.vendors WHERE id = vendor_id AND user_id = auth.uid())
);

-- Create RLS policies for payment
CREATE POLICY "Vendors can view their own payments" ON public.payment_table FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.vendors WHERE id = vendor_id AND user_id = auth.uid())
);

-- Insert categories with new category names
INSERT INTO public.categories (name, description) VALUES
('Venue', 'Party plots, banquet halls, party halls'),
('Decor and Styling', 'Decoration and lighting services'),
('Personal Care and Grooming', 'Makeup artists for men and women'),
('Catering Services', 'Food and beverage services'),
('Event Planner', 'Complete event planning services'),
('Photography & Videography', 'Professional photography and videography services'),
('Music, Anchors & Entertainment', 'DJ, entertainment like dancers and singers, anchors'),
('Rental Services', 'Vehicles, horses, clothes and jewellery rental');

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_user_registration()
RETURNS TRIGGER AS $$
DECLARE
  customer_record_id uuid;
  vendor_record_id uuid;
BEGIN
  -- Check if user is a customer or vendor based on metadata
  IF NEW.raw_user_meta_data->>'user_type' = 'customer' THEN
    -- Insert into customers table
    INSERT INTO public.customers (user_id, name, email, phone_number)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'name', ''),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'phone', '')
    )
    RETURNING id INTO customer_record_id;
    
    -- Insert into customer_profiles table with reference to customers record
    INSERT INTO public.customer_profiles (user_id, customer_id)
    VALUES (NEW.id, customer_record_id);
    
  ELSIF NEW.raw_user_meta_data->>'user_type' = 'vendor' THEN
    -- Insert into vendors table
    INSERT INTO public.vendors (user_id, vendor_name, business_name, email, phone_number, pan, aadhar, categories)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'vendor_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'business_name', ''),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'phone', ''),
      COALESCE(NEW.raw_user_meta_data->>'pan_number', ''),
      COALESCE(NEW.raw_user_meta_data->>'aadhaar_number', ''),
      COALESCE(
        ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'categories')),
        '{}'::text[]
      )
    )
    RETURNING id INTO vendor_record_id;
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_registration();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates on customer_profiles
CREATE TRIGGER update_customer_profiles_updated_at
    BEFORE UPDATE ON public.customer_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();