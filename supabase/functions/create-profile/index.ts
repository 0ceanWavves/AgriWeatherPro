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

    // Insert a new row into the public.profiles table
    const { error } = await supabaseAdminClient
      .from('profiles')
      .insert([{
        id: user.id,
        username: user.user_metadata.username, // Get username from metadata
        full_name: user.user_metadata.full_name, // Get full_name from metadata
        website: user.user_metadata.website, // Get website from metadata
      }]);

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ message: 'Profile created' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    console.error('Error creating profile:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}); 