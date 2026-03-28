"use client"

import Link from "next/link"
import { MapPin } from "lucide-react"
import { UserNav } from "@/components/user-nav"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary md:h-9 md:w-9">
            <MapPin className="h-4 w-4 text-primary-foreground md:h-5 md:w-5" />
          </div>
          <span className="text-lg font-bold text-foreground md:text-xl">探铺</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link 
            href="/free" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            免费查询
          </Link>
          <Link 
            href="/query" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            选址查询
          </Link>
          <Link 
            href="/#pricing" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            会员价格
          </Link>
        </nav>

        {/* Desktop User Nav */}
        <div className="hidden md:flex">
          <UserNav />
        </div>

        {/* Mobile: Show mini user status */}
        <div className="flex items-center gap-2 md:hidden">
          <UserNav compact />
        </div>
      </div>
    </header>
  )
}
