-- Fix security vulnerability: Protect newsletter subscriber email addresses
-- Add a SELECT policy that restricts access to newsletter_subscribers table

-- This policy ensures that only authenticated users with admin privileges can view newsletter subscribers
-- Since no authentication system is currently implemented, this effectively blocks all public access
CREATE POLICY "Newsletter subscriber data is restricted to authorized users only" 
ON public.newsletter_subscribers 
FOR SELECT 
USING (false); -- This denies all SELECT access until proper admin authentication is implemented

-- Note: When implementing admin authentication later, this policy should be updated to:
-- USING (auth.uid() IS NOT NULL AND (SELECT has_admin_role FROM profiles WHERE id = auth.uid()) = true)