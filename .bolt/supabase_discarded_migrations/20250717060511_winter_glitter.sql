/*
  # Initial Event Sathi Database Setup

  1. New Tables
    - `categories` - Event categories (Photography, Catering, etc.)
    - `customers` - Customer profiles
    - `vendors` - Vendor profiles  
    - `vendor_images` - Vendor portfolio images
    - `chat_messages` - Real-time chat between customers and vendors
    - `customer_vendor_bookings` - Booking management
    - `customer_vendor_reviews` - Review system
    - `customer_vendor_chats` - Chat room management

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each user type
    - Secure data access based on user relationships

  3. Features
    - Real-time chat system
    - Image storage for vendor portfolios
    - Booking and review management
    - Category-based vendor filtering
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text,
  phone_number text,
  gender text,
  created_at timestamptz DEFAULT now()
);

-- Create vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  vendor_name text,
  business_name text,
  phone_number text,
  age integer,
  gender text,
  aadhar text,
  pan text,
  gst text,
  address text,
  categories jsonb DEFAULT '[]'::jsonb,
  business_info jsonb DEFAULT '{}'::jsonb,
  pricing_info jsonb DEFAULT '{}'::jsonb,
  availability_info jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create vendor_images table
CREATE TABLE IF NOT EXISTS vendor_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  title text,
  description text,
  uploaded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create customer_vendor_chats table
CREATE TABLE IF NOT EXISTS customer_vendor_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  vendor_id uuid REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  chat_room_id uuid DEFAULT gen_random_uuid(),
  last_message_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(customer_id, vendor_id),
  UNIQUE(chat_room_id)
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  vendor_id uuid REFERENCES vendors(id)ON DELETE CASCADE NOT NULL,
  chat_room_id uuid REFERENCES customer_vendor_chats(chat_room_id) ON DELETE CASCADE,
  sender text NOT NULL CHECK (sender IN ('customer', 'vendor')),
  message text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create customer_vendor_bookings table
CREATE TABLE IF NOT EXISTS customer_vendor_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  vendor_id uuid REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  booking_date timestamptz NOT NULL,
  event_date timestamptz,
  event_type text,
  package_details jsonb DEFAULT '{}'::jsonb,
  total_amount decimal(10,2),
  booking_status text DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create customer_vendor_reviews table
CREATE TABLE IF NOT EXISTS customer_vendor_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  vendor_id uuid REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  booking_id uuid REFERENCES customer_vendor_bookings(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  review_images jsonb DEFAULT '[]'::jsonb,
  response_from_vendor text,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(customer_id, vendor_id, booking_id)
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_vendor_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_vendor_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_vendor_reviews ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Everyone can view categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

-- Customers policies
CREATE POLICY "Users can view their own customer data"
  ON customers FOR SELECT
  TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own customer data"
  ON customers FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own customer data"
  ON customers FOR UPDATE
  TO public
  USING (auth.uid() = user_id);

-- Vendors policies
CREATE POLICY "Everyone can view vendor data for browsing"
  ON vendors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view their own vendor data"
  ON vendors FOR SELECT
  TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vendor data"
  ON vendors FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vendor data"
  ON vendors FOR UPDATE
  TO public
  USING (auth.uid() = user_id);

-- Vendor images policies
CREATE POLICY "Everyone can view vendor images"
  ON vendor_images FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Vendors can manage their own images"
  ON vendor_images FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM vendors 
      WHERE vendors.id = vendor_images.vendor_id 
      AND vendors.user_id = auth.uid()
    )
  );

-- Chat policies
CREATE POLICY "Users can view their own chats"
  ON customer_vendor_chats FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM customers 
      WHERE customers.id = customer_vendor_chats.customer_id 
      AND customers.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM vendors 
      WHERE vendors.i = customer_vendor_chats.vendor_id 
      AND vendors.user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can create chats"
  ON customer_vendor_chats FOR INSERT
  TO public
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers 
      WHERE customers.id = customer_vendor_chats.customer_id 
      AND customers.user_id = auth.uid()
    )
  );

-- Chat messages policies
CREATE POLICY "Users can view their own chat messages"
  ON chat_messages FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM customers 
      WHERE customers.id = chat_messages.customer_id 
      AND customers.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM vendors 
      WHERE vendors.id = chat_messages.vendor_id 
      AND vendors.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own chat messages"
  ON chat_messages FOR INSERT
  TO public
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers 
      WHERE customers.id = chat_messages.customer_id 
       
      AND customers.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM vendors 
      WHERE vendors.id = chat_messages.vendor_id 
      AND vendors.user_id = auth.uid()
    )
  );

-- Booking policies
CREATE POLICY "Users can view their own bookings"
  ON customer_vendor_bookings FOR SELECT
  TO public
  
  USING (
    EXISTS (
      SELECT 1 FROM customers 
      WHERE customers.id = customer_vendor_bookings.customer_id 
      AND customers.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM vendors 
      WHERE vendors.id = customer_vendor_bookings.vendor_id 
      AND vendors.user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can create bookings"
  ON customer_vendor_bookings FOR INSERT
  TO public
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers 
      WHERE customers.id = customer_vendor_bookings.customer_id 
      AND customers.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own bookings"
  
  ON customer_vendor_bookings FOR UPDATE
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM customers 
      WHERE customers.id = customer_vendor_bookings.customer_id 
      AND customers.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM vendors 
      WHERE vendors.id = customer_vendor_bookings.vendor_id  
      AND vendors.user_id = auth.uid()
    )
  );

-- Review policies
CREATE POLICY "Everyone can view reviews"
  ON customer_vendor_reviews FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Customers can create reviews"
  ON customer_vendor_reviews FOR INSERT
  TO public
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers 
       
      WHERE customers.id = customer_vendor_reviews.customer_id 
      AND customers.user_id = auth.uid()
    )
  );

CREATE POLICY "Review owners can update"
  ON customer_vendor_reviews FOR UPDATE
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM customers 
      WHERE customers.id = customer_vendor_reviews.customer_id 
      AND customers.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM vendors 
      WHERE vendors.id = customer_vendor_reviews.vendor_id 
      AND vendors.user_id = auth.uid()
    )
  );

-- Insert default categories
INSERT INTO categories (name, description) VALUES
  ('Photography', 'Professional photography services for events'),
  ('Catering', 'Foo and beverage services'),
  ('Venue', 'Event venues and locations'),
  ('Decor', 'Event decoration and styling'),
  ('Music', 'Music and entertainment services'),
  ('Makeup', 'Makeup and beauty services'),
  ('Event Planning', 'Complete event planning services'),
  ('Transportation', 'Transportation and logistics')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vendors_categories ON vendors USING GIN (categories);
CREATE INDEX IF NOT EXISTS idx_vendors_location ON vendors (address);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages (timestamp);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON customer_vendor_bookings (booking_status);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON customer_vendor_reviews (rating);