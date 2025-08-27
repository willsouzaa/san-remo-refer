-- Add pix_key column first
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS pix_key TEXT;

-- Remove default constraint first
ALTER TABLE public.profiles 
ALTER COLUMN role DROP DEFAULT;

-- Change role column to text temporarily
ALTER TABLE public.profiles 
ALTER COLUMN role TYPE TEXT;

-- Create the new enum type
DROP TYPE IF EXISTS public.app_role CASCADE;
CREATE TYPE public.app_role AS ENUM ('indicator', 'admin', 'finance', 'commercial');

-- Update role values to ensure they match the new enum
UPDATE public.profiles 
SET role = CASE 
  WHEN role = 'staff' THEN 'admin'  -- Convert old 'staff' to 'admin'
  WHEN role NOT IN ('indicator', 'admin') THEN 'indicator'  -- Default fallback
  ELSE role
END;

-- Convert to the new enum type
ALTER TABLE public.profiles 
ALTER COLUMN role TYPE public.app_role USING role::public.app_role;

-- Set new default
ALTER TABLE public.profiles 
ALTER COLUMN role SET DEFAULT 'indicator'::public.app_role;

-- Create security definer functions
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

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS public.app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;