import { create } from 'zustand'
import { AIState, DashboardStats, Watcher } from '@/lib/types'
import { mockAIState, mockDashboardStats, mockWatchers } from '@/lib/mock-data'
import { apiClient } from '@/lib/api/client'

interface AppStore {
  // AI State
  aiState: AIState
  setAIState: (state: Partial<AIState>) => void

  // Watchers
  watchers: Watcher[]
  updateWatcher: (id: string, update: Partial<Watcher>) => void

  // Stats
  stats: DashboardStats
  setStats: (stats: Partial<DashboardStats>) => void

  // Global UI
  sidebarOpen: boolean
  toggleSidebar: () => void

  // TopBar visibility
  topBarVisible: boolean
  toggleTopBar: () => void
  setTopBarVisible: (visible: boolean) => void

  // Loading state
  isLoading: boolean
  error: string | null

  // Initialize with real backend data (fallback to mock if backend unavailable)
  initialize: () => Promise<void>
}

export const useAppStore = create<AppStore>((set, get) => ({
  aiState: mockAIState,
  setAIState: (update) => set((state) => ({
    aiState: { ...state.aiState, ...update }
  })),

  watchers: mockWatchers,
  updateWatcher: (id, update) => set((state) => ({
    watchers: state.watchers.map((w) =>
      w.id === id ? { ...w, ...update } : w
    )
  })),

  stats: mockDashboardStats,
  setStats: (update) => set((state) => ({
    stats: { ...state.stats, ...update }
  })),

  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  topBarVisible: true,
  toggleTopBar: () => set((state) => ({ topBarVisible: !state.topBarVisible })),
  setTopBarVisible: (visible) => set({ topBarVisible: visible }),

  isLoading: false,
  error: null,

  initialize: async () => {
    set({ isLoading: true, error: null })
    
    try {
      // Try to fetch real data from backend
      const [aiState, watchers, stats] = await Promise.all([
        apiClient.getSystemStatus().catch(() => mockAIState),
        apiClient.getWatchers().catch(() => mockWatchers),
        apiClient.getDashboardStats().catch(() => mockDashboardStats),
      ])

      set({
        aiState: aiState || mockAIState,
        watchers: watchers || mockWatchers,
        stats: stats || mockDashboardStats,
        isLoading: false,
        topBarVisible: true
      })

      console.log('[Store] Initialized with real backend data')
    } catch (error) {
      console.warn('[Store] Backend unavailable, falling back to mock data:', error)
      // Fallback to mock data if backend is unavailable
      set({
        aiState: mockAIState,
        watchers: mockWatchers,
        stats: mockDashboardStats,
        isLoading: false,
        error: 'Backend unavailable - using demo data',
        topBarVisible: true
      })
    }
  }
}))