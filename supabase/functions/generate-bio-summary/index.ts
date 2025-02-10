
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
    const { bioData, userId } = await req.json()
    
    // Create OpenAI prompt for bio summary
    const bioPrompt = `Please summarize the following health information concisely:
    Diagnosis Date: ${bioData.diagnosisDate}
    Situation: ${bioData.situation}
    Mobility Description: ${bioData.mobilityDescription}
    Has seen physiotherapist: ${bioData.hasSeenPhysio}
    ${bioData.hasSeenPhysio === 'yes' ? `Physiotherapist Feedback: ${bioData.physioFeedback}` : ''}`

    // Create OpenAI prompt for program recommendations
    const programPrompt = `Based on the following health information, provide personalized exercise recommendations:
    Diagnosis Date: ${bioData.diagnosisDate}
    Situation: ${bioData.situation}
    Mobility Description: ${bioData.mobilityDescription}
    Has seen physiotherapist: ${bioData.hasSeenPhysio}
    ${bioData.hasSeenPhysio === 'yes' ? `Physiotherapist Feedback: ${bioData.physioFeedback}` : ''}
    About Me: ${bioData.aboutMe}
    
    Please provide:
    1. A list of 3-5 focus areas for exercises
    2. Specific advice about exercise frequency
    3. A list of 3-5 daily tips for staying active
    Format the response as JSON with these keys: focus_areas (array), frequency_advice (string), daily_tips (array)`

    // Create OpenAI prompt for motivational quote
    const quotePrompt = `Based on this person's interests and situation, generate an inspiring and relevant motivational quote:
    About Me: ${bioData.aboutMe}
    Situation: ${bioData.situation}`

    // Generate bio summary using OpenAI
    const bioResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: bioPrompt
          }
        ],
      }),
    })

    if (!bioResponse.ok) {
      const error = await bioResponse.json()
      throw new Error(`OpenAI API error: ${JSON.stringify(error)}`)
    }

    // Generate program recommendations using OpenAI
    const programResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are a neuro physiotherapist. Provide exercise recommendations in JSON format.'
          },
          {
            role: 'user',
            content: programPrompt
          }
        ],
      }),
    })

    if (!programResponse.ok) {
      const error = await programResponse.json()
      throw new Error(`OpenAI API error: ${JSON.stringify(error)}`)
    }

    // Generate motivational quote using OpenAI
    const quoteResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are a motivational coach. Generate an inspiring quote that resonates with the person\'s interests and situation.'
          },
          {
            role: 'user',
            content: quotePrompt
          }
        ],
      }),
    })

    if (!quoteResponse.ok) {
      const error = await quoteResponse.json()
      throw new Error(`OpenAI API error: ${JSON.stringify(error)}`)
    }

    const bioData = await bioResponse.json()
    const programData = await programResponse.json()
    const quoteData = await quoteResponse.json()

    const summary = bioData.choices[0].message.content
    const recommendations = JSON.parse(programData.choices[0].message.content)
    const quote = quoteData.choices[0].message.content

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Save the bio summary
    const { error: bioError } = await supabaseClient
      .from('user_bios')
      .update({ bio_summary: summary })
      .eq('user_id', userId)

    if (bioError) throw bioError

    // Save the program recommendations
    const { error: programError } = await supabaseClient
      .from('program_recommendations')
      .upsert({
        user_id: userId,
        focus_areas: recommendations.focus_areas,
        frequency_advice: recommendations.frequency_advice,
        daily_tips: recommendations.daily_tips
      })

    if (programError) throw programError

    // Save the daily quote
    const { error: quoteError } = await supabaseClient
      .from('daily_quotes')
      .upsert({
        user_id: userId,
        quote: quote,
        date: new Date().toISOString().split('T')[0]
      })

    if (quoteError) throw quoteError

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
