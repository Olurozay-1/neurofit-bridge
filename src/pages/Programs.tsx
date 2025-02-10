
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { CreateProgramForm } from "@/components/programs/CreateProgramForm"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"

interface Exercise {
  id: string
  title: string
  description: string
  instructions: string[]
  duration: string
  level: string
  repetitions: string
  safety_notes: string
  exercise_type: string
}

interface ProgramRecommendations {
  focus_areas: string[]
  frequency_advice: string
  daily_tips: string[]
}

export default function Programs() {
  const navigate = useNavigate()

  const { data: bioData, isLoading: isBioLoading } = useQuery({
    queryKey: ["bio"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_bios")
        .select("*")
        .maybeSingle()

      if (error) throw error
      return data
    },
  })

  const { data: recommendations, isLoading: isRecommendationsLoading } = useQuery({
    queryKey: ["program_recommendations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("program_recommendations")
        .select("*")
        .maybeSingle()

      if (error) throw error
      return data as ProgramRecommendations
    },
    enabled: Boolean(bioData?.bio_summary),
  })

  const { data: exercises, isLoading: isExercisesLoading } = useQuery({
    queryKey: ["exercises"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .order('created_at', { ascending: true })

      if (error) throw error
      return data as Exercise[]
    },
    enabled: Boolean(bioData?.bio_summary),
  })

  const { data: quote } = useQuery({
    queryKey: ["daily_quote"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("daily_quotes")
        .select("*")
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) throw error
      return data
    },
    enabled: Boolean(bioData?.bio_summary),
  })

  const hasBio = Boolean(bioData?.bio_summary)
  const hasProgram = Boolean(recommendations)

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-600">My Programs</h1>
      </div>

      <Card className="bg-blue-600 text-white mb-8">
        <CardContent className="p-8">
          <div className="space-y-4">
            <span className="text-sm font-medium uppercase tracking-wider opacity-80">
              {hasBio ? "Recommended" : "Get Started"}
            </span>
            <h2 className="text-2xl font-semibold">
              {hasBio ? "Daily Mobility Program" : "Complete Your Health Bio"}
            </h2>
            <p className="text-blue-100">
              {hasBio 
                ? "Customized for your recovery goals"
                : "Complete your Health Bio so we can learn more about you and create tailored plans and answer questions with context."}
            </p>
            {hasBio ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                    {hasProgram ? "View Program" : "Create Program"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px]">
                  <DialogHeader>
                    <DialogTitle>
                      {hasProgram ? "Your Personalized Program" : "Create New Program"}
                    </DialogTitle>
                  </DialogHeader>
                  {hasProgram ? (
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
              </Dialog>
            ) : (
              <Button 
                variant="secondary" 
                className="bg-white text-blue-600 hover:bg-blue-50"
                onClick={() => navigate("/bio")}
              >
                Complete Health Bio
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button className="border-b-2 border-blue-600 py-4 px-1 text-sm font-medium text-blue-600">
              Physical Exercises
            </button>
            <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
              Speech Exercises
            </button>
          </nav>
        </div>

        {!hasBio ? (
          <div className="text-center py-8">
            <p className="text-gray-600">
              Complete Your Health Bio For Tailored Exercises
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {isExercisesLoading ? (
              <div className="col-span-2 text-center py-12">
                <p className="text-gray-600">Loading exercises...</p>
              </div>
            ) : exercises && exercises.length > 0 ? (
              exercises.map((exercise) => (
                <ExerciseCard key={exercise.id} {...exercise} />
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <p className="text-gray-600">No exercises available yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ExerciseCard({ 
  title, 
  description, 
  duration, 
  level,
  instructions,
  repetitions,
  safety_notes 
}: Exercise) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-blue-600 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-gray-500 text-sm">
            <span>{duration}</span>
          </div>
          <span className="text-blue-600 text-sm">{level}</span>
        </div>
        
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
              View Exercise
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Instructions:</h4>
              <ol className="list-decimal pl-4 space-y-2">
                {instructions.map((step, index) => (
                  <li key={index} className="text-gray-600">{step}</li>
                ))}
              </ol>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Repetitions:</h4>
              <p className="text-gray-600">{repetitions}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Safety Notice:</h4>
              <p className="text-gray-600">{safety_notes}</p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
