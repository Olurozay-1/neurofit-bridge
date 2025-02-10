
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  background: z.string().min(10, "Please provide more detail about what happened"),
  goals: z.string().min(10, "Please describe your goals in more detail"),
  mobilityLevel: z.string({
    required_error: "Please select your mobility level",
  }),
})

export function CreateProgramForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      background: "",
      goals: "",
      mobilityLevel: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      // Here you would typically save the program to your backend
      console.log(values)
      toast({
        title: "Success",
        description: "Your program has been created",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="background"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What happened?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please describe your condition or situation..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="goals"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What areas or goals would you like to work on?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the specific body areas or goals you'd like to focus on..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mobilityLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What is your current mobility level?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your mobility level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="limited">Limited Mobility</SelectItem>
                  <SelectItem value="moderate">Moderate Mobility</SelectItem>
                  <SelectItem value="good">Good Mobility</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Program"}
        </Button>
      </form>
    </Form>
  )
}
