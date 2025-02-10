
import { useQuery, useMutation } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { BioFormValues } from "@/types/bio"
import { useToast } from "@/components/ui/use-toast"

export function useBioData() {
  const { toast } = useToast()

  const { data: bioData, refetch } = useQuery({
    queryKey: ["bio"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_bios")
        .select("*")
        .maybeSingle()

      if (error) throw error
      return data
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: BioFormValues) => {
      const { data: userSession } = await supabase.auth.getSession()
      if (!userSession?.session?.user?.id) {
        throw new Error("No authenticated user found")
      }

      const { error } = await supabase.from("user_bios").upsert({
        diagnosis_date: values.diagnosisDate.toISOString().split('T')[0],
        situation: values.situation,
        mobility_description: values.mobilityDescription,
        has_seen_physio: values.hasSeenPhysio === "yes",
        physio_feedback: values.hasSeenPhysio === "yes" ? values.physioFeedback : null,
        user_id: userSession.session.user.id,
      })

      if (error) throw error
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your bio has been saved.",
      })
      refetch()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save your bio. Please try again.",
        variant: "destructive",
      })
      console.error("Error saving bio:", error)
    },
  })

  return { bioData, mutation }
}
