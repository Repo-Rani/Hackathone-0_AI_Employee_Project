import {
  Task,
  Approval,
  Plan,
  Briefing,
  Transaction,
  LogEntry,
  Watcher,
  AIState,
  DashboardStats,
  PlanStep,
  BriefingKPI
} from './types'

// Mock tasks
export const mockTasks: Task[] = [
  {
    id: "EMAIL_001",
    type: "email",
    priority: "high",
    status: "pending",
    title: "Invoice Request",
    preview: "Hey can you send me the invoice for January services asap?",
    from: "client_a@email.com",
    createdAt: "2026-01-07T10:30:00Z",
    fullContent: "Hey can you send me the invoice for January services asap? The payment is already overdue and we need to process it soon.",
    metadata: {
      subject: "January Invoice Request",
      to: "me@mybusiness.com"
    }
  },
  {
    id: "WHATSAPP_001",
    type: "whatsapp",
    priority: "medium",
    status: "pending",
    title: "Meeting Follow-up",
    preview: "Thanks for the meeting yesterday. When can we expect the proposal?",
    from: "+1234567890",
    createdAt: "2026-01-07T09:15:00Z",
    fullContent: "Thanks for the meeting yesterday. When can we expect the proposal? We're looking forward to seeing your recommendations.",
    metadata: { chatName: "Client B" }
  },
  {
    id: "FILE_001",
    type: "file",
    priority: "low",
    status: "processing",
    title: "New Contract Template",
    preview: "New contract template for Q1 2026 has been added to the vault",
    from: "system",
    createdAt: "2026-01-07T08:45:00Z",
    fullContent: "New contract template for Q1 2026 has been added to the vault for your review and approval.",
    metadata: { filename: "contract_template_q1_2026.docx", path: "/Templates/", size: "1.2 MB" }
  },
  {
    id: "FINANCE_001",
    type: "finance",
    priority: "high",
    status: "pending",
    title: "Bank Alert",
    preview: "Unusual transaction detected on business account",
    from: "Bank",
    createdAt: "2026-01-07T07:30:00Z",
    fullContent: "Unusual transaction of $1,250 detected on business checking account. Please confirm this transaction or report as fraud.",
    metadata: { amount: "1250.00", bankName: "Chase Business", flagReason: "Unusual pattern" }
  },
  {
    id: "EMAIL_002",
    type: "email",
    priority: "medium",
    status: "pending",
    title: "Project Update",
    preview: "Just wanted to give you a quick update on the website redesign project.",
    from: "designer@agency.com",
    createdAt: "2026-01-07T06:20:00Z",
    fullContent: "Just wanted to give you a quick update on the website redesign project. We've completed the mockups and will be moving into development next week.",
    metadata: { subject: "Website Redesign Update", to: "me@mybusiness.com" }
  }
]

// Mock approvals
export const mockApprovals: Approval[] = [
  {
    id: "APPROVAL_001",
    actionType: "payment",
    title: "Client Payment",
    description: "Payment of $500 to Client Service Provider for January services",
    status: "pending",
    createdAt: "2026-01-07T11:00:00Z",
    expiresAt: "2026-01-08T11:00:00Z",
    metadata: {
      amount: 500,
      recipient: "Client Service Provider",
      reference: "INV-2026-001"
    }
  },
  {
    id: "APPROVAL_002",
    actionType: "email_send",
    title: "Send Follow-up Email",
    description: "Send follow-up email to important client regarding their inquiry",
    status: "pending",
    createdAt: "2026-01-07T10:30:00Z",
    expiresAt: "2026-01-07T16:30:00Z",
    metadata: {
      to: "important.client@company.com",
      subject: "Following up on your inquiry",
      bodyPreview: "Thank you for your interest in our services..."
    }
  },
  {
    id: "APPROVAL_003",
    actionType: "subscription_cancel",
    title: "Cancel Unused Subscription",
    description: "Cancel Cloud Storage subscription (unused for 60+ days)",
    status: "pending",
    createdAt: "2026-01-07T09:45:00Z",
    expiresAt: "2026-01-09T09:45:00Z",
    metadata: {
      serviceName: "Cloud Storage Pro",
      monthlyCost: 29.99,
      daysSinceUsed: 75
    }
  }
]

