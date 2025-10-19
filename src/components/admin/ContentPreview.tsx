import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import DOMPurify from "dompurify";

interface ContentPreviewProps {
  content: string;
  title?: string;
}

export function ContentPreview({ content, title }: ContentPreviewProps) {
  // Simple function to convert markdown-like syntax to HTML for preview
  const convertToHTML = (text: string) => {
    return text
      // Headers
      .replace(/^### (.+$)/gim, '<h3>$1</h3>')
      .replace(/^## (.+$)/gim, '<h2>$1</h2>')
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Lists
      .replace(/^\- (.+$)/gim, '<li>$1</li>')
      .replace(/^1\. (.+$)/gim, '<li>$1</li>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
      // Quotes
      .replace(/^> (.+$)/gim, '<blockquote class="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">$1</blockquote>')
      // Line breaks
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
  };

  const previewHTML = convertToHTML(content);

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
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(`<p>${previewHTML}</p>`) }}
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