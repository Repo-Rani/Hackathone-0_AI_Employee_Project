import { PlanStep, StepStatus } from '@/lib/types'
import { CheckCircle2, Clock, XCircle, Loader2, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlanStepListProps {
  steps: PlanStep[]
}

export function PlanStepList({ steps }: PlanStepListProps) {
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
    <div className="space-y-2">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-start gap-3">
          <div className="pt-0.5">
            {getStepIcon(step.status)}
          </div>
          <div className="flex-1">
            <div className={cn("text-sm", getStepColor(step.status))}>
              {step.label}
            </div>
            {step.status === 'done' && step.durationMs && (
              <div className="text-xs text-muted ml-5">
                ({(step.durationMs / 1000).toFixed(1)}s)
              </div>
            )}
            {step.status === 'failed' && step.errorMessage && (
              <div className="text-xs text-danger ml-5">
                {step.errorMessage}
              </div>
            )}
            {step.requiresApproval && (
              <div className="flex items-center gap-1 text-xs text-warning ml-5">
                <Lock className="size-3" />
                Requires approval
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}