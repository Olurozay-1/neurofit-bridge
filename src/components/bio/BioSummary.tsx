
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil } from "lucide-react"

interface BioSummaryProps {
  summary: string
  onEdit: () => void
}

export function BioSummary({ summary, onEdit }: BioSummaryProps) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="bg-blue-600 shadow-lg mb-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Your Bio Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white leading-relaxed whitespace-pre-wrap">{summary}</p>
        </CardContent>
      </Card>
      
      <Button 
        variant="ghost" 
        onClick={onEdit}
        className="mx-auto flex items-center text-blue-600 hover:text-blue-700"
      >
        <Pencil className="mr-2 h-4 w-4" />
        Edit Bio
      </Button>
    </div>
  )
}
