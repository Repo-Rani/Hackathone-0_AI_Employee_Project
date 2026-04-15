'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store/useAppStore'
import { apiClient } from '@/lib/api/client'
import { TaskCard } from '@/components/inbox/TaskCard'
import { TaskFilter } from '@/components/inbox/TaskFilter'
import { TaskDetailDrawer } from '@/components/inbox/TaskDetailDrawer'
import { EmptyState } from '@/components/shared/EmptyState'
import { Task } from '@/lib/types'

export default function InboxPage() {
  const { initialize } = useAppStore()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('latest')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    initialize()
    fetchTasks()
  }, [initialize])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getTasks()
      setTasks(data)
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  // Filter and search tasks
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.type === filter
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.from.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    } else if (sortBy === 'type') {
      return a.type.localeCompare(b.type)
    }
    return 0
  })

  const handleViewDetails = (task: Task) => {
    setSelectedTask(task)
    setDrawerOpen(true)
  }

  const handleMarkDone = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, status: 'done' } : task
    ))
  }

  const handleDismiss = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, status: 'dismissed' } : task
    ))
  }

  const handleCreatePlan = (task: Task) => {
    console.log('Creating plan for task:', task)
    // In a real app, this would navigate to the plans page
    setDrawerOpen(false)
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Inbox</h1>
        <p className="text-sm text-muted">Tasks that need your attention</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted">Loading tasks from vault...</p>
          </div>
        ) : (
          <>
            <TaskFilter
              filter={filter}
              setFilter={setFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            {sortedTasks.length === 0 ? (
              <EmptyState page="inbox" />
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 gap-4"
              >
                {sortedTasks.map((task, index) => (
                  <motion.div key={task.id} variants={containerVariants}>
                    <TaskCard
                      task={task}
                      index={index}
                      onViewDetails={handleViewDetails}
                      onCreatePlan={handleCreatePlan}
                      onMarkDone={handleMarkDone}
                      onDismiss={handleDismiss}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>

      <TaskDetailDrawer
        task={selectedTask}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onMarkDone={handleMarkDone}
        onDismiss={handleDismiss}
        onCreatePlan={handleCreatePlan}
      />
    </div>
  )
}