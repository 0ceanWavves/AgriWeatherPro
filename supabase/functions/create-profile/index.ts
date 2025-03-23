import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 
;
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Create a Supabase client with the service role key
const supabaseAdminClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  try {
    const { record } = await req.json();
    const userId = record.id;

    if (req.method === 'POST' && userId) {
      const { error } = await supabase
        .from('profiles')
        .insert([{ id: userId }]);

      if (error) {
        throw error;
      }

      return new Response(
        JSON.stringify({ message: `Profile created for user ${userId}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
        JSON.stringify({message: `No action needed`}),
        {headers: { ...corsHeaders, "Content-Type": "application/json"}}
    )
  } catch (error) {
    console.error('Error creating profile:', error);
    return new Response(
      JSON.stringify({ error: `Failed to create profile: ${error.message}` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 },
    );
  }
});