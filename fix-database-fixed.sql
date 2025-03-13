-- Add email field to profiles table if missing
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Check if policy exists before creating it
-- PostgreSQL doesn't support IF NOT EXISTS for policies
DO $$
BEGIN
    -- Check if the policy already exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'profiles' 
        AND policyname = 'Users can insert their own profile'
    ) THEN
        -- Create the policy if it doesn't exist
        EXECUTE 'CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id)';
    END IF;
END
$$;

-- Create or replace the function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );
  
  -- Also create user preferences if that table exists
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_preferences') THEN
    INSERT INTO public.user_preferences (user_id)
    VALUES (NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();