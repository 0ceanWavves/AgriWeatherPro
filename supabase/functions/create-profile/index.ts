import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Create a Supabase client with the service role key
const supabaseAdminClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);


Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('OK', { headers: corsHeaders });
  }

  try {
    const { user } = await req.json();

    // Update the profile instead of inserting a new one
    const { error } = await supabaseAdminClient
      .from('profiles')
      .update({
        first_name: user.user_metadata?.full_name?.split(' ')[0] || '',
        last_name: user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
        updated_at: new Date()
      })
      .eq('id', user.id);

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ message: 'Profile updated' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}); 