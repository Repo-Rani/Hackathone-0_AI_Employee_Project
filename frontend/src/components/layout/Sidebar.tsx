'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Inbox,
  Bell,
  GitBranch,
  FileText,
  BarChart3,
  ScrollText,
  Settings,
  Home,
  LogOut,
  CheckCircle,
  FolderCheck,
  XCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store/useAppStore'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { DashboardStats } from '@/lib/types'
import { motion } from 'framer-motion'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  badge: (stats: DashboardStats) => number
  badgeVariant?: 'default' | 'urgent'
}

// Define navigation items
const navItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    badge: (stats: DashboardStats) => 0,
  },
  {
    href: '/inbox',
    label: 'Inbox',
    icon: Inbox,
    badge: (stats: DashboardStats) => stats.tasksTotal - stats.tasksDoneToday,
  },
  {
    href: '/approvals',
    label: 'Approvals',
    icon: Bell,
    badge: (stats: DashboardStats) => stats.pendingApprovals,
    badgeVariant: 'urgent',
  },
  {
    href: '/approved',
    label: 'Approved',
    icon: CheckCircle,
    badge: (stats: DashboardStats) => 0,
  },
  {
    href: '/done',
    label: 'Done',
    icon: FolderCheck,
    badge: (stats: DashboardStats) => 0,
  },
  {
    href: '/rejected',
    label: 'Rejected',
    icon: XCircle,
    badge: (stats: DashboardStats) => 0,
  },
  {
    href: '/plans',
    label: 'Plans',
    icon: GitBranch,
    badge: (stats: DashboardStats) => stats.activeWatchers,
  },
  {
    href: '/briefings',
    label: 'Briefings',
    icon: FileText,
    badge: (stats: DashboardStats) => 0,
  },
  {
    href: '/accounting',
    label: 'Accounting',
    icon: BarChart3,
    badge: (stats: DashboardStats) => stats.pendingApprovalsUrgent,
  },
  {
    href: '/logs',
    label: 'Audit Logs',
    icon: ScrollText,
    badge: (stats: DashboardStats) => 0,
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: Settings,
    badge: (stats: DashboardStats) => 0,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { stats, sidebarOpen, toggleSidebar } = useAppStore()

  // Function to get badge count for each item
  const getBadgeCount = (item: typeof navItems[0]) => {
    if (item.badge && stats) {
      const count = item.badge(stats)
      return count || 0
    }
    return 0
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 z-30 hidden h-dvh border-r bg-sidebar-bg transition-all duration-300 ease-in-out lg:block",
        sidebarOpen ? "w-60" : "w-16"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header with Logo */}
        <motion.div
          className="flex items-center gap-3 border-b p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {sidebarOpen ? (
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="size-8 rounded-lg bg-gradient-to-br from-primary to-cyan flex items-center justify-center"
                animate={{
                  boxShadow: ['0 0 20px hsl(var(--primary)/0.5)', '0 0 40px hsl(var(--primary)/0.8)', '0 0 20px hsl(var(--primary)/0.5)']
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <LayoutDashboard className="size-5 text-primary-foreground" />
              </motion.div>
              <h1 className="text-lg font-bold font-display bg-gradient-to-r from-primary via-cyan to-primary bg-[length:200%_auto] bg-clip-text text-transparent">
                AI Employee
              </h1>
            </motion.div>
          ) : (
            <motion.div
              className="size-8 rounded-lg bg-gradient-to-br from-primary to-cyan flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <LayoutDashboard className="size-5 text-primary-foreground" />
            </motion.div>
          )}
        </motion.div>

        {/* Quick Home Button */}
        <motion.div
          className="p-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/">
                  <div
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                      "text-muted hover:bg-sidebar-hover hover:text-primary",
                      "group"
                    )}
                  >
                    <Home className="size-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <span className="text-left">Home</span>
                    )}
                  </div>
                </Link>
              </TooltipTrigger>
              {!sidebarOpen && (
                <TooltipContent side="right">
                  <p>Go to Home</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </motion.div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item, index) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              const badgeCount = getBadgeCount(item)

              return (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={item.href}>
                    <div
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                        isActive
                          ? "bg-sidebar-active text-foreground shadow-sm"
                          : "text-muted hover:bg-sidebar-hover hover:text-primary",
                        "group"
                      )}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <Icon className="size-5 flex-shrink-0" />
                      </motion.div>
                      {sidebarOpen && (
                        <motion.div
                          className="flex-1 truncate text-left"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          {item.label}
                        </motion.div>
                      )}
                      {badgeCount > 0 && sidebarOpen && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500 }}
                          className={cn(
                            "inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium",
                            item.badgeVariant === 'urgent' ? 'bg-danger text-white' : 'bg-primary text-primary-foreground'
                          )}
                        >
                          {badgeCount}
                        </motion.span>
                      )}
                      {badgeCount > 0 && !sidebarOpen && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={cn(
                            "absolute left-10 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium -ml-1",
                            item.badgeVariant === 'urgent' ? 'bg-danger text-white' : 'bg-primary text-primary-foreground'
                          )}
                        >
                          {badgeCount}
                        </motion.span>
                      )}
                    </div>
                  </Link>
                </motion.li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <motion.div
          className="border-t p-4 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {/* Version Info */}
          {sidebarOpen && (
            <motion.div
              className="flex items-center gap-2 text-xs text-muted mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <span className="px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                Platinum Tier
              </span>
              <span>v2.0</span>
            </motion.div>
          )}

          {/* Theme Toggle & Logout */}
          <div className="flex items-center justify-between gap-2">
            {sidebarOpen ? (
              <span className="text-xs text-muted">Theme</span>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-8" />
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Toggle Theme</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <ThemeToggle />
          </div>
        </motion.div>
      </div>
    </aside>
  )
}