'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store/useAppStore'
import { apiClient } from '@/lib/api/client'
import { StatCard } from '@/components/dashboard/StatCard'
import { WatcherStatusGrid } from '@/components/dashboard/WatcherStatusGrid'
import { RalphWiggumProgress } from '@/components/dashboard/RalphWiggumProgress'
import { RecentActivityFeed } from '@/components/dashboard/RecentActivityFeed'
import { QuickActionPanel } from '@/components/dashboard/QuickActionPanel'
import { RevenueAreaChart } from '@/components/dashboard/RevenueAreaChart'
import {
  Bell,
  CheckCircle2,
  Activity,
  DollarSign,
  XCircle,
  Clock,
  Brain,
  FolderCheck,
  FolderX,
  Inbox
} from 'lucide-react'

interface VaultSummary {
  needsAction: number
  pendingApproval: number
  approved: number
  done: number
  rejected: number
  plans: number
  logs: number
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

export default function DashboardPage() {
  const { aiState, watchers, stats, initialize } = useAppStore()
  const [vaultSummary, setVaultSummary] = useState<VaultSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initialize()
    fetchVaultSummary()
  }, [initialize])

  const fetchVaultSummary = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getVaultSummary()
      setVaultSummary(data)
    } catch (error) {
      console.error('Failed to fetch vault summary:', error)
      setVaultSummary(null)
    } finally {
      setLoading(false)
    }
  }

  // Calculate revenue trend for stat cards
  const revenueTrend = stats.revenueChange > 0 ? 'up' : 'down'

  // Prepare chart data (mock data for the last 7 days)
  const chartData = [
    { date: '2026-01-01', amount: 1200 },
    { date: '2026-01-02', amount: 1800 },
    { date: '2026-01-03', amount: 2100 },
    { date: '2026-01-04', amount: 1950 },
    { date: '2026-01-05', amount: 2300 },
    { date: '2026-01-06', amount: 1750 },
    { date: '2026-01-07', amount: 2000 }
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Page Header with enhanced styling */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-cyan/10 to-primary/10 p-6 border border-primary/20">
        {/* Animated background glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/5 via-cyan/5 to-primary/5"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'linear'
          }}
          style={{ backgroundSize: '200% 100%' }}
        />

        <div className="relative flex items-center justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-2"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Brain className="w-6 h-6 text-primary" />
              </motion.div>
              <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-primary via-cyan to-primary bg-[length:200%_auto] bg-clip-text text-transparent">
                Dashboard
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-muted"
            >
              Command center for your AI Employee
            </motion.p>
          </div>

          {/* Animated status indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-success"
            />
            <span className="text-sm font-medium text-success">System Active</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Stat Cards - Main Stats */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div variants={scaleIn}>
            <StatCard
              title="Revenue MTD"
              value={stats.revenueMTD}
              format="currency"
              icon={DollarSign}
              iconColor="primary"
              trend={{
                value: Math.abs(stats.revenueChange),
                direction: revenueTrend as 'up' | 'down',
                label: revenueTrend === 'up' ? 'vs last month' : 'vs last month'
              }}
              subtitle={`of $${stats.revenueTarget.toLocaleString()} target`}
              href="/accounting"
            />
          </motion.div>

          <motion.div variants={scaleIn}>
            <StatCard
              title="Pending Approvals"
              value={stats.pendingApprovals}
              format="number"
              icon={Bell}
              iconColor="warning"
              urgent={stats.pendingApprovals > 0}
              href="/approvals"
            />
          </motion.div>

          <motion.div variants={scaleIn}>
            <StatCard
              title="Tasks Done Today"
              value={stats.tasksDoneToday}
              format="number"
              icon={CheckCircle2}
              iconColor="success"
              href="/logs"
            />
          </motion.div>

          <motion.div variants={scaleIn}>
            <StatCard
              title="Active Watchers"
              value={stats.activeWatchers}
              format="number"
              icon={Activity}
              iconColor="cyan"
              href="/logs"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Vault Sections Stats */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold mb-3">Vault Sections</h2>
        {loading ? (
          <div className="text-muted text-sm">Loading vault summary...</div>
        ) : vaultSummary ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <motion.div variants={scaleIn}>
              <StatCard
                title="Needs Action"
                value={vaultSummary.needsAction}
                format="number"
                icon={Inbox}
                iconColor="warning"
                href="/inbox"
              />
            </motion.div>

            <motion.div variants={scaleIn}>
              <StatCard
                title="Approved"
                value={vaultSummary.approved}
                format="number"
                icon={CheckCircle2}
                iconColor="success"
                href="/approvals"
              />
            </motion.div>

            <motion.div variants={scaleIn}>
              <StatCard
                title="Done"
                value={vaultSummary.done}
                format="number"
                icon={FolderCheck}
                iconColor="success"
                href="/logs"
              />
            </motion.div>

            <motion.div variants={scaleIn}>
              <StatCard
                title="Rejected"
                value={vaultSummary.rejected}
                format="number"
                icon={FolderX}
                iconColor="danger"
                href="/logs"
              />
            </motion.div>

            <motion.div variants={scaleIn}>
              <StatCard
                title="Plans"
                value={vaultSummary.plans}
                format="number"
                icon={Clock}
                iconColor="primary"
                href="/plans"
              />
            </motion.div>
          </div>
        ) : (
          <div className="text-muted text-sm">Failed to load vault summary</div>
        )}
      </motion.div>

      {/* Watcher Grid & Ralph Wiggum */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={scaleIn}>
            <WatcherStatusGrid watchers={watchers} />
          </motion.div>

          <motion.div variants={scaleIn}>
            <RalphWiggumProgress aiState={aiState} />
          </motion.div>
        </div>
      </motion.div>

      {/* Recent Activity & Quick Actions */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={scaleIn}>
            <RecentActivityFeed logs={mockLogs} />
          </motion.div>

          <motion.div variants={scaleIn}>
            <QuickActionPanel />
          </motion.div>
        </div>
      </motion.div>

      {/* Revenue Chart */}
      <motion.div variants={itemVariants}>
        <RevenueAreaChart data={chartData} />
      </motion.div>
    </motion.div>
  )
}