-- First, check what values exist in the role column
-- Update existing role values to match the new enum
UPDATE public.profiles 
SET role = CASE 
  WHEN role = 'indicator' THEN 'indicator'
  WHEN role = 'admin' THEN 'admin'
  WHEN role = 'staff' THEN 'admin'  -- Convert old 'staff' to 'admin'
  ELSE 'indicator'  -- Default fallback
END;

-- Add pix_key column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS pix_key TEXT;

-- Create the new enum type
DROP TYPE IF EXISTS public.app_role CASCADE;
CREATE TYPE public.app_role AS ENUM ('indicator', 'admin', 'finance', 'commercial');

-- Update role column to use the new enum with explicit casting
ALTER TABLE public.profiles 
ALTER COLUMN role DROP DEFAULT;

ALTER TABLE public.profiles 
ALTER COLUMN role TYPE public.app_role USING 
  CASE 
    WHEN role::text = 'indicator' THEN 'indicator'::public.app_role
    WHEN role::text = 'admin' THEN 'admin'::public.app_role
    WHEN role::text = 'staff' THEN 'admin'::public.app_role
    ELSE 'indicator'::public.app_role
  END;

ALTER TABLE public.profiles 
ALTER COLUMN role SET DEFAULT 'indicator'::public.app_role;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = _role
  );
$$;

-- Create function to check if user is staff (admin, finance, commercial)
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'finance', 'commercial')
  );
$$;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS public.app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;