
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"

interface ProgramHeaderProps {
  hasBio: boolean
  hasProgram: boolean
  onViewProgram: () => void
}

export function ProgramHeader({ hasBio, hasProgram, onViewProgram }: ProgramHeaderProps) {
  const navigate = useNavigate()

  return (
    <Card className="bg-blue-600 text-white mb-8">
      <CardContent className="p-8">
        <div className="space-y-4">
          <span className="text-sm font-medium uppercase tracking-wider opacity-80">
            {hasBio ? "Recommended" : "Get Started"}
          </span>
          <h2 className="text-2xl font-semibold">
            {hasBio ? "Daily Mobility Program" : "Complete Your Health Bio"}
          </h2>
          <p className="text-blue-100">
            {hasBio 
              ? "Customized for your recovery goals"
              : "Complete your Health Bio so we can learn more about you and create tailored plans and answer questions with context."}
          </p>
          {hasBio ? (
            <Button 
              variant="secondary" 
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={onViewProgram}
            >
              View Program
            </Button>
          ) : (
            <Button 
              variant="secondary" 
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => navigate("/bio")}
            >
              Complete Health Bio
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
