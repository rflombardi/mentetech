import { Clock, Tag, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Post, Categoria } from "@/types/blog";
import { Link } from "react-router-dom";

interface PostCardProps {
  post: Post;
  categoria?: Categoria;
  variant?: "default" | "featured" | "compact";
}

const PostCard = ({ post, categoria, variant = "default" }: PostCardProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long', 
      year: 'numeric'
    });
  };

  if (variant === "featured") {
    return (
      <Card className="card-hover shadow-card bg-gradient-card border-0 overflow-hidden">
        <div className="relative h-64 overflow-hidden">
          {post.imagem_url && (
            <img 
              src={post.imagem_url}
              alt={post.titulo}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            {categoria && (
              <Badge 
                variant="secondary" 
                className="mb-2 bg-white/90 text-primary border-0"
              >
                {categoria.nome}
              </Badge>
            )}
          </div>
        </div>
        
        <CardHeader className="pb-3">
          <Link to={`/post/${post.slug}`} className="group">
            <h2 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors duration-200 line-clamp-2">
              {post.titulo}
            </h2>
          </Link>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
            {post.resumo}
          </p>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.data_publicacao)}</span>
              </div>
              {post.tempo_leitura && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{post.tempo_leitura} min</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === "compact") {
    return (
      <Card className="card-hover shadow-card bg-gradient-card border-0">
        <CardContent className="p-4">
          <div className="flex space-x-4">
            {post.imagem_url && (
              <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                <img 
                  src={post.imagem_url}
                  alt={post.titulo}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <Link to={`/post/${post.slug}`} className="group">
                <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors duration-200 line-clamp-2 mb-1">
                  {post.titulo}
                </h3>
              </Link>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                {post.resumo}
              </p>
              <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                <span>{formatDate(post.data_publicacao)}</span>
                {post.tempo_leitura && (
                  <span>{post.tempo_leitura} min</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-hover shadow-card bg-gradient-card border-0 h-full flex flex-col">
      {post.imagem_url && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={post.imagem_url}
            alt={post.titulo}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      
      <CardHeader className="pb-3">
        {categoria && (
          <Badge 
            variant="secondary" 
            className="w-fit mb-2" 
            style={{ backgroundColor: `${categoria.cor}15`, color: categoria.cor }}
          >
            <Tag className="h-3 w-3 mr-1" />
            {categoria.nome}
          </Badge>
        )}
        
        <Link to={`/post/${post.slug}`} className="group">
          <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors duration-200 line-clamp-2">
            {post.titulo}
          </h3>
        </Link>
      </CardHeader>

      <CardContent className="pt-0 flex-1 flex flex-col">
        <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed flex-1">
          {post.resumo}
        </p>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.data_publicacao)}</span>
            </div>
            {post.tempo_leitura && (
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{post.tempo_leitura} min</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;