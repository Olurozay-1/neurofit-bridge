
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CreateProgramForm } from "@/components/programs/CreateProgramForm"

export default function Programs() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-600">My Programs</h1>
      </div>

      <Card className="bg-blue-600 text-white mb-8">
        <CardContent className="p-8">
          <div className="space-y-4">
            <span className="text-sm font-medium uppercase tracking-wider opacity-80">
              Recommended
            </span>
            <h2 className="text-2xl font-semibold">Daily Mobility Program</h2>
            <p className="text-blue-100">Customized for your recovery goals</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                  Create Program
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Program</DialogTitle>
                </DialogHeader>
                <CreateProgramForm />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
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

        <div className="grid md:grid-cols-2 gap-6">
          <ExerciseCard
            title="Walking"
            description="A simple, low-impact exercise to help with overall mobility. Walk at a comfortable pace in a flat, safe area."
            duration="10 mins"
            level="Beginner"
          />
          <ExerciseCard
            title="Chair Yoga"
            description="A seated yoga routine focusing on gentle stretching and relaxation to enhance flexibility and relieve tension."
            duration="15 mins"
            level="Beginner"
          />
          <ExerciseCard
            title="Seated Marching"
            description="While seated, lift knees alternately as if marching in place to promote circulation and joint movement."
            duration="10 mins"
            level="Beginner"
          />
        </div>
      </div>
    </div>
  )
}

function ExerciseCard({ title, description, duration, level }: {
  title: string
  description: string
  duration: string
  level: string
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-blue-600 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-500 text-sm">
            <span>{duration}</span>
          </div>
          <span className="text-blue-600 text-sm">{level}</span>
        </div>
        <Button variant="outline" className="w-full mt-4">
          View Exercise
        </Button>
      </CardContent>
    </Card>
  )
}
