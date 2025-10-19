-- Update RLS policies for posts table to require admin role
DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.posts;
DROP POLICY IF EXISTS "Authenticated users can update posts" ON public.posts;
DROP POLICY IF EXISTS "Authenticated users can delete posts" ON public.posts;

-- Create admin-only policies for posts
CREATE POLICY "Only admins can create posts"
ON public.posts
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update posts"
ON public.posts
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete posts"
ON public.posts
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update RLS policies for categorias table to require admin role
DROP POLICY IF EXISTS "Authenticated users can create categories" ON public.categorias;

CREATE POLICY "Only admins can create categories"
ON public.categorias
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update categories"
ON public.categorias
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete categories"
ON public.categorias
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add helpful comments
COMMENT ON TABLE public.posts IS 'Blog posts. Only admins can create, update, or delete. Published posts are publicly visible.';
COMMENT ON TABLE public.categorias IS 'Post categories. Only admins can manage categories. All users can view categories.';