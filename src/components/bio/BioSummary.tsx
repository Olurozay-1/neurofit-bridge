
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil } from "lucide-react"
import ReactMarkdown from 'react-markdown'

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
          <div className="text-white leading-relaxed">
            <ReactMarkdown 
              components={{
                p: ({children}) => <p className="mb-4 last:mb-0">{children}</p>,
                strong: ({children}) => <span className="font-semibold">{children}</span>,
                ul: ({children}) => <ul className="list-disc pl-4 mb-4">{children}</ul>,
                li: ({children}) => <li className="mb-2">{children}</li>
              }}
            >
              {summary}
            </ReactMarkdown>
          </div>
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
