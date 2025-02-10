
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AuthLayout } from "@/components/auth/AuthLayout"
import { SignInForm } from "@/components/auth/SignInForm"
import { SignUpForm } from "@/components/auth/SignUpForm"

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  return (
    <AuthLayout>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {isSignUp ? "Create an account" : "Welcome back"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isSignUp
            ? "Enter your details to create your account"
            : "Enter your email to sign in to your account"}
        </p>
      </div>
      
      {isSignUp ? (
        <SignUpForm isLoading={isLoading} setIsLoading={setIsLoading} />
      ) : (
        <SignInForm isLoading={isLoading} setIsLoading={setIsLoading} />
      )}

      <div className="text-center text-sm">
        {isSignUp ? "Already have an account? " : "Don't have an account? "}
        <Button
          variant="link"
          className="underline"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? "Sign In" : "Sign Up"}
        </Button>
      </div>
    </AuthLayout>
  )
}
