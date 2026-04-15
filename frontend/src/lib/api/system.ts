// APIError class implementation
export class APIError extends Error {
  public status: number
  public data?: any

  constructor(message: string, status: number, data?: any) {
    super(message)
    this.name = 'APIError'
    this.status = status
    this.data = data
  }
}

export const apiSystem = {
  // Health check
  async checkHealth() {
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      await new Promise(resolve => setTimeout(resolve, 50))
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          database: 'connected',
          odoo: 'available',
          email: 'ready',
        }
      }
    }

    const response = await fetch('/api/system/health')
    if (!response.ok) throw new APIError('Health check failed', response.status)
    return response.json()
  },

  // System configuration
  async getSystemConfig() {
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      await new Promise(resolve => setTimeout(resolve, 50))
      return {
        gmailCheckInterval: 120,
        whatsappCheckInterval: 30,
        bankCheckInterval: 60,
        autoApproveThreshold: 50,
        ralphMaxIterations: 10,
        approvalWindowHours: 24,
        devMode: false,
        dryRun: true
      }
    }

    const response = await fetch('/api/system/config')
    if (!response.ok) throw new APIError('Failed to fetch config', response.status)
    return response.json()
  },

  async updateSystemConfig(config: any) {
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      await new Promise(resolve => setTimeout(resolve, 50))
      return config
    }

    const response = await fetch('/api/system/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    })
    if (!response.ok) throw new APIError('Failed to update config', response.status)
    return response.json()
  },

  // System status
  async getSystemStatus() {
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      await new Promise(resolve => setTimeout(resolve, 50))
      return {
        status: 'running',
        uptime: 3600,
        activeWatchers: 3,
        activeTasks: 1,
        lastError: null
      }
    }

    const response = await fetch('/api/system/status')
    if (!response.ok) throw new APIError('Failed to fetch system status', response.status)
    return response.json()
  }
}