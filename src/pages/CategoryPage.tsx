import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Tag } from "lucide-react";
import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Post, Categoria } from "@/types/blog";

const CategoryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  // Fetch category and its posts
  const { data, isLoading, isError } = useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      if (!slug) return null;

      // Fetch category details
      const { data: categoryData, error: categoryError } = await supabase
        .from('categorias')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (categoryError) throw categoryError;

      // Fetch posts for this category
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*, categorias(nome, slug, cor)')
        .eq('categoria_id', categoryData.id)
        .eq('status', 'PUBLICADO')
        .order('data_publicacao', { ascending: false });

      if (postsError) throw postsError;

      return { categoria: categoryData as Categoria, posts: postsData as Post[] };
    }
  });

  if (isLoading) {
    return (
      <Layout>
        <Skeleton className="h-12 w-1/2 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </Layout>
    );
  }

  if (isError || !data) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Categoria não encontrada</h1>
          <p className="text-muted-foreground mb-6">A categoria que você está procurando não existe.</p>
          <Button onClick={() => navigate("/")}>Voltar ao Início</Button>
        </div>
      </Layout>
    );
  }

  const { categoria, posts: categoryPosts } = data;

  return (
    <Layout>
      <SEOHead metadata={{
        title: `${categoria.nome} - Artigos sobre IA para PMEs`,
        description: categoria.descricao || `Artigos sobre ${categoria.nome}`,
      }} />
      
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <Badge 
            variant="secondary" 
            className="mb-4 px-4 py-2 text-base"
          >
            <Tag className="h-4 w-4 mr-2" />
            {categoria.nome}
          </Badge>
          
          <h1 className="text-3xl lg:text-4xl font-bold mb-4 gradient-text">
            {categoria.nome}
          </h1>
          
          {categoria.descricao && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {categoria.descricao}
            </p>
          )}
        </header>

        {categoryPosts.length > 0 ? (
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryPosts.map((post) => (
                <PostCard key={post.id} post={post} categoria={post.categorias} />
              ))}
            </div>
          </section>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Nenhum artigo encontrado</h2>
            <p className="text-muted-foreground mb-6">Esta categoria ainda não possui artigos publicados.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryPage;