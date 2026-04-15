'use client'

import { BriefingKPI } from '@/lib/types'
import { CheckCircle2, AlertTriangle, Lightbulb, DollarSign } from 'lucide-react'

interface BriefingKPIRowProps {
  kpi: BriefingKPI
}

export function BriefingKPIRow({ kpi }: BriefingKPIRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Revenue */}
      <div className="bg-background-2 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="size-8 rounded-full bg-success/10 flex items-center justify-center">
            <DollarSign className="size-4 text-success" />
          </div>
        </div>
        <div className="text-2xl font-bold text-success">
          ${kpi.revenueThisWeek.toLocaleString()}
        </div>
        <div className="text-xs text-muted mt-1">Revenue This Week</div>
        <div className="text-xs text-muted">
          {kpi.revenuePct}% of target
        </div>
      </div>

      {/* Tasks Completed */}
      <div className="bg-background-2 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="size-4 text-primary" />
          </div>
        </div>
        <div className="text-2xl font-bold text-primary">
          {kpi.tasksCompleted}
        </div>
        <div className="text-xs text-muted mt-1">Tasks Completed</div>
      </div>

      {/* Bottlenecks */}
      <div className="bg-background-2 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="size-8 rounded-full bg-danger/10 flex items-center justify-center">
            <AlertTriangle className="size-4 text-danger" />
          </div>
        </div>
        <div className="text-2xl font-bold text-danger">
          {kpi.bottlenecksCount}
        </div>
        <div className="text-xs text-muted mt-1">Bottlenecks</div>
      </div>

      {/* Suggestions */}
      <div className="bg-background-2 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="size-8 rounded-full bg-warning/10 flex items-center justify-center">
            <Lightbulb className="size-4 text-warning" />
          </div>
        </div>
        <div className="text-2xl font-bold text-warning">
          {kpi.suggestionsCount}
        </div>
        <div className="text-xs text-muted mt-1">Suggestions</div>
      </div>
    </div>
  )
}
