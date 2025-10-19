import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, Tag, Share2, Bookmark } from "lucide-react";
import DOMPurify from "dompurify";
import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { posts, categorias } from "@/data/mockData";

const PostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const post = posts.find(p => p.slug === slug);
  const categoria = post ? categorias.find(cat => cat.id === post.categoria_id) : undefined;
  
  if (!post) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Artigo não encontrado</h1>
          <p className="text-muted-foreground mb-6">O artigo que você está procurando não existe.</p>
          <Button onClick={() => navigate("/")}>Voltar ao Início</Button>
        </div>
      </Layout>
    );
  }

  const relatedPosts = posts
    .filter(p => p.id !== post.id && (p.categoria_id === post.categoria_id || 
            p.tags.some(tag => post.tags.includes(tag))))
    .slice(0, 2);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long', 
      year: 'numeric'
    });
  };

  const seoMetadata = {
    title: `${post.titulo} | Blog Mente Tech`,
    description: post.resumo,
    keywords: post.tags.join(", "),
    canonical: `https://blogmentetech.com.br/post/${post.slug}`
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.titulo,
    "description": post.resumo,
    "image": post.imagem_url,
    "datePublished": post.data_publicacao,
    "dateModified": post.data_publicacao,
    "author": {
      "@type": "Person",
      "name": post.autor || "Mente Tech"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Mente Tech",
      "logo": {
        "@type": "ImageObject",
        "url": "https://blogmentetech.com.br/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://blogmentetech.com.br/post/${post.slug}`
    }
  };

  return (
    <Layout>
      <SEOHead metadata={seoMetadata} structuredData={structuredData} />
      
      <article className="max-w-4xl mx-auto">
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

        {/* Article Header */}
        <header className="mb-8">
          {categoria && (
            <Badge 
              variant="secondary" 
              className="mb-4" 
              style={{ backgroundColor: `${categoria.cor}15`, color: categoria.cor }}
            >
              <Tag className="h-3 w-3 mr-1" />
              {categoria.nome}
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
            <div className="flex items-center space-x-1">
              <span>Por {post.autor}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 mb-6">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
            <Button variant="outline" size="sm">
              <Bookmark className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed italic border-l-4 border-primary pl-4">
            {post.resumo}
          </p>
        </header>

        {/* Featured Image */}
        {post.imagem_url && (
          <div className="mb-8">
            <img 
              src={post.imagem_url}
              alt={post.titulo}
              className="w-full h-64 lg:h-96 object-cover rounded-2xl shadow-card"
            />
          </div>
        )}

        {/* Google AdSense Placeholder - In-Article */}
        <div className="my-8">
          <Card className="bg-muted/20 border-dashed">
            <CardContent className="p-6 text-center">
              <div className="text-muted-foreground">
                <div className="text-xs uppercase tracking-wide mb-2">Publicidade</div>
                <div className="text-sm">Google AdSense - In-Article</div>
                <div className="text-xs">Responsive</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Article Content */}
        <div 
          className="blog-content text-foreground"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.conteudo_html) }}
        />

        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-border">
          <h3 className="text-lg font-semibold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="hover:bg-primary hover:text-white cursor-pointer transition-colors">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Author Bio */}
        <Card className="mt-8 bg-gradient-card shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">MT</span>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Mente Tech</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Especialistas em democratizar o acesso à Inteligência Artificial para pequenas e médias empresas brasileiras. 
                  Nossa missão é traduzir tecnologias complexas em soluções práticas e acessíveis.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-12">
            <h3 className="text-2xl font-bold mb-6">Artigos Relacionados</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => {
                const relatedCategoria = categorias.find(cat => cat.id === relatedPost.categoria_id);
                return (
                  <PostCard 
                    key={relatedPost.id} 
                    post={relatedPost} 
                    categoria={relatedCategoria} 
                  />
                );
              })}
            </div>
          </section>
        )}
      </article>
    </Layout>
  );
};

export default PostPage;