'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { AIStatusBar } from '@/components/layout/AIStatusBar'
import { MobileNav } from '@/components/layout/MobileNav'
import { ReactNode } from 'react'
import { useAppStore } from '@/lib/store/useAppStore'
import { cn } from '@/lib/utils'

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const { sidebarOpen, topBarVisible } = useAppStore()

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - hidden on mobile */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <TopBar />

        {/* AI Status Bar - appears below top navigation */}
        <AIStatusBar />

        {/* Main content - dynamic padding based on TopBar visibility */}
        <main className={cn(
          "flex-1 pb-8 px-4 sm:px-6 lg:px-8 transition-all duration-300",
          topBarVisible ? "pt-28" : "pt-12",
          sidebarOpen ? "lg:pl-60" : "lg:pl-20"
        )}>
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileNav />
      </div>
    </div>
  )
}