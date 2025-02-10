
import * as React from "react"
import { Link } from "react-router-dom"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Brain, Target, FileText, MessageSquare } from "lucide-react"

export function MainNav() {
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
      title: "Documents",
      href: "/documents",
      icon: FileText,
      description: "Access your documents and reports",
    },
  ]

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {menuItems.map((item) => (
          <NavigationMenuItem key={item.title}>
            <Link to={item.href}>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
