"use client"

import Link from "next/link"
import { MapPin, Menu, X } from "lucide-react"
import { useState } from "react"
import { UserNav } from "@/components/user-nav"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <MapPin className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">探铺</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link 
            href="/free" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            免费查询
          </Link>
          <Link 
            href="/query" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            选址查询
          </Link>
          <Link 
            href="/#pricing" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            会员价格
          </Link>
        </nav>

        <div className="hidden md:flex">
          <UserNav />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex items-center justify-center md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border/40 bg-background md:hidden">
          <nav className="container mx-auto flex flex-col gap-4 px-4 py-4">
            <Link 
              href="/free" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              免费查询
            </Link>
            <Link 
              href="/query" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              选址查询
            </Link>
            <Link 
              href="/#pricing" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              会员价格
            </Link>
            <div className="pt-2">
              <UserNav />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
