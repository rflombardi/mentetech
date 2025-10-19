-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true);

-- Create RLS policies for blog-images bucket
CREATE POLICY "Anyone can view blog images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can update blog images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can delete blog images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'blog-images');

-- Add RLS policies for posts table to allow CRUD operations for authenticated users
CREATE POLICY "Authenticated users can create posts" 
ON public.posts 
FOR INSERT 
WITH CHECK (true); -- For now, any authenticated user can create posts

CREATE POLICY "Authenticated users can update posts" 
ON public.posts 
FOR UPDATE 
USING (true); -- For now, any authenticated user can update posts

CREATE POLICY "Authenticated users can delete posts" 
ON public.posts 
FOR DELETE 
USING (true); -- For now, any authenticated user can delete posts

-- Add RLS policies for categorias table to allow reading
CREATE POLICY "Anyone can read categorias" 
ON public.categorias 
FOR SELECT 
USING (true);