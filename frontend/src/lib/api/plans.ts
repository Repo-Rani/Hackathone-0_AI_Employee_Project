import { apiClient } from '@/lib/api/client'

export const plansAPI = {
  getPlans: () => apiClient.getPlans(),
}