'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { apiClient } from '@/lib/api/client'
import { EmptyState } from '@/components/shared/EmptyState'
import { CheckCircle2, Clock } from 'lucide-react'

interface ApprovedItem {
  id: string
  title: string
  type: string
  approvedAt: string
  approvedBy: string
}

export default function ApprovedPage() {
  const [items, setItems] = useState<ApprovedItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApprovedItems()
  }, [])

  const fetchApprovedItems = async () => {
    try {
      setLoading(true)
      // For now, we'll get from logs or you can add a dedicated endpoint
      // This is a placeholder - you can add a proper endpoint later
      setItems([])
    } catch (error) {
      console.error('Failed to fetch approved items:', error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-success/10 via-green/10 to-success/10 p-6 border border-success/20">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-success/5 via-green/5 to-success/5"
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

        <div className="relative flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <CheckCircle2 className="w-6 h-6 text-success" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-success via-green to-success bg-[length:200%_auto] bg-clip-text text-transparent">
              Approved Items
            </h1>
            <p className="text-muted">Items that have been approved and are awaiting execution</p>
          </div>
        </div>
      </motion.div>

      {/* Approved Items List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted">Loading approved items...</p>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="No approved items"
          description="Approved items waiting for execution will appear here"
        />
      ) : (
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 gap-4"
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              variants={containerVariants}
              whileHover={{ scale: 1.01 }}
              className="rounded-lg border border-success/30 bg-card p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <h3 className="font-semibold text-lg text-success">{item.title}</h3>
                  </div>
                  <p className="text-sm text-muted">Type: {item.type}</p>
                </div>
                <div className="text-right text-sm text-muted">
                  <p>Approved</p>
                  <p>{new Date(item.approvedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
