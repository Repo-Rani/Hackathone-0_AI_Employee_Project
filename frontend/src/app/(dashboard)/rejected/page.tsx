'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { apiClient } from '@/lib/api/client'
import { EmptyState } from '@/components/shared/EmptyState'
import { FolderX, XCircle, AlertTriangle } from 'lucide-react'

interface RejectedItem {
  id: string
  title: string
  type: string
  rejectedAt: string
  reason: string
}

export default function RejectedPage() {
  const [items, setItems] = useState<RejectedItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRejectedItems()
  }, [])

  const fetchRejectedItems = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getRejectedItems()
      setItems(data)
    } catch (error) {
      console.error('Failed to fetch rejected items:', error)
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
      <motion.div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-danger/10 via-orange/10 to-danger/10 p-6 border border-danger/20">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-danger/5 via-orange/5 to-danger/5"
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
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <XCircle className="w-6 h-6 text-danger" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-danger via-orange to-danger bg-[length:200%_auto] bg-clip-text text-transparent">
              Rejected Items
            </h1>
            <p className="text-muted">Items that were rejected or expired</p>
          </div>
        </div>
      </motion.div>

      {/* Rejected Items List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted">Loading rejected items...</p>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={FolderX}
          title="No rejected items"
          description="Rejected items will appear here"
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
              className="rounded-lg border border-danger/30 bg-card p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-danger" />
                    <h3 className="font-semibold text-lg text-danger">{item.title}</h3>
                  </div>
                  <p className="text-sm text-muted mb-2">Type: {item.type}</p>
                  <div className="bg-danger/5 rounded-lg p-3 border border-danger/20">
                    <p className="text-sm text-danger font-medium mb-1">Rejection Reason:</p>
                    <p className="text-sm">{item.reason}</p>
                  </div>
                </div>
                <div className="text-right text-sm text-muted">
                  <p>Rejected</p>
                  <p>{new Date(item.rejectedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
