import { serve } from "https://deno.land/std@0.190.0/http/server.ts";


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  messageId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, subject, message, messageId }: ContactEmailRequest = await req.json();

    console.log("Sending contact email:", { name, email, subject, messageId });

    // Get contact email from environment or use default
    const contactEmail = Deno.env.get("CONTACT_EMAIL") || "contato@mentetech.com.br";
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

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
        subject: `Nova Mensagem de Contato: ${subject}`,
        html: `
          <h2>Nova Mensagem de Contato</h2>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Telefone:</strong> ${phone}</p>` : ''}
          <p><strong>Assunto:</strong> ${subject}</p>
          <p><strong>Mensagem:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      }),
    });

    const ownerEmailData = await ownerEmailResponse.json();
    console.log("Owner email sent successfully:", ownerEmailData);

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
          <h1>Obrigado por entrar em contato, ${name}!</h1>
          <p>Recebemos sua mensagem e retornaremos em breve.</p>
          <p><strong>Assunto:</strong> ${subject}</p>
          <p><strong>Sua mensagem:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <br>
          <p>Atenciosamente,<br>Equipe Mente Tech</p>
        `,
      }),
    });

    const userEmailData = await userEmailResponse.json();
    console.log("User confirmation email sent successfully:", userEmailData);

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
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
