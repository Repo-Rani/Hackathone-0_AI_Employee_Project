'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Task } from '@/lib/types'
import { format } from 'date-fns'
import { Mail, MessageCircle, FileText, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskDetailDrawerProps {
  task: Task | null
  open: boolean
  onClose: () => void
  onMarkDone: (id: string) => void
  onDismiss: (id: string) => void
  onCreatePlan: (task: Task) => void
}

export function TaskDetailDrawer({
  task,
  open,
  onClose,
  onMarkDone,
  onDismiss,
  onCreatePlan
}: TaskDetailDrawerProps) {
  if (!task) return null

  const getTypeIcon = (type: string) => {
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

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-background-2">
              {getTypeIcon(task.type)}
            </div>
            {task.title}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted">From</p>
              <p className="font-medium">{task.from}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Priority</p>
              <span className={cn(
                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                task.priority === 'high' ? 'bg-danger/10 text-danger' :
                task.priority === 'medium' ? 'bg-warning/10 text-warning' :
                'bg-muted/20 text-muted'
              )}>
                {task.priority.toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm text-muted">Status</p>
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
            <div>
              <p className="text-sm text-muted">Created</p>
              <p className="font-mono text-sm">{format(new Date(task.createdAt), 'MMM dd, yyyy HH:mm')}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted">Full Content</p>
            <div className="mt-2 p-4 bg-background-2 rounded-lg">
              <p className="whitespace-pre-line">{task.fullContent}</p>
            </div>
          </div>

          {task.metadata && Object.keys(task.metadata).length > 0 && (
            <div>
              <p className="text-sm text-muted">Metadata</p>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(task.metadata).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="text-muted capitalize">{key}:</span> {value}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-2">
          <Button
            className="flex-1"
            onClick={() => onCreatePlan(task)}
          >
            Create Plan
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onMarkDone(task.id)}
          >
            Mark Done
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onDismiss(task.id)}
          >
            Dismiss
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}