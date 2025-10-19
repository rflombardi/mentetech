-- Add newsletter subscription field to contact_messages table
ALTER TABLE contact_messages 
ADD COLUMN IF NOT EXISTS deseja_newsletter boolean DEFAULT false;