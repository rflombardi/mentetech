import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, FileText, Settings, Home, LogOut, BarChart2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostsList } from "@/components/admin/PostsList";
import { PostForm } from "@/components/admin/PostForm";
import SEOHead from "@/components/SEOHead";
import { useAuth } from "@/contexts/AuthContext";
import type { Post } from "@/types/blog";

export default function Admin() {
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("posts");
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch all posts for stats and for the list component
  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['admin-posts-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*');
      
      if (error) throw error;
      return data as Post[];
    }
  });

  const handleCreatePost = () => {
    setEditingPost(null);
    setShowForm(true);
    setActiveTab("form");
  };

  const handleEditPost = (postId: string) => {
    setEditingPost(postId);
    setShowForm(true);
    setActiveTab("form");
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingPost(null);
    setActiveTab("posts");
  };

  // Calculate stats
  const publishedCount = posts?.filter(p => p.status === 'PUBLICADO').length || 0;
  const draftCount = posts?.filter(p => p.status === 'RASCUNHO').length || 0;
  const scheduledCount = posts?.filter(p => p.status === 'AGENDADO').length || 0;

  return (
    <>
      <SEOHead 
        metadata={{
          title: "Painel Administrativo - Blog IA para PMEs",
          description: "Gerencie posts do blog sobre Inteligência Artificial para pequenas e médias empresas brasileiras",
          canonical: "/admin"
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold gradient-text mb-2">
                  Painel Administrativo
                </h1>
                <p className="text-muted-foreground text-lg">
                  Gerencie o conteúdo do blog sobre IA para PMEs
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleCreatePost}
                  className="btn-hero"
                  size="lg"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Novo Post
                </Button>
                <Button
                  onClick={signOut}
                  variant="outline"
                  size="lg"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Posts Publicados</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{postsLoading ? '...' : publishedCount}</div>
                <p className="text-xs text-muted-foreground">
                  Visíveis para o público
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rascunhos</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{postsLoading ? '...' : draftCount}</div>
                <p className="text-xs text-muted-foreground">
                  Posts não publicados
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Agendados</CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{postsLoading ? '...' : scheduledCount}</div>
                <p className="text-xs text-muted-foreground">
                  Para publicação futura
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Card className="shadow-elevated">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="form" disabled={!showForm}>
                  {editingPost ? 'Editar Post' : 'Novo Post'}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="posts" className="mt-6">
                <PostsList 
                  posts={posts}
                  isLoading={postsLoading}
                  onEditPost={handleEditPost} 
                />
              </TabsContent>
              
              <TabsContent value="form" className="mt-6">
                {showForm && (
                  <PostForm 
                    postId={editingPost}
                    onSuccess={handleFormSuccess}
                    onCancel={() => {
                      setShowForm(false);
                      setEditingPost(null);
                      setActiveTab("posts");
                    }}
                  />
                )}
              </TabsContent>
            </Tabs>
          </Card>

          {/* Footer */}
          <div className="mt-8 flex justify-end">
            <Button 
              asChild
              variant="outline"
              size="lg" 
              className="gap-2"
            >
              <Link to="/">
                <Home className="h-4 w-4" />
                Voltar ao Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}