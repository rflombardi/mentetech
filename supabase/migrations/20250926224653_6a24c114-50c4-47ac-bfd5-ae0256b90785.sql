-- Insert initial categories for AI blog for SMEs (only if they don't exist)
INSERT INTO public.categorias (nome, slug, descricao) 
SELECT nome, slug, descricao FROM (VALUES 
  ('Inteligência Artificial', 'inteligencia-artificial', 'Artigos sobre conceitos fundamentais de IA aplicados a pequenas empresas'),
  ('Automação de Processos', 'automacao-processos', 'Como automatizar processos empresariais usando IA'),
  ('Marketing Digital', 'marketing-digital', 'Uso de IA para otimizar estratégias de marketing'),
  ('Atendimento ao Cliente', 'atendimento-cliente', 'Soluções de IA para melhorar o atendimento e relacionamento com clientes'),
  ('Ferramentas e Tecnologia', 'ferramentas-tecnologia', 'Reviews e tutoriais de ferramentas de IA para PMEs'),
  ('Casos de Sucesso', 'casos-sucesso', 'Histórias reais de empresas brasileiras que implementaram IA'),
  ('Tendências e Futuro', 'tendencias-futuro', 'Análises sobre o futuro da IA no mercado brasileiro')
) AS v(nome, slug, descricao)
WHERE NOT EXISTS (
  SELECT 1 FROM public.categorias c WHERE c.slug = v.slug
);

-- Add RLS policy for categorias INSERT (for admin use)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'categorias' 
        AND policyname = 'Authenticated users can create categories'
    ) THEN
        CREATE POLICY "Authenticated users can create categories" 
        ON public.categorias 
        FOR INSERT 
        WITH CHECK (true);
    END IF;
END $$;