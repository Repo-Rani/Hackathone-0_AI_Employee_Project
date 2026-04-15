'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: number
  format: 'currency' | 'number' | 'percentage' | 'ratio'
  icon: React.ElementType
  iconColor: 'primary' | 'success' | 'warning' | 'danger' | 'cyan'
  trend?: { value: number; direction: 'up' | 'down'; label: string }
  subtitle?: string
  urgent?: boolean
  href?: string
}

export function StatCard({
  title,
  value,
  format,
  icon: Icon,
  iconColor,
  trend,
  subtitle,
  urgent,
  href
}: StatCardProps) {
  const iconColorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
    cyan: 'bg-cyan/10 text-cyan',
  }

  const formattedValue =
    format === 'currency' ? formatCurrency(value) :
    format === 'percentage' ? `${value}%` :
    format === 'ratio' ? value.toString() :
    value.toLocaleString()

  const content = (
    <motion.div
      className={cn(
        "rounded-xl border bg-card p-5 h-full transition-all duration-300 group",
        "hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30",
        urgent && "border-danger/50 animate-pulse"
      )}
      whileHover={{ y: -4, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <motion.p
            className="text-sm font-medium text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {title}
          </motion.p>
          <motion.div
            className="mt-2 flex items-baseline gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-3xl font-bold font-display bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {formattedValue}
            </h3>
            {subtitle && (
              <span className="text-sm text-muted">{subtitle}</span>
            )}
          </motion.div>
        </div>
        
        <motion.div
          className={cn(
            "p-3 rounded-xl transition-all duration-300 group-hover:scale-110",
            iconColorClasses[iconColor]
          )}
          whileHover={{ rotate: 5 }}
        >
          <Icon className="w-6 h-6" />
        </motion.div>
      </div>

      {trend && (
        <motion.div
          className={cn(
            "mt-4 flex items-center gap-1 text-sm font-medium",
            trend.direction === 'up' ? 'text-success' : 'text-danger'
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.span
            animate={{ y: trend.direction === 'up' ? -2 : 2 }}
            transition={{ duration: 0.3 }}
          >
            {trend.direction === 'up' ? '↑' : '↓'}
          </motion.span>
          <span>{Math.abs(trend.value)}%</span>
          <span className="text-muted font-normal">{trend.label}</span>
        </motion.div>
      )}
    </motion.div>
  )

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    )
  }

  return content
}