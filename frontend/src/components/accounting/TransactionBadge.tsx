'use client'

import { TransactionType } from '@/lib/types'
import { cn } from '@/lib/utils'

interface TransactionBadgeProps {
  type: TransactionType
  size?: 'sm' | 'md'
}

export function TransactionBadge({ type, size = 'sm' }: TransactionBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  }

  const typeColors = {
    income: 'bg-success/10 text-success',
    expense: 'bg-danger/10 text-danger',
    subscription: 'bg-warning/10 text-warning',
    refund: 'bg-cyan/10 text-cyan',
    transfer: 'bg-muted/20 text-muted',
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium uppercase",
        sizeClasses[size],
        typeColors[type]
      )}
    >
      {type}
    </span>
  )
}
