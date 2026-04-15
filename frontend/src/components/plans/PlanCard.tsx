'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plan, PlanStatus } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { PlanStepList } from '@/components/plans/PlanStepList'
import { CheckCircle2, Clock, XCircle, Loader2, GitBranch } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlanCardProps {
  plan: Plan
  index: number
}

export function PlanCard({ plan, index }: PlanCardProps) {
  const [showSteps, setShowSteps] = useState(false)

  const getStatusColor = (status: PlanStatus) => {
    switch (status) {
      case 'in_progress':
        return 'border-cyan/30 bg-cyan/5'
      case 'pending_approval':
        return 'border-warning/30 bg-warning/5'
      case 'complete':
        return 'border-success/30 bg-success/5'
      case 'blocked':
        return 'border-danger/30 bg-danger/5'
      default:
        return 'border-border'
    }
  }

  const getStatusIcon = (status: PlanStatus) => {
    switch (status) {
      case 'in_progress':
        return <Loader2 className="size-4 text-cyan animate-spin" />
      case 'pending_approval':
        return <Clock className="size-4 text-warning" />
      case 'complete':
        return <CheckCircle2 className="size-4 text-success" />
      case 'blocked':
        return <XCircle className="size-4 text-danger" />
      default:
        return <GitBranch className="size-4 text-muted" />
    }
  }

  // Calculate progress
  const completedSteps = plan.steps.filter(step => step.status === 'done').length
  const progress = plan.steps.length > 0 ? (completedSteps / plan.steps.length) * 100 : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        "rounded-lg border bg-card p-5",
        getStatusColor(plan.status)
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="size-10 rounded-lg bg-background-2 flex items-center justify-center flex-shrink-0">
            {getStatusIcon(plan.status)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold truncate">{plan.title}</h3>
              <span className={cn(
                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2",
                plan.status === 'in_progress' ? 'bg-cyan/10 text-cyan' :
                plan.status === 'pending_approval' ? 'bg-warning/10 text-warning' :
                plan.status === 'complete' ? 'bg-success/10 text-success' :
                plan.status === 'blocked' ? 'bg-danger/10 text-danger' :
                'bg-muted/20 text-muted'
              )}>
                {plan.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <p className="text-sm text-muted mt-1 line-clamp-2">
              {plan.objective}
            </p>

            <div className="mt-3">
              <div className="flex justify-between text-xs text-muted mb-1">
                <span>Progress</span>
                <span>{completedSteps} / {plan.steps.length}</span>
              </div>
              <div className="w-full bg-background-2 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {plan.iteration > 0 && plan.maxIterations > 0 && (
              <div className="mt-2 text-xs text-muted">
                Iteration: {plan.iteration} / {plan.maxIterations}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSteps(!showSteps)}
          className="w-full"
        >
          {showSteps ? 'Hide Steps' : 'Expand Steps'}
        </Button>
      </div>

      {showSteps && (
        <div className="mt-4 pt-4 border-t">
          <PlanStepList steps={plan.steps} />
        </div>
      )}
    </motion.div>
  )
}