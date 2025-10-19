import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, Phone, User, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const newsletterSchema = z.object({
  nome: z.string()
    .trim()
    .min(2, { message: "Nome deve ter pelo menos 2 caracteres" })
    .max(100, { message: "Nome deve ter no máximo 100 caracteres" }),
  email: z.string()
    .trim()
    .email({ message: "E-mail inválido" })
    .max(255, { message: "E-mail deve ter no máximo 255 caracteres" }),
  telefone: z.string()
    .trim()
    .min(10, { message: "Telefone deve ter pelo menos 10 caracteres" })
    .max(20, { message: "Telefone deve ter no máximo 20 caracteres" })
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

interface NewsletterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewsletterModal = ({ open, onOpenChange }: NewsletterModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: ""
    }
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setIsSubmitting(true);

    try {
      // Check if email already exists
      const { data: existingSubscriber } = await supabase
        .from('newsletter_subscribers')
        .select('id')
        .eq('email', data.email)
        .maybeSingle();

      if (existingSubscriber) {
        toast({
          title: "E-mail já cadastrado",
          description: "Este e-mail já está inscrito em nossa newsletter.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Insert new subscriber
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({
          nome: data.nome,
          email: data.email,
          telefone: data.telefone || null,
          confirmado: true,
          status: 'ativo',
          fonte: 'newsletter'
        });

      if (error) {
        throw error;
      }

      // Success state
      setIsSubmitted(true);
      form.reset();

      toast({
        title: "Inscrição realizada com sucesso! ✅",
        description: "Você receberá conteúdo exclusivo sobre IA para PMEs.",
      });

      // Close modal after 2 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        onOpenChange(false);
      }, 2000);

    } catch (error) {
      if (import.meta.env.DEV) console.error('Newsletter subscription error:', error);
      toast({
        title: "Erro ao realizar inscrição",
        description: "Tente novamente em alguns momentos.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
      setIsSubmitted(false);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-card border-border/50 shadow-elevated">
        <DialogHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold gradient-text">
            Newsletter Gratuita
          </DialogTitle>
          <p className="text-muted-foreground text-sm">
            Receba conteúdo exclusivo sobre IA para PMEs direto no seu e-mail
          </p>
        </DialogHeader>

        {isSubmitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Inscrição confirmada!</h3>
              <p className="text-muted-foreground text-sm">
                Obrigado por se juntar à nossa comunidade ✨
              </p>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">Nome completo *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Seu nome completo"
                          className="pl-10 bg-background/50 border-border/50 focus:border-primary transition-colors"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">E-mail *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          type="email"
                          placeholder="seu@email.com"
                          className="pl-10 bg-background/50 border-border/50 focus:border-primary transition-colors"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">Telefone *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          type="tel"
                          placeholder="(11) 99999-9999"
                          className="pl-10 bg-background/50 border-border/50 focus:border-primary transition-colors"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Inscrevendo...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Inscrever-se
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Respeitamos sua privacidade. Sem spam, apenas conteúdo de qualidade.
              </p>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};