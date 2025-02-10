
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { bioData } = await req.json()
    
    // Create OpenAI prompt from bio data
    const prompt = `Please summarize the following health information concisely:
    Diagnosis Date: ${bioData.diagnosisDate}
    Situation: ${bioData.situation}
    Mobility Description: ${bioData.mobilityDescription}
    Has seen physiotherapist: ${bioData.hasSeenPhysio}
    ${bioData.hasSeenPhysio === 'yes' ? `Physiotherapist Feedback: ${bioData.physioFeedback}` : ''}`

    // Generate summary using OpenAI
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a medical summarizer. Create a concise, professional summary of the patient\'s health information.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
      }),
    })

    const openAIData = await openAIResponse.json()
    const summary = openAIData.choices[0].message.content

    // Save the summary to the database
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: updateError } = await supabaseClient
      .from('user_bios')
      .update({ bio_summary: summary })
      .eq('user_id', req.headers.get('Authorization')?.split('Bearer ')[1])

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
