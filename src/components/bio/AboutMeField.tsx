
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

interface AboutMeFieldProps {
  form: UseFormReturn<BioFormValues>
}

export function AboutMeField({ form }: AboutMeFieldProps) {
  return (
    <FormField
      control={form.control}
      name="aboutMe"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-blue-600">Tell Us About Yourself</FormLabel>
          <FormDescription>
            Share your interests, hobbies, favorite sports teams, or anything else you'd like us to know about you
          </FormDescription>
          <FormControl>
            <Textarea
              placeholder="I enjoy watching basketball, specifically the Lakers. I love gardening and spending time with my family..."
              className="resize-none min-h-[120px]"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
