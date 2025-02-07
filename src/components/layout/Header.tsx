
import { MainNav } from "./MainNav"
import { MobileNav } from "./MobileNav"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"

export function Header() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/auth")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <MobileNav />
        <div className="mr-4 hidden md:flex">
          <div className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              NeuroFit Bridge
            </span>
          </div>
          <MainNav />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Button onClick={handleLogout}>
              Sign Out
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
