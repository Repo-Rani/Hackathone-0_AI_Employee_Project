'use client'

import { Briefing } from '@/lib/types'
import { format } from 'date-fns'
import { FileText, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BriefingSidebarProps {
  briefings: Briefing[]
  selectedBriefingId: string | null
  onSelectBriefing: (id: string) => void
}

export function BriefingSidebar({
  briefings,
  selectedBriefingId,
  onSelectBriefing
}: BriefingSidebarProps) {
  return (
    <div className="h-full overflow-y-auto border-r pr-4">
      <h2 className="font-semibold font-display mb-4 flex items-center gap-2">
        <FileText className="size-5" />
        Briefings
      </h2>

      <div className="space-y-2">
        {briefings.map((briefing) => {
          const isSelected = selectedBriefingId === briefing.id

          return (
            <div
              key={briefing.id}
              className={cn(
                "p-3 rounded-lg cursor-pointer transition-colors",
                isSelected
                  ? "bg-primary/10 border border-primary/30"
                  : "hover:bg-background-2 border border-transparent"
              )}
              onClick={() => onSelectBriefing(briefing.id)}
            >
              <div className="flex items-center gap-2">
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

              <h3 className="font-medium text-sm truncate mt-1">
                {format(new Date(briefing.date), 'MMM dd, yyyy')}
              </h3>
              <p className="text-xs text-muted truncate">
                {briefing.period}
              </p>
              <p className="text-xs mt-1">
                ${briefing.kpi.revenueThisWeek.toLocaleString()}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}