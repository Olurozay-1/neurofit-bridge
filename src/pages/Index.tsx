
import { Button } from "@/components/ui/button"
import { Brain } from "lucide-react"
import { Link } from "react-router-dom"

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Welcome to NeuroFit Bridge
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Your AI-powered companion for neurophysiotherapy. Get personalized
                  exercises, track your progress, and achieve your recovery goals.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg">
                  <Link to="/signup">
                    <Brain className="mr-2 h-4 w-4" />
                    Start Your Journey
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4">
                <MessageSquare className="h-12 w-12" />
                <h3 className="text-xl font-bold">AI Assistant</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Get real-time guidance and support from our AI-powered assistant.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <Target className="h-12 w-12" />
                <h3 className="text-xl font-bold">Personalized Programs</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Follow customized exercise programs designed for your specific needs.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <BarChart3 className="h-12 w-12" />
                <h3 className="text-xl font-bold">Progress Tracking</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Monitor your improvement with detailed progress tracking and analytics.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Index
