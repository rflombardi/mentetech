import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Clock, Calendar, Tag, Share2, Bookmark } from "lucide-react";
import DOMPurify from "dompurify";
import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Post } from "@/types/blog";

const PostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from('posts')
        .select('*, categorias(nome, slug, cor)')
        .eq('slug', slug)
        .eq('status', 'PUBLICADO')
        .single();
      if (error) throw error;
      return data as Post;
    },
    enabled: !!slug,
  });

  const { data: relatedPosts } = useQuery({
    queryKey: ['relatedPosts', post?.id],
    queryFn: async () => {
      if (!post) return [];
      const { data, error } = await supabase
        .from('posts')
        .select('*, categorias(nome, slug, cor)')
        .eq('categoria_id', post.categoria_id)
        .neq('id', post.id)
        .eq('status', 'PUBLICADO')
        .limit(2);
      if (error) throw error;
      return data as Post[];
    },
    enabled: !!post,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-1/4 mb-8" />
          <Skeleton className="h-16 w-full mb-4" />
          <Skeleton className="h-8 w-3/4 mb-8" />
          <Skeleton className="h-96 w-full mb-8" />
          <Skeleton className="h-6 w-full mb-4" />
          <Skeleton className="h-6 w-full mb-4" />
          <Skeleton className="h-6 w-5/6 mb-4" />
        </div>
      </Layout>
    );
  }
  
  if (isError || !post) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Artigo não encontrado</h1>
          <p className="text-muted-foreground mb-6">O artigo que você está procurando não existe ou não está publicado.</p>
          <Button onClick={() => navigate("/")}>Voltar ao Início</Button>
        </div>
      </Layout>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  };

  return (
    <Layout>
      <SEOHead metadata={{ title: post.titulo, description: post.resumo }} />
      
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          {post.categorias && (
            <Badge variant="secondary" className="mb-4">
              <Tag className="h-3 w-3 mr-1" />
              {post.categorias.nome}
            </Badge>
          )}
          
          <h1 className="text-3xl lg:text-4xl font-bold leading-tight mb-6">
            {post.titulo}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.data_publicacao)}</span>
            </div>
            {post.tempo_leitura && (
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{post.tempo_leitura} minutos de leitura</span>
              </div>
            )}
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed italic border-l-4 border-primary pl-4">
            {post.resumo}
          </p>
        </header>

        {post.imagem_url && (
          <div className="mb-8">
            <img 
              src={post.imagem_url}
              alt={post.titulo}
              className="w-full h-64 lg:h-96 object-cover rounded-2xl shadow-card"
            />
          </div>
        )}

        <div 
          className="blog-content text-foreground"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.conteudo_html) }}
        />

        {relatedPosts && relatedPosts.length > 0 && (
          <section className="mt-12">
            <h3 className="text-2xl font-bold mb-6">Artigos Relacionados</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <PostCard 
                  key={relatedPost.id} 
                  post={relatedPost} 
                  categoria={relatedPost.categorias} 
                />
              ))}
            </div>
          </section>
        )}
      </article>
    </Layout>
  );
};

export default PostPage;