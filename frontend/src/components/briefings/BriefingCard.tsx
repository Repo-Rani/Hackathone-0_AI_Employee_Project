'use client'

import { Briefing } from '@/lib/types'
import { format } from 'date-fns'
import { CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BriefingCardProps {
  briefing: Briefing
  isSelected: boolean
  onSelect: () => void
}

export function BriefingCard({ briefing, isSelected, onSelect }: BriefingCardProps) {
  return (
    <div
      className={cn(
        "p-3 rounded-lg cursor-pointer transition-colors",
        isSelected
          ? "bg-primary/10 border border-primary/30"
          : "hover:bg-background-2 border border-transparent"
      )}
      onClick={onSelect}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-1">
          <CheckCircle2 className="size-3 text-success" />
          <span className="text-xs font-medium">{briefing.kpi.tasksCompleted}</span>
        </div>
        <div className="flex items-center gap-1">
          <AlertTriangle className="size-3 text-danger" />
          <span className="text-xs font-medium">{briefing.kpi.bottlenecksCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <Lightbulb className="size-3 text-warning" />
          <span className="text-xs font-medium">{briefing.kpi.suggestionsCount}</span>
        </div>
      </div>

      <h3 className="font-medium text-sm truncate">
        {format(new Date(briefing.date), 'MMM dd, yyyy')}
      </h3>
      <p className="text-xs text-muted truncate">
        {briefing.period}
      </p>
      <p className="text-xs mt-1 text-success font-medium">
        ${briefing.kpi.revenueThisWeek.toLocaleString()}
      </p>
    </div>
  )
}
