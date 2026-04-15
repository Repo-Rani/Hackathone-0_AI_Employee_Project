'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'

interface ApprovalConfirmModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (reason?: string) => void
  mode: 'approve' | 'reject'
  title: string
  description: string
}

export function ApprovalConfirmModal({
  open,
  onOpenChange,
  onConfirm,
  mode,
  title,
  description,
}: ApprovalConfirmModalProps) {
  const [rejectReason, setRejectReason] = useState('')

  const handleConfirm = () => {
    onConfirm(mode === 'reject' ? rejectReason : undefined)
    setRejectReason('')
    onOpenChange(false)
  }

  const isReject = mode === 'reject'

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
            {isReject && (
              <Textarea
                placeholder="Optional: Provide a reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="mt-3 min-h-[100px]"
              />
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={isReject ? 'bg-danger hover:bg-danger/90' : ''}
          >
            {isReject ? 'Reject' : 'Confirm'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
