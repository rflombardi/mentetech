import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ContentPreview } from "@/components/admin/ContentPreview";
import { Save, X, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { StatusSelector } from "@/components/admin/StatusSelector";
import { DateTimePicker } from "@/components/admin/DateTimePicker";
import type { Post, Categoria, PostStatus } from "@/types/blog";

const postSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório").max(200, "Título muito longo"),
  resumo: z.string().min(1, "Resumo é obrigatório").max(500, "Resumo muito longo"),
  conteudo_html: z.string().min(1, "Conteúdo é obrigatório"),
  categoria_id: z.string().uuid("Selecione uma categoria"),
  tags: z.array(z.string()).max(10, "Máximo 10 tags"),
  capa_url: z.string().optional(),
  status: z.enum(['RASCUNHO', 'PUBLICADO', 'AGENDADO'] as const),
  data_publicacao_agendada: z.date().optional(),
  slug: z.string().min(1, "Slug é obrigatório"),
}).refine((data) => {
  // If status is AGENDADO, data_publicacao_agendada is required
  if (data.status === 'AGENDADO' && !data.data_publicacao_agendada) {
    return false;
  }
  return true;
}, {
  message: "Data de publicação é obrigatória para posts agendados",
  path: ["data_publicacao_agendada"],
});

type PostFormData = z.infer<typeof postSchema>;

