import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, Zap, Target, Users } from "lucide-react";
import { posts, categorias } from "@/data/mockData";
import heroImage from "@/assets/hero-ai-pme.jpg";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter posts based on search and category
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = searchQuery === "" || 
        post.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.resumo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === null || post.categoria_id === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const featuredPost = posts[0];
  const featuredCategory = categorias.find(cat => cat.id === featuredPost.categoria_id);

  const seoMetadata = {
    title: "Blog Mente Tech - Inteligência Artificial para PMEs Brasileiras",
    description: "Descubra como pequenas e médias empresas brasileiras podem transformar seus negócios com IA. Guias práticos, cases de sucesso e estratégias de implementação.",
    keywords: "inteligência artificial, IA, PME, pequenas médias empresas, brasil, automação, tecnologia, inovação",
    canonical: "https://blogmentetech.com.br"
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Blog Mente Tech",
    "description": "Blog especializado em Inteligência Artificial para PMEs brasileiras",
    "url": "https://blogmentetech.com.br",
    "publisher": {
      "@type": "Organization",
      "name": "Mente Tech"
    },
    "blogPost": posts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.titulo,
      "description": post.resumo,
      "datePublished": post.data_publicacao,
      "author": {
        "@type": "Person",
        "name": post.autor
      }
    }))
  };

  return (
    <Layout>
      <SEOHead metadata={seoMetadata} structuredData={structuredData} />
      
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
            <Badge className="mb-4 bg-white/20 text-white border-0">
              ✨ Transformação Digital
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="block">Inteligência Artificial</span>
              <span className="block text-accent">para PMEs Brasileiras</span>
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed">
              Descubra como sua pequena ou média empresa pode usar IA para <strong>automatizar processos</strong>, 
              <strong> reduzir custos</strong> e <strong>aumentar a produtividade</strong> sem precisar de conhecimento técnico.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 font-semibold px-8">
                <Zap className="h-5 w-5 mr-2" />
                Explorar Guias
              </Button>
              <Button size="lg" variant="ghost" className="text-white border-white/30 hover:bg-white/10 px-8">
                <Users className="h-5 w-5 mr-2" />
                Cases de Sucesso
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">Foco em PMEs</div>
                  <div className="text-white/80">Soluções práticas e acessíveis</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">Resultados Reais</div>
                  <div className="text-white/80">Cases comprovados no Brasil</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">Implementação Rápida</div>
                  <div className="text-white/80">Sem complicações técnicas</div>
                </div>
              </div>
            </div>
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
            {categorias.map((categoria) => (
              <Button
                key={categoria.id}
                variant={selectedCategory === categoria.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(categoria.id)}
                className={selectedCategory === categoria.id ? "bg-gradient-primary" : ""}
              >
                {categoria.nome}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Artigo em Destaque</h2>
          </div>
          <PostCard post={featuredPost} categoria={featuredCategory} variant="featured" />
        </section>
      )}

      {/* Google AdSense Placeholder - Horizontal */}
      <section className="mb-12">
        <div className="bg-muted/20 border border-dashed border-muted-foreground/30 rounded-lg p-6 text-center">
          <div className="text-muted-foreground">
            <div className="text-xs uppercase tracking-wide mb-2">Publicidade</div>
            <div className="text-sm">Google AdSense - Banner Horizontal</div>
            <div className="text-xs">728x90 ou 970x250</div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {searchQuery || selectedCategory ? "Resultados da Busca" : "Últimos Artigos"}
          </h2>
          {filteredPosts.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {filteredPosts.length} {filteredPosts.length === 1 ? "artigo encontrado" : "artigos encontrados"}
            </span>
          )}
        </div>
        
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPosts.slice(1).map((post) => {
              const categoria = categorias.find(cat => cat.id === post.categoria_id);
              return (
                <PostCard key={post.id} post={post} categoria={categoria} />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum artigo encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Tente buscar por outros termos ou explore nossas categorias
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Home;