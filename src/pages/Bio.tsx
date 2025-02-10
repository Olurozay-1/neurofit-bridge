
import { useForm } from "react-hook-form"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { BioFormValues } from "@/types/bio"
import { DiagnosisDateField } from "@/components/bio/DiagnosisDateField"
import { SituationMobilityFields } from "@/components/bio/SituationMobilityFields"
import { PhysioFeedbackField } from "@/components/bio/PhysioFeedbackField"
import { useBioData } from "@/hooks/useBioData"

const Bio = () => {
  const form = useForm<BioFormValues>({
    defaultValues: {
      situation: "",
      mobilityDescription: "",
      hasSeenPhysio: "no",
      physioFeedback: "",
    },
  })

  const { bioData, mutation } = useBioData()

  const onSubmit = (values: BioFormValues) => {
    mutation.mutate(values)
  }

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
      <h1 className="text-2xl font-bold mb-6 text-blue-600">Health Bio</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <DiagnosisDateField form={form} />
          <SituationMobilityFields form={form} />
          <PhysioFeedbackField form={form} />
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Save Bio
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default Bio
