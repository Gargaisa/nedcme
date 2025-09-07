/*
  # Add Admin Authentication System

  1. New Tables
    - `admin_users` - Store admin credentials and info
    - Update user_profiles to include admin creation tracking
  
  2. Security
    - Enable RLS on admin_users table
    - Add policies for admin access only
    - Add function to verify admin credentials
  
  3. Changes
    - Add created_by field to user_profiles to track who created each user
    - Add admin verification functions
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Add created_by field to user_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN created_by uuid REFERENCES admin_users(id);
  END IF;
END $$;

-- Create admin policies
CREATE POLICY "Only admins can read admin_users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.id = auth.uid() AND au.is_active = true
    )
  );

CREATE POLICY "Only admins can update admin_users"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.id = auth.uid() AND au.is_active = true
    )
  );

-- Function to verify admin credentials
CREATE OR REPLACE FUNCTION verify_admin_credentials(
  input_username text,
  input_password text
)
RETURNS TABLE(
  admin_id uuid,
  full_name text,
  email text,
  is_valid boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    au.id,
    au.full_name,
    au.email,
    (au.password_hash = crypt(input_password, au.password_hash)) as is_valid
  FROM admin_users au
  WHERE au.username = input_username AND au.is_active = true;
END;
$$;

-- Function to create new user (admin only)
CREATE OR REPLACE FUNCTION create_user_account(
  admin_id uuid,
  user_email text,
  user_password text,
  user_role text DEFAULT 'user'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Verify admin exists and is active
  IF NOT EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = admin_id AND is_active = true
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Invalid admin credentials';
  END IF;

  -- Create user in auth.users (this would typically be handled by Supabase Auth)
  -- For now, we'll create a user profile entry
  INSERT INTO user_profiles (id, email, role, created_by, created_at)
  VALUES (gen_random_uuid(), user_email, user_role, admin_id, now())
  RETURNING id INTO new_user_id;

  RETURN new_user_id;
END;
$$;

-- Insert default admin user (username: admin, password: admin123)
INSERT INTO admin_users (username, password_hash, full_name, email)
VALUES (
  'admin',
  crypt('admin123', gen_salt('bf')),
  'System Administrator',
  'admin@nedc.gov.ng'
) ON CONFLICT (username) DO NOTHING;

-- Update trigger for admin_users
CREATE OR REPLACE FUNCTION update_admin_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_updated_at();