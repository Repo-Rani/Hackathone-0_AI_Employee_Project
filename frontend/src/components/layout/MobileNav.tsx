'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Inbox,
  Bell,
  MoreHorizontal
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/inbox', label: 'Inbox', icon: Inbox },
  { href: '/approvals', label: 'Approvals', icon: Bell },
]

const moreItems: NavItem[] = [
  { href: '/plans', label: 'Plans', icon: LayoutDashboard },
  { href: '/briefings', label: 'Briefings', icon: LayoutDashboard },
  { href: '/accounting', label: 'Accounting', icon: LayoutDashboard },
  { href: '/logs', label: 'Audit Logs', icon: LayoutDashboard },
  { href: '/settings', label: 'Settings', icon: LayoutDashboard },
]

export function MobileNav() {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background lg:hidden">
        <div className="grid grid-cols-4 h-16">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1",
                  "transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted hover:text-foreground"
                )}
              >
                <Icon className="size-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
            )
          })}

          {/* More menu trigger */}
          <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
            <SheetTrigger asChild>
              <button
                className={cn(
                  "flex flex-col items-center justify-center gap-1",
                  "transition-colors",
                  "text-muted hover:text-foreground"
                )}
              >
                <MoreHorizontal className="size-5" />
                <span className="text-xs">More</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto max-h-[60vh] overflow-y-auto">
              <div className="grid gap-2 py-4">
                {moreItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted"
                      )}
                    >
                      <Icon className="size-5" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Spacer for bottom nav on mobile */}
      <div className="h-16 lg:hidden" />
    </>
  )
}
