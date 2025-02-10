
import { ExerciseCard } from "./ExerciseCard"

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

interface ExerciseListProps {
  exercises: Exercise[] | null
  isLoading: boolean
  hasBio: boolean
}

export function ExerciseList({ exercises, isLoading, hasBio }: ExerciseListProps) {
  if (!hasBio) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">
          Complete Your Health Bio For Tailored Exercises
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="col-span-2 text-center py-12">
        <p className="text-gray-600">Loading exercises...</p>
      </div>
    )
  }

  if (!exercises || exercises.length === 0) {
    return (
      <div className="col-span-2 text-center py-12">
        <p className="text-gray-600">No exercises available yet.</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {exercises.map((exercise) => (
        <ExerciseCard key={exercise.id} {...exercise} />
      ))}
    </div>
  )
}