// Mock plans
export const mockPlans: Plan[] = [
  {
    id: "PLAN_001",
    title: "Process Invoice Request",
    objective: "Handle client invoice request and generate proper invoice",
    status: "in_progress",
    currentStepIdx: 2,
    iteration: 1,
    maxIterations: 3,
    createdAt: "2026-01-07T10:00:00Z",
    updatedAt: "2026-01-07T11:30:00Z",
    steps: [
      {
        id: "step_1",
        label: "Read invoice request email",
        status: "done",
        completedAt: "2026-01-07T10:05:00Z",
        durationMs: 2000,
        requiresApproval: false
      },
      {
        id: "step_2",
        label: "Verify client details in CRM",
        status: "active",
        durationMs: 4500,
        requiresApproval: false
      },
      {
        id: "step_3",
        label: "Generate invoice PDF",
        status: "pending",
        requiresApproval: false
      },
      {
        id: "step_4",
        label: "Send invoice to client",
        status: "pending",
        requiresApproval: true
      }
    ],
    linkedTaskId: "EMAIL_001"
  },
  {
    id: "PLAN_002",
    title: "Cancel Unused Subscription",
    objective: "Identify and cancel unused subscriptions to reduce costs",
    status: "pending_approval",
    currentStepIdx: -1,
    iteration: 0,
    maxIterations: 1,
    createdAt: "2026-01-07T09:30:00Z",
    updatedAt: "2026-01-07T09:30:00Z",
    steps: [
      {
        id: "step_1",
        label: "Scan for unused subscriptions",
        status: "done",
        completedAt: "2026-01-07T09:35:00Z",
        durationMs: 5000,
        requiresApproval: false
      },
      {
        id: "step_2",
        label: "Generate cancellation plan",
        status: "done",
        completedAt: "2026-01-07T09:40:00Z",
        durationMs: 3000,
        requiresApproval: false
      },
      {
        id: "step_3",
        label: "Request human approval",
        status: "done",
        completedAt: "2026-01-07T09:45:00Z",
        durationMs: 100,
        requiresApproval: true
      }
    ],
    linkedTaskId: "FINANCE_001",
    linkedApprovalId: "APPROVAL_003"
  }
]

// Mock briefings
export const mockBriefings: Briefing[] = [
  {
    id: "briefing_2026-01-06",
    date: "2026-01-06",
    period: "Jan 1, 2026 – Jan 6, 2026",
    title: "Monday Morning CEO Briefing",
    content: `# CEO Weekly Briefing - Week of Jan 1-6, 2026

## Revenue
| Date | Revenue | Target |
|------|---------|---------|
| Jan 1 | $1,200 | $2,000 |
| Jan 2 | $1,800 | $2,000 |
| Jan 3 | $2,100 | $2,000 |
| Jan 4 | $1,950 | $2,000 |
| Jan 5 | $2,300 | $2,000 |
| Jan 6 | $1,750 | $2,000 |
| **Week Total** | **$11,100** | **$12,000** |

- **Weekly Revenue**: $11,100
- **Revenue vs Target**: 92.5% of target
- **Revenue Trend**: ⬆ +8% from previous week

## Bottlenecks
| Issue | Days Delayed | Priority |
|-------|--------------|----------|
| Client A Invoice Approval | 3 days | High |
| Server Migration | 7 days | Medium |
| New Hire Onboarding | 2 days | Low |

## Completed Tasks
- [x] Process Q1 contracts
- [x] Schedule client meetings
- [x] Review marketing campaign
- [x] Update business plan
- [x] Handle payment processing

## Proactive Suggestions
- [ ] **Reduce Software Costs**: Cancel unused subscriptions for $150/month savings
- [ ] **Improve Response Time**: Implement auto-responders for common inquiries
- [ ] **Upsell Opportunity**: Client B has been inquiring about premium services`,
    kpi: {
      revenueThisWeek: 11100,
      revenueTarget: 12000,
      revenueTrend: 'up',
      revenuePct: 92.5,
      tasksCompleted: 24,
      bottlenecksCount: 3,
      suggestionsCount: 5
    },
    generatedAt: "2026-01-06T08:00:00Z"
  }
]