interface PostFormProps {
  postId: string | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PostForm({ postId, onSuccess, onCancel }: PostFormProps) {
  const [formData, setFormData] = useState<Partial<PostFormData>>({
    titulo: "",
    resumo: "",
    conteudo_html: "",
    categoria_id: "",
    tags: [],
    capa_url: "",
    status: "RASCUNHO" as PostStatus,
    data_publicacao_agendada: undefined,
    slug: "",
  });
  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('nome');
      
      if (error) throw error;
      return data as Categoria[];
    }
  });

  // Fetch post data if editing
  const { data: post, isLoading } = useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      if (!postId) return null;
      
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single();
      
      if (error) throw error;
      return data as Post;
    },
    enabled: !!postId
  });

  // Load post data into form
  useEffect(() => {
    if (post) {
      setFormData({
        titulo: post.titulo,
        resumo: post.resumo,
        conteudo_html: post.conteudo_html,
        categoria_id: post.categoria_id || "",
        tags: post.tags || [],
        capa_url: post.imagem_url || "",
        status: post.status || "RASCUNHO",
        data_publicacao_agendada: post.data_publicacao_agendada ? new Date(post.data_publicacao_agendada) : undefined,
        slug: post.slug,
      });
    }
  }, [post]);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with dashes
      .replace(/-+/g, '-') // Replace multiple dashes
      .trim();
  };

  // Auto-generate slug when title changes
  useEffect(() => {
    if (formData.titulo && !postId) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.titulo)
      }));
    }
  }, [formData.titulo, postId]);

  // Save post mutation
  const savePostMutation = useMutation({
    mutationFn: async (data: PostFormData) => {
      const payload = {
        titulo: data.titulo,
        resumo: data.resumo,
        conteudo_html: data.conteudo_html,
        categoria_id: data.categoria_id,
        tags: data.tags,
        imagem_url: data.capa_url || null,
        status: data.status,
        data_publicacao_agendada: data.data_publicacao_agendada ? data.data_publicacao_agendada.toISOString() : null,
        slug: data.slug,
        // Set data_publicacao only if publishing immediately
        data_publicacao: data.status === 'PUBLICADO' ? new Date().toISOString() : null,
        // Keep legacy publicado field for compatibility
        publicado: data.status === 'PUBLICADO',
      };

      if (postId) {
        const { error } = await supabase
          .from('posts')
          .update(payload)
          .eq('id', postId);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('posts')
          .insert([payload]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: postId ? "Post atualizado" : "Post criado",
        description: postId 
          ? "O post foi atualizado com sucesso."
          : "O post foi criado com sucesso.",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = postSchema.parse(formData);
      setErrors({});
      savePostMutation.mutate(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  if (isLoading && postId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader className="bg-gradient-card">
          <CardTitle className="flex items-center gap-2">
            {postId ? (
              <>
                <Save className="h-5 w-5 text-primary" />
                Editar Post
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 text-primary" />
                Novo Post
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
              placeholder="Digite o título do post..."
              className={errors.titulo ? "border-destructive" : ""}
            />
            {errors.titulo && <p className="text-sm text-destructive">{errors.titulo}</p>}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL) *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="url-do-post"
              className={errors.slug ? "border-destructive" : ""}
            />
            {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
          </div>

          {/* Resume */}
          <div className="space-y-2">
            <Label htmlFor="resumo">Resumo *</Label>
            <Textarea
              id="resumo"
              value={formData.resumo}
              onChange={(e) => setFormData(prev => ({ ...prev, resumo: e.target.value }))}
              placeholder="Breve descrição do post..."
              rows={3}
              className={errors.resumo ? "border-destructive" : ""}
            />
            {errors.resumo && <p className="text-sm text-destructive">{errors.resumo}</p>}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Categoria *</Label>
            <Select
              value={formData.categoria_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, categoria_id: value }))}
            >
              <SelectTrigger className={errors.categoria_id ? "border-destructive" : ""}>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoria_id && <p className="text-sm text-destructive">{errors.categoria_id}</p>}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Digite uma tag..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" onClick={addTag} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="cursor-pointer">
                  {tag}
                  <X
                    className="ml-1 h-3 w-3"
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
            {errors.tags && <p className="text-sm text-destructive">{errors.tags}</p>}
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <Label>Imagem de Capa</Label>
            <ImageUpload
              currentImage={formData.capa_url}
              onImageUploaded={(url) => setFormData(prev => ({ ...prev, capa_url: url }))}
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label>Conteúdo *</Label>
            <RichTextEditor
              value={formData.conteudo_html || ""}
              onChange={(content) => setFormData(prev => ({ ...prev, conteudo_html: content }))}
            />
            {errors.conteudo_html && <p className="text-sm text-destructive">{errors.conteudo_html}</p>}
          </div>

          {/* Content Preview - show only if there's content */}
          {formData.conteudo_html && formData.conteudo_html.trim().length > 50 && (
            <ContentPreview 
              content={formData.conteudo_html} 
              title={formData.titulo}
            />
          )}

          {/* Status and Publication */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status do Post *</Label>
              <StatusSelector
                value={formData.status || "RASCUNHO"}
                onChange={(status) => setFormData(prev => ({ 
                  ...prev, 
                  status,
                  // Clear scheduled date if not scheduling
                  data_publicacao_agendada: status !== 'AGENDADO' ? undefined : prev.data_publicacao_agendada
                }))}
                className={errors.status ? "border-destructive" : ""}
              />
              {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
            </div>

            {/* Show date picker only for scheduled posts */}
            {formData.status === 'AGENDADO' && (
              <div className="space-y-2">
                <Label>Data e Hora de Publicação *</Label>
                <DateTimePicker
                  value={formData.data_publicacao_agendada}
                  onChange={(date) => setFormData(prev => ({ ...prev, data_publicacao_agendada: date }))}
                  placeholder="Agendar publicação..."
                />
                {errors.data_publicacao_agendada && (
                  <p className="text-sm text-destructive">{errors.data_publicacao_agendada}</p>
                )}
              </div>
            )}
          </div>

          {/* Status-specific help text */}
          <div className="p-3 bg-muted/50 rounded-lg text-sm">
            {formData.status === 'RASCUNHO' && (
              <p className="text-muted-foreground">
                📝 <strong>Rascunho:</strong> O post será salvo mas não aparecerá no blog público. Você pode editá-lo e publicá-lo posteriormente.
              </p>
            )}
            {formData.status === 'PUBLICADO' && (
              <p className="text-green-700 dark:text-green-400">
                ✅ <strong>Publicado:</strong> O post será publicado imediatamente e ficará visível no blog.
              </p>
            )}
            {formData.status === 'AGENDADO' && (
              <p className="text-blue-700 dark:text-blue-400">
                🕒 <strong>Agendado:</strong> O post será publicado automaticamente na data e hora selecionadas.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={savePostMutation.isPending}
          className="btn-hero"
        >
          <Save className="mr-2 h-4 w-4" />
          {savePostMutation.isPending ? "Salvando..." : "Salvar Post"}
        </Button>
      </div>
    </form>
  );
}