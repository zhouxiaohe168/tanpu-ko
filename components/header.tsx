"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Menu, X } from "lucide-react"
import { useState } from "react"

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
            href="/query" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            免费查询
          </Link>
          <Link 
            href="/#pricing" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            会员价格
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm">
            登录
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            免费试用
          </Button>
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
              href="/query" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              免费查询
            </Link>
            <Link 
              href="/#pricing" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              会员价格
            </Link>
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="ghost" size="sm" className="justify-start">
                登录
              </Button>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                免费试用
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
