
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ProgramRecommendations {
  focus_areas: string[]
  frequency_advice: string
  daily_tips: string[]
}

interface ProgramRecommendationsProps {
  recommendations: ProgramRecommendations | null
  quote: { quote: string } | null
}

export function ProgramRecommendationsDialog({ recommendations, quote }: ProgramRecommendationsProps) {
  if (!recommendations) {
    return (
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Program Not Available</DialogTitle>
        </DialogHeader>
        <p className="text-gray-600">
          Your program is being generated. Please check back soon.
        </p>
      </DialogContent>
    )
  }

  return (
    <DialogContent className="sm:max-w-[800px]">
      <DialogHeader>
        <DialogTitle>Your Personalized Program</DialogTitle>
      </DialogHeader>
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold mb-3">Focus Areas</h3>
          <ul className="list-disc pl-5 space-y-1">
            {recommendations.focus_areas.map((area, index) => (
              <li key={index} className="text-gray-700">{area}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">Exercise Frequency</h3>
          <p className="text-gray-700">{recommendations.frequency_advice}</p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">Daily Tips for Staying Active</h3>
          <ul className="list-disc pl-5 space-y-1">
            {recommendations.daily_tips.map((tip, index) => (
              <li key={index} className="text-gray-700">{tip}</li>
            ))}
          </ul>
        </section>

        {quote && (
          <section className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Your Daily Motivation</h3>
            <p className="text-gray-700 italic">{quote.quote}</p>
          </section>
        )}
      </div>
    </DialogContent>
  )
}
