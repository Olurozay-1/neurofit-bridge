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

    // Create OpenAI prompt for program recommendations
    const recommendationsPrompt = `Based on the following health information, provide exercise recommendations:
    About the person: ${bioData.aboutMe}
    Situation: ${bioData.situation}
    Mobility Description: ${bioData.mobilityDescription}
    Has seen physiotherapist: ${bioData.hasSeenPhysio}
    ${bioData.hasSeenPhysio === 'yes' ? `Physiotherapist Feedback: ${bioData.physioFeedback}` : ''}
    
    Generate the following in a structured way:
    1. A list of 3-5 body areas to focus on
    2. Clear advice on exercise frequency and duration
    3. A list of 5 practical daily tips for staying active
    4. A personalized motivational quote that references their interests from the "About Me" section`

    // Generate recommendations using OpenAI
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
            content: 'You are a professional physical therapist and motivational coach. Provide specific, actionable advice.'
          },
          {
            role: 'user',
            content: recommendationsPrompt
          }
        ],
      }),
    })

    const openAIData = await openAIResponse.json()
    const recommendationsText = openAIData.choices[0].message.content

    // Parse the OpenAI response
    const focusAreas = recommendationsText.match(/body areas to focus on:?([\s\S]*?)(?=Clear advice on exercise|$)/i)?.[1]
      .split('\n')
      .filter(area => area.trim())
      .map(area => area.replace(/^[-*\d.]+\s*/, '').trim())

    const frequencyAdvice = recommendationsText.match(/exercise frequency and duration:?([\s\S]*?)(?=practical daily tips|$)/i)?.[1].trim()

    const dailyTips = recommendationsText.match(/practical daily tips:?([\s\S]*?)(?=personalized motivational quote|$)/i)?.[1]
      .split('\n')
      .filter(tip => tip.trim())
      .map(tip => tip.replace(/^[-*\d.]+\s*/, '').trim())

    const motivationalQuote = recommendationsText.match(/motivational quote:?([\s\S]*?)$/i)?.[1].trim()

    // Save the recommendations to the database
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // First, delete any existing recommendations for this user
    const { error: deleteError } = await supabaseClient
      .from('program_recommendations')
      .delete()
      .eq('user_id', userId)

    if (deleteError) throw deleteError

    // Insert new recommendations
    const { error: insertError } = await supabaseClient
      .from('program_recommendations')
      .insert({
        user_id: userId,
        focus_areas: focusAreas,
        frequency_advice: frequencyAdvice,
        daily_tips: dailyTips,
      })

    if (insertError) throw insertError

    // Save the motivational quote
    const { error: quoteError } = await supabaseClient
      .from('daily_quotes')
      .insert({
        user_id: userId,
        quote: motivationalQuote,
      })

    if (quoteError) throw quoteError

    // Continue with exercise generation (keep existing exercise generation code)
    const exercisePrompt = `Based on the following health information, suggest 3-5 simple exercises:
    About the person: ${bioData.aboutMe}
    Situation: ${bioData.situation}
    Mobility Description: ${bioData.mobilityDescription}
    Has seen physiotherapist: ${bioData.hasSeenPhysio}
    ${bioData.hasSeenPhysio === 'yes' ? `Physiotherapist Feedback: ${bioData.physioFeedback}` : ''}
    
    Each exercise should include:
    - Title
    - Short description
    - Step-by-step instructions
    - Duration
    - Level (easy, moderate, hard)
    - Repetitions
    - Safety notes`

    // Generate exercises using OpenAI
    const exerciseAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are a physical therapy expert. Provide clear, safe, and effective exercise recommendations.'
          },
          {
            role: 'user',
            content: exercisePrompt
          }
        ],
      }),
    })

    const exerciseAIData = await exerciseAIResponse.json()
    const exercisesText = exerciseAIData.choices[0].message.content

    // Parse the OpenAI response for exercises
    const exercises = exercisesText.split('\n\n').map(exerciseText => {
      const title = exerciseText.match(/Title: (.*)/)?.[1]
      const description = exerciseText.match(/Description: (.*)/)?.[1]
      const instructions = exerciseText.match(/Instructions:([\s\S]*?)Duration:/)?.[1]?.split('\n').filter(line => line.trim() !== '').map(line => line.replace(/^\d+\.\s*/, '').trim())
      const duration = exerciseText.match(/Duration: (.*)/)?.[1]
      const level = exerciseText.match(/Level: (.*)/)?.[1]
      const repetitions = exerciseText.match(/Repetitions: (.*)/)?.[1]
      const safety_notes = exerciseText.match(/Safety notes: (.*)/)?.[1]

      return {
        title: title?.trim(),
        description: description?.trim(),
        instructions: instructions?.filter(instruction => instruction !== undefined),
        duration: duration?.trim(),
        level: level?.trim(),
        repetitions: repetitions?.trim(),
        safety_notes: safety_notes?.trim(),
      }
    }).filter(exercise => exercise.title)

    // Save the exercises to the database
    for (const exercise of exercises) {
      const { error: exerciseError } = await supabaseClient
        .from('exercises')
        .insert({
          ...exercise,
          user_id: userId,
        })

      if (exerciseError) throw exerciseError
    }

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
