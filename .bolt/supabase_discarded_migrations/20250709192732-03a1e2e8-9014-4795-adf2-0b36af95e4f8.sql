-- Remove old matrix tables and create proper relational structure
DROP TABLE IF EXISTS booking_matrix;
DROP TABLE IF EXISTS chat_matrix;
DROP TABLE IF EXISTS reply_matrix;
DROP TABLE IF EXISTS review_matrix;
DROP TABLE IF EXISTS visiting_matrix;

-- Create proper junction tables
CREATE TABLE customer_vendor_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    booking_date TIMESTAMP WITH TIME ZONE NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE,
    event_type TEXT,
    package_details JSONB DEFAULT '{}',
    total_amount DECIMAL(10,2),
    booking_status TEXT DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE customer_vendor_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES customer_vendor_bookings(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    review_images JSONB DEFAULT '[]',
    response_from_vendor TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(customer_id, vendor_id, booking_id)
);

CREATE TABLE customer_vendor_chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    chat_room_id UUID UNIQUE DEFAULT gen_random_uuid(),
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(customer_id, vendor_id)
);

-- Update chat_messages to reference the new chat system
ALTER TABLE chat_messages 
ADD COLUMN chat_room_id UUID REFERENCES customer_vendor_chats(chat_room_id) ON DELETE CASCADE;

-- Create admin images table for homepage management
CREATE TABLE admin_homepage_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section TEXT NOT NULL CHECK (section IN ('hero', 'trending_carousel')),
    slot_number INTEGER NOT NULL,
    image_data BYTEA NOT NULL,
    image_name TEXT NOT NULL,
    image_type TEXT NOT NULL CHECK (image_type IN ('image/jpeg', 'image/jpg', 'image/png')),
    alt_text TEXT,
    title TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    uploaded_by UUID REFERENCES customers(id), -- assuming admin is also a customer type
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(section, slot_number)
);

-- Create vendor category images table
CREATE TABLE vendor_category_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    category_name TEXT NOT NULL,
    image_data BYTEA NOT NULL,
    image_name TEXT NOT NULL,
    image_type TEXT NOT NULL CHECK (image_type IN ('image/jpeg', 'image/jpg', 'image/png')),
    image_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update vendors table to use JSONB for categories and other flexible fields
ALTER TABLE vendors 
DROP COLUMN IF EXISTS categories;

ALTER TABLE vendors 
ADD COLUMN categories JSONB DEFAULT '[]',
ADD COLUMN business_info JSONB DEFAULT '{}',
ADD COLUMN pricing_info JSONB DEFAULT '{}',
ADD COLUMN availability_info JSONB DEFAULT '{}';

-- Enable RLS policies
ALTER TABLE customer_vendor_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_vendor_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_vendor_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_homepage_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_category_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings" ON customer_vendor_bookings
FOR SELECT USING (
    EXISTS (SELECT 1 FROM customers WHERE customers.id = customer_vendor_bookings.customer_id AND customers.user_id = auth.uid())
    OR
    EXISTS (SELECT 1 FROM vendors WHERE vendors.id = customer_vendor_bookings.vendor_id AND vendors.user_id = auth.uid())
);

CREATE POLICY "Customers can create bookings" ON customer_vendor_bookings
FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM customers WHERE customers.id = customer_vendor_bookings.customer_id AND customers.user_id = auth.uid())
);

CREATE POLICY "Users can update their own bookings" ON customer_vendor_bookings
FOR UPDATE USING (
    EXISTS (SELECT 1 FROM customers WHERE customers.id = customer_vendor_bookings.customer_id AND customers.user_id = auth.uid())
    OR
    EXISTS (SELECT 1 FROM vendors WHERE vendors.id = customer_vendor_bookings.vendor_id AND vendors.user_id = auth.uid())
);

-- RLS Policies for reviews
CREATE POLICY "Everyone can view reviews" ON customer_vendor_reviews
FOR SELECT USING (true);

CREATE POLICY "Customers can create reviews" ON customer_vendor_reviews
FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM customers WHERE customers.id = customer_vendor_reviews.customer_id AND customers.user_id = auth.uid())
);

