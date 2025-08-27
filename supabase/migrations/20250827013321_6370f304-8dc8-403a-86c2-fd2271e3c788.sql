-- Simple update to add pix_key column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS pix_key TEXT;

-- Update any existing NULL roles to 'indicator'
UPDATE public.profiles 
SET role = 'indicator' 
WHERE role IS NULL;