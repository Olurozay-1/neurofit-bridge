
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "./integrations/supabase/client"
import { Header } from "./components/layout/Header"
import { Footer } from "./components/layout/Footer"
import Auth from "./pages/Auth"
import Index from "./pages/Index"
import NotFound from "./pages/NotFound"
import Programs from "./pages/Programs"
import Chat from "./pages/Chat"

const queryClient = new QueryClient()

const App = () => {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="relative flex min-h-screen flex-col pb-32 md:pb-16">
            {session && <Header />}
            <Routes>
              <Route
                path="/"
                element={
                  session ? (
                    <Index />
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              <Route
                path="/programs"
                element={
                  session ? (
                    <Programs />
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              <Route
                path="/chat"
                element={
                  session ? (
                    <Chat />
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              <Route
                path="/auth"
                element={
                  !session ? (
                    <Auth />
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
            {session && <Footer />}
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
