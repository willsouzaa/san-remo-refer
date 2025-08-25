-- Create profiles table (users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  role TEXT CHECK (role IN ('indicator', 'staff', 'admin')) DEFAULT 'indicator',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create referrals table (imoveis_indicados)
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  property_type TEXT CHECK (property_type IN ('casa', 'apartamento', 'terreno', 'comercial')),
  owner_name TEXT NOT NULL,
  owner_phone TEXT,
  owner_email TEXT,
  estimate_value NUMERIC,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_analise', 'aprovado', 'rejeitado', 'fechado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create commissions table (comissoes)
CREATE TABLE public.commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_id UUID NOT NULL REFERENCES public.referrals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  deal_value NUMERIC NOT NULL,
  commission_rate NUMERIC NOT NULL DEFAULT 0.10,
  commission_amount NUMERIC GENERATED ALWAYS AS (deal_value * commission_rate) STORED,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is staff/admin
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('staff', 'admin')
  );
$$;

-- Profiles policies
CREATE POLICY "profiles_select_own_or_staff" ON public.profiles
  FOR SELECT USING (id = auth.uid() OR public.is_staff());

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

-- Referrals policies
CREATE POLICY "referrals_select_own_or_staff" ON public.referrals
  FOR SELECT USING (user_id = auth.uid() OR public.is_staff());

CREATE POLICY "referrals_insert_own" ON public.referrals
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "referrals_update_own_pending" ON public.referrals
  FOR UPDATE USING (
    (user_id = auth.uid() AND status IN ('pendente', 'em_analise')) OR 
    public.is_staff()
  );

-- Commissions policies
CREATE POLICY "commissions_select_own_or_staff" ON public.commissions
  FOR SELECT USING (user_id = auth.uid() OR public.is_staff());

CREATE POLICY "commissions_insert_staff" ON public.commissions
  FOR INSERT WITH CHECK (public.is_staff());

CREATE POLICY "commissions_update_staff" ON public.commissions
  FOR UPDATE USING (public.is_staff());

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name');
  RETURN new;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger for referrals updated_at
CREATE TRIGGER update_referrals_updated_at
  BEFORE UPDATE ON public.referrals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();