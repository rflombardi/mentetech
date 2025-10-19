import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { InlineImageUpload } from "@/components/admin/InlineImageUpload";
import { 
  Code, 
  Eye, 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading2, 
  Heading3, 
  Link,
  Image as ImageIcon,
  Quote
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [mode, setMode] = useState<"visual" | "html">("visual");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertTextAtCursor = (beforeText: string, afterText: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + beforeText + selectedText + afterText + value.substring(end);
    onChange(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + beforeText.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertImageAtCursor = (imageHtml: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newText = value.substring(0, start) + '\n' + imageHtml + '\n' + value.substring(start);
    onChange(newText);

    // Position cursor after the inserted image
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + imageHtml.length + 2;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 100);
  };

  const formatActions = [
    { 
      icon: Bold, 
      label: "Negrito", 
      action: () => insertTextAtCursor("**", "**"),
      shortcut: "Ctrl+B"
    },
    { 
      icon: Italic, 
      label: "Itálico", 
      action: () => insertTextAtCursor("*", "*"),
      shortcut: "Ctrl+I"
    },
    { 
      icon: Heading2, 
      label: "Título H2", 
      action: () => insertTextAtCursor("\n## ", "\n"),
      shortcut: "H2"
    },
    { 
      icon: Heading3, 
      label: "Subtítulo H3", 
      action: () => insertTextAtCursor("\n### ", "\n"),
      shortcut: "H3"
    },
    { 
      icon: List, 
      label: "Lista não numerada", 
      action: () => insertTextAtCursor("\n- ", "\n"),
      shortcut: "Lista"
    },
    { 
      icon: ListOrdered, 
      label: "Lista numerada", 
      action: () => insertTextAtCursor("\n1. ", "\n"),
      shortcut: "1,2,3"
    },
    { 
      icon: Link, 
      label: "Link", 
      action: () => insertTextAtCursor("[", "](url)"),
      shortcut: "Link"
    },
    { 
      icon: Quote, 
      label: "Citação", 
      action: () => insertTextAtCursor("\n> ", "\n"),
      shortcut: "Quote"
    }
  ];

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Tabs value={mode} onValueChange={(value: any) => setMode(value)}>
          {/* Header with tabs and toolbar */}
          <div className="border-b bg-muted/30">
            <div className="flex items-center justify-between px-4 py-2">
              <TabsList className="grid w-48 grid-cols-2">
                <TabsTrigger value="visual" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Visual
                </TabsTrigger>
                <TabsTrigger value="html" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  HTML
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Formatting Toolbar - only show in visual mode */}
            {mode === "visual" && (
              <div className="px-4 pb-3">
                <div className="flex flex-wrap items-center gap-1 p-2 editor-toolbar rounded-lg">
                  {formatActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={action.action}
                      className="h-8 px-2 editor-toolbar-button"
                      title={`${action.label} (${action.shortcut})`}
                    >
                      <action.icon className="h-4 w-4" />
                    </Button>
                  ))}
                  
                  <div className="w-px h-6 bg-border mx-1" />
                  
                  <InlineImageUpload onImageInserted={insertImageAtCursor}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                      title="Inserir Imagem Ilustrativa"
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </InlineImageUpload>
                </div>
              </div>
            )}
          </div>

          <TabsContent value="visual" className="mt-0">
            <div className="p-4">
              <div className="min-h-[500px] border rounded-lg bg-background">
                <Textarea
                  ref={textareaRef}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="Comece a escrever seu post aqui...

Use a barra de ferramentas acima para formatar o texto ou inserir imagens ilustrativas.

Dicas rápidas:
• **texto em negrito** ou *texto em itálico*
• ## Título H2 ou ### Subtítulo H3
• - Lista com marcadores ou 1. Lista numerada
• [texto do link](https://exemplo.com)
• > Citação em destaque"
                  rows={20}
                  className="border-0 resize-none focus-visible:ring-0 text-base leading-relaxed p-4"
                />
              </div>
              
              {/* Quick tips */}
              <div className="mt-4 p-4 editor-preview rounded-lg border">
                <h4 className="font-medium text-sm text-foreground mb-3 flex items-center gap-2">
                  💡 <span className="gradient-text">Dicas para um conteúdo rico e engajante</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-3 w-3 text-accent" />
                    Use imagens para ilustrar conceitos complexos
                  </div>
                  <div className="flex items-center gap-2">
                    <Quote className="h-3 w-3 text-secondary" />
                    Adicione legendas explicativas às imagens
                  </div>
                  <div className="flex items-center gap-2">
                    <Heading2 className="h-3 w-3 text-primary" />
                    Estruture o conteúdo com títulos H2 e H3
                  </div>
                  <div className="flex items-center gap-2">
                    <List className="h-3 w-3 text-primary-glow" />
                    Use listas para organizar informações
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="html" className="mt-0">
            <div className="p-4">
              <Textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="<p>Digite o HTML do seu conteúdo...</p>

<h2>Exemplo de Título</h2>
<p>Parágrafo com <strong>texto em negrito</strong> e <em>itálico</em>.</p>

<figure class='inline-image-container my-6'>
  <img src='url-da-imagem' alt='Descrição' class='w-full max-w-2xl mx-auto rounded-lg shadow-card border border-border' />
  <figcaption class='text-center text-sm text-muted-foreground mt-3 italic'>Legenda da imagem</figcaption>
</figure>"
                rows={25}
                className="font-mono text-sm bg-background border rounded-lg p-4"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}