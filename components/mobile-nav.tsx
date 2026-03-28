"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, MapPin, User, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    label: "首页",
    href: "/",
    icon: Home,
  },
  {
    label: "免费查",
    href: "/free",
    icon: Search,
  },
  {
    label: "选址",
    href: "/query",
    icon: MapPin,
    primary: true,
  },
  {
    label: "会员",
    href: "/#pricing",
    icon: CreditCard,
  },
  {
    label: "我的",
    href: "/auth/login",
    icon: User,
  },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/" && pathname.startsWith(item.href.split("#")[0]))
          const Icon = item.icon

          if (item.primary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-4"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30">
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="mt-1 text-xs font-medium text-primary">
                  {item.label}
                </span>
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
      {/* Safe area for iOS */}
      <div className="h-safe-area-inset-bottom bg-background" />
    </nav>
  )
}
