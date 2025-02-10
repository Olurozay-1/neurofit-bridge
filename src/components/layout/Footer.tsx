
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useIsMobile } from "@/hooks/use-mobile"

export function Footer() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/auth")
  }

  return (
    <footer className="mt-auto bg-background border-t z-40">
      <div className="container flex h-14 items-center justify-between">
        {isMobile && (
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
              <span className="text-sm font-bold text-white">NPT</span>
            </div>
            <span className="font-bold text-blue-600">NeuroPT</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleLogout}
          className={`text-muted-foreground hover:text-foreground ${isMobile ? 'ml-auto' : ''}`}
        >
          Sign Out
        </Button>
      </div>
    </footer>
  )
}
