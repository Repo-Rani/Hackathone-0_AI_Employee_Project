import { apiClient } from '@/lib/api/client'

export const tasksAPI = {
  getTasks: () => apiClient.getTasks(),
  getTask: (id: string) => apiClient.getTask(id),
  updateTask: (id: string, data: Partial<{ status: string }>) => apiClient.updateTask(id, data),
  createPlanForTask: (taskId: string) => apiClient.createPlanForTask(taskId),
}