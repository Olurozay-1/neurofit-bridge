
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

const Goals = () => {
  const [quote, setQuote] = useState<string | null>(null)

  const { data: dailyQuote } = useQuery({
    queryKey: ["dailyQuote"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return null

      const today = new Date().toISOString().split('T')[0]
      
      // First try to get today's quote from the database
      const { data: existingQuote } = await supabase
        .from('daily_quotes')
        .select('quote')
        .eq('user_id', session.user.id)
        .eq('date', today)
        .maybeSingle()

      if (existingQuote) {
        return existingQuote.quote
      }

      // If no quote exists for today, generate a new one
      const response = await fetch('/api/generate-quote', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })
      
      const { quote: newQuote } = await response.json()
      
      // Store the new quote in the database
      const { error: insertError } = await supabase
        .from('daily_quotes')
        .insert({
          quote: newQuote,
          user_id: session.user.id,
          date: today
        })

      if (insertError) {
        console.error('Error storing quote:', insertError)
      }

      return newQuote
    }
  })

  useEffect(() => {
    if (dailyQuote) {
      setQuote(dailyQuote)
    }
  }, [dailyQuote])

  return (
    <main className="container mx-auto px-4 py-8">
      {quote && (
        <div className="mb-8 p-6 bg-blue-50 rounded-lg shadow-sm">
          <p className="text-lg text-blue-800 font-medium italic text-center">
            "{quote}"
          </p>
        </div>
      )}
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">My Goals</h1>
        {/* Goals content will be implemented in the next iteration */}
        <p className="text-gray-600">Goals tracking coming soon...</p>
      </div>
    </main>
  )
}

export default Goals
