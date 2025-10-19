import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ImageUploadProps {
  currentImage?: string;
  onImageUploaded: (url: string) => void;
  className?: string;
}

export function ImageUpload({ currentImage, onImageUploaded, className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const uploadImage = async (file: File) => {
    setUploading(true);
    
    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('O arquivo deve ser uma imagem');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('A imagem deve ter no máximo 5MB');
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `posts/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      onImageUploaded(publicUrl);
      
      toast({
        title: "Imagem carregada",
        description: "A imagem foi carregada com sucesso.",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erro no upload",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      uploadImage(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  const removeImage = () => {
    onImageUploaded("");
  };

  return (
    <div className={className}>
      {currentImage ? (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <img
                src={currentImage}
                alt="Imagem atual"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card 
          {...getRootProps()} 
          className={`
            cursor-pointer transition-colors border-dashed 
            ${dragActive || isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
            ${uploading ? 'pointer-events-none opacity-50' : 'hover:border-primary hover:bg-primary/5'}
          `}
        >
          <input {...getInputProps()} />
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              {uploading ? (
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
              ) : (
                <div className="p-4 rounded-full bg-primary/10">
                  {dragActive || isDragActive ? (
                    <Upload className="h-8 w-8 text-primary" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-primary" />
                  )}
                </div>
              )}
              
              <div className="space-y-2">
                <p className="text-lg font-medium text-foreground">
                  {uploading 
                    ? 'Carregando imagem...' 
                    : dragActive || isDragActive 
                      ? 'Solte a imagem aqui' 
                      : 'Arraste uma imagem ou clique para selecionar'
                  }
                </p>
                
                {!uploading && (
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG, WEBP até 5MB
                  </p>
                )}
              </div>

              {!uploading && !dragActive && !isDragActive && (
                <Button type="button" variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Selecionar Imagem
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}