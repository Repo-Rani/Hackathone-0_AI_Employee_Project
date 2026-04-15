'use client'

import { PlanStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

interface PlanStatusBadgeProps {
  status: PlanStatus
  size?: 'sm' | 'md'
}

export function PlanStatusBadge({ status, size = 'sm' }: PlanStatusBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  }

  const statusConfig = {
    pending_approval: {
      label: 'Pending Approval',
      className: 'bg-warning/10 text-warning',
    },
    in_progress: {
      label: 'In Progress',
      className: 'bg-cyan/10 text-cyan',
    },
    complete: {
      label: 'Complete',
      className: 'bg-success/10 text-success',
    },
    blocked: {
      label: 'Blocked',
      className: 'bg-danger/10 text-danger',
    },
    cancelled: {
      label: 'Cancelled',
      className: 'bg-muted/20 text-muted',
    },
  }

  const config = statusConfig[status]

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        sizeClasses[size],
        config.className
      )}
    >
      {config.label}
    </span>
  )
}
