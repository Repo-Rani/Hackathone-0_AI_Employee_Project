import { apiClient } from '@/lib/api/client'

export const accountingAPI = {
  getTransactions: () => apiClient.getTransactions(),
  getAccountingSummary: () => apiClient.getAccountingSummary(),
}