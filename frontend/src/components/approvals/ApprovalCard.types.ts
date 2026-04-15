export interface ApprovalCardProps {
  approval: import('@/lib/types').Approval
  index: number
  onApprove: (id: string) => void
  onReject: (id: string, reason?: string) => void
  isDragging?: boolean
}
