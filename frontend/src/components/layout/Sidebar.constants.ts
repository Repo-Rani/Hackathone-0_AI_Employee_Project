import { DashboardStats } from '@/lib/types'
import {
  LayoutDashboard,
  Inbox,
  Bell,
  GitBranch,
  FileText,
  BarChart3,
  ScrollText,
  Settings
} from 'lucide-react'

export interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  badge?: (stats: DashboardStats) => number
  badgeVariant?: 'default' | 'urgent'
}

// Define navigation items
export const navItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    badge: () => 0,
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
    href: '/plans',
    label: 'Plans',
    icon: GitBranch,
    badge: (stats: DashboardStats) => stats.activeWatchers,
  },
  {
    href: '/briefings',
    label: 'Briefings',
    icon: FileText,
    badge: () => 0,
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
    badge: () => 0,
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: Settings,
    badge: () => 0,
  },
]
