
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { UseFormReturn } from "react-hook-form"
import { BioFormValues } from "@/types/bio"

interface SituationMobilityFieldsProps {
  form: UseFormReturn<BioFormValues>
}

export function SituationMobilityFields({ form }: SituationMobilityFieldsProps) {
  return (
    <>
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
    </>
  )
}
