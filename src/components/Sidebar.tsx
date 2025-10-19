import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Categoria, Post } from "@/types/blog";
import { Link } from "react-router-dom";
import { TrendingUp, Mail, Star, ArrowRight } from "lucide-react";
import { useNewsletter } from "@/contexts/NewsletterContext";

interface SidebarProps {
  categorias: Categoria[];
  postsRecentes?: Post[];
  postsPopulares?: Post[];
}

const Sidebar = ({ categorias, postsRecentes = [], postsPopulares = [] }: SidebarProps) => {
  const { openModal } = useNewsletter();
  
  return (
    <div className="space-y-6">
      {/* Newsletter Signup */}
      <Card className="bg-gradient-hero text-white border-0 shadow-elevated">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <CardTitle className="text-lg">Newsletter Gratuita</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-white/90 text-sm mb-4">
            Receba semanalmente as últimas tendências em IA para PMEs diretamente na sua caixa de entrada.
          </p>
          <Button 
            onClick={openModal}
            variant="secondary" 
            className="w-full bg-white text-primary hover:bg-white/90 font-medium"
          >
            Assinar Grátis
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>

      {/* Categorias */}
      <Card className="shadow-card border-0 bg-gradient-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Categorias</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {categorias.map((categoria) => (
              <Link 
                key={categoria.id}
                to={`/categoria/${categoria.slug}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: categoria.cor }}
                  />
                  <span className="font-medium group-hover:text-primary transition-colors">
                    {categoria.nome}
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Posts Populares */}
      {postsPopulares.length > 0 && (
        <Card className="shadow-card border-0 bg-gradient-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Star className="h-5 w-5 text-secondary" />
              <span>Mais Populares</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {postsPopulares.slice(0, 3).map((post, index) => (
                <div key={post.id} className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link 
                      to={`/post/${post.slug}`}
                      className="text-sm font-medium leading-tight hover:text-primary transition-colors duration-200 line-clamp-2 block"
                    >
                      {post.titulo}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1">
                      {post.tempo_leitura} min de leitura
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Google AdSense Placeholder */}
      <Card className="shadow-card border-0 bg-muted/20">
        <CardContent className="p-4 text-center">
          <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="text-xs uppercase tracking-wide mb-2">Publicidade</div>
              <div className="text-sm">Google AdSense</div>
              <div className="text-xs">300x250</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tags Populares */}
      <Card className="shadow-card border-0 bg-gradient-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Tags Populares</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            {[
              "chatbot", "automação", "pme", "ia generativa", 
              "marketing", "vendas", "atendimento", "crm"
            ].map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-xs hover:bg-primary hover:text-white cursor-pointer transition-colors duration-200"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sidebar;