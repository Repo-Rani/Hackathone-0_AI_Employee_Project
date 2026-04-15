import { useEffect } from 'react'
import { useAppStore } from '@/lib/store/useAppStore'

export function useRealtime() {
  const { setAIState, updateWatcher, setStats } = useAppStore()

  useEffect(() => {
    // In demo mode, we'll simulate real-time updates with intervals
    // In a real implementation, this would connect to a WebSocket server

    // Simulate AI state updates every 10 seconds for demo
    const aiStatusInterval = setInterval(() => {
      // Rotate through different states for demo purposes
      const states: Array<'active' | 'idle' | 'processing' | 'paused' | 'error'> = ['active', 'idle', 'processing', 'paused', 'error']
      const randomState = states[Math.floor(Math.random() * states.length)]

      setAIState({
        status: randomState,
        queueLength: Math.floor(Math.random() * 10),
        lastActionAt: new Date().toISOString(),
        tasksCompleted: Math.floor(Math.random() * 100)
      })
    }, 10000)

    // Simulate watcher updates every 15 seconds
    const watcherInterval = setInterval(() => {
      const watcherIds: Array<'gmail' | 'whatsapp' | 'bank' | 'filesystem'> = ['gmail', 'whatsapp', 'bank', 'filesystem']
      const randomId = watcherIds[Math.floor(Math.random() * watcherIds.length)] as any
      const statuses: Array<'live' | 'idle' | 'slow' | 'error' | 'offline'> = ['live', 'idle', 'slow', 'error', 'offline']
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

      updateWatcher(randomId, {
        status: randomStatus,
        lastChecked: new Date().toISOString(),
        itemsFound: Math.floor(Math.random() * 5)
      })
    }, 15000)

    // Simulate stats updates every 30 seconds
    const statsInterval = setInterval(() => {
      setStats({
        revenueMTD: Math.floor(Math.random() * 20000),
        pendingApprovals: Math.floor(Math.random() * 10),
        tasksDoneToday: Math.floor(Math.random() * 20),
        activeWatchers: Math.floor(Math.random() * 5)
      })
    }, 30000)

    return () => {
      clearInterval(aiStatusInterval)
      clearInterval(watcherInterval)
      clearInterval(statsInterval)
    }
  }, [setAIState, updateWatcher, setStats])
}