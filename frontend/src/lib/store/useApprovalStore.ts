import { create } from 'zustand'
import { Approval } from '@/lib/types'
import { mockApprovals } from '@/lib/mock-data'

interface ApprovalStore {
  // Approvals
  approvals: Approval[]
  activeId: string | null
  selectedId: string | null
  setApprovals: (approvals: Approval[]) => void
  setActiveId: (id: string | null) => void
  setSelectedId: (id: string | null) => void

  // Actions
  approveItem: (id: string) => void
  rejectItem: (id: string, reason?: string) => void
  expireItem: (id: string) => void

  // Initialize with mock data
  initialize: () => void
}

export const useApprovalStore = create<ApprovalStore>((set, get) => ({
  approvals: mockApprovals,
  activeId: null,
  selectedId: null,

  setApprovals: (approvals) => set({ approvals }),
  setActiveId: (id) => set({ activeId: id }),
  setSelectedId: (id) => set({ selectedId: id }),

  approveItem: (id) => set((state) => ({
    approvals: state.approvals.map(approval =>
      approval.id === id ? { ...approval, status: 'approved' as const } : approval
    )
  })),

  rejectItem: (id, reason) => set((state) => ({
    approvals: state.approvals.map(approval =>
      approval.id === id ? { ...approval, status: 'rejected' as const, rejectionReason: reason } : approval
    )
  })),

  expireItem: (id) => set((state) => ({
    approvals: state.approvals.map(approval =>
      approval.id === id ? { ...approval, status: 'expired' as const } : approval
    )
  })),

  initialize: () => {
    set({
      approvals: mockApprovals,
      activeId: null,
      selectedId: null
    })
  }
}))