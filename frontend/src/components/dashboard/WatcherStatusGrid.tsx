'use client'

import { motion } from 'framer-motion'
import { Watcher } from '@/lib/types'
import { LiveDot } from '@/components/shared/LiveDot'
import { formatTimeAgo } from '@/lib/utils'

interface WatcherStatusGridProps {
  watchers: Watcher[]
}

export function WatcherStatusGrid({ watchers }: WatcherStatusGridProps) {
  const getWatcherIcon = (id: string) => {
    switch (id) {
      case 'gmail':
        return (
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-5.727V12.91L12 16.636l-4.636-3.727V20.91H1.636A1.636 1.636 0 0 1 0 19.364V5.457L12 12l12-6.543z"/>
          </svg>
        )
      case 'whatsapp':
        return (
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        )
      case 'bank':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8v4h4v6h-4v4h8v-4h-4v-6h4l-6-4zm-8 8h4v-6H2v6z"/>
          </svg>
        )
      case 'filesystem':
        return (
          <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/>
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <motion.div
      className="rounded-xl border bg-card p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold font-display text-lg">Watcher Status</h3>
        <motion.div
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <LiveDot status="live" />
          <span className="text-xs font-medium text-primary">All Systems Operational</span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {watchers.map((watcher, index) => (
          <motion.div
            key={watcher.id}
            className="rounded-lg border bg-card/50 p-3 transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {getWatcherIcon(watcher.id)}
                </motion.div>
                <h4 className="font-semibold font-display text-sm">{watcher.label}</h4>
              </div>
              <LiveDot status={watcher.status} />
            </div>

            <div className="mt-2 space-y-1">
              <p className="text-xs">
                <span className="text-muted">Found:</span>{' '}
                <span className="font-medium text-primary">{watcher.itemsFound}</span>
              </p>
              <p className="text-xs text-muted">
                Last: {formatTimeAgo(watcher.lastChecked)}
              </p>

              {watcher.errorMessage && (
                <motion.p
                  className="text-xs text-danger mt-2 truncate"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {watcher.errorMessage}
                </motion.p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}