export type PostStatus = 'RASCUNHO' | 'PUBLICADO' | 'AGENDADO';

export interface Post {
  id: string;
  titulo: string;
  resumo: string;
  conteudo_html: string;
  tags: string[];
  categoria_id: string;
  data_publicacao: string;
  slug: string;
  imagem_url?: string;
  tempo_leitura?: number;
  autor?: string;
  publicado?: boolean;
  status: PostStatus;
  data_publicacao_agendada?: string;
  created_at?: string;
  updated_at?: string;
  visualizacoes?: number;
  is_featured?: boolean;
}

export interface Categoria {
  id: string;
  nome: string;
  slug: string;
  descricao?: string;
  cor?: string;
}

export interface BlogMetadata {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
}