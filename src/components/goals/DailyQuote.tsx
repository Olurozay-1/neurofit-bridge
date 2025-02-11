
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { CircleDot } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export const DailyQuote = () => {
  const { toast } = useToast()
  const { data: dailyQuote, isError } = useQuery({
    queryKey: ["dailyQuote"],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return null

        const today = new Date().toISOString().split('T')[0]
        
        // First try to get an existing quote for today
        const { data: existingQuote } = await supabase
          .from('daily_quotes')
          .select('quote')
          .eq('user_id', session.user.id)
          .eq('date', today)
          .maybeSingle()

        if (existingQuote) {
          console.log('Found existing quote:', existingQuote)
          return existingQuote.quote
        }

        // If no existing quote, generate a new one
        console.log('Generating new quote...')
        const response = await fetch('/api/generate-quote', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (!response.ok) {
          const error = await response.json()
          console.error('Error generating quote:', error)
          toast({
            title: "Failed to load daily quote",
            description: "Please try refreshing the page",
            variant: "destructive"
          })
          throw new Error('Failed to generate quote')
        }

        const { quote: newQuote } = await response.json()
        console.log('Generated new quote:', newQuote)
        
        // Store the new quote
        const { error: insertError } = await supabase
          .from('daily_quotes')
          .insert({
            quote: newQuote,
            user_id: session.user.id,
            date: today
          })

        if (insertError) {
          console.error('Error storing quote:', insertError)
          toast({
            title: "Failed to store quote",
            description: "Please try refreshing the page",
            variant: "destructive"
          })
          throw new Error('Failed to store quote')
        }

        return newQuote
      } catch (error) {
        console.error('Error in daily quote query:', error)
        toast({
          title: "Failed to load daily quote",
          description: "Please try refreshing the page",
          variant: "destructive"
        })
        throw error
      }
    },
    retry: 1
  })

  if (isError || !dailyQuote) return null

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
