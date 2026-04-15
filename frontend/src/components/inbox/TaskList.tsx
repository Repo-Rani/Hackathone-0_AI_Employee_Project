'use client'

import { motion } from 'framer-motion'
import { Task } from '@/lib/types'

interface TaskListProps {
  tasks: Task[]
  children: (task: Task, index: number) => React.ReactNode
}

export function TaskList({ tasks, children }: TaskListProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.055
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-4"
    >
      {tasks.map((task, index) => children(task, index))}
    </motion.div>
  )
}
