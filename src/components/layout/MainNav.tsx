
import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import { Brain, Target, FileText, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

export function MainNav() {
  const location = useLocation()
  
  const menuItems = [
    {
      title: "Programs",
      href: "/programs",
      icon: Brain,
    },
    {
      title: "Chat",
      href: "/chat",
      icon: MessageSquare,
    },
    {
      title: "Goals",
      href: "/goals",
      icon: Target,
    },
    {
      title: "Docs",
      href: "/documents",
      icon: FileText,
    },
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-4">
        {menuItems.map((item) => (
          <Link
            key={item.title}
            to={item.href}
            className={cn(
              "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
              location.pathname === item.href
                ? "text-blue-600"
                : "text-gray-500 hover:text-blue-600"
            )}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
          </Link>
        ))}
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t z-50">
        <div className="flex justify-around items-center h-16">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-2 text-xs",
                location.pathname === item.href
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-blue-600"
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              {item.title}
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
}
