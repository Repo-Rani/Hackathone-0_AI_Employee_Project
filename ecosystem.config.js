// File: C:\Users\HP\AI_Employee_Project\ecosystem.config.js

// ecosystem.config.js — GOLD TIER
// Replace the Silver version entirely

module.exports = {
  apps: [
    // ── Silver processes (RETAIN ALL — do not remove) ─────────────
    {
      name: 'gmail_watcher',
      script: 'watchers/gmail_watcher.py',
      interpreter: 'python',
      autorestart: true,
      max_restarts: 10,
      log_file: 'logs/pm2/gmail_watcher.log',
      error_file: 'logs/pm2/gmail_watcher_err.log'
    },
    {
      name: 'whatsapp_watcher',
      script: 'watchers/whatsapp_watcher.py',
      interpreter: 'python',
      autorestart: true,
      max_restarts: 10,
      log_file: 'logs/pm2/whatsapp_watcher.log',
      error_file: 'logs/pm2/whatsapp_watcher_err.log'
    },
    {
      name: 'orchestrator',
      script: 'orchestrator.py',
      interpreter: 'python',
      autorestart: true,
      max_restarts: 10,
      log_file: 'logs/pm2/orchestrator.log',
      error_file: 'logs/pm2/orchestrator_err.log'
    },
    {
      name: 'linkedin_poster',
      script: 'watchers/linkedin_poster.py',
      interpreter: 'python',
      autorestart: true,
      log_file: 'logs/pm2/linkedin_poster.log',
      error_file: 'logs/pm2/linkedin_poster_err.log'
    },

    // ── Gold processes (NEW — add these) ──────────────────────────
    {
      name: 'facebook_poster',
      script: 'watchers/facebook_poster.py',
      interpreter: 'python',
      autorestart: true,
      log_file: 'logs/pm2/facebook_poster.log',
      error_file: 'logs/pm2/facebook_poster_err.log'
    },
    {
      name: 'instagram_poster',
      script: 'watchers/instagram_poster.py',
      interpreter: 'python',
      autorestart: true,
      log_file: 'logs/pm2/instagram_poster.log',
      error_file: 'logs/pm2/instagram_poster_err.log'
    },
    {
      name: 'twitter_poster',
      script: 'watchers/twitter_poster.py',
      interpreter: 'python',
      autorestart: true,
      log_file: 'logs/pm2/twitter_poster.log',
      error_file: 'logs/pm2/twitter_poster_err.log'
    },
    {
      name: 'autonomous_loop',
      script: 'autonomous_loop.py',
      interpreter: 'python',
      autorestart: true,
      max_restarts: 10,
      log_file: 'logs/pm2/autonomous_loop.log',
      error_file: 'logs/pm2/autonomous_loop_err.log'
    },
    {
      name: 'watchdog',
      script: 'watchdog.py',
      interpreter: 'python',
      autorestart: true,
      log_file: 'logs/pm2/watchdog.log',
      error_file: 'logs/pm2/watchdog_err.log'
    }
  ]
};