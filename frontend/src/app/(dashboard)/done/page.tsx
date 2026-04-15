'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { apiClient } from '@/lib/api/client'
import { TaskCard } from '@/components/inbox/TaskCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { FolderCheck, Clock } from 'lucide-react'

interface DoneTask {
  id: string
  title: string
  type: string
  completedAt: string
  preview: string
}

export default function DonePage() {
  const [tasks, setTasks] = useState<DoneTask[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDoneTasks()
  }, [])

  const fetchDoneTasks = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getDoneTasks()
      setTasks(data)
    } catch (error) {
      console.error('Failed to fetch done tasks:', error)
      setTasks([])
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
      <motion.div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-success/10 via-cyan/10 to-success/10 p-6 border border-success/20">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-success/5 via-cyan/5 to-success/5"
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
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <FolderCheck className="w-6 h-6 text-success" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-success via-cyan to-success bg-[length:200%_auto] bg-clip-text text-transparent">
              Completed Tasks
            </h1>
            <p className="text-muted">Tasks that have been successfully completed</p>
          </div>
        </div>
      </motion.div>

      {/* Tasks List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted">Loading completed tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={FolderCheck}
          title="No completed tasks"
          description="Completed tasks will appear here"
        />
      ) : (
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 gap-4"
        >
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              variants={containerVariants}
              whileHover={{ scale: 1.01 }}
              className="rounded-lg border bg-card p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-success" />
                    <h3 className="font-semibold text-lg">{task.title}</h3>
                  </div>
                  <p className="text-sm text-muted mb-2">Type: {task.type}</p>
                  <p className="text-sm line-clamp-2">{task.preview}</p>
                </div>
                <div className="text-right text-sm text-muted">
                  <p>Completed</p>
                  <p>{new Date(task.completedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
