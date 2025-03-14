import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  console.log('Request received:', req.method, req.url);

  // Handle preflight requests (OPTIONS)
  if (req.method === 'OPTIONS') {
    console.log('OPTIONS request - returning CORS headers');
    return new Response('OK', { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json(); // Parse the JSON
    console.log('Request body:', requestBody); // Log the parsed body

    return new Response(JSON.stringify({ message: 'Received JSON data!' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400, // Use a 400 Bad Request for invalid JSON
    });
  }
}); 