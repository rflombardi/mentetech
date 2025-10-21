import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import DOMPurify from "dompurify";
import { marked } from 'marked'; // Importar marked (nome correto do pacote)

interface ContentPreviewProps {
  content: string;
  title?: string;
}

export function ContentPreview({ content, title }: ContentPreviewProps) {
  // Convert Markdown to HTML and sanitize for preview
  const previewHTML = DOMPurify.sanitize(marked.parse(content) as string);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Eye className="h-5 w-5 text-primary" />
          Preview do Conteúdo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-96 overflow-y-auto">
          {title && (
            <h1 className="text-2xl font-bold text-foreground mb-4 pb-2 border-b border-border">
              {title}
            </h1>
          )}
          <div 
            className="blog-content prose prose-gray dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: previewHTML }}
          />
        </div>
        
        <div className="mt-4 p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
          <p className="font-medium mb-1">ℹ️ Preview Simplificado</p>
          <p>Esta é uma visualização básica. O conteúdo final será renderizado com todos os estilos e formatações do blog.</p>
        </div>
      </CardContent>
    </Card>
  );
}