// Mock transactions
export const mockTransactions: Transaction[] = [
  {
    id: "TX_001",
    date: "2026-01-06",
    description: "Client Payment - Project Work",
    merchant: "Client A",
    category: "Client Payment",
    type: "income",
    amount: 5000,
    flagged: false
  },
  {
    id: "TX_002",
    date: "2026-01-05",
    description: "Monthly Software Subscription",
    merchant: "Cloud Service",
    category: "Software",
    type: "expense",
    amount: -99.99,
    flagged: false
  },
  {
    id: "TX_003",
    date: "2026-01-04",
    description: "Payment Processing Fee",
    merchant: "Stripe",
    category: "Operations",
    type: "expense",
    amount: -25.50,
    flagged: false
  },
  {
    id: "TX_004",
    date: "2026-01-03",
    description: "New Software License",
    merchant: "Design Tools Pro",
    category: "Software",
    type: "expense",
    amount: -299.99,
    flagged: true,
    flagReason: "No login in 45 days"
  },
  {
    id: "TX_005",
    date: "2026-01-02",
    description: "Freelancer Payment",
    merchant: "UI Designer",
    category: "Operations",
    type: "expense",
    amount: -1200,
    flagged: false
  }
]

// Mock logs
export const mockLogs: LogEntry[] = [
  {
    id: "LOG_001",
    timestamp: "2026-01-07T11:30:00.123Z",
    actionType: "email_send",
    actor: "claude_code",
    target: "client_a@email.com",
    approvalStatus: "approved",
    approvedBy: "human",
    result: "success",
    durationMs: 1250
  },
  {
    id: "LOG_002",
    timestamp: "2026-01-07T11:28:00.456Z",
    actionType: "payment_execute",
    actor: "claude_code",
    target: "$500 to Provider",
    approvalStatus: "approved",
    approvedBy: "human",
    result: "success",
    durationMs: 980
  },
  {
    id: "LOG_003",
    timestamp: "2026-01-07T10:45:00.789Z",
    actionType: "claude_complete",
    actor: "claude_code",
    target: "Process Invoice Request",
    result: "success",
    durationMs: 180000
  },
  {
    id: "LOG_004",
    timestamp: "2026-01-07T09:30:00.012Z",
    actionType: "watcher_trigger",
    actor: "watcher",
    target: "Gmail",
    result: "success",
    parameters: { itemsFound: 3 }
  },
  {
    id: "LOG_005",
    timestamp: "2026-01-07T08:15:00.345Z",
    actionType: "approval_request",
    actor: "claude_code",
    target: "Cancel subscription",
    result: "pending"
  }
]

// Mock watchers
export const mockWatchers: Watcher[] = [
  {
    id: "gmail",
    label: "Gmail",
    status: "live",
    lastChecked: "2026-01-07T11:25:00Z",
    itemsFound: 3,
    checkInterval: 60
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    status: "live",
    lastChecked: "2026-01-07T11:20:00Z",
    itemsFound: 1,
    checkInterval: 30
  },
  {
    id: "bank",
    label: "Bank",
    status: "slow",
    lastChecked: "2026-01-07T10:45:00Z",
    itemsFound: 0,
    checkInterval: 120,
    errorMessage: "API rate limit exceeded"
  },
  {
    id: "filesystem",
    label: "FileSystem",
    status: "live",
    lastChecked: "2026-01-07T11:30:00Z",
    itemsFound: 2,
    checkInterval: 60
  }
]

// Mock AI state
export const mockAIState: AIState = {
  status: "active",
  currentTask: "Processing Invoice Request for Client A",
  queueLength: 3,
  lastActionAt: "2026-01-07T11:30:00Z",
  iterationsToday: 12,
  tasksCompleted: 47,
  uptime: 45600,
  ralphWiggum: {
    taskId: "EMAIL_001",
    taskDescription: "Process Invoice Request",
    currentIteration: 1,
    maxIterations: 3,
    startedAt: "2026-01-07T10:00:00Z",
    currentStep: "Verifying client details in CRM",
    steps: [
      {
        id: "step_1",
        label: "Read invoice request email",
        status: "done",
        completedAt: "2026-01-07T10:05:00Z",
        requiresApproval: false
      },
      {
        id: "step_2",
        label: "Verify client details in CRM",
        status: "active",
        requiresApproval: false
      },
      {
        id: "step_3",
        label: "Generate invoice PDF",
        status: "pending",
        requiresApproval: false
      }
    ]
  }
}

// Mock dashboard stats
export const mockDashboardStats: DashboardStats = {
  revenueMTD: 11100,
  revenueTarget: 15000,
  revenueChange: 8.5,
  pendingApprovals: 3,
  pendingApprovalsUrgent: 1,
  tasksDoneToday: 5,
  tasksTotal: 12,
  activeWatchers: 3,
  totalWatchers: 4,
  briefingsGenerated: 1
}