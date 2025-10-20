import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, Zap, Target, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import heroImage from "@/assets/hero-ai-pme.jpg";
import type { Post, Categoria } from "@/types/blog";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch posts from Supabase
  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['posts', 'published'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*, categorias(nome, slug, cor)')
        .eq('status', 'PUBLICADO')
        .order('data_publicacao', { ascending: false });
      if (error) throw error;
      return data as Post[];
    }
  });

  // Fetch categories from Supabase
  const { data: categorias, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categorias'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categorias').select('*').order('nome');
      if (error) throw error;
      return data as Categoria[];
    }
  });

  // Fetch featured post
  const { data: featuredPostData, isLoading: featuredLoading } = useQuery({
    queryKey: ['posts', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*, categorias(nome, slug, cor)')
        .eq('is_featured', true)
        .eq('status', 'PUBLICADO')
        .limit(1)
        .single();
      if (error && error.code !== 'PGRST116') throw error; // Ignore 'no rows' error
      return data as Post | null;
    }
  });

  const featuredPost = featuredPostData ?? (posts && posts.length > 0 ? posts[0] : null);
  const latestPosts = posts?.filter(p => p.id !== featuredPost?.id) || [];

  // Filter posts based on search and category
  const filteredPosts = useMemo(() => {
    return latestPosts.filter(post => {
      const matchesSearch = searchQuery === "" || 
        post.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.resumo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === null || post.categoria_id === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, latestPosts]);

  const seoMetadata = {
    title: "Blog Mente Tech - Inteligência Artificial para PMEs Brasileiras",
    description: "Descubra como pequenas e médias empresas brasileiras podem transformar seus negócios com IA. Guias práticos, cases de sucesso e estratégias de implementação.",
    keywords: "inteligência artificial, IA, PME, pequenas médias empresas, brasil, automação, tecnologia, inovação",
    canonical: "https://blogmentetech.com.br"
  };

  return (
    <Layout>
      <SEOHead metadata={seoMetadata} />
      
      {/* Hero Section */}
      <section className="relative mb-12 rounded-2xl overflow-hidden shadow-elevated">
        <div className="absolute inset-0">
          <img 
            src={heroImage}
            alt="Inteligência Artificial para PMEs Brasileiras"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-secondary/80" />
        </div>
        
        <div className="relative px-8 py-16 lg:py-24 text-white">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="block">Inteligência Artificial</span>
              <span className="block text-accent">para PMEs Brasileiras</span>
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed">
              Descubra como sua PME pode usar IA para <strong>automatizar processos</strong>, 
              <strong> reduzir custos</strong> e <strong>aumentar a produtividade</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar por título, conteúdo ou tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? "bg-gradient-primary" : ""}
            >
              Todos
            </Button>
            {categoriesLoading ? (
              <Skeleton className="h-8 w-48" />
            ) : (
              categorias?.map((categoria) => (
                <Button
                  key={categoria.id}
                  variant={selectedCategory === categoria.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(categoria.id)}
                  className={selectedCategory === categoria.id ? "bg-gradient-primary" : ""}
                >
                  {categoria.nome}
                </Button>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="mb-12">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Artigo em Destaque</h2>
        </div>
        {featuredLoading || postsLoading ? (
          <Skeleton className="h-[400px] w-full rounded-lg" />
        ) : featuredPost ? (
          <PostCard post={featuredPost} categoria={featuredPost.categorias} variant="featured" />
        ) : null}
      </section>

      {/* Posts Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {searchQuery || selectedCategory ? "Resultados da Busca" : "Últimos Artigos"}
          </h2>
        </div>
        
        {postsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-[350px] w-full rounded-lg" />
            <Skeleton className="h-[350px] w-full rounded-lg" />
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} categoria={post.categorias} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum artigo encontrado</h3>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Home;