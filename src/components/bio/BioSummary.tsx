
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

interface BioSummaryProps {
  summary: string
  onEdit: () => void
}

export function BioSummary({ summary, onEdit }: BioSummaryProps) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Button 
        variant="ghost" 
        onClick={onEdit}
        className="mb-4 text-blue-600 hover:text-blue-700"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Edit Bio
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-600">Your Bio Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 whitespace-pre-wrap">{summary}</p>
        </CardContent>
      </Card>
    </div>
  )
}
