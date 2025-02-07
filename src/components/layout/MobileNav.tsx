
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Link } from "react-router-dom"
import { Brain, BarChart3, Target, FileText, MessageSquare } from "lucide-react"

export function MobileNav() {
  const menuItems = [
    {
      title: "NeuroPT",
      href: "/chat",
      icon: MessageSquare,
      description: "Chat with our AI assistant",
    },
    {
      title: "My Programs",
      href: "/programs",
      icon: Brain,
      description: "View and manage your exercise programs",
    },
    {
      title: "My Goals",
      href: "/goals",
      icon: Target,
      description: "Track your progress and goals",
    },
    {
      title: "My Progress",
      href: "/progress",
      icon: BarChart3,
      description: "View your progress over time",
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
