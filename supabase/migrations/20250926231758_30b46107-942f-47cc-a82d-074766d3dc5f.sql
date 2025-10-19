-- Fix security warnings by setting search_path for functions

-- Update auto_publish_scheduled_posts function with proper search_path
CREATE OR REPLACE FUNCTION auto_publish_scheduled_posts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Update set_publication_date function with proper search_path
CREATE OR REPLACE FUNCTION set_publication_date()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
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