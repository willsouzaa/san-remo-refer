-- Enable RLS on pix_keys table
ALTER TABLE public.pix_keys ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own PIX keys
CREATE POLICY "Users can view their own PIX keys"
ON public.pix_keys
FOR SELECT
USING (user_id = auth.uid());

-- Policy: Users can insert their own PIX keys
CREATE POLICY "Users can insert their own PIX keys"
ON public.pix_keys
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Policy: Users can update their own PIX keys
CREATE POLICY "Users can update their own PIX keys"
ON public.pix_keys
FOR UPDATE
USING (user_id = auth.uid());

-- Policy: Users can delete their own PIX keys
CREATE POLICY "Users can delete their own PIX keys"
ON public.pix_keys
FOR DELETE
USING (user_id = auth.uid());

-- Policy: Admins can manage all PIX keys
CREATE POLICY "Admins can manage all PIX keys"
ON public.pix_keys
FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));