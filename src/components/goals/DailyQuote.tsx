
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { CircleDot } from "lucide-react"

export const DailyQuote = () => {
  const { data: dailyQuote } = useQuery({
    queryKey: ["dailyQuote"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return null

      const today = new Date().toISOString().split('T')[0]
      
      const { data: existingQuote } = await supabase
        .from('daily_quotes')
        .select('quote')
        .eq('user_id', session.user.id)
        .eq('date', today)
        .maybeSingle()

      if (existingQuote) {
        return existingQuote.quote
      }

      const response = await fetch('/api/generate-quote', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })
      
      const { quote: newQuote } = await response.json()
      
      await supabase
        .from('daily_quotes')
        .insert({
          quote: newQuote,
          user_id: session.user.id,
          date: today
        })

      return newQuote
    }
  })

  if (!dailyQuote) return null

  return (
    <Card className="mb-8 bg-gray-50">
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <CircleDot className="h-10 w-10 text-gray-400" />
          <div>
            <h2 className="text-lg font-semibold mb-1">Today's Motivation</h2>
            <p className="text-gray-600 italic">"{dailyQuote}"</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
