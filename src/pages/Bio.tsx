
import { useForm } from "react-hook-form"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { BioFormValues } from "@/types/bio"
import { DiagnosisDateField } from "@/components/bio/DiagnosisDateField"
import { SituationMobilityFields } from "@/components/bio/SituationMobilityFields"
import { PhysioFeedbackField } from "@/components/bio/PhysioFeedbackField"
import { AboutMeField } from "@/components/bio/AboutMeField"
import { BioSummary } from "@/components/bio/BioSummary"
import { useBioData } from "@/hooks/useBioData"
import { Progress } from "@/components/ui/progress"

const Bio = () => {
  const [showForm, setShowForm] = React.useState(true)
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  
  const form = useForm<BioFormValues>({
    defaultValues: {
      situation: "",
      mobilityDescription: "",
      hasSeenPhysio: "no",
      physioFeedback: "",
      aboutMe: "",
    },
  })

  const { bioData, mutation } = useBioData()

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout
    if (isAnalyzing) {
      intervalId = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(intervalId)
            return 100
          }
          return prev + 2
        })
      }, 50)
    }
    return () => clearInterval(intervalId)
  }, [isAnalyzing])

  const onSubmit = (values: BioFormValues) => {
    setIsAnalyzing(true)
    setProgress(0)
    
    mutation.mutate(values, {
      onSuccess: () => {
        setIsAnalyzing(false)
        setShowForm(false)
      },
      onError: () => {
        setIsAnalyzing(false)
      }
    })
  }

  React.useEffect(() => {
    if (bioData) {
      form.reset({
        diagnosisDate: bioData.diagnosis_date ? new Date(bioData.diagnosis_date) : undefined,
        situation: bioData.situation || "",
        mobilityDescription: bioData.mobility_description || "",
        hasSeenPhysio: bioData.has_seen_physio ? "yes" : "no",
        physioFeedback: bioData.physio_feedback || "",
        aboutMe: bioData.about_me || "",
      })
      if (bioData.bio_summary) {
        setShowForm(false)
      }
    }
  }, [bioData, form])

  if (!showForm && bioData?.bio_summary) {
    return (
      <BioSummary 
        summary={bioData.bio_summary}
        onEdit={() => setShowForm(true)}
      />
    )
  }

  if (isAnalyzing) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <h2 className="text-xl font-semibold text-blue-600 text-center animate-pulse">
          AI is analyzing your responses...
        </h2>
        <Progress value={progress} className="w-full" />
        <p className="text-center text-gray-600">
          Creating your personalized exercise recommendations
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">Health Bio</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <DiagnosisDateField form={form} />
          <SituationMobilityFields form={form} />
          <PhysioFeedbackField form={form} />
          <AboutMeField form={form} />
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Save Bio
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default Bio
