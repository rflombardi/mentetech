-- Remove public read access from site_settings table
-- This prevents unauthorized API access while keeping data for potential future admin use

-- Drop the existing public read policy
DROP POLICY IF EXISTS "Anyone can read site settings" ON public.site_settings;

-- Create a new policy that only allows admins to read site_settings
CREATE POLICY "Only admins can read site settings"
ON public.site_settings
FOR SELECT
USING (
  EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- Update the existing modification policy to be more explicit
DROP POLICY IF EXISTS "Only service role can modify settings" ON public.site_settings;

CREATE POLICY "Only admins can modify site settings"
ON public.site_settings
FOR ALL
USING (
  EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- Add comment explaining the security change
COMMENT ON TABLE public.site_settings IS 'Site configuration settings - restricted to admin access only for security. Contact information should be managed in application code rather than exposed via public API.';