import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Upload, Image as ImageIcon, X } from "lucide-react";

interface InlineImageUploadProps {
  onImageInserted: (imageHtml: string) => void;
  children: React.ReactNode;
}

export function InlineImageUpload({ onImageInserted, children }: InlineImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageCaption, setImageCaption] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [open, setOpen] = useState(false);

  const uploadImage = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro no upload",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `blog-content/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      setImagePreview(data.publicUrl);
      
      if (!imageAlt) {
        setImageAlt(file.name.split('.').slice(0, -1).join('.'));
      }

      toast({
        title: "Upload realizado",
        description: "Imagem carregada com sucesso! Adicione uma legenda se desejar.",
      });

    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erro no upload",
        description: error.message || "Falha no upload da imagem.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        uploadImage(acceptedFiles[0]);
      }
    },
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1,
    disabled: uploading || !!imagePreview
  });

  const handleInsertImage = () => {
    if (!imagePreview) return;

    const imageHtml = `
<figure class="inline-image-container my-6">
  <img 
    src="${imagePreview}" 
    alt="${imageAlt || 'Ilustração'}"
    class="w-full max-w-2xl mx-auto rounded-lg shadow-card border border-border"
    loading="lazy"
  />
  ${imageCaption ? `<figcaption class="text-center text-sm text-muted-foreground mt-3 italic">${imageCaption}</figcaption>` : ''}
</figure>
`;

    onImageInserted(imageHtml);
    
    // Reset form
    setImagePreview("");
    setImageCaption("");
    setImageAlt("");
    setOpen(false);

    toast({
      title: "Imagem inserida",
      description: "A imagem foi adicionada ao conteúdo com sucesso.",
    });
  };

  const handleCancel = () => {
    setImagePreview("");
    setImageCaption("");
    setImageAlt("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            Inserir Imagem Ilustrativa
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!imagePreview ? (
            <Card>
              <CardContent className="pt-6">
                <div
                  {...getRootProps()}
                  className={`
                    border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
                    ${isDragActive 
                      ? 'border-primary bg-primary/5 shadow-primary' 
                      : 'border-muted-foreground/25 hover:border-primary hover:bg-muted/50'
                    }
                    ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <input {...getInputProps()} />
                  
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <Upload className={`h-8 w-8 text-primary ${uploading ? 'animate-pulse' : ''}`} />
                    </div>
                    
                    <div>
                      <p className="text-lg font-medium text-foreground">
                        {uploading ? "Carregando imagem..." : 
                         isDragActive ? "Solte a imagem aqui" : 
                         "Clique ou arraste uma imagem"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        PNG, JPG, JPEG, GIF, WEBP até 5MB
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Image Preview */}
              <Card>
                <CardContent className="pt-6">
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview"
                      className="w-full max-w-lg mx-auto rounded-lg shadow-card border border-border"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setImagePreview("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Image Details */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="alt-text">Texto Alternativo (Alt Text) *</Label>
                  <Input
                    id="alt-text"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    placeholder="Descreva a imagem para acessibilidade..."
                    className="bg-background"
                  />
                  <p className="text-xs text-muted-foreground">
                    Importante para acessibilidade e SEO
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caption">Legenda da Imagem</Label>
                  <Input
                    id="caption"
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                    placeholder="Legenda explicativa (opcional)..."
                    className="bg-background"
                  />
                  <p className="text-xs text-muted-foreground">
                    Aparecerá abaixo da imagem para contextualizar a ilustração
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleInsertImage}
                  disabled={!imageAlt.trim()}
                  className="btn-hero"
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Inserir Imagem
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}