'use client'

import type { PlanStep as PlanStepType, StepStatus } from '@/lib/types'
import { CheckCircle2, Clock, XCircle, Loader2, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlanStepProps {
  step: PlanStepType
  index: number
}

export function PlanStep({ step, index }: PlanStepProps) {
  const getStepIcon = (status: StepStatus) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="size-4 text-success" />
      case 'active':
        return <Loader2 className="size-4 text-cyan animate-spin" />
      case 'failed':
        return <XCircle className="size-4 text-danger" />
      case 'skipped':
        return <Clock className="size-4 text-muted" />
      default:
        return <Clock className="size-4 text-muted" />
    }
  }

  const getStepColor = (status: StepStatus) => {
    switch (status) {
      case 'done':
        return 'text-success'
      case 'active':
        return 'text-cyan font-medium'
      case 'failed':
        return 'text-danger'
      case 'skipped':
        return 'text-muted'
      default:
        return 'text-muted'
    }
  }

  return (
    <div className="flex items-start gap-3 py-2">
      <div className="pt-0.5 flex-shrink-0">
        {getStepIcon(step.status)}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm truncate", getStepColor(step.status))}>
          {step.label}
        </p>
        {step.status === 'done' && step.durationMs && (
          <p className="text-xs text-muted ml-5">
            ({(step.durationMs / 1000).toFixed(1)}s)
          </p>
        )}
        {step.status === 'failed' && step.errorMessage && (
          <p className="text-xs text-danger ml-5 truncate">
            {step.errorMessage}
          </p>
        )}
        {step.requiresApproval && (
          <div className="flex items-center gap-1 text-xs text-warning ml-5 mt-1">
            <Lock className="size-3" />
            Requires approval
          </div>
        )}
      </div>
    </div>
  )
}
