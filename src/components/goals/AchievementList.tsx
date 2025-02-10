
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent } from "@/components/ui/card"

interface Achievement {
  id: string
  title: string
  description: string
  awarded_at: string
}

export const AchievementList = () => {
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

  if (!achievements?.length) return null

  return (
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
  )
}
