-- Criar tabela de categorias
CREATE TABLE public.categorias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de posts
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  resumo TEXT NOT NULL,
  conteudo_html TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  categoria_id UUID REFERENCES public.categorias(id),
  imagem_url TEXT,
  data_publicacao TIMESTAMP WITH TIME ZONE,
  publicado BOOLEAN DEFAULT false,
  visualizacoes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de newsletter/leads
CREATE TABLE public.newsletter_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  nome TEXT,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'cancelado')),
  fonte TEXT DEFAULT 'newsletter',
  data_inscricao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  confirmado BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para categorias (públicas para leitura)
CREATE POLICY "Categorias são visíveis publicamente"
ON public.categorias
FOR SELECT
USING (true);

-- Políticas RLS para posts (públicos apenas os publicados)
CREATE POLICY "Posts publicados são visíveis publicamente"
ON public.posts
FOR SELECT
USING (publicado = true);

-- Políticas RLS para newsletter (inserção pública, mas leitura restrita)
CREATE POLICY "Qualquer um pode se inscrever na newsletter"
ON public.newsletter_subscribers
FOR INSERT
WITH CHECK (true);

-- Índices para melhor performance
CREATE INDEX idx_posts_categoria_id ON public.posts(categoria_id);
CREATE INDEX idx_posts_publicado ON public.posts(publicado);
CREATE INDEX idx_posts_data_publicacao ON public.posts(data_publicacao DESC);
CREATE INDEX idx_posts_slug ON public.posts(slug);
CREATE INDEX idx_categorias_slug ON public.categorias(slug);
CREATE INDEX idx_newsletter_email ON public.newsletter_subscribers(email);

-- Função para atualizar timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar timestamps
CREATE TRIGGER update_categorias_updated_at
  BEFORE UPDATE ON public.categorias
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir algumas categorias iniciais
INSERT INTO public.categorias (nome, slug, descricao) VALUES
('Automação de Processos', 'automacao-processos', 'Como a IA pode automatizar processos empresariais'),
('Marketing Digital', 'marketing-digital', 'Estratégias de marketing com inteligência artificial'),
('Atendimento ao Cliente', 'atendimento-cliente', 'IA no atendimento e suporte ao cliente'),
('Análise de Dados', 'analise-dados', 'Como usar IA para análise e insights de negócios'),
('Ferramentas de IA', 'ferramentas-ia', 'Reviews e tutoriais de ferramentas de IA para PMEs');