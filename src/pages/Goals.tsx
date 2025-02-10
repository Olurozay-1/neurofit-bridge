
import { useQuery } from "@tanstack/react-query"
import { DailyQuote } from "@/components/goals/DailyQuote"
import { CreateGoalDialog } from "@/components/goals/CreateGoalDialog"
import { GoalList } from "@/components/goals/GoalList"
import { AchievementList } from "@/components/goals/AchievementList"

const Goals = () => {
  const { refetch: refetchGoals } = useQuery({
    queryKey: ["goals"],
    queryFn: async () => null,
    enabled: false
  })

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <DailyQuote />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-600 mb-2">My Goals</h1>
            <p className="text-gray-600">Track your progress and celebrate achievements</p>
          </div>
          <CreateGoalDialog onGoalCreated={() => refetchGoals()} />
        </div>

        <GoalList onGoalUpdate={() => refetchGoals()} />
        <AchievementList />
      </div>
    </main>
  )
}

export default Goals
