
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

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

export function ExerciseCard({ 
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
