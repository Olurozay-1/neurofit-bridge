
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"

export function Footer() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/auth")
  }

  return (
    <footer className="mt-auto bg-background border-t z-40">
      <div className="container flex h-14 items-center justify-end">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleLogout}
          className="text-muted-foreground hover:text-foreground"
        >
          Sign Out
        </Button>
      </div>
    </footer>
  )
}
