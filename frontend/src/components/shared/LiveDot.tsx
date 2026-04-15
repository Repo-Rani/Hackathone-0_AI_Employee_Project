'use client'

import { cn } from '@/lib/utils'

interface LiveDotProps {
  status: 'live' | 'idle' | 'slow' | 'error' | 'offline'
  size?: 'sm' | 'md' | 'lg'
  label?: boolean
}

export function LiveDot({ status, size = 'sm', label = false }: LiveDotProps) {
  const sizeClasses = {
    sm: 'size-2',
    md: 'size-3',
    lg: 'size-4',
  }

  const statusConfig = {
    live: {
      color: 'bg-success',
      label: 'LIVE',
    },
    idle: {
      color: 'bg-muted',
      label: 'IDLE',
    },
    slow: {
      color: 'bg-warning',
      label: 'SLOW',
    },
    error: {
      color: 'bg-danger',
      label: 'ERROR',
    },
    offline: {
      color: 'bg-muted/50',
      label: 'OFFLINE',
    },
  }

  const config = statusConfig[status]

  return (
    <div className="flex items-center gap-1">
      <div
        className={cn(
          sizeClasses[size],
          config.color,
          'rounded-full',
          status === 'live' && 'live-dot',
          status === 'slow' && 'animate-pulse',
          status === 'error' && 'animate-pulse'
        )}
      />
      {label && (
        <span className="text-xs text-muted">{config.label}</span>
      )}
    </div>
  )
}