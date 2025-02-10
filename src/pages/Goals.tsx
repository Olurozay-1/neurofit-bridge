
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, Target, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

interface Goal {
  id: string
  title: string
  description: string
  target_count: number
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
    description: "",
    target_count: 1,
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

    const { error } = await supabase
      .from('goals')
      .insert({
        ...newGoal,
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
      setNewGoal({ title: "", description: "", target_count: 1 })
      refetchGoals()
    }
  }

  const handleProgress = async (goalId: string, currentCount: number, targetCount: number) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const { error } = await supabase
      .from('goals')
      .update({ current_count: currentCount + 1 })
      .eq('id', goalId)

    if (!error) {
      if (currentCount + 1 === targetCount) {
        // Create achievement with user_id
        await supabase
          .from('achievements')
          .insert({
            goal_id: goalId,
            user_id: session.user.id,
            title: "Goal Achieved!",
            description: "Congratulations on reaching your goal!",
          })
        
        toast({
          title: "Achievement Unlocked! 🎉",
          description: "Congratulations on reaching your goal!",
        })
      }
      refetchGoals()
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {quote && (
        <div className="mb-8 p-6 bg-blue-50 rounded-lg shadow-sm">
          <p className="text-lg text-blue-800 font-medium italic text-center">
            "{quote}"
          </p>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">My Goals</h1>
          <Dialog open={newGoalOpen} onOpenChange={setNewGoalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="target">Target Count</Label>
                  <Input
                    id="target"
                    type="number"
                    min="1"
                    value={newGoal.target_count}
                    onChange={(e) => setNewGoal({ ...newGoal, target_count: parseInt(e.target.value) })}
                  />
                </div>
                <Button onClick={handleNewGoal}>Create Goal</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {goals?.map((goal: Goal) => (
            <Card key={goal.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{goal.title}</span>
                  {goal.streak_count > 0 && (
                    <span className="text-sm text-orange-500">
                      🔥 {goal.streak_count} day streak
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{goal.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Progress</span>
                    <span>{goal.current_count} / {goal.target_count}</span>
                  </div>
                  <Progress value={(goal.current_count / goal.target_count) * 100} />
                  <Button 
                    className="w-full mt-4"
                    onClick={() => handleProgress(goal.id, goal.current_count, goal.target_count)}
                    disabled={goal.current_count >= goal.target_count}
                  >
                    <Target className="mr-2 h-4 w-4" />
                    Track Progress
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {achievements && achievements.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Trophy className="mr-2 h-6 w-6 text-yellow-500" />
              Achievements
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {achievements.map((achievement: Achievement) => (
                <Card key={achievement.id}>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-lg mb-2">{achievement.title}</h3>
                    <p className="text-gray-600 text-sm">{achievement.description}</p>
                    <p className="text-gray-400 text-xs mt-2">
                      {new Date(achievement.awarded_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default Goals
