import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Target, Plus, CircleDot } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface Goal {
  id: string
  title: string
  target_date: string
  current_count: number
  streak_count: number
}

interface Achievement {
  id: string
  title: string
  description: string
  awarded_at: string
}

const Goals = () => {
  const [quote, setQuote] = useState<string | null>(null)
  const [newGoalOpen, setNewGoalOpen] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: "",
    target_date: "",
  })
  const { toast } = useToast()

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

  const { data: goals, refetch: refetchGoals } = useQuery({
    queryKey: ["goals"],
    queryFn: async () => {
      const { data } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false })
      return data || []
    }
  })

  const { data: achievements } = useQuery({
    queryKey: ["achievements"],
    queryFn: async () => {
      const { data } = await supabase
        .from('achievements')
        .select('*')
        .order('awarded_at', { ascending: false })
      return data || []
    }
  })

  useEffect(() => {
    if (dailyQuote) {
      setQuote(dailyQuote)
    }
  }, [dailyQuote])

  const handleNewGoal = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    if (!newGoal.title || !newGoal.target_date) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields.",
      })
      return
    }

    const { error } = await supabase
      .from('goals')
      .insert({
        title: newGoal.title,
        target_date: newGoal.target_date,
        user_id: session.user.id
      })

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create goal. Please try again.",
      })
    } else {
      toast({
        title: "Success",
        description: "Goal created successfully!",
      })
      setNewGoalOpen(false)
      setNewGoal({ title: "", target_date: "" })
      refetchGoals()
    }
  }

  const handleProgress = async (goalId: string, currentCount: number) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const { error } = await supabase
      .from('goals')
      .update({ current_count: currentCount + 1 })
      .eq('id', goalId)

    if (!error) {
      await supabase
        .from('achievements')
        .insert({
          goal_id: goalId,
          user_id: session.user.id,
          title: "Goal Progress!",
          description: "You're making progress towards your goal!",
        })
      
      refetchGoals()
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {quote && (
        <Card className="mb-8 bg-gray-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <CircleDot className="h-10 w-10 text-gray-400" />
              <div>
                <h2 className="text-lg font-semibold mb-1">Today's Motivation</h2>
                <p className="text-gray-600 italic">"{quote}"</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-600 mb-2">My Goals</h1>
            <p className="text-gray-600">Track your progress and celebrate achievements</p>
          </div>
          <Dialog open={newGoalOpen} onOpenChange={setNewGoalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" /> Add New Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl">Create a New Goal</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-gray-600 mb-6">Set a meaningful goal that you can track and achieve.</p>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="title" className="text-base font-medium">What would you like to achieve?</Label>
                    <Input
                      id="title"
                      placeholder="E.g., Walk 30 minutes daily"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="target_date" className="text-base font-medium">Target Date</Label>
                    <Input
                      id="target_date"
                      type="date"
                      value={newGoal.target_date}
                      onChange={(e) => setNewGoal({ ...newGoal, target_date: e.target.value })}
                      className="mt-2"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleNewGoal} className="bg-blue-600 hover:bg-blue-700">
                  Create Goal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-2">Active Goals</h2>
            <p className="text-gray-600 mb-6">Your current focus areas</p>
            <div className="space-y-8">
              {goals?.map((goal: Goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{goal.title}</h3>
                      <p className="text-gray-600 text-sm">{goal.target_date}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleProgress(goal.id, goal.current_count)}
                      
                    >
                      <Target className="h-5 w-5 text-blue-600" />
                    </Button>
                  </div>
                  <Progress value={goal.current_count} className="h-2" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{goal.current_count}% Complete</span>
                    {goal.streak_count > 0 && (
                      <span>{goal.streak_count} days streak</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {achievements && achievements.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-6">Achievements</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {achievements.map((achievement: Achievement) => (
                  <div key={achievement.id} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">{achievement.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{achievement.description}</p>
                    <p className="text-gray-400 text-xs">
                      {new Date(achievement.awarded_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}

export default Goals
