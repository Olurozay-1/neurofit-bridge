
import { ReactNode } from "react"

type AuthLayoutProps = {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="container relative min-h-screen flex items-center justify-center">
      <div className="w-full max-w-[400px] space-y-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Logo circle with NPT text */}
          <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">NPT</span>
          </div>
          <h1 className="text-2xl font-bold text-blue-600">
            NeuroPT
          </h1>
          <p className="text-black text-sm italic text-center mx-auto w-full px-4">
            "Small efforts, repeated, become breakthroughs."
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
