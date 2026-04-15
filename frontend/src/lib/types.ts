// ═══════════════════════════════════════════════════════════
// WATCHER TYPES
// ═══════════════════════════════════════════════════════════

export type WatcherName   = 'gmail' | 'whatsapp' | 'bank' | 'filesystem'
export type WatcherStatus = 'live' | 'idle' | 'slow' | 'error' | 'offline'

export interface Watcher {
  id:             WatcherName
  label:          string            // Display name: "Gmail", "WhatsApp"
  status:         WatcherStatus
  lastChecked:    string            // ISO 8601 datetime
  itemsFound:     number            // Items found in last check
  checkInterval:  number            // Polling interval in seconds
  errorMessage?:  string            // Present when status = 'error'
}

// ═══════════════════════════════════════════════════════════
// TASK / INBOX TYPES
// ═══════════════════════════════════════════════════════════

export type TaskType     = 'email' | 'whatsapp' | 'file' | 'finance'
export type TaskPriority = 'high' | 'medium' | 'low'
export type TaskStatus   = 'pending' | 'processing' | 'plan_created' | 'done' | 'dismissed'

export interface Task {
  id:          string              // e.g., "EMAIL_abc123"
  type:        TaskType
  priority:    TaskPriority
  status:      TaskStatus
  title:       string              // e.g., "Invoice Request"
  preview:     string              // Short text preview (max 120 chars)
  fullContent: string              // Full message/email content (markdown)
  from:        string              // Sender: email address or WhatsApp name
  createdAt:   string              // ISO 8601
  linkedPlanId?: string            // If a plan was created for this task
  metadata:    Record<string, string>  // Type-specific extra data
}

// metadata examples:
// email: { subject, messageId, threadId, to }
// whatsapp: { phone, chatName, keywords }
// file: { filename, size, mimeType, path }
// finance: { transactionId, bankName, amount, flagReason }

// ═══════════════════════════════════════════════════════════
// APPROVAL TYPES
// ═══════════════════════════════════════════════════════════

export type ApprovalActionType =
  | 'payment'
  | 'email_send'
  | 'social_post'
  | 'file_delete'
  | 'subscription_cancel'
  | 'new_contact_email'

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'expired'

export interface Approval {
  id:            string             // e.g., "APPROVAL_pay_client_a"
  actionType:    ApprovalActionType
  title:         string             // Short description
  description:   string             // Full details (markdown)
  status:        ApprovalStatus
  createdAt:     string
  expiresAt:     string             // ISO 8601 — approval window deadline
  decidedAt?:    string             // When human made decision
  rejectionReason?: string          // Optional reason when rejected
  metadata: {
    // payment
    amount?:     number
    recipient?:  string
    bankAccount?: string
    reference?:  string
    // email
    to?:         string
    subject?:    string
    bodyPreview?: string
    // social
    platform?:   string
    postContent?: string
    // subscription
    serviceName?: string
    monthlyCost?: number
    daysSinceUsed?: number
  }
}

// ═══════════════════════════════════════════════════════════
// PLAN TYPES
// ═══════════════════════════════════════════════════════════

export type PlanStatus = 'pending_approval' | 'in_progress' | 'complete' | 'blocked' | 'cancelled'
export type StepStatus = 'done' | 'active' | 'pending' | 'skipped' | 'failed'

export interface PlanStep {
  id:               string
  label:            string
  status:           StepStatus
  requiresApproval: boolean
  durationMs?:      number          // How long this step took (if done)
  completedAt?:     string
  errorMessage?:    string          // Present if status = 'failed'
}

export interface Plan {
  id:             string            // e.g., "PLAN_invoice_client_a"
  title:          string
  objective:      string            // Full description of what Claude is doing
  status:         PlanStatus
  steps:          PlanStep[]
  currentStepIdx: number            // Index of currently active step (-1 if none)
  iteration:      number            // Current Ralph Wiggum iteration
  maxIterations:  number
  linkedTaskId?:  string
  linkedApprovalId?: string
  createdAt:      string
  updatedAt:      string
  completedAt?:   string
}

// ═══════════════════════════════════════════════════════════
// BRIEFING TYPES
// ═══════════════════════════════════════════════════════════

export interface BriefingKPI {
  revenueThisWeek:   number
  revenueTarget:     number         // Weekly target
  revenueTrend:      'up' | 'down' | 'flat'
  revenuePct:        number         // % of monthly target achieved
  tasksCompleted:    number
  bottlenecksCount:  number
  suggestionsCount:  number
}

export interface Briefing {
  id:        string                 // e.g., "briefing_2026-01-06"
  date:      string                 // ISO date (Monday's date)
  period:    string                 // e.g., "Dec 30, 2025 – Jan 5, 2026"
  title:     string                 // e.g., "Monday Morning CEO Briefing"
  content:   string                 // Full GitHub-Flavored Markdown
  kpi:       BriefingKPI
  generatedAt: string              // ISO 8601 datetime
}

