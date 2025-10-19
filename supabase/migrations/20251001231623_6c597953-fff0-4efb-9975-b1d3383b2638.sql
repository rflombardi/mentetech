-- Fix RLS policy on user_roles to use has_role function and avoid potential recursion
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'user_roles' 
      AND policyname = 'Admins can manage all roles'
  ) THEN
    EXECUTE 'DROP POLICY "Admins can manage all roles" ON public.user_roles';
  END IF;
END $$;

-- Recreate policy using security definer function
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
