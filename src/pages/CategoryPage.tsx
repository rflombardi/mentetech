import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Tag } from "lucide-react";
import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { posts, categorias } from "@/data/mockData";

const CategoryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const categoria = categorias.find(cat => cat.slug === slug);
  const categoryPosts = categoria ? posts.filter(post => post.categoria_id === categoria.id) : [];
  
  if (!categoria) {
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

  const seoMetadata = {
    title: `${categoria.nome} - Artigos sobre IA para PMEs | Blog Mente Tech`,
    description: `${categoria.descricao}. Encontre artigos especializados sobre ${categoria.nome.toLowerCase()} com foco em pequenas e médias empresas brasileiras.`,
    keywords: `${categoria.nome.toLowerCase()}, IA, PME, ${categoria.nome.toLowerCase().replace(" ", ", ")}, inteligência artificial`,
    canonical: `https://blogmentetech.com.br/categoria/${categoria.slug}`
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": categoria.nome,
    "description": categoria.descricao,
    "url": `https://blogmentetech.com.br/categoria/${categoria.slug}`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": categoryPosts.map((post, index) => ({
        "@type": "BlogPosting",
        "position": index + 1,
        "headline": post.titulo,
        "description": post.resumo,
        "url": `https://blogmentetech.com.br/post/${post.slug}`
      }))
    }
  };

  return (
    <Layout>
      <SEOHead metadata={seoMetadata} structuredData={structuredData} />
      
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>

        {/* Category Header */}
        <header className="mb-12 text-center">
          <Badge 
            variant="secondary" 
            className="mb-4 px-4 py-2 text-base"
            style={{ backgroundColor: `${categoria.cor}15`, color: categoria.cor }}
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
          
          <div className="mt-6 p-4 bg-gradient-card rounded-lg border-l-4" style={{ borderColor: categoria.cor }}>
            <p className="text-sm text-muted-foreground">
              <strong>{categoryPosts.length}</strong> {categoryPosts.length === 1 ? "artigo encontrado" : "artigos encontrados"} nesta categoria
            </p>
          </div>
        </header>

        {/* Posts Grid */}
        {categoryPosts.length > 0 ? (
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryPosts.map((post) => (
                <PostCard key={post.id} post={post} categoria={categoria} />
              ))}
            </div>
          </section>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Tag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Nenhum artigo encontrado</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Esta categoria ainda não possui artigos publicados. Volte em breve para conferir novos conteúdos!
            </p>
            <Button onClick={() => navigate("/")} variant="default">
              Explorar Outros Artigos
            </Button>
          </div>
        )}

        {/* Related Categories */}
        {categoryPosts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-border">
            <h3 className="text-2xl font-bold mb-6 text-center">Explore Outras Categorias</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categorias
                .filter(cat => cat.id !== categoria.id)
                .map((otherCategory) => {
                  const categoryPostCount = posts.filter(post => post.categoria_id === otherCategory.id).length;
                  return (
                    <button
                      key={otherCategory.id}
                      onClick={() => navigate(`/categoria/${otherCategory.slug}`)}
                      className="p-4 rounded-lg border border-border hover:shadow-card transition-all duration-200 text-left group hover:scale-[1.02]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: otherCategory.cor }}
                        />
                        <span className="text-xs text-muted-foreground">
                          {categoryPostCount} {categoryPostCount === 1 ? "artigo" : "artigos"}
                        </span>
                      </div>
                      <h4 className="font-semibold group-hover:text-primary transition-colors">
                        {otherCategory.nome}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {otherCategory.descricao}
                      </p>
                    </button>
                  );
                })}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default CategoryPage;