import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const contactSchema = z.object({
  name: z.string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z.string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  phone: z.string()
    .trim()
    .max(20, { message: "Phone must be less than 20 characters" })
    .optional()
    .nullable(),
  subject: z.string()
    .trim()
    .min(3, { message: "Subject must be at least 3 characters" })
    .max(200, { message: "Subject must be less than 200 characters" }),
  message: z.string()
    .trim()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(5000, { message: "Message must be less than 5000 characters" }),
  messageId: z.string().uuid({ message: "Invalid message ID format" }),
});

type ContactEmailRequest = z.infer<typeof contactSchema>;

// Escape HTML to prevent injection in email content
function escapeHtml(text: string): string {
  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEscapeMap[char] || char);
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse and validate input
    const rawBody = await req.json();
    const validationResult = contactSchema.safeParse(rawBody);

    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error.errors);
      return new Response(
        JSON.stringify({ 
          error: "Invalid input data",
          details: validationResult.error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { name, email, phone, subject, message, messageId } = validationResult.data;

    console.log("Sending contact email:", { name, email: email.substring(0, 3) + "***", subject, messageId });

    // Get contact email from environment or use default
    const contactEmail = Deno.env.get("CONTACT_EMAIL") || "contato@mentetech.com.br";
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Email service is not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Escape HTML in user-provided content
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = phone ? escapeHtml(phone) : null;
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message);

    // Send email to the site owner
    const ownerEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: "Mente Tech <noreply@mentetech.com.br>",
        to: [contactEmail],
        subject: `Nova Mensagem de Contato: ${safeSubject}`,
        html: `
          <h2>Nova Mensagem de Contato</h2>
          <p><strong>Nome:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          ${safePhone ? `<p><strong>Telefone:</strong> ${safePhone}</p>` : ''}
          <p><strong>Assunto:</strong> ${safeSubject}</p>
          <p><strong>Mensagem:</strong></p>
          <p>${safeMessage.replace(/\n/g, '<br>')}</p>
        `,
      }),
    });

    const ownerEmailData = await ownerEmailResponse.json();
    
    if (!ownerEmailResponse.ok) {
      console.error("Failed to send owner email:", ownerEmailData);
      throw new Error(ownerEmailData.message || "Failed to send email to owner");
    }

    console.log("Owner email sent successfully:", ownerEmailData.id);

    // Send confirmation email to the user
    const userEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: "Mente Tech <noreply@mentetech.com.br>",
        to: [email],
        subject: "Recebemos sua mensagem!",
        html: `
          <h1>Obrigado por entrar em contato, ${safeName}!</h1>
          <p>Recebemos sua mensagem e retornaremos em breve.</p>
          <p><strong>Assunto:</strong> ${safeSubject}</p>
          <p><strong>Sua mensagem:</strong></p>
          <p>${safeMessage.replace(/\n/g, '<br>')}</p>
          <br>
          <p>Atenciosamente,<br>Equipe Mente Tech</p>
        `,
      }),
    });

    const userEmailData = await userEmailResponse.json();
    
    if (!userEmailResponse.ok) {
      console.error("Failed to send user confirmation email:", userEmailData);
      // Don't throw here - owner email was already sent successfully
    } else {
      console.log("User confirmation email sent successfully:", userEmailData.id);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        ownerEmailId: ownerEmailData.id,
        userEmailId: userEmailData.id
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error.message);
    return new Response(
      JSON.stringify({ error: "An error occurred while sending your message" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
