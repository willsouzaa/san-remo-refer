-- Update the role enum to include all required roles
DROP TYPE IF EXISTS public.app_role CASCADE;
CREATE TYPE public.app_role AS ENUM ('indicator', 'admin', 'finance', 'commercial');

-- Add pix_key column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS pix_key TEXT;

-- Update role column to use the new enum
ALTER TABLE public.profiles 
ALTER COLUMN role DROP DEFAULT,
ALTER COLUMN role TYPE public.app_role USING role::public.app_role,
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

-- Update profiles RLS policies
DROP POLICY IF EXISTS "profiles_select_own_or_staff" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;

-- Allow users to view their own profile or staff to view all
CREATE POLICY "profiles_select_own_or_staff" 
ON public.profiles 
FOR SELECT 
USING (id = auth.uid() OR public.is_staff());

-- Allow users to update their own profile
CREATE POLICY "profiles_update_own" 
ON public.profiles 
FOR UPDATE 
USING (id = auth.uid());

-- Allow users to insert their own profile
CREATE POLICY "profiles_insert_own" 
ON public.profiles 
FOR INSERT 
WITH CHECK (id = auth.uid());

-- Update referrals RLS policies to work with new role system
DROP POLICY IF EXISTS "referrals_select_own_or_staff" ON public.referrals;
DROP POLICY IF EXISTS "referrals_update_own_pending" ON public.referrals;
DROP POLICY IF EXISTS "referrals_delete_own_pending" ON public.referrals;

-- Allow users to view their own referrals or staff to view all
CREATE POLICY "referrals_select_own_or_staff" 
ON public.referrals 
FOR SELECT 
USING (user_id = auth.uid() OR public.is_staff());

-- Allow users to update their own pending referrals or staff to update any
CREATE POLICY "referrals_update_own_pending" 
ON public.referrals 
FOR UPDATE 
USING (
  (user_id = auth.uid() AND status IN ('pendente', 'em_analise')) 
  OR public.is_staff()
);

-- Allow users to delete their own pending referrals or staff to delete any
CREATE POLICY "referrals_delete_own_pending" 
ON public.referrals 
FOR DELETE 
USING (
  (user_id = auth.uid() AND status IN ('pendente', 'em_analise')) 
  OR public.is_staff()
);

-- Update commissions RLS policies
DROP POLICY IF EXISTS "commissions_select_own_or_staff" ON public.commissions;
DROP POLICY IF EXISTS "commissions_update_staff" ON public.commissions;
DROP POLICY IF EXISTS "commissions_insert_staff" ON public.commissions;

-- Allow users to view their own commissions or staff to view all
CREATE POLICY "commissions_select_own_or_staff" 
ON public.commissions 
FOR SELECT 
USING (user_id = auth.uid() OR public.is_staff());

-- Only staff can update commissions
CREATE POLICY "commissions_update_staff" 
ON public.commissions 
FOR UPDATE 
USING (public.is_staff());

-- Only staff can insert commissions
CREATE POLICY "commissions_insert_staff" 
ON public.commissions 
FOR INSERT 
WITH CHECK (public.is_staff());

-- Create trigger to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'name', new.email), 
    'indicator'::public.app_role
  );
  RETURN new;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();