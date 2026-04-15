import { apiClient } from '@/lib/api/client'

export const briefingsAPI = {
  getBriefings: () => apiClient.getBriefings(),
}