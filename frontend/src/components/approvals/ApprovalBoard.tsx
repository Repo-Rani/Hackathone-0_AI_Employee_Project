'use client'

import { DndContext, DragOverlay, DragStartEvent, DragEndEvent, DragOverEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import { useState } from 'react'
import { Approval } from '@/lib/types'
import { ApprovalCard } from './ApprovalCard'
import { ApprovalDropZone } from './ApprovalDropZone'
import { toast } from 'sonner'

interface ApprovalBoardProps {
  approvals: Approval[]
  onApprove: (id: string) => void
  onReject: (id: string, reason?: string) => void
}

export function ApprovalBoard({ approvals, onApprove, onReject }: ApprovalBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeApproval, setActiveApproval] = useState<Approval | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
    const approval = approvals.find(a => a.id === event.active.id)
    if (approval) setActiveApproval(approval)
  }

  const handleDragOver = (event: DragOverEvent) => {
    // Could add visual feedback for drop zones here
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event

    if (over) {
      if (over.id === 'approve-zone') {
        if (activeId) {
          onApprove(activeId)
          toast.success('Approval granted', {
            description: 'Action will be executed shortly'
          })
        }
      } else if (over.id === 'reject-zone') {
        if (activeId) {
          onReject(activeId)
          toast.error('Approval rejected', {
            description: 'Action has been cancelled'
          })
        }
      }
    }

    setActiveId(null)
    setActiveApproval(null)
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        {/* Drop Zones - shown when dragging */}
        {activeId && (
          <ApprovalDropZone />
        )}

        {/* Approval Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {approvals.map((approval, index) => (
            <ApprovalCard
              key={approval.id}
              approval={approval}
              index={index}
              onApprove={onApprove}
              onReject={onReject}
              isDragging={activeId === approval.id}
            />
          ))}
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeApproval && (
          <div className="rotate-2 shadow-2xl">
            <ApprovalCard
              approval={activeApproval}
              index={0}
              onApprove={() => {}}
              onReject={() => {}}
              isDragging={true}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
