-- Add status enum and publication date fields to posts table
CREATE TYPE post_status AS ENUM ('RASCUNHO', 'PUBLICADO', 'AGENDADO');

-- Add new columns to posts table
ALTER TABLE posts 
ADD COLUMN status post_status DEFAULT 'RASCUNHO',
ADD COLUMN data_publicacao_agendada TIMESTAMP WITH TIME ZONE;

-- Update existing posts to have PUBLICADO status if they are currently published
UPDATE posts 
SET status = 'PUBLICADO' 
WHERE publicado = true;

-- Update existing posts to have RASCUNHO status if they are currently not published
UPDATE posts 
SET status = 'RASCUNHO' 
WHERE publicado = false OR publicado IS NULL;

-- Update RLS policies for posts table to consider status
DROP POLICY IF EXISTS "Posts publicados são visíveis publicamente" ON posts;

-- Create new policy for public visibility - only show PUBLICADO posts
CREATE POLICY "Only published posts are publicly visible" 
ON posts 
FOR SELECT 
USING (status = 'PUBLICADO');

-- Create function to auto-publish scheduled posts
CREATE OR REPLACE FUNCTION auto_publish_scheduled_posts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE posts 
  SET status = 'PUBLICADO',
      data_publicacao = COALESCE(data_publicacao_agendada, now()),
      updated_at = now()
  WHERE status = 'AGENDADO' 
    AND data_publicacao_agendada IS NOT NULL 
    AND data_publicacao_agendada <= now();
END;
$$;

-- Create trigger to automatically set data_publicacao when status changes to PUBLICADO
CREATE OR REPLACE FUNCTION set_publication_date()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- If status is being changed to PUBLICADO and data_publicacao is null, set it to now
  IF NEW.status = 'PUBLICADO' AND OLD.status != 'PUBLICADO' AND NEW.data_publicacao IS NULL THEN
    NEW.data_publicacao = now();
  END IF;
  
  -- If status is AGENDADO, ensure data_publicacao_agendada is set
  IF NEW.status = 'AGENDADO' AND NEW.data_publicacao_agendada IS NULL THEN
    RAISE EXCEPTION 'Data de publicação agendada é obrigatória para posts agendados';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_publication_date
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION set_publication_date();

-- Add indexes for better performance
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_scheduled_date ON posts(data_publicacao_agendada) WHERE status = 'AGENDADO';