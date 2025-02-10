
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
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

interface CreateGoalDialogProps {
  onGoalCreated: () => void
}

export const CreateGoalDialog = ({ onGoalCreated }: CreateGoalDialogProps) => {
  const [open, setOpen] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: "",
    target_date: "",
  })
  const { toast } = useToast()

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
      setOpen(false)
      setNewGoal({ title: "", target_date: "" })
      onGoalCreated()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
  )
}
