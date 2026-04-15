'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store/useAppStore'
import { apiClient } from '@/lib/api/client'
import { ApprovalCard } from '@/components/approvals/ApprovalCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { toast } from 'sonner'
import { Approval } from '@/lib/types'

export default function ApprovalsPage() {
  const { stats, setStats, initialize } = useAppStore()
  const [approvals, setApprovals] = useState<Approval[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initialize()
    fetchApprovals()
  }, [initialize])

  const fetchApprovals = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getApprovals()
      setApprovals(data)
    } catch (error) {
      console.error('Failed to fetch approvals:', error)
      setApprovals([])
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      await apiClient.approveItem(id)
      setApprovals(prev => prev.filter(approval => approval.id !== id))
      setStats({ pendingApprovals: Math.max(0, stats.pendingApprovals - 1) })
      toast.success('Approval granted', {
        description: 'Action will be executed shortly'
      })
    } catch (error) {
      console.error('Failed to approve:', error)
      toast.error('Failed to approve', {
        description: 'Please try again'
      })
    }
  }

  const handleReject = async (id: string) => {
    try {
      await apiClient.rejectItem(id)
      setApprovals(prev => prev.filter(approval => approval.id !== id))
      setStats({ pendingApprovals: Math.max(0, stats.pendingApprovals - 1) })
      toast.error('Approval rejected', {
        description: 'Action has been cancelled'
      })
    } catch (error) {
      console.error('Failed to reject:', error)
      toast.error('Failed to reject', {
        description: 'Please try again'
      })
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  // Filter pending approvals
  const pendingApprovals = approvals.filter(approval => approval.status === 'pending')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Approvals</h1>
        <p className="text-sm text-muted">Items requiring your approval</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted">Loading approvals...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingApprovals.length === 0 ? (
            <EmptyState page="approvals" />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {pendingApprovals.map((approval, index) => (
                <motion.div key={approval.id} variants={containerVariants}>
                  <ApprovalCard
                    approval={approval}
                    index={index}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}