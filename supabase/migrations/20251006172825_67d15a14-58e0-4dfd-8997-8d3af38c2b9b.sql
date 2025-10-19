-- Drop the existing policy that allows all authenticated users to view contact messages
DROP POLICY IF EXISTS "Only authenticated users can view contact messages" ON public.contact_messages;

-- Create a new policy that restricts SELECT access to admins only
CREATE POLICY "Only admins can view contact messages"
ON public.contact_messages
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));