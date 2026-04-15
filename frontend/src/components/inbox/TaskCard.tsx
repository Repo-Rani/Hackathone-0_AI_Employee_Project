'use client'

import { motion } from 'framer-motion'
import { Task, TaskStatus, TaskPriority, TaskType } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  Mail,
  MessageCircle,
  FileText,
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2
} from 'lucide-react'
import { formatTimeAgo } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface TaskCardProps {
  task: Task
  onViewDetails: (task: Task) => void
  onCreatePlan: (task: Task) => void
  onMarkDone: (id: string) => void
  onDismiss: (id: string) => void
  index: number
}

export function TaskCard({
  task,
  onViewDetails,
  onCreatePlan,
  onMarkDone,
  onDismiss,
  index
}: TaskCardProps) {
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return 'border-danger w-1'
      case 'medium':
        return 'border-warning w-1'
      case 'low':
        return 'border-muted w-1'
      default:
        return 'border-muted w-1'
    }
  }

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'done':
        return 'border-success/50 bg-success/5'
      case 'dismissed':
        return 'border-muted/30 bg-muted/5 line-through'
      case 'processing':
        return 'border-warning/50 bg-warning/5'
      default:
        return 'border-border'
    }
  }

  const getTypeIcon = (type: TaskType) => {
    switch (type) {
      case 'email':
        return <Mail className="size-5 text-red-500" />
      case 'whatsapp':
        return <MessageCircle className="size-5 text-green-500" />
      case 'file':
        return <FileText className="size-5 text-amber-500" />
      case 'finance':
        return <DollarSign className="size-5 text-blue-500" />
      default:
        return <FileText className="size-5 text-muted" />
    }
  }

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="size-4 text-success" />
      case 'dismissed':
        return <XCircle className="size-4 text-muted" />
      case 'processing':
        return <Loader2 className="size-4 text-warning animate-spin" />
      default:
        return <Clock className="size-4 text-muted" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        "rounded-lg border p-4 flex flex-col",
        getPriorityColor(task.priority),
        getStatusColor(task.status)
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2 rounded-lg bg-background-2">
            {getTypeIcon(task.type)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-medium truncate">{task.title}</h3>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted">{formatTimeAgo(task.createdAt)}</span>
                {getStatusIcon(task.status)}
              </div>
            </div>

            <p className="text-sm text-muted truncate mt-1">{task.from}</p>
            <p className="text-sm mt-2 line-clamp-2">{task.preview}</p>

            <div className="flex items-center gap-2 mt-3">
              <span className={cn(
                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                task.priority === 'high' ? 'bg-danger/10 text-danger' :
                task.priority === 'medium' ? 'bg-warning/10 text-warning' :
                'bg-muted/20 text-muted'
              )}>
                {task.priority.toUpperCase()}
              </span>

              <span className={cn(
                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                task.status === 'done' ? 'bg-success/10 text-success' :
                task.status === 'dismissed' ? 'bg-muted/20 text-muted' :
                task.status === 'processing' ? 'bg-warning/10 text-warning' :
                'bg-primary/10 text-primary'
              )}>
                {task.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons - hidden when status is done or dismissed */}
      {task.status !== 'done' && task.status !== 'dismissed' && (
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(task)}
            className="flex-1"
          >
            View Details
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onCreatePlan(task)}
            className="flex-1"
          >
            Create Plan
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onMarkDone(task.id)}
            className="flex-1"
          >
            Mark Done
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onDismiss(task.id)}
            className="flex-1"
          >
            Dismiss
          </Button>
        </div>
      )}

      {task.status === 'processing' && (
        <div className="mt-4 text-center">
          <p className="text-sm text-warning flex items-center justify-center gap-1">
            <Loader2 className="size-4 animate-spin" />
            Processing...
          </p>
        </div>
      )}
    </motion.div>
  )
}