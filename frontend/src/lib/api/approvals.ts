import { apiClient } from '@/lib/api/client'

export const approvalsAPI = {
  getApprovals: () => apiClient.getApprovals(),
  approveItem: (id: string) => apiClient.approveItem(id),
  rejectItem: (id: string, reason?: string) => apiClient.rejectItem(id, reason),
}