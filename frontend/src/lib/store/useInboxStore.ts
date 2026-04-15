import { create } from 'zustand'
import { Task } from '@/lib/types'
import { mockTasks } from '@/lib/mock-data'

type TaskFilterType = 'all' | 'email' | 'whatsapp' | 'file' | 'finance'
type TaskSortType = 'newest' | 'oldest' | 'priority' | 'type'

interface InboxStore {
  // Tasks
  tasks: Task[]
  filter: TaskFilterType
  sortBy: TaskSortType
  searchQuery: string

  // Setters
  setTasks: (tasks: Task[]) => void
  setFilter: (filter: TaskFilterType) => void
  setSortBy: (sortBy: TaskSortType) => void
  setSearchQuery: (query: string) => void

  // Initialize with mock data
  initialize: () => void
}

export const useInboxStore = create<InboxStore>((set, get) => ({
  tasks: mockTasks,
  filter: 'all',
  sortBy: 'newest',
  searchQuery: '',

  setTasks: (tasks) => set({ tasks }),
  setFilter: (filter) => set({ filter }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  initialize: () => {
    set({
      tasks: mockTasks,
      filter: 'all',
      sortBy: 'newest',
      searchQuery: ''
    })
  }
}))