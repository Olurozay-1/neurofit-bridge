
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a motivational coach. Generate a short, impactful daily motivational quote (max 100 characters). Be direct and inspiring.'
          },
          {
            role: 'user',
            content: 'Generate a motivational quote for today.'
          }
        ],
        temperature: 0.7,
        max_tokens: 60,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('OpenAI API error:', error)
      throw new Error('Failed to generate quote')
    }

    const data = await response.json()
    
    if (!data.choices?.[0]?.message?.content) {
      console.error('Unexpected OpenAI response format:', data)
      throw new Error('Invalid response format from OpenAI')
    }

    return new Response(
      JSON.stringify({ quote: data.choices[0].message.content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in generate-quote function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
