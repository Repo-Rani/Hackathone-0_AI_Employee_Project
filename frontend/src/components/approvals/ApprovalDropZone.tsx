'use client'

import { cn } from '@/lib/utils'

interface ApprovalDropZoneProps {
  className?: string
}

export function ApprovalDropZone({ className }: ApprovalDropZoneProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-4", className)}>
      {/* Reject Zone */}
      <div
        data-droppable="reject-zone"
        className="rounded-lg border-2 border-dashed border-danger/50 bg-danger/5 p-8 flex flex-col items-center justify-center gap-2"
      >
        <div className="size-12 rounded-full bg-danger/10 flex items-center justify-center">
          <span className="text-2xl">❌</span>
        </div>
        <p className="text-danger font-medium">Drop to Reject</p>
        <p className="text-xs text-muted">Action will be cancelled</p>
      </div>

      {/* Approve Zone */}
      <div
        data-droppable="approve-zone"
        className="rounded-lg border-2 border-dashed border-success/50 bg-success/5 p-8 flex flex-col items-center justify-center gap-2"
      >
        <div className="size-12 rounded-full bg-success/10 flex items-center justify-center">
          <span className="text-2xl">✅</span>
        </div>
        <p className="text-success font-medium">Drop to Approve</p>
        <p className="text-xs text-muted">Action will be executed</p>
      </div>
    </div>
  )
}
