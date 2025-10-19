import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Por favor, preencha seu nome completo" })
    .max(100, { message: "Nome deve ter no máximo 100 caracteres" }),
  email: z
    .string()
    .trim()
    .email({ message: "Por favor, insira um e-mail válido" })
    .max(255, { message: "Email deve ter no máximo 255 caracteres" }),
  subject: z
    .string()
    .trim()
    .min(5, { message: "Por favor, informe o assunto da mensagem" })
    .max(200, { message: "Assunto deve ter no máximo 200 caracteres" }),
  message: z
    .string()
    .trim()
    .min(10, { message: "Por favor, escreva uma mensagem mais detalhada" })
    .max(2000, { message: "Mensagem deve ter no máximo 2000 caracteres" }),
  deseja_newsletter: z.boolean().default(false),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      deseja_newsletter: false,
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // Save message to database
      const { error: insertError } = await supabase
        .from("contact_messages")
        .insert([
          {
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
            deseja_newsletter: data.deseja_newsletter,
            status: "pending",
          },
        ]);

      if (insertError) {
        throw insertError;
      }

      // If user wants newsletter, add to newsletter subscribers
      if (data.deseja_newsletter) {
        await supabase
          .from("newsletter_subscribers")
          .insert([
            {
              email: data.email,
              nome: data.name,
              fonte: "contato",
              confirmado: false,
            },
          ])
          .select()
          .maybeSingle();
      }

      setIsSuccess(true);
      form.reset();

      toast({
        title: "Mensagem enviada com sucesso!",
        description: "Obrigado pelo contato. Responderemos em breve.",
      });
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar mensagem",
        description: "Por favor, tente novamente mais tarde.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEOHead
        metadata={{
          title: "Contato - Mente Tech",
          description: "Entre em contato com o Mente Tech. Envie suas dúvidas, sugestões ou feedbacks sobre IA, ciência e tecnologia.",
          canonical: `${window.location.origin}/contato`
        }}
      />
      <Layout>
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Entre em Contato</h1>
              <p className="text-lg text-muted-foreground">
                Tem alguma dúvida, sugestão ou feedback? Envie sua mensagem e entraremos em contato em breve.
              </p>
            </div>

            {isSuccess ? (
              <div className="bg-card border rounded-lg p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Mensagem Enviada!</h2>
                <p className="text-muted-foreground mb-6">
                  Obrigado pelo contato. Responderemos sua mensagem o mais breve possível.
                </p>
                <Button onClick={() => setIsSuccess(false)} variant="outline">
                  Enviar outra mensagem
                </Button>
              </div>
            ) : (
              <div className="bg-card border rounded-lg p-6 md:p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Digite seu nome completo" {...field} />
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
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="seu@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assunto</FormLabel>
                          <FormControl>
                            <Input placeholder="Sobre o que você quer falar?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mensagem</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Escreva sua mensagem aqui..."
                              className="min-h-[150px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="deseja_newsletter"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="font-normal cursor-pointer">
                              Quero receber novidades e conteúdos do Mente Tech
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Enviando mensagem..." : "Enviar mensagem"}
                    </Button>
                  </form>
                </Form>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Contact;
