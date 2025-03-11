-- This SQL script sets up the necessary tables in Supabase
-- You can run these commands in the Supabase SQL Editor

-- Create a table for user profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create a table for saved locations
CREATE TABLE IF NOT EXISTS public.saved_locations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  latitude DECIMAL NOT NULL,
  longitude DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create a table for saved reports
CREATE TABLE IF NOT EXISTS public.saved_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  report_type TEXT NOT NULL,
  report_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create a table for user preferences
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  theme TEXT DEFAULT 'light',
  temperature_unit TEXT DEFAULT 'celsius',
  notification_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Set up Row Level Security (RLS)
-- This ensures users can only access their own data

-- Profiles table policy
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Saved locations table policy
ALTER TABLE public.saved_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved locations" 
ON public.saved_locations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved locations" 
ON public.saved_locations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved locations" 
ON public.saved_locations FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved locations" 
ON public.saved_locations FOR DELETE 
USING (auth.uid() = user_id);

-- Saved reports table policy
ALTER TABLE public.saved_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved reports" 
ON public.saved_reports FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved reports" 
ON public.saved_reports FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved reports" 
ON public.saved_reports FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved reports" 
ON public.saved_reports FOR DELETE 
USING (auth.uid() = user_id);

-- User preferences table policy
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own preferences" 
ON public.user_preferences FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" 
ON public.user_preferences FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
ON public.user_preferences FOR UPDATE 
USING (auth.uid() = user_id);

-- Create a function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();