export type PostStatus = 'RASCUNHO' | 'PUBLICADO' | 'AGENDADO';

export interface Categoria {
  id: string;
  nome: string;
  slug: string;
  descricao?: string;
  cor?: string;
}

export interface Post {
  id: string;
  titulo: string;
  resumo: string;
  conteudo_html: string;
  tags: string[];
  categoria_id: string | null; // Pode ser nulo se não houver categoria
  data_publicacao: string | null;
  slug: string;
  imagem_url?: string;
  tempo_leitura?: number;
  autor?: string;
  publicado?: boolean;
  status: PostStatus;
  data_publicacao_agendada?: string | null;
  created_at?: string;
  updated_at?: string;
  visualizacoes?: number;
  categorias?: Categoria; // Propriedade para dados da categoria (objeto aninhado)
}

export interface BlogMetadata {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
}