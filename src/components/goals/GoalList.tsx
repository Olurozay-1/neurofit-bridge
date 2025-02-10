
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Target } from "lucide-react"

interface Goal {
  id: string
  title: string
  target_date: string
  current_count: number
  streak_count: number
}

interface GoalListProps {
  onGoalUpdate: () => void
}

export const GoalList = ({ onGoalUpdate }: GoalListProps) => {
  const { data: goals } = useQuery({
    queryKey: ["goals"],
    queryFn: async () => {
      const { data } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false })
      return (data || []) as Goal[]
    }
  })

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
      
      onGoalUpdate()
    }
  }

  if (!goals?.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-2">Active Goals</h2>
          <p className="text-gray-600">No goals yet. Create one to get started!</p>
        </CardContent>
      </Card>
    )
  }

  return (
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
                  <p className="text-gray-600 text-sm">Target: {new Date(goal.target_date).toLocaleDateString()}</p>
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
  )
}
