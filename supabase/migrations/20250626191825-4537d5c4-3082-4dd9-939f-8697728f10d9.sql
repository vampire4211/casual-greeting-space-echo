
-- Create user profiles table for authentication
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email TEXT,
  full_name TEXT,
  user_type TEXT CHECK (user_type IN ('customer', 'vendor')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vendor profiles table
CREATE TABLE public.vendor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  business_name TEXT NOT NULL,
  categories TEXT[] DEFAULT '{}',
  profile_completion INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create questions table
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  question_type TEXT CHECK (question_type IN ('true_false', 'multiple_choice', 'textarea')) NOT NULL,
  options JSONB, -- For multiple choice options
  category_id UUID REFERENCES public.categories(id),
  is_static BOOLEAN DEFAULT false,
  is_mandatory BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vendor question responses table
CREATE TABLE public.vendor_question_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES public.vendor_profiles(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(vendor_id, question_id)
);

-- Create chat conversations table
CREATE TABLE public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat messages table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_question_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Everyone can view categories" ON public.categories FOR SELECT TO authenticated USING (true);

CREATE POLICY "Vendors can view their own profile" ON public.vendor_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Vendors can update their own profile" ON public.vendor_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Vendors can insert their own profile" ON public.vendor_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Everyone can view questions" ON public.questions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Vendors can view their own responses" ON public.vendor_question_responses FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.vendor_profiles WHERE id = vendor_id AND user_id = auth.uid())
);
CREATE POLICY "Vendors can insert their own responses" ON public.vendor_question_responses FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.vendor_profiles WHERE id = vendor_id AND user_id = auth.uid())
);
CREATE POLICY "Vendors can update their own responses" ON public.vendor_question_responses FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.vendor_profiles WHERE id = vendor_id AND user_id = auth.uid())
);

CREATE POLICY "Users can view their own conversations" ON public.chat_conversations FOR SELECT USING (
  auth.uid() = customer_id OR auth.uid() = vendor_id
);
CREATE POLICY "Users can create conversations" ON public.chat_conversations FOR INSERT WITH CHECK (
  auth.uid() = customer_id OR auth.uid() = vendor_id
);

CREATE POLICY "Users can view messages in their conversations" ON public.chat_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.chat_conversations WHERE id = conversation_id AND (customer_id = auth.uid() OR vendor_id = auth.uid()))
);
CREATE POLICY "Users can send messages in their conversations" ON public.chat_messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.chat_conversations WHERE id = conversation_id AND (customer_id = auth.uid() OR vendor_id = auth.uid()))
);

-- Create function to handle new user registration
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
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample categories
INSERT INTO public.categories (name, description) VALUES
('Photography', 'Professional photography services'),
('Catering', 'Food and beverage services'),
('Decoration', 'Event decoration and styling'),
('Music & Entertainment', 'DJ, bands, and entertainment services'),
('Venue', 'Event venues and locations'),
('Wedding Planning', 'Complete wedding planning services');

-- Insert sample static questions
INSERT INTO public.questions (question_text, question_type, is_static, is_mandatory) VALUES
('Do you provide services on weekends?', 'true_false', true, true),
('What is your experience in the event industry?', 'textarea', true, true),
('Do you have insurance coverage?', 'true_false', true, true),
('What is your cancellation policy?', 'textarea', true, true),
('Do you provide equipment?', 'true_false', true, false),
('What payment methods do you accept?', 'multiple_choice', true, true),
('Do you offer package deals?', 'true_false', true, false),
('What is your service area?', 'textarea', true, true),
('Do you have backup plans for emergencies?', 'true_false', true, true),
('What makes your service unique?', 'textarea', true, false);

-- Update the payment methods question with options
UPDATE public.questions 
SET options = '["Cash", "Bank Transfer", "Credit Card", "UPI", "Cheque"]'
WHERE question_text = 'What payment methods do you accept?';
