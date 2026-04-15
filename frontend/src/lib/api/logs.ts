import { apiClient } from '@/lib/api/client'

export const logsAPI = {
  getLogs: () => apiClient.getLogs(),
}