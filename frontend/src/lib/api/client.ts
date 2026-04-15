import { mockTasks, mockApprovals, mockPlans, mockBriefings, mockTransactions, mockLogs, mockWatchers, mockAIState, mockDashboardStats } from '@/lib/mock-data'
import { APIError } from './system'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

class APIClient {
  private useMockData = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

  async getTasks() {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 50))
      return mockTasks
    }

    const response = await fetch(`${BASE_URL}/api/tasks`)
    if (!response.ok) throw new APIError('Failed to fetch tasks', response.status)
    return response.json()
  }

  async getTask(id: string) {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 50))
      return mockTasks.find(task => task.id === id)
    }

    const response = await fetch(`${BASE_URL}/api/tasks/${id}`)
    if (!response.ok) throw new APIError('Failed to fetch task', response.status)
    return response.json()
  }

  async updateTask(id: string, data: Partial<{ status: string }>) {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 50))
      return { id, ...data }
    }

    const response = await fetch(`${BASE_URL}/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new APIError('Failed to update task', response.status)
    return response.json()
  }

  async createPlanForTask(taskId: string) {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 50))
      return mockPlans[0]
    }

    const response = await fetch(`${BASE_URL}/api/tasks/${taskId}/create-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!response.ok) throw new APIError('Failed to create plan', response.status)
    return response.json()
  }

  async getApprovals() {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 50))
      return mockApprovals
    }

    const response = await fetch(`${BASE_URL}/api/approvals`)
    if (!response.ok) throw new APIError('Failed to fetch approvals', response.status)
    return response.json()
  }

  async approveItem(id: string) {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 50))
      return { id, status: 'approved' }
    }

    const response = await fetch(`${BASE_URL}/api/approvals/${id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!response.ok) throw new APIError('Failed to approve item', response.status)
    return response.json()
  }

  async rejectItem(id: string, reason?: string) {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 50))
      return { id, status: 'rejected' }
    }

    const response = await fetch(`${BASE_URL}/api/approvals/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    })
    if (!response.ok) throw new APIError('Failed to reject item', response.status)
    return response.json()
  }

  async getPlans() {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 50))
      return mockPlans
    }

    const response = await fetch(`${BASE_URL}/api/plans`)
    if (!response.ok) throw new APIError('Failed to fetch plans', response.status)
    return response.json()
  }

  async getBriefings() {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 50))
      return mockBriefings
    }

    const response = await fetch(`${BASE_URL}/api/briefings`)
    if (!response.ok) throw new APIError('Failed to fetch briefings', response.status)
    return response.json()
  }

  async getTransactions() {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 50))
      return mockTransactions
    }

    const response = await fetch(`${BASE_URL}/api/accounting/transactions`)
    if (!response.ok) throw new APIError('Failed to fetch transactions', response.status)
    return response.json()
  }

  async getAccountingSummary() {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 50))
      return {
        period: 'This Month',
        totalIncome: 11100,
        totalExpenses: 2200,
        netRevenue: 8900,
        subscriptionCost: 215,
        flaggedCount: 1,
        dailyRevenue: [],
        byCategory: []
      }
    }

    const response = await fetch(`${BASE_URL}/api/accounting/summary`)
    if (!response.ok) throw new APIError('Failed to fetch accounting summary', response.status)
    return response.json()
  }

  async getLogs() {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 50))
      return mockLogs
    }

    const response = await fetch(`${BASE_URL}/api/logs`)
    if (!response.ok) throw new APIError('Failed to fetch logs', response.status)
    return response.json()
  }

  async getSystemStatus() {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 50))
      return mockAIState
    }

    const response = await fetch(`${BASE_URL}/api/system/status`)
    if (!response.ok) throw new APIError('Failed to fetch system status', response.status)
    return response.json()
  }

  async getDashboardStats() {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 50))
      return mockDashboardStats
    }

    const response = await fetch(`${BASE_URL}/api/system/stats`)
    if (!response.ok) throw new APIError('Failed to fetch dashboard stats', response.status)
    return response.json()
  }

  async getWatchers() {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 50))
      return mockWatchers
    }

    const response = await fetch(`${BASE_URL}/api/system/watchers`)
    if (!response.ok) throw new APIError('Failed to fetch watchers', response.status)
    return response.json()
  }

  // ── Vault Sections ──────────────────────────────────────────────

  async getDoneTasks() {
    const response = await fetch(`${BASE_URL}/api/vault/done`)
    if (!response.ok) throw new APIError('Failed to fetch done tasks', response.status)
    return response.json()
  }

  async getRejectedItems() {
    const response = await fetch(`${BASE_URL}/api/vault/rejected`)
    if (!response.ok) throw new APIError('Failed to fetch rejected items', response.status)
    return response.json()
  }

  async getVaultSummary() {
    const response = await fetch(`${BASE_URL}/api/vault/summary`)
    if (!response.ok) throw new APIError('Failed to fetch vault summary', response.status)
    return response.json()
  }
}

export const apiClient = new APIClient()