
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { UseFormReturn } from "react-hook-form"
import { BioFormValues } from "@/types/bio"

interface PhysioFeedbackFieldProps {
  form: UseFormReturn<BioFormValues>
}

export function PhysioFeedbackField({ form }: PhysioFeedbackFieldProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="hasSeenPhysio"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-blue-600">Have you seen a Physiotherapist?</FormLabel>
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
              <FormLabel className="text-blue-600">What was their opinion/feedback?</FormLabel>
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
    </>
  )
}
