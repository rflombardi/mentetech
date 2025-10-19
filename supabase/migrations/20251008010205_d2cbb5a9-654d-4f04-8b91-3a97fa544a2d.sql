-- Drop all existing conflicting policies on newsletter_subscribers
DROP POLICY IF EXISTS "Qualquer um pode se inscrever na newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Only admins can read subscriber data" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can update subscriber data" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can delete subscriber data" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Users can select their own newsletter_subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Users can insert their own newsletter_subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Users can update their own newsletter_subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Users can delete their own newsletter_subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Privileged roles can select all newsletter_subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Privileged roles can insert all newsletter_subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Privileged roles can update all newsletter_subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Privileged roles can delete all newsletter_subscribers" ON public.newsletter_subscribers;

-- Create clean, secure policies
CREATE POLICY "Public can subscribe to newsletter"
ON public.newsletter_subscribers 
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Admins can view all subscribers"
ON public.newsletter_subscribers 
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update subscribers"
ON public.newsletter_subscribers 
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete subscribers"
ON public.newsletter_subscribers 
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));