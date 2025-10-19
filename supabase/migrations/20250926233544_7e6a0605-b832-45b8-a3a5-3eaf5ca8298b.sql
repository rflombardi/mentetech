-- Add telefone field to newsletter_subscribers table
ALTER TABLE public.newsletter_subscribers 
ADD COLUMN telefone text;