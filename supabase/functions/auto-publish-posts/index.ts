import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string;
          status: 'RASCUNHO' | 'PUBLICADO' | 'AGENDADO';
          data_publicacao_agendada: string | null;
          data_publicacao: string | null;
          titulo: string;
          updated_at: string;
        };
      };
    };
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('🕒 Auto-publish scheduled posts function started');

    // Call the database function to auto-publish posts
    const { error: publishError } = await supabaseClient.rpc('auto_publish_scheduled_posts');
    
    if (publishError) {
      console.error('❌ Error calling auto_publish_scheduled_posts:', publishError);
      throw publishError;
    }

    // Get the posts that were just published
    const { data: publishedPosts, error: fetchError } = await supabaseClient
      .from('posts')
      .select('id, titulo, data_publicacao')
      .eq('status', 'PUBLICADO')
      .gte('data_publicacao', new Date(Date.now() - 60000).toISOString()) // Published in the last minute
      .order('data_publicacao', { ascending: false });

    if (fetchError) {
      console.error('❌ Error fetching published posts:', fetchError);
      throw fetchError;
    }

    const publishedCount = publishedPosts?.length || 0;
    
    console.log(`✅ Auto-publish completed. ${publishedCount} posts published.`);
    
    if (publishedPosts && publishedPosts.length > 0) {
      console.log('📋 Published posts:', publishedPosts.map((p: any) => p.titulo));
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Auto-publish completed successfully. ${publishedCount} posts published.`,
        publishedPosts: publishedPosts || [],
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('❌ Auto-publish function error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});