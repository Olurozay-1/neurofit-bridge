
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Check, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"

interface Goal {
  id: string
  title: string
  target_date: string
  current_count: number
  streak_count: number
  last_tracked_at: string | null
}

interface GoalListProps {
  onGoalUpdate: () => void
}

export const GoalList = ({ onGoalUpdate }: GoalListProps) => {
  const [deleteGoalId, setDeleteGoalId] = useState<string | null>(null)
  const { toast } = useToast()

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

  const handleProgress = async (goalId: string, currentCount: number, lastTrackedAt: string | null) => {
    const today = new Date().toISOString()
    if (lastTrackedAt && new Date(lastTrackedAt).toDateString() === new Date().toDateString()) {
      toast({
        title: "Already tracked today",
        description: "You can only track progress once per day.",
        variant: "destructive",
      })
      return
    }

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const wasYesterday = lastTrackedAt && 
      new Date(lastTrackedAt).toDateString() === 
      new Date(Date.now() - 86400000).toDateString()

    const { error } = await supabase
      .from('goals')
      .update({ 
        current_count: currentCount + 1,
        last_tracked_at: today,
        streak_count: wasYesterday ? currentCount + 1 : 1
      })
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
      toast({
        title: "Progress updated!",
        description: "Your goal progress has been tracked for today.",
      })
    }
  }

  const handleDelete = async (goalId: string) => {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', goalId)

    if (!error) {
      onGoalUpdate()
      toast({
        title: "Goal deleted",
        description: "Your goal has been successfully deleted.",
      })
    }
    setDeleteGoalId(null)
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
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleProgress(goal.id, goal.current_count, goal.last_tracked_at)}
                    className="h-8 w-8"
                  >
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteGoalId(goal.id)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
              <Progress value={goal.current_count} className="h-2" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{goal.current_count}% Complete</span>
                {goal.streak_count > 0 && (
                  <span>🔥 {goal.streak_count} day streak!</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <AlertDialog open={!!deleteGoalId} onOpenChange={() => setDeleteGoalId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your goal and its progress.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteGoalId && handleDelete(deleteGoalId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
