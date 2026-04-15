/**
 * API Client Tests
 * Tests the frontend API client against real FastAPI backend
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { apiClient } from '@/lib/api/client'

describe('API Client Integration Tests', () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  beforeAll(() => {
    // Ensure we're testing real backend
    console.log(`Testing against: ${API_URL}`)
  })

  describe('Health Check', () => {
    it('should connect to backend health endpoint', async () => {
      const response = await fetch(`${API_URL}/health`)
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data.status).toBe('healthy')
      expect(data.vault_exists).toBe(true)
    })
  })

  describe('Tasks API', () => {
    it('should fetch tasks from backend', async () => {
      const response = await fetch(`${API_URL}/api/tasks`)
      expect(response.status).toBe(200)
      
      const tasks = await response.json()
      expect(Array.isArray(tasks)).toBe(true)
    })

    it('should handle non-existent task', async () => {
      const response = await fetch(`${API_URL}/api/tasks/NONEXISTENT`)
      expect(response.status).toBe(404)
    })
  })

  describe('Approvals API', () => {
    it('should fetch approvals from backend', async () => {
      const response = await fetch(`${API_URL}/api/approvals`)
      expect(response.status).toBe(200)
      
      const approvals = await response.json()
      expect(Array.isArray(approvals)).toBe(true)
    })
  })

  describe('System Status API', () => {
    it('should fetch system status', async () => {
      const response = await fetch(`${API_URL}/api/system/status`)
      expect(response.status).toBe(200)
      
      const status = await response.json()
      expect(status).toHaveProperty('status')
      expect(status).toHaveProperty('queueLength')
    })

    it('should fetch dashboard stats', async () => {
      const response = await fetch(`${API_URL}/api/system/stats`)
      expect(response.status).toBe(200)
      
      const stats = await response.json()
      expect(stats).toHaveProperty('revenueMTD')
      expect(stats).toHaveProperty('pendingApprovals')
    })

    it('should fetch watchers', async () => {
      const response = await fetch(`${API_URL}/api/system/watchers`)
      expect(response.status).toBe(200)
      
      const watchers = await response.json()
      expect(Array.isArray(watchers)).toBe(true)
      expect(watchers.length).toBeGreaterThan(0)
    })
  })

  describe('Logs API', () => {
    it('should fetch logs from backend', async () => {
      const response = await fetch(`${API_URL}/api/logs`)
      expect(response.status).toBe(200)
      
      const logs = await response.json()
      expect(Array.isArray(logs)).toBe(true)
    })
  })

  describe('Accounting API', () => {
    it('should fetch accounting summary', async () => {
      const response = await fetch(`${API_URL}/api/accounting/summary`)
      expect(response.status).toBe(200)
      
      const summary = await response.json()
      expect(summary).toHaveProperty('period')
      expect(summary).toHaveProperty('totalIncome')
      expect(summary).toHaveProperty('totalExpenses')
    })
  })
})
