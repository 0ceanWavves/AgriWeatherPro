-- Create a new user in auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data
)
VALUES (
  '00000000-0000-0000-0000-000000000000', -- Use your instance ID
  gen_random_uuid(),                      -- Generate UUID for user
  'test@example.com',                     -- User email 
  crypt('password123', gen_salt('bf')),   -- Encrypted password
  NOW(),                                  -- Email confirmed timestamp
  NOW(),                                  -- Created timestamp
  NOW(),                                  -- Updated timestamp
  '{"provider":"email","providers":["email"]}', -- App metadata
  '{"full_name":"Test User"}'            -- User metadata
) RETURNING id;

-- After getting the user ID from the first query, insert into profiles
-- Using a placeholder ID below - you'll need to replace this with the actual ID
INSERT INTO public.profiles (
  id,
  full_name,
  email,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000000', -- Replace with user ID from above
  'Test User',
  'test@example.com',
  NOW(),
  NOW()
);
