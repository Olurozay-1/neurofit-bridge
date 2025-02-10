
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Brain, Target, FileText, MessageSquare } from "lucide-react"

export function MobileNav() {
  const menuItems = [
    {
      title: "My Programs",
      href: "/programs",
      icon: Brain,
      description: "View and manage your exercise programs",
    },
    {
      title: "NeuroPT",
      href: "/chat",
      icon: MessageSquare,
      description: "Chat with our AI assistant",
    },
    {
      title: "My Goals",
      href: "/goals",
      icon: Target,
      description: "Track your progress and goals",
    },
    {
      title: "Documents",
      href: "/documents",
      icon: FileText,
      description: "Access your documents and reports",
    },
  ]

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <div className="flex items-center space-x-3 mb-8">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
            <span className="text-sm font-bold text-white">NPT</span>
          </div>
          <span className="font-bold">NeuroPT</span>
        </div>
        <nav className="flex flex-col gap-4">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              to={item.href}
              className="flex items-center gap-2 text-lg font-medium"
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
