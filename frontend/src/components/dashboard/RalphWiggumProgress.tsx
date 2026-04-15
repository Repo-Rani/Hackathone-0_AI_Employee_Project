'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Clock, XCircle, Loader2 } from 'lucide-react'
import { AIState } from '@/lib/types'
import { formatTimeAgo } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface RalphWiggumProgressProps {
  aiState: AIState
}

export function RalphWiggumProgress({ aiState }: RalphWiggumProgressProps) {
  if (!aiState.ralphWiggum) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-muted/50 mb-4">
            <Clock className="size-8 text-muted" />
          </div>
          <h3 className="font-semibold font-display">No Active Task</h3>
          <p className="text-sm text-muted mt-1">
            Claude is idle — {aiState.queueLength} items waiting in queue
          </p>
        </div>
      </div>
    )
  }

  const { ralphWiggum } = aiState
  const progress = (ralphWiggum.currentIteration / ralphWiggum.maxIterations) * 100

  // Calculate elapsed time
  const startTime = new Date(ralphWiggum.startedAt).getTime()
  const currentTime = Date.now()
  const elapsedSeconds = Math.floor((currentTime - startTime) / 1000)
  const minutes = Math.floor(elapsedSeconds / 60)
  const seconds = elapsedSeconds % 60

  return (
    <div className={cn(
      "rounded-lg border bg-card p-6",
      aiState.status === 'active' || aiState.status === 'processing' ? 'border-cyan/30' : ''
    )}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold font-display">Active Task</h3>
          <p className="text-sm text-muted">{ralphWiggum.taskDescription}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted">
            Iteration {ralphWiggum.currentIteration} of {ralphWiggum.maxIterations}
          </p>
          <p className="text-xs font-mono">
            {minutes}m {seconds}s
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-background-2 rounded-full h-2 mb-4 overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>

      {/* Step list */}
      <div className="space-y-2">
        {ralphWiggum.steps.map((step, index) => {
          let Icon = Clock
          let color = 'text-muted'
          let bg = 'bg-muted/20'

          if (step.status === 'done') {
            Icon = CheckCircle2
            color = 'text-success'
            bg = 'bg-success/10'
          } else if (step.status === 'active') {
            Icon = Loader2
            color = 'text-cyan'
            bg = 'bg-cyan/10'
          } else if (step.status === 'failed') {
            Icon = XCircle
            color = 'text-danger'
            bg = 'bg-danger/10'
          }

          return (
            <div key={step.id} className="flex items-center gap-3 py-1">
              <div className={cn(
                "size-6 rounded-full flex items-center justify-center",
                bg
              )}>
                <Icon className={cn("size-4", color)} />
              </div>
              <div className="flex-1">
                <p className={cn(
                  "text-sm",
                  step.status === 'active' ? 'text-foreground font-medium' : 'text-muted'
                )}>
                  {step.label}
                </p>
                {step.status === 'done' && step.durationMs && (
                  <p className="text-xs text-muted ml-6">
                    ({(step.durationMs / 1000).toFixed(1)}s)
                  </p>
                )}
                {step.status === 'failed' && step.errorMessage && (
                  <p className="text-xs text-danger ml-6 truncate">
                    {step.errorMessage}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}