// ═══════════════════════════════════════════════════════════
// TRANSACTION TYPES
// ═══════════════════════════════════════════════════════════

export type TransactionType     = 'income' | 'expense' | 'subscription' | 'refund' | 'transfer'
export type TransactionCategory =
  | 'Client Payment' | 'Software' | 'Marketing' | 'Operations'
  | 'Utilities' | 'Payroll' | 'Refund' | 'Transfer' | 'Other'

export interface Transaction {
  id:          string
  date:        string               // ISO date string
  description: string               // e.g., "Netflix Monthly Subscription"
  merchant:    string               // e.g., "Netflix"
  category:    TransactionCategory
  type:        TransactionType
  amount:      number               // + for income, - for expense
  flagged:     boolean
  flagReason?: string               // e.g., "No login in 45 days"
  reviewAction?: 'cancel' | 'keep' | 'investigate'  // Human decision after flag
}

export interface AccountingSummary {
  period:        string
  totalIncome:   number
  totalExpenses: number
  netRevenue:    number
  subscriptionCost: number
  flaggedCount:  number
  dailyRevenue:  { date: string; amount: number }[]   // For area chart
  byCategory:    { category: string; amount: number }[] // For bar chart
}

// ═══════════════════════════════════════════════════════════
// LOG TYPES
// ═══════════════════════════════════════════════════════════

export type LogActionType =
  | 'email_send' | 'email_draft'
  | 'payment_execute' | 'payment_draft'
  | 'social_post' | 'social_draft'
  | 'file_move' | 'file_create' | 'file_delete'
  | 'approval_request' | 'approval_granted' | 'approval_rejected'
  | 'watcher_trigger' | 'watcher_error'
  | 'claude_start' | 'claude_complete' | 'claude_error'
  | 'system_start' | 'system_error'

export type LogActor  = 'claude_code' | 'human' | 'watcher' | 'orchestrator' | 'system'
export type LogResult = 'success' | 'failure' | 'pending' | 'skipped' | 'timeout'

export interface LogEntry {
  id:              string
  timestamp:       string           // ISO 8601 with milliseconds
  actionType:      LogActionType
  actor:           LogActor
  target?:         string           // e.g., email address, file path, amount
  parameters?:     Record<string, string | number | boolean>
  approvalStatus?: 'approved' | 'rejected' | 'not_required' | 'pending'
  approvedBy?:     'human' | 'auto'
  linkedPlanId?:   string
  linkedTaskId?:   string
  result:          LogResult
  durationMs?:     number           // How long the action took
  errorMessage?:   string
}

// ═══════════════════════════════════════════════════════════
// AI STATE TYPES
// ═══════════════════════════════════════════════════════════

export type AIStatus = 'active' | 'idle' | 'processing' | 'paused' | 'error' | 'offline'

export interface RalphWiggumState {
  taskId:          string
  taskDescription: string
  currentIteration: number
  maxIterations:   number
  startedAt:       string
  currentStep?:    string           // Description of what Claude is doing right now
  steps:           PlanStep[]
}

export interface AIState {
  status:            AIStatus
  currentTask?:      string         // Brief description of active task
  ralphWiggum?:      RalphWiggumState
  queueLength:       number         // Items waiting in /Needs_Action
  lastActionAt:      string
  iterationsToday:   number
  tasksCompleted:    number
  uptime:            number         // Seconds since orchestrator started
  errorMessage?:     string         // Present when status = 'error'
}

// ═══════════════════════════════════════════════════════════
// DASHBOARD STATS TYPES
// ═══════════════════════════════════════════════════════════

export interface DashboardStats {
  revenueMTD:          number
  revenueTarget:       number
  revenueChange:       number       // % change vs last month
  pendingApprovals:    number
  pendingApprovalsUrgent: number    // Expiring in < 2 hours
  tasksDoneToday:      number
  tasksTotal:          number
  activeWatchers:      number
  totalWatchers:       number
  briefingsGenerated:  number
}

// ═══════════════════════════════════════════════════════════
// SETTINGS TYPES
// ═══════════════════════════════════════════════════════════

export interface SystemConfig {
  gmailCheckInterval:      number   // seconds
  whatsappCheckInterval:   number
  bankCheckInterval:       number
  autoApproveThreshold:    number   // Dollar amount below which payments auto-approve
  ralphMaxIterations:      number
  approvalWindowHours:     number   // Default expiry for approval requests
  devMode:                 boolean
  dryRun:                  boolean
}

export interface BusinessGoals {
  monthlyRevenueTarget:    number
  clientResponseTimeHours: number
  invoicePaymentRatePct:   number
  maxSoftwareCostMonthly:  number
  subscriptionAuditDays:   number  // Flag if no login in X days
}