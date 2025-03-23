    -- supabase/migrations/YYYYMMDDHHMMSS_create_profiles_table.sql

    CREATE TABLE profiles (
        id UUID PRIMARY KEY REFERENCES auth.users(id),
        full_name TEXT,
        date_of_birth DATE,
        address TEXT,
        phone_number TEXT,
        profile_picture_url TEXT,
        farm_size INTEGER,
        crops_grown TEXT[],
        farm_location TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Add a trigger to automatically update the updated_at column
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

    -- Enable Row Level Security (RLS) - VERY IMPORTANT
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

    -- Allow users to read their own profile
    CREATE POLICY "Users can read their own profile." ON profiles
    FOR SELECT USING (auth.uid() = id);

    -- Allow users to update their own profile
    CREATE POLICY "Users can update their own profile." ON profiles
    FOR UPDATE USING (auth.uid() = id);