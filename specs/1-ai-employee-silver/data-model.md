# Data Model: Silver Tier Personal AI Employee

**Feature**: Silver Tier Personal AI Employee
**Date**: 2026-02-26

## Core Entities

### 1. EmailAction (EMAIL_*.md)

**Purpose**: Represents an important email detected by the Gmail Watcher

**Structure**:
```yaml
# YAML Frontmatter
type: string (always "email")
from: string (sender email address)
subject: string (email subject line)
email_date: string (original email date)
received: string (timestamp when detected)
priority: enum ("high", "medium", "low")
status: enum ("pending", "processing", "done")
msg_id: string (Gmail message ID)
processed: boolean (default: false)
```

**Content Body**:
- Email snippet/content
- Suggested actions checklist

**State Transitions**:
- pending → processing (when Claude starts processing)
- processing → done (when action completed)
- processing → pending (if action needs reprocessing)

### 2. WhatsAppAction (WA_*.md)

**Purpose**: Represents a keyword-matched WhatsApp message detected by the WhatsApp Watcher

**Structure**:
```yaml
# YAML Frontmatter
type: string (always "whatsapp")
received: string (timestamp when detected)
priority: enum ("high", "medium", "low")
status: enum ("pending", "processing", "done")
keywords_matched: array of strings (detected keywords)
processed: boolean (default: false)
```

**Content Body**:
- WhatsApp message content
- Detected keywords
- Suggested actions checklist

**State Transitions**:
- pending → processing (when Claude starts processing)
- processing → done (when action completed)

### 3. PlanFile (PLAN_*.md)

**Purpose**: Represents Claude's analysis and plan for processing an action item

**Structure**:
```yaml
# YAML Frontmatter
created: string (timestamp)
source_file: string (reference to original action file)
status: enum ("pending_approval", "pending_execution", "completed")
priority: enum ("high", "medium", "low")
processed: boolean (default: false)
```

**Content Body**:
- **Objective**: 1-line summary of required action
- **Analysis**: Detailed analysis of the situation
- **Action Steps**: Checklist of required actions
- **REQUIRES_APPROVAL**: Details if sensitive action needs approval

**State Transitions**:
- (new) → pending_approval (after Claude analysis)
- pending_approval → pending_execution (after human approval)
- pending_execution → completed (after action execution)

### 4. ApprovalRequest (email_*.md, linkedin_*.md, etc.)

**Purpose**: Represents an action that requires human approval before execution

**Structure**:
```yaml
# YAML Frontmatter
type: string (always "approval_request")
action: enum ("send_email", "linkedin_post", etc.)
to: string (recipient)
subject: string (subject line)
attachment_path: string (optional file path)
amount: number (if financial)
new_payee: boolean
created: string (timestamp)
expires: string (expiry timestamp, usually 24h after created)
status: enum ("pending", "approved", "rejected", "expired")
source_plan: string (reference to source PlanFile)
```

**Content Body**:
- Action details
- Context information
- Approval/rejection instructions

**State Transitions**:
- pending → approved (when moved to /Approved/ folder)
- pending → rejected (when moved to /Rejected/ folder)
- pending → expired (when expiry time passes)
- approved → executed (when orchestrator processes)

### 5. AuditLogEntry (YYYY-MM-DD.json)

**Purpose**: Records all actions taken by the system for audit and debugging

**Structure**:
```json
{
  "timestamp": "string (ISO format)",
  "action_type": "string (email_sent, post_published, etc.)",
  "actor": "string ('orchestrator')",
  "target": "string (recipient/destination)",
  "approval_status": "string ('approved')",
  "result": "string ('success', 'dry_run', 'skipped', etc.)",
  "details": "string (additional information)"
}
```

**State**: Immutable once created

### 6. LinkedInPost (POST_*.md)

**Purpose**: Represents a LinkedIn post in the queue to be published

**Structure**:
```yaml
# YAML Frontmatter
type: string (always "linkedin_post")
scheduled_for: string (ISO timestamp for publication)
status: enum ("queued", "published", "failed")
auto_approved: boolean (scheduled posts are auto-approved)
topic: string (post topic slug)
```

**Content Body**:
- **Post Content**: Professional content for LinkedIn
- Hashtags
- Engagement questions

**State Transitions**:
- (new) → queued (when created)
- queued → published (when scheduled time arrives and published)
- queued → failed (if publication fails)

### 7. DashboardEntry (Dashboard.md)

**Purpose**: Provides a summary view of the AI employee's activities

**Structure**:
```markdown
# AI Employee Dashboard
Last Updated: {timestamp}

## 📊 Business Summary
- Revenue MTD: ${amount} / ${target} target
- Active Projects: {count}
- Pending Approvals: {count}

## ⏳ Pending Approval
| File | Action | Created | Expires |
|------|--------|---------|---------|
| filename.md | send_email | time | time |

## 📥 Recent Activity (Last 10)
- [timestamp] {action}: {brief description}

## 📋 Active Projects
| Project | Due | Budget | Status |
|---------|-----|--------|--------|

## 🔔 Alerts
- {any threshold breach or important notice}
```

**State**: Continuously updated by dashboard-updater skill

## Relationships

```
EmailAction 1 → 1 PlanFile (via source_file reference)
WhatsAppAction 1 → 1 PlanFile (via source_file reference)
PlanFile 1 → 0..1 ApprovalRequest (if action requires approval)
ApprovalRequest 1 → 1 PlanFile (via source_plan reference)
ApprovalRequest → 1 AuditLogEntry (when processed)
PlanFile → 1 AuditLogEntry (when completed)
LinkedInPost → 1 AuditLogEntry (when published)
DashboardEntry → * (aggregates information from all entities)
```

## Validation Rules

### EmailAction
- `msg_id` must be unique
- `from` must be a valid email format
- `status` must be one of the allowed values
- `priority` defaults to "high" if not specified

### WhatsAppAction
- `keywords_matched` must not be empty
- `status` must be one of the allowed values
- `priority` defaults to "high" if not specified

### PlanFile
- `source_file` must reference an existing EmailAction or WhatsAppAction
- `status` transitions must follow defined rules
- `priority` must match the source action priority

### ApprovalRequest
- `expires` must be after `created`
- `action` must be one of the supported actions
- `status` must be consistent with file location (pending/approved/rejected)

### AuditLogEntry
- `timestamp` must be in ISO format
- `result` must accurately reflect actual execution outcome
- Immutable after creation

### LinkedInPost
- `scheduled_for` must be in the future
- `status` must match actual post state
- `auto_approved` must be true for scheduled posts

## Indexes

### Primary Indexes
- `msg_id` for EmailAction (unique)
- `keywords_matched` for WhatsAppAction (for fast keyword lookup)
- `source_file` for PlanFile (for linking to source)
- `created` for ApprovalRequest (for expiry checking)

### Query Patterns

1. **Get pending approvals**: Query ApprovalRequest with status="pending" and expires > now
2. **Get today's activity**: Query AuditLogEntry with date range
3. **Get email by message ID**: Query EmailAction with msg_id
4. **Get queued LinkedIn posts**: Query LinkedInPost with status="queued" and scheduled_for < now
5. **Get all plans for source**: Query PlanFile with source_file reference