CREATE POLICY "Review owners can update" ON customer_vendor_reviews
FOR UPDATE USING (
    EXISTS (SELECT 1 FROM customers WHERE customers.id = customer_vendor_reviews.customer_id AND customers.user_id = auth.uid())
    OR
    EXISTS (SELECT 1 FROM vendors WHERE vendors.id = customer_vendor_reviews.vendor_id AND vendors.user_id = auth.uid())
);

-- RLS Policies for chats
CREATE POLICY "Users can view their own chats" ON customer_vendor_chats
FOR SELECT USING (
    EXISTS (SELECT 1 FROM customers WHERE customers.id = customer_vendor_chats.customer_id AND customers.user_id = auth.uid())
    OR
    EXISTS (SELECT 1 FROM vendors WHERE vendors.id = customer_vendor_chats.vendor_id AND vendors.user_id = auth.uid())
);

CREATE POLICY "Customers can create chats" ON customer_vendor_chats
FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM customers WHERE customers.id = customer_vendor_chats.customer_id AND customers.user_id = auth.uid())
);

-- RLS Policies for admin homepage images
CREATE POLICY "Everyone can view homepage images" ON admin_homepage_images
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage homepage images" ON admin_homepage_images
FOR ALL USING (
    EXISTS (SELECT 1 FROM customers WHERE customers.id = admin_homepage_images.uploaded_by AND customers.user_id = auth.uid())
);

-- RLS Policies for vendor category images
CREATE POLICY "Everyone can view vendor images" ON vendor_category_images
FOR SELECT USING (true);

CREATE POLICY "Vendors can manage their own images" ON vendor_category_images
FOR ALL USING (
    EXISTS (SELECT 1 FROM vendors WHERE vendors.id = vendor_category_images.vendor_id AND vendors.user_id = auth.uid())
);

-- Create indexes for better performance
CREATE INDEX idx_customer_vendor_bookings_customer ON customer_vendor_bookings(customer_id);
CREATE INDEX idx_customer_vendor_bookings_vendor ON customer_vendor_bookings(vendor_id);
CREATE INDEX idx_customer_vendor_bookings_status ON customer_vendor_bookings(booking_status);
CREATE INDEX idx_customer_vendor_reviews_vendor ON customer_vendor_reviews(vendor_id);
CREATE INDEX idx_customer_vendor_reviews_rating ON customer_vendor_reviews(rating);
CREATE INDEX idx_vendor_category_images_vendor ON vendor_category_images(vendor_id);
CREATE INDEX idx_vendor_category_images_category ON vendor_category_images(category_name);
CREATE INDEX idx_admin_homepage_images_section ON admin_homepage_images(section, slot_number);

-- Insert sample data for trending carousel (8 slots)
INSERT INTO admin_homepage_images (section, slot_number, image_data, image_name, image_type, alt_text, title, description) VALUES
('trending_carousel', 1, decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64'), 'photography.jpg', 'image/jpeg', 'Photography Services', 'Photography', 'Professional photography services'),
('trending_carousel', 2, decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64'), 'catering.jpg', 'image/jpeg', 'Catering Services', 'Catering', 'Delicious catering options'),
('trending_carousel', 3, decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64'), 'decoration.jpg', 'image/jpeg', 'Decoration Services', 'Decoration', 'Beautiful event decorations'),
('trending_carousel', 4, decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64'), 'videography.jpg', 'image/jpeg', 'Videography Services', 'Videography', 'Professional video coverage'),
('trending_carousel', 5, decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64'), 'music.jpg', 'image/jpeg', 'Music Services', 'Music & DJ', 'Live music and DJ services'),
('trending_carousel', 6, decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64'), 'venue.jpg', 'image/jpeg', 'Venue Services', 'Venues', 'Perfect venues for events'),
('trending_carousel', 7, decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64'), 'flowers.jpg', 'image/jpeg', 'Flower Services', 'Flowers', 'Beautiful floral arrangements'),
('trending_carousel', 8, decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64'), 'planning.jpg', 'image/jpeg', 'Event Planning', 'Event Planning', 'Complete event planning services');

-- Insert sample hero image
INSERT INTO admin_homepage_images (section, slot_number, image_data, image_name, image_type, alt_text, title, description) VALUES
('hero', 1, decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64'), 'hero-bg.jpg', 'image/jpeg', 'Event Planning Hero Image', 'Create Perfect Events', 'Your one-stop solution for all event planning needs');