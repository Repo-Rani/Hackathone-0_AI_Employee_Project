// Navigation constants
export const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    requiresAuth: true,
  },
  {
    href: '/inbox',
    label: 'Inbox',
    requiresAuth: true,
  },
  {
    href: '/approvals',
    label: 'Approvals',
    requiresAuth: true,
  },
  {
    href: '/approved',
    label: 'Approved',
    requiresAuth: true,
  },
  {
    href: '/done',
    label: 'Done',
    requiresAuth: true,
  },
  {
    href: '/rejected',
    label: 'Rejected',
    requiresAuth: true,
  },
  {
    href: '/plans',
    label: 'Plans',
    requiresAuth: true,
  },
  {
    href: '/briefings',
    label: 'Briefings',
    requiresAuth: true,
  },
  {
    href: '/accounting',
    label: 'Accounting',
    requiresAuth: true,
  },
  {
    href: '/logs',
    label: 'Audit Logs',
    requiresAuth: true,
  },
  {
    href: '/settings',
    label: 'Settings',
    requiresAuth: true,
  },
] as const;

// Theme constants
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// Status constants
export const STATUS_COLORS = {
  live: 'success',
  idle: 'muted',
  slow: 'warning',
  error: 'danger',
  offline: 'muted',
} as const;

// Task status constants
export const TASK_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  PLAN_CREATED: 'plan_created',
  DONE: 'done',
  DISMISSED: 'dismissed',
} as const;

// Task priority constants
export const TASK_PRIORITY = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

// Approval status constants
export const APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
} as const;

// AI status constants
export const AI_STATUS = {
  ACTIVE: 'active',
  IDLE: 'idle',
  PROCESSING: 'processing',
  PAUSED: 'paused',
  ERROR: 'error',
  OFFLINE: 'offline',
} as const;

// Notification constants
export const NOTIFICATION_DURATION = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 10000,
} as const;

// API constants
export const API_CONFIG = {
  RETRY_ATTEMPTS: 3,
  TIMEOUT_MS: 10000,
  CACHE_TTL: 300000, // 5 minutes
} as const;

// Animation constants
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;