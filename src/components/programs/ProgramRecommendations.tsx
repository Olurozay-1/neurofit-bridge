
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CreateProgramForm } from "@/components/programs/CreateProgramForm"

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
  return (
    <DialogContent className="sm:max-w-[800px]">
      <DialogHeader>
        <DialogTitle>
          {recommendations ? "Your Personalized Program" : "Create New Program"}
        </DialogTitle>
      </DialogHeader>
      {recommendations ? (
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
      ) : (
        <CreateProgramForm />
      )}
    </DialogContent>
  )
}
