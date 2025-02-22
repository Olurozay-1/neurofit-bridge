
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, userId } = await req.json()
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!openAIApiKey || !supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing environment variables')
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch user's bio if available
    let bioContext = ""
    if (userId) {
      const { data: bioData } = await supabase
        .from('user_bios')
        .select('bio_summary')
        .eq('user_id', userId)
        .single()

      if (bioData?.bio_summary) {
        bioContext = `Context about the user: ${bioData.bio_summary}\n\n`
      }
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are NeuroPT, a knowledgeable AI assistant specializing in physical therapy and rehabilitation. 
            ${bioContext}
            Format your responses in clean markdown:
            
            1. Use proper headings with a single '#' for main titles
            2. Use bullet points with '-' for lists
            3. Use bold with ** for emphasis sparingly
            4. Use proper spacing between paragraphs
            5. Keep responses clear and professional
            6. Don't use heading levels deeper than ### (avoid ####)
            7. Avoid using special characters or excessive formatting`
          },
          { role: 'user', content: prompt }
        ],
      }),
    })

    const data = await response.json()
    const generatedText = data.choices[0].message.content

    return new Response(
      JSON.stringify({ generatedText }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
