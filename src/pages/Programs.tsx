
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ProgramHeader } from "@/components/programs/ProgramHeader"
import { ProgramRecommendationsDialog } from "@/components/programs/ProgramRecommendations"
import { ExerciseList } from "@/components/programs/ExerciseList"

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

  const hasBio = Boolean(bioData?.bio_summary)
  const hasProgram = Boolean(recommendations)

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-600">My Programs</h1>
      </div>

      <Dialog>
        <ProgramHeader 
          hasBio={hasBio} 
          hasProgram={hasProgram}
          onViewProgram={() => {}}
        />
        <DialogTrigger asChild>
          <span className="hidden" />
        </DialogTrigger>
        <ProgramRecommendationsDialog 
          recommendations={recommendations}
        />
      </Dialog>

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

        <ExerciseList 
          exercises={exercises}
          isLoading={isExercisesLoading}
          hasBio={hasBio}
        />
      </div>
    </div>
  );
}
