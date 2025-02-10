
import { useState } from "react"
import * as React from "react"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import { useQuery, useMutation } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"

interface BioFormValues {
  diagnosisDate: Date
  situation: string
  mobilityDescription: string
  hasSeenPhysio: "yes" | "no"
  physioFeedback?: string
}

const Bio = () => {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)

  const form = useForm<BioFormValues>({
    defaultValues: {
      situation: "",
      mobilityDescription: "",
      hasSeenPhysio: "no",
      physioFeedback: "",
    },
  })

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
        diagnosis_date: values.diagnosisDate.toISOString().split('T')[0], // Convert Date to YYYY-MM-DD
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

  const onSubmit = (values: BioFormValues) => {
    mutation.mutate(values)
  }

  // Set form values when data is loaded
  React.useEffect(() => {
    if (bioData) {
      form.reset({
        diagnosisDate: bioData.diagnosis_date ? new Date(bioData.diagnosis_date) : undefined,
        situation: bioData.situation || "",
        mobilityDescription: bioData.mobility_description || "",
        hasSeenPhysio: bioData.has_seen_physio ? "yes" : "no",
        physioFeedback: bioData.physio_feedback || "",
      })
    }
  }, [bioData, form])

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Health Bio</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="diagnosisDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of Diagnosis/Incident/Surgery</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date)
                        setOpen(false)
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="situation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Explanation of the Situation</FormLabel>
                <FormDescription>
                  Describe what happened that led you to need this app
                </FormDescription>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your situation..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mobilityDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobility Level</FormLabel>
                <FormDescription>
                  Describe what you can and cannot do (e.g., walking unassisted, raising arms)
                </FormDescription>
                <FormControl>
                  <Textarea
                    placeholder="Describe your mobility level..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hasSeenPhysio"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Have you seen a Physiotherapist?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="yes" />
                      </FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="no" />
                      </FormControl>
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("hasSeenPhysio") === "yes" && (
            <FormField
              control={form.control}
              name="physioFeedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What was their opinion/feedback?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share what your physiotherapist said..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit" className="w-full">
            Save Bio
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default Bio
