
import { MainNav } from "./MainNav"
import { supabase } from "@/integrations/supabase/client"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center pt-4">
        <div className="flex items-center">
          <div className="mr-6 hidden md:flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
              <span className="text-sm font-bold text-white">NPT</span>
            </div>
            <span className="font-bold text-blue-600">NeuroPT</span>
          </div>
          <MainNav />
        </div>
      </div>
    </header>
  )
}
