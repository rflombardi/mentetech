-- Security Improvements Migration
-- This migration fixes critical security issues identified in the security audit

-- ============================================================================
-- 1. FIX STORAGE POLICIES - Restrict to admins only
-- ============================================================================

-- Drop overly permissive storage policies
DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete blog images" ON storage.objects;

-- Create admin-only storage policies
CREATE POLICY "Only admins can upload blog images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'blog-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Only admins can update blog images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'blog-images' AND
  has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  bucket_id = 'blog-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Only admins can delete blog images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'blog-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- ============================================================================
-- 2. FIX POSTS POLICIES - Restrict to admins only
-- ============================================================================

-- Drop overly permissive posts policies
DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.posts;
DROP POLICY IF EXISTS "Authenticated users can update posts" ON public.posts;
DROP POLICY IF EXISTS "Authenticated users can delete posts" ON public.posts;

-- Create admin-only posts policies
CREATE POLICY "Only admins can create posts"
ON public.posts
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update posts"
ON public.posts
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete posts"
ON public.posts
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================================================
-- 3. FIX CATEGORIAS POLICIES - Restrict modifications to admins only
-- ============================================================================

-- Drop existing public read policy (if exists)
DROP POLICY IF EXISTS "Categorias são visíveis publicamente" ON public.categorias;
DROP POLICY IF EXISTS "Anyone can read categorias" ON public.categorias;

-- Recreate public read policy
CREATE POLICY "Public can read categorias"
ON public.categorias
FOR SELECT
USING (true);

-- Add admin-only modification policies
CREATE POLICY "Only admins can create categorias"
ON public.categorias
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update categorias"
ON public.categorias
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete categorias"
ON public.categorias
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
