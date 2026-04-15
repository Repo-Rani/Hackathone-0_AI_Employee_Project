export interface TaskCardProps {
  task: import('@/lib/types').Task
  index: number
  onViewDetails: (task: import('@/lib/types').Task) => void
  onCreatePlan: (task: import('@/lib/types').Task) => void
  onMarkDone: (id: string) => void
  onDismiss: (id: string) => void
}
