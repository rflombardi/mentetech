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
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.log('❌ No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Unauthorized: No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a client with the user's auth token to verify their identity and role
    const supabaseUserClient = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify user is authenticated
    const { data: { user }, error: userError } = await supabaseUserClient.auth.getUser();
    if (userError || !user) {
      console.log('❌ Invalid or expired token');
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has admin role using the has_role function
    // Using 'as any' because the local Database interface doesn't include RPC function types
    const { data: isAdmin, error: roleError } = await (supabaseUserClient.rpc as any)('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (roleError) {
      console.error('❌ Error checking admin role:', roleError.message);
      return new Response(
        JSON.stringify({ error: 'Failed to verify permissions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!isAdmin) {
      console.log('❌ User is not an admin:', user.id);
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Admin access verified for user:', user.id);

    // Use service role client for the actual database operations
    const supabaseServiceClient = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('🕒 Auto-publish scheduled posts function started');

    // Call the database function to auto-publish posts
    const { error: publishError } = await supabaseServiceClient.rpc('auto_publish_scheduled_posts');
    
    if (publishError) {
      console.error('❌ Error calling auto_publish_scheduled_posts:', publishError);
      throw publishError;
    }

    // Get the posts that were just published
    const { data: publishedPosts, error: fetchError } = await supabaseServiceClient
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
        error: 'An error occurred while processing your request',
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
