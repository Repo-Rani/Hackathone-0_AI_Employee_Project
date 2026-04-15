'use client'

import { cn } from '@/lib/utils'

type StatusVariant = 'default' | 'success' | 'warning' | 'danger' | 'cyan' | 'muted'

interface StatusBadgeProps {
  variant?: StatusVariant
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function StatusBadge({
  variant = 'default',
  children,
  className,
  size = 'sm'
}: StatusBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  }

  const variantClasses = {
    default: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
    cyan: 'bg-cyan/10 text-cyan',
    muted: 'bg-muted/20 text-muted',
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
