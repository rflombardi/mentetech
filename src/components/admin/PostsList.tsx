import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit3, Trash2, Search, Calendar, Clock, Star } from "lucide-react";
import { StatusBadge, statusConfig } from "@/components/admin/StatusSelector";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Post, Categoria, PostStatus } from "@/types/blog";

interface PostsListProps {
  posts: (Post & { categorias?: Categoria })[] | undefined;
  isLoading: boolean;
  onEditPost: (postId: string) => void;
}

export function PostsList({ posts, isLoading, onEditPost }: PostsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PostStatus>("all");
  const queryClient = useQueryClient();

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts-all'] });
      toast({
        title: "Post excluído",
        description: "O post foi excluído com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Change post status
  const changeStatusMutation = useMutation({
    mutationFn: async ({ postId, status }: { postId: string; status: PostStatus }) => {
      const payload: any = { status };
      
      if (status === 'PUBLICADO') {
        payload.data_publicacao = new Date().toISOString();
        payload.publicado = true;
      } else {
        payload.publicado = false;
      }
      
      if (status !== 'AGENDADO') {
        payload.data_publicacao_agendada = null;
      }

      const { error } = await supabase
        .from('posts')
        .update(payload)
        .eq('id', postId);
      
      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts-all'] });
      const statusName = statusConfig[status].label.toLowerCase();
      toast({
        title: "Status alterado",
        description: `O post foi marcado como ${statusName}.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao alterar status",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Auto-publish scheduled posts (manual trigger)
  const autoPublishMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc('auto_publish_scheduled_posts');
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts-all'] });
      toast({
        title: "Posts agendados publicados",
        description: "Posts com data de publicação vencida foram publicados automaticamente.",
      });
    }
  });

  // Filter posts
  const filteredPosts = posts?.filter(post => {
    const matchesSearch = post.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.resumo && post.resumo.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const isScheduledOverdue = (post: Post) => {
    if (post.status !== 'AGENDADO' || !post.data_publicacao_agendada) return false;
    return new Date(post.data_publicacao_agendada) <= new Date();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-muted rounded w-full mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with auto-publish button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gerenciar Posts</h2>
        {posts?.some(isScheduledOverdue) && (
          <Button
            onClick={() => autoPublishMutation.mutate()}
            disabled={autoPublishMutation.isPending}
            className="btn-hero"
          >
            <Clock className="mr-2 h-4 w-4" />
            Publicar Posts Agendados
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar posts por título ou resumo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os posts</SelectItem>
            <SelectItem value="AGENDADO">🕒 Agendados</SelectItem>
            <SelectItem value="PUBLICADO">✅ Publicados</SelectItem>
            <SelectItem value="RASCUNHO">📝 Rascunhos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts?.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== "all" 
                    ? "Nenhum post encontrado com os filtros aplicados." 
                    : "Nenhum post criado ainda. Que tal criar o primeiro?"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredPosts?.map((post) => (
            <Card 
              key={post.id} 
              className={`card-hover ${isScheduledOverdue(post) ? 'ring-2 ring-orange-500 bg-orange-50/50 dark:bg-orange-950/20' : ''}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      {post.is_featured && <Star className="h-5 w-5 text-yellow-500" />}
                      <CardTitle className="text-xl flex-1">{post.titulo}</CardTitle>
                      {isScheduledOverdue(post) && (
                        <Badge variant="destructive" className="ml-2">
                          Vencido
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">{post.resumo}</p>
                    <div className="flex flex-wrap gap-2 items-center">
                      <StatusBadge status={post.status} />
                      {post.categorias && (
                        <Badge variant="outline">{post.categorias.nome}</Badge>
                      )}
                      {post.tags?.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags && post.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{post.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {post.status === 'RASCUNHO' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => changeStatusMutation.mutate({
                          postId: post.id,
                          status: 'PUBLICADO'
                        })}
                        disabled={changeStatusMutation.isPending}
                        title="Publicar agora"
                      >
                        ✅
                      </Button>
                    )}
                    {post.status === 'PUBLICADO' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => changeStatusMutation.mutate({
                          postId: post.id,
                          status: 'RASCUNHO'
                        })}
                        disabled={changeStatusMutation.isPending}
                        title="Mover para rascunho"
                      >
                        📝
                      </Button>
                    )}
                    {isScheduledOverdue(post) && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => changeStatusMutation.mutate({
                          postId: post.id,
                          status: 'PUBLICADO'
                        })}
                        disabled={changeStatusMutation.isPending}
                        title="Publicar agora"
                      >
                        Publicar
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEditPost(post.id)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir post</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o post "{post.titulo}"? 
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deletePostMutation.mutate(post.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-muted-foreground">
                  <span>
                    Atualizado em {format(new Date(post.updated_at || new Date()), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </span>
                  <div className="flex flex-col sm:flex-row gap-2 text-xs">
                    {post.status === 'PUBLICADO' && post.data_publicacao && (
                      <span className="text-green-600 dark:text-green-400">
                        📅 Publicado em {format(new Date(post.data_publicacao), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    )}
                    {post.status === 'AGENDADO' && post.data_publicacao_agendada && (
                      <span className="text-blue-600 dark:text-blue-400">
                        🕒 Agendado para {format(new Date(post.data_publicacao_agendada), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </span>
                    )}
                    {post.visualizacoes && post.visualizacoes > 0 && (
                      <span>👁️ {post.visualizacoes} visualizações</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}