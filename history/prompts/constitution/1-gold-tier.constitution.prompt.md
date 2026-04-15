---
id: 1
title: "Gold Tier Constitution"
stage: "constitution"
date_iso: "2026-03-01"
surface: "agent"
model: "claude-opus-4-5-20251101"
feature: "none"
branch: "main"
user: "AI_Employee_Project"
command: "/sp.constitution # GOLD_TIER_CONSTITUTION.md"
labels: ["constitution", "gold-tier", "spec-driven-development"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - ".specify/memory/constitution.md"
  - "GOLD_TIER_CONSTITUTION.md"
tests_yaml:
  - "Constitution file created"
  - "Gold tier specifications documented"
outcome: "Created Gold Tier constitution file with comprehensive specifications for autonomous business operations"
evaluation: "Successfully created detailed constitution covering all Gold Tier requirements"
---

# Prompt History Record

## Original Prompt
```
# GOLD_TIER_CONSTITUTION.md
# Feature: Gold Tier — Autonomous Business Operator
# Project: Personal AI Employee — Building Autonomous FTEs in 2026
# Depends on: Silver Tier (ALL features verified working — see Silver checklist)
# Stack: Windows 11 + Claude CLI + Speckit Plus + Python 3.13 + Node.js v24+ + Odoo 17+
# Version: 2.0 — Full PDF Requirements Coverage

---

## 1. IDENTITY — What This Tier Is

Gold Tier transforms the Silver Tier proactive assistant into a **semi-autonomous business operator**. The shift is fundamental: Silver required a human trigger for every task. Gold runs multi-step workflows end-to-end using the **Ralph Wiggum Stop Hook loop** — the human only approves or rejects.

The AI Employee at Gold Tier can:

- **Run the accounting system** — Create real invoices in Odoo Community Edition, update the CRM, and track monthly revenue via the Odoo MCP Server (JSON-RPC)
- **Broadcast across all platforms** — Post to LinkedIn, Facebook, Instagram, and Twitter/X automatically with platform-optimized content (Social Broadcaster)
- **Work autonomously** — Use the Ralph Wiggum Stop Hook loop to complete multi-step tasks without repeated human triggers. Claude iterates until it outputs `TASK_COMPLETE` or hits the 10-iteration safety limit
- **Generate the CEO Briefing** — Every Sunday night, autonomously audit business performance, check Odoo revenue data, flag unpaid invoices, and write the Monday Morning CEO Briefing
- **Handle errors and recover gracefully** — Retry transient failures with exponential backoff, degrade gracefully when components go offline, and use a Watchdog process to auto-restart crashed watchers
- **Audit subscriptions and spending** — Flag unused software subscriptions, cost increases, and overdue invoices automatically
- **Operate as Agent Skills** — All 12 PDF requirements implemented. Silver's 6 skills + 5 new Gold skills = **11 SKILL.md files total**

> **PDF Rule:** *"All AI functionality should be implemented as Agent Skills"*
> Gold Tier total: **11 SKILL.md files** (6 Silver retained + 5 new Gold skills)

> **Ralph Wiggum Rule (PDF Section 2D):** Claude works → tries to exit → Stop hook checks if task is in /Done → if NOT done, block exit and re-inject prompt → repeat until `TASK_COMPLETE` or max 10 iterations

---

## 2. TECH STACK — Fixed, Will Not Change

### Core (Same as Silver — No Changes)
| Layer | Technology | Rule |
|---|---|---|
| OS | Windows 11 | Use PowerShell — not bash |
| AI Brain | Claude CLI | `claude --cwd <vault_path> "..."` |
| Skill System | Speckit Plus | Every feature → SKILL.md |
| Knowledge Base | Obsidian Vault | Local Markdown — no cloud storage |
| Language | Python 3.13+ | All watcher, loop, auditor scripts |
| Runtime | Node.js v24+ LTS | All MCP servers |
| Process Manager | PM2 | 9 processes always-on |
| Scheduler | Windows Task Scheduler | `schtasks` command |
| Credentials | `.env` file | Never hardcode, never commit |

### New — Gold Tier Additions
| Layer | Technology | Rule |
|---|---|---|
| ERP | Odoo Community 17+ | Self-hosted localhost:8069 — free, no cloud |
| ERP Bridge | JSON-RPC / XML-RPC | Protocol for the Odoo MCP Server |
| Facebook | Meta Graph API v19 | Page Access Token — long-lived (60 days) |
| Instagram | `instagrapi` library | Business account only — not personal |
| Twitter / X | `tweepy` v4 + API v2 | OAuth 1.0a — Read + Write permission |
| Autonomous Loop | Python subprocess + Claude CLI | Ralph Wiggum Stop Hook — `TASK_COMPLETE` signal |
| Error Recovery | `retry_handler.py` + `watchdog.py` | Exponential backoff + auto-restart |
| Finance Watcher | Python + banking API / CSV | Downloads transactions to /Accounting/ |
| Docker (optional) | Docker Desktop | Odoo + PostgreSQL containers |

### MCP Servers — Gold
| Server | Technology | Tools |
|---|---|---|
| email-mcp | Node.js + nodemailer | `send_email` (retained from Silver) |
| odoo-mcp | Node.js + xmlrpc | `create_invoice`, `get_unpaid_invoices`, `upsert_customer`, `get_monthly_revenue` |

---

## 3. VAULT FOLDER STRUCTURE — Gold Extension

Retain all Silver folders. Only add new Gold folders. Never rename any existing folder.

```
AI_Employee_Vault/
├── Needs_Action/              ← (Silver) Watchers write .md files here
├── Plans/                     ← (Silver) Claude's Plan.md for every action
├── Pending_Approval/          ← (Silver) Human review queue
├── Approved/                  ← (Silver) Human approved → execute
├── Rejected/                  ← (Silver) Human rejected → archive
├── Done/                      ← (Silver) Completed tasks archive
├── Logs/                      ← (Silver) Audit trail: YYYY-MM-DD.json
├── Social/
│   ├── Queue/                 ← (Silver) All platforms queue
│   ├── Posted/                ← (Silver) Published archive
│   ├── Facebook/              ← NEW Gold: FB posted archive
│   ├── Instagram/             ← NEW Gold: IG posted archive
│   └── Twitter/               ← NEW Gold: Twitter posted archive
├── ERP/                       ← NEW Gold: Odoo sync output
│   ├── Invoices/              ← Invoice confirmation .md files
│   ├── Customers/             ← CRM sync records
│   └── Payments/              ← Payment records (human-only)
├── Briefings/                 ← NEW Gold: CEO reports
│   ├── Weekly/                ← Monday Morning CEO Briefing files
│   └── Monthly/               ← Monthly audit reports
├── Autonomous/                ← NEW Gold: Ralph Wiggum loop state
│   ├── Active_Tasks/          ← Running task .json files
│   └── Completed_Tasks/       ← Finished task archive
├── Accounting/
│   ├── Current_Month.md       ← (Silver) Finance watcher output
│   ├── Subscriptions.md       ← NEW Gold: Software cost audit
│   └── Receivables.md         ← NEW Gold: Unpaid invoices tracker
├── Dashboard.md               ← (Bronze/Silver) Real-time summary
├── Company_Handbook.md        ← (Bronze/Silver) Claude's rules of engagement
├── Business_Goals.md          ← (Silver) KPIs, targets, active projects
└── .claude/
    └── skills/                ← 11 SKILL.md files (6 Silver + 5 Gold)
        ├── email-triage/SKILL.md          ← (Silver — keep)
        ├── whatsapp-handler/SKILL.md      ← (Silver — keep)
        ├── plan-generator/SKILL.md        ← (Silver — keep)
        ├── linkedin-poster/SKILL.md       ← (Silver — keep)
        ├── hitl-manager/SKILL.md          ← (Silver — keep)
        ├── dashboard-updater/SKILL.md     ← (Silver — keep)
        ├── odoo-connector/SKILL.md        ← NEW Gold
        ├── social-broadcaster/SKILL.md    ← NEW Gold
        ├── autonomous-loop/SKILL.md       ← NEW Gold
        ├── ceo-briefing/SKILL.md          ← NEW Gold
        └── accounting-auditor/SKILL.md    ← NEW Gold
```

### Project Root (Outside the Vault):
```
C:\Users\YourName\AI_Employee_Project\
├── .env                           ← IN GITIGNORE — never commit
├── .gitignore
├── orchestrator.py                ← (Silver) /Approved/ watcher — extend only
├── autonomous_loop.py             ← NEW Gold: Ralph Wiggum Stop Hook controller
├── retry_handler.py               ← NEW Gold: exponential backoff utility
├── watchdog.py                    ← NEW Gold: process health monitor
├── watchers\
│   ├── gmail_watcher.py           ← (Silver — untouched)
│   ├── whatsapp_watcher.py        ← (Silver — untouched)
│   ├── linkedin_poster.py         ← (Silver — untouched)
│   ├── finance_watcher.py         ← NEW Gold: bank transactions
│   ├── facebook_poster.py         ← NEW Gold
│   ├── instagram_poster.py        ← NEW Gold
│   ├── twitter_poster.py          ← NEW Gold
│   └── subscription_auditor.py    ← NEW Gold
├── mcp_servers\
│   ├── email_mcp\                 ← (Silver — untouched)
│   │   ├── package.json
│   │   └── index.js
│   └── odoo_mcp\                  ← NEW Gold
│       ├── package.json
│       └── index.js
└── AI_Employee_Vault\             ← Obsidian vault
```

---

## 4. ARCHITECTURE RULES

### 4.1 Silver Rules — All Retained
```
All Silver rules from Sections 4.1 through 4.5 apply in Gold without exception.
Gold only ADDS new rules — it does not override or remove Silver rules.
```

### 4.2 Ralph Wiggum Loop (Stop Hook) Rules — PDF Section 2D

The exact CLI command from the PDF to start a Ralph loop:
```bash
# Start a Ralph loop (PDF Section 2D exact syntax)
/ralph-loop "Process all files in /Needs_Action, move to /Done when complete" \
  --completion-promise "TASK_COMPLETE" \
  --max-iterations 10
```

Two completion strategies (PDF Section 2D):
1. **Promise-based (simple):** Claude outputs `<promise>TASK_COMPLETE</promise>`
2. **File-movement (advanced — Gold tier):** Stop hook detects when task file moves to `/Done/` — more reliable because completion is a natural part of the workflow

```
✅ DO:
- Use promise-based completion: Claude outputs <promise>TASK_COMPLETE</promise> when done
- Alternative (advanced): file-movement strategy — Stop hook detects task file moved to /Done/
- Check after every step: more work in /Needs_Action/? Re-inject if yes, allow exit if no
- Log every loop iteration to /Logs/YYYY-MM-DD.json with loop_iteration counter
- Hard limit: MAX_AUTONOMOUS_LOOPS=10 — code-enforced, .env cannot override it
- Sensitive actions inside the loop still go to /Pending_Approval/ — output LOOP_BLOCKED
- On crash or timeout: update /Autonomous/Active_Tasks/ status to "failed" before exiting

❌ DO NOT:
- Payments are NEVER executed inside the autonomous loop — blocked unconditionally
- Emails to new contacts are NEVER sent inside the autonomous loop
- The loop never moves files to /Approved/ — only a human does that
- If 10 iterations complete without TASK_COMPLETE: log the error and stop — never continue
- Company_Handbook.md rules are NEVER skipped inside the loop
```

### 4.3 Odoo ERP Rules
```
✅ DO:
- Odoo always runs at localhost:8069 — never on the public internet
- ODOO_API_KEY always in .env — never in code or any .md file
- Verify partner identity before calling create_invoice
- After every Odoo action, write a confirmation .md file to /ERP/Invoices/ or /ERP/Customers/
- Log every Odoo call to /Logs/YYYY-MM-DD.json
- When DRY_RUN=true, simulate the Odoo call and log — do not make the actual API call

❌ DO NOT:
- Payment recording is NEVER auto-executed — human logs payments manually in Odoo
- For new payees, ALWAYS require approval before calling create_invoice
- Odoo credentials never appear in any .md file, SKILL.md, or Dashboard.md
- Odoo server is never exposed to the internet — localhost only
- Accounting data (revenue, client amounts) never appears in social media posts
```

### 4.4 Multi-Platform Social Rules
```
✅ DO:
- Every post file must have a platforms: field specifying platforms
- Optimize content per platform — LinkedIn: long/B2B, Twitter: short/punchy
- Apply DRY_RUN check on every run for Facebook and Instagram
- Each platform has its own Posted archive folder
- Maximum 3 posts per platform per day

❌ DO NOT:
- Never copy-paste the same content to all platforms — each section must be platform-optimized
- Never send more than 280 characters on Twitter/X
- Never silently fail if the Instagram image path is missing — log the error and skip
- Never include client names or confidential financial data in any social post
- Never use a personal Instagram account — only a Business account
```

### 4.5 CEO Briefing Rules
```
✅ DO:
- Use real Odoo data: call get_unpaid_invoices and get_monthly_revenue from odoo-mcp
- Save the briefing to /Briefings/Weekly/CEO_Briefing_{YYYY-MM-DD}.md
- Briefing must always include: Revenue Dashboard, Unpaid Invoices, Expense Audit,
  Week in Review, Bottlenecks, Proactive Suggestions, Red Flags, Top 3 Priorities
- Output BRIEFING_COMPLETE when the file is saved

❌ DO NOT:
- The CEO Briefing is NEVER auto-sent — saved to vault only
- Never include client email addresses in the briefing
- Never generate an approximate briefing when real Odoo data is unavailable
- If Odoo is offline: log the error and skip — do not generate with missing data
```

### 4.6 Error Recovery & Graceful Degradation Rules — PDF Section 7
```
✅ DO:
- Classify every error: Transient | Authentication | Logic | Data | System
- Transient errors: retry with exponential backoff — base 1s, max 60s, 3 attempts
- Authentication errors: alert the human, pause operations for that watcher
- Logic errors: route to /Needs_Action/ with type: review_required
- System errors: Watchdog.py detects dead PID and restarts the process
- When Gmail API is down: queue outgoing emails locally, process when restored
- When Odoo is offline: never retry payments — always require fresh approval
- When vault is locked: write to temp folder and sync when available

❌ DO NOT:
- Never retry payment actions automatically after any failure — always require fresh approval
- Never swallow errors silently — every failure gets a log entry in /Logs/
- Never let a single watcher crash take down the entire system — PM2 is the safety net
- Retain /Logs/ entries for minimum 90 days — required for audit trail (PDF Section 6.3)
```

### 4.7 Finance Watcher Rules — PDF Section 2A

All Gold watchers (finance_watcher, facebook_poster, instagram_poster, twitter_poster, subscription_auditor) must follow the **BaseWatcher pattern** from the PDF:

```python
# base_watcher.py — Template all Gold watchers must follow (PDF Section 2A)
import time
import logging
from pathlib import Path
from abc import ABC, abstractmethod

class BaseWatcher(ABC):
    def __init__(self, vault_path: str, check_interval: int = 60):
        self.vault_path = Path(vault_path)
        self.needs_action = self.vault_path / 'Needs_Action'
        self.check_interval = check_interval
        self.logger = logging.getLogger(self.__class__.__name__)

    @abstractmethod
    def check_for_updates(self) -> list:
        '''Return list of new items to process'''
        pass

    @abstractmethod
    def create_action_file(self, item) -> Path:
        '''Create .md file in Needs_Action folder'''
        pass

    def run(self):
        self.logger.info(f'Starting {self.__class__.__name__}')
        while True:
            try:
                items = self.check_for_updates()
                for item in items:
                    self.create_action_file(item)
            except Exception as e:
                self.logger.error(f'Error: {e}')
            time.sleep(self.check_interval)
```

```
✅ DO:
- Finance Watcher downloads bank transaction CSVs or calls banking API
- Write new transactions to /Accounting/Current_Month.md
- Use audit_logic.py patterns to auto-tag recurring subscription expenses
- New transactions trigger Claude's reasoning loop via /Needs_Action/

❌ DO NOT:
- Finance Watcher never executes payments — it only reads and logs
- Banking credentials (if any) use Windows Credential Manager — never in plain .env
```

---

## 5. IMPLEMENTATION ORDER — Step by Step

Complete all Silver verification checks before starting Gold. This is non-negotiable.

```
STEP 1:  Odoo Community Setup      — Docker install + database 'ai_employee_erp'
                                     + API user + enable modules (Invoicing, CRM, Contacts)
STEP 2:  Odoo MCP Server           — Node.js JSON-RPC bridge, 4 tools,
                                     add to claude_desktop_config.json, test dry-run
STEP 3:  retry_handler.py          — Exponential backoff utility (base 1s, max 60s, 3 attempts)
STEP 4:  watchdog.py               — PID monitoring, auto-restart, human notification on restart
STEP 5:  Finance Watcher           — Bank CSV download + /Accounting/Current_Month.md writer
                                     + audit_logic.py subscription patterns
STEP 6:  Facebook Poster           — Meta Graph API v19, Page Token, DRY_RUN support
STEP 7:  Instagram Poster          — instagrapi, Business account, session file gitignored
STEP 8:  Twitter/X Poster          — Tweepy v4, API v2, OAuth 1.0a, 280-char truncation
STEP 9:  Ralph Wiggum Loop         — autonomous_loop.py, Stop Hook, TASK_COMPLETE promise,
                                     MAX_LOOPS=10 hard limit
STEP 10: Accounting Audit System   — Subscriptions.md, Receivables.md,
                                     subscription_auditor.py, audit_logic.py
STEP 11: CEO Briefing              — Sunday 11 PM task, Odoo data synthesis,
                                     Monday Morning CEO Briefing format from PDF
STEP 12: Gold Agent Skills         — 5 new SKILL.md files (11 total)
STEP 13: PM2 Gold Update           — Add 5 new processes (9 total)
STEP 14: Task Scheduler Update     — Add 2 new tasks: SocialBroadcast, SubAudit (5 total)
STEP 15: Integration Testing       — End-to-end: WhatsApp → Ralph Loop → Plan
                                     → Approval → Odoo Invoice → Email → Done
```

---

## 6. AGENT SKILLS — Gold Tier (5 New SKILL.md Files)

All 6 Silver skills are retained unchanged. 5 new Gold skills are added.

### Skill Format (Same as Silver):
```markdown
---
name: skill-name
description: >
  [When to trigger — detailed] [What it does] [Trigger keywords]
  Use this skill whenever [specific contexts]. Also trigger when [edge cases].
---

# Skill Title

## Purpose
[1-2 lines — what it does]

## Trigger Conditions
[When Claude should use this skill]

## Instructions
1. [Step 1]
2. [Step 2]
...

## Rules (from Company_Handbook.md)
- [Relevant rule 1]

## Output Format
[Expected output format]

## Error Handling
[What to do if something fails]
```

### Required Gold Skills List:

| Skill Name | Trigger Conditions | Output |
|---|---|---|
| `odoo-connector` | Invoice needed \| CRM update \| "billing" \| "invoice" \| "unpaid" | /ERP/Invoices/*.md + Odoo invoice created (or dry-run log) |
| `social-broadcaster` | "post everywhere" \| milestone \| "all platforms" \| weekly update | /Social/Queue/POST_*.md with all 4 platform sections |
| `autonomous-loop` | "process all" \| "run autonomously" \| "handle inbox" \| batch task | TASK_COMPLETE signal + /Logs/ entries for every iteration |
| `ceo-briefing` | "weekly briefing" \| Sunday schedule \| "CEO report" \| "business summary" | /Briefings/Weekly/CEO_Briefing_{YYYY-MM-DD}.md + BRIEFING_COMPLETE |
| `accounting-auditor` | "audit" \| "unpaid invoices" \| "subscription review" \| "where is money" | AUDIT_*.md in /Needs_Action/ + Dashboard.md updated |

---

## 7. FILE FORMATS — New Gold Schemas

All Silver file formats are retained unchanged.

### /Autonomous/Active_Tasks/*.json — Ralph Wiggum Task File
```json
{
  "name": "process_daily_inbox",
  "created": "2026-01-08T08:00:00Z",
  "prompt": "Process all unprocessed files in /Needs_Action/. For each: (1) Read the file. (2) Create PLAN_*.md in /Plans/. (3) For sensitive actions, create approval file in /Pending_Approval/. (4) Mark source file processed: true in frontmatter. (5) Update Dashboard.md. When ALL files are processed, output <promise>TASK_COMPLETE</promise>. Follow Company_Handbook.md at all times.",
  "completion_promise": "TASK_COMPLETE",
  "max_loops": 10,
  "loop_count": 0,
  "status": "active",
  "created_by": "daily_scheduler"
}
```

### /Social/Queue/*.md — Multi-Platform Post Format (Gold Extension)
```yaml
---
type: social_post
platforms: linkedin, facebook, instagram, twitter
scheduled_for: 2026-01-08T09:00:00
status: queued
auto_approved: true
image_path: ""
---

## LinkedIn Version
[150-300 words, 3-5 hashtags, B2B professional tone]

## Facebook Version
[100-250 words, 2-3 hashtags, community/conversational tone]

## Instagram Version
[2200 chars max, 10-15 hashtags, visual description first]

## Twitter Version
[Under 240 chars, no hashtags in main tweet body, punchy hook]
```

### /Briefings/Weekly/CEO_Briefing_{date}.md — Monday Morning CEO Briefing
```markdown
---
type: ceo_briefing
generated: 2026-01-12T23:05:00Z
period: 2026-01-06 to 2026-01-12
week: 2026-W02
status: complete
---

# Monday Morning CEO Briefing

## Executive Summary
[3 sentences max — this week in business]

## Revenue Dashboard (from Odoo MCP)
| Metric    | Amount | Target | Gap |
|-----------|--------|--------|-----|
| Billed    | $X,XXX | $X,XXX | +/- |
| Collected | $X,XXX | $X,XXX | +/- |

## Unpaid Invoices (from get_unpaid_invoices)
| Invoice | Client | Amount | Due Date | Days Overdue |
|---------|--------|--------|----------|--------------|

## Subscription Audit
- [Tool]: No login in [N] days. Cost: $[X]/month.
  [ACTION] Cancel? → Move to /Pending_Approval

## Completed Tasks This Week
[Done/ folder summary — count + highlights]

## Bottlenecks
| Task | Expected | Actual | Delay |
|------|----------|--------|-------|

## Proactive Suggestions
[Cost optimizations, subscription cancellations, upcoming deadlines]

## Red Flags
[Invoices 30+ days overdue | Revenue < 80% target | Unused subscriptions]

## Top 3 Priorities — Next Week
1. [Priority 1]
2. [Priority 2]
3. [Priority 3]

---
*Generated by AI Employee — Gold Tier*
```

### /ERP/Invoices/INV_{date}_{client}.md — Odoo Confirmation
```yaml
---
type: erp_invoice
odoo_invoice_id: 42
client: Client Name
amount: 2500.00
status: posted
created: 2026-01-08T10:30:00Z
source_approval: Pending_Approval/invoice_client_20260108.md
---

## Details
Invoice INV-003 created in Odoo ERP.
Email sent to client@example.com via email-mcp.
```

### /Logs/YYYY-MM-DD.json — Gold Extension (New Action Types)
```json
[
  {
    "timestamp": "2026-01-08T10:30:00Z",
    "action_type": "odoo_invoice_create | odoo_customer_upsert | autonomous_loop_step | ceo_briefing_generate | social_broadcast | subscription_audit | finance_watcher | retry_attempt | watchdog_restart",
    "actor": "claude_cli | orchestrator | autonomous_loop | scheduler | watchdog",
    "target": "odoo:INV-003 | facebook:page_id | twitter:@handle",
    "source_file": "PLAN_wa_20260108.md",
    "approval_status": "approved | auto | dry_run",
    "result": "success | failed | dry_run | retried",
    "loop_iteration": 2,
    "retry_attempt": 1,
    "details": "Optional note"
  }
]
```

### audit_logic.py — Subscription Pattern Matching (PDF Section 4)
```python
# audit_logic.py — Used by Finance Watcher and subscription_auditor.py
SUBSCRIPTION_PATTERNS = {
    'netflix.com':  'Netflix',
    'spotify.com':  'Spotify',
    'adobe.com':    'Adobe Creative Cloud',
    'notion.so':    'Notion',
    'slack.com':    'Slack',
    'github.com':   'GitHub',
    'openai.com':   'OpenAI',
    'anthropic.com':'Claude API',
    # Add your own subscriptions here
}

def analyze_transaction(transaction):
    for pattern, name in SUBSCRIPTION_PATTERNS.items():
        if pattern in transaction['description'].lower():
            return {
                'type': 'subscription',
                'name': name,
                'amount': transaction['amount'],
                'date': transaction['date']
            }
    return None
```

### Business_Goals.md Template — PDF Section 4 (Required for CEO Briefing)
```markdown
# /Vault/Business_Goals.md
---
last_updated: 2026-01-07
review_frequency: weekly
---

## Q1 2026 Objectives

### Revenue Target
- Monthly goal: $10,000
- Current MTD: $4,500

### Key Metrics to Track
| Metric               | Target       | Alert Threshold |
|----------------------|--------------|-----------------|
| Client response time | < 24 hours   | > 48 hours      |
| Invoice payment rate | > 90%        | < 80%           |
| Software costs       | < $500/month | > $600/month    |

### Active Projects
1. Project Alpha - Due Jan 15 - Budget $2,000
2. Project Beta  - Due Jan 30 - Budget $3,500

### Subscription Audit Rules
Flag for review if:
- No login in 30 days
- Cost increased > 20%
- Duplicate functionality with another tool
```

---

## 8. ERROR RECOVERY & GRACEFUL DEGRADATION — PDF Section 7

Autonomous systems will fail. Plan for it.

### 8.1 Error Categories — PDF Section 7.1

| Category | Examples | Recovery Strategy |
|---|---|---|
| Transient | Network timeout, API rate limit | Exponential backoff retry (retry_handler.py) |
| Authentication | Expired token, revoked access | Alert human, pause operations for that watcher |
| Logic | Claude misinterprets message | Route to /Needs_Action/ with type: review_required |
| Data | Corrupted file, missing field | Quarantine to /Logs/quarantine/ and alert |
| System | Orchestrator crash, disk full | Watchdog.py detects dead PID and restarts |

### 8.2 retry_handler.py — Exponential Backoff — PDF Section 7.2
```python
# retry_handler.py
import time
from functools import wraps

def with_retry(max_attempts=3, base_delay=1, max_delay=60):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except TransientError as e:
                    if attempt == max_attempts - 1:
                        raise
                    delay = min(base_delay * (2 ** attempt), max_delay)
                    logger.warning(f'Attempt {attempt+1} failed, retrying in {delay}s')
                    time.sleep(delay)
        return wrapper
    return decorator
```

### 8.3 watchdog.py — Process Health Monitor — PDF Section 7.4
```python
# watchdog.py - Monitor and restart critical processes
import subprocess, time
from pathlib import Path

PROCESSES = {
    'orchestrator':     'python orchestrator.py',
    'autonomous_loop':  'python autonomous_loop.py',
    'gmail_watcher':    'python watchers/gmail_watcher.py',
    'whatsapp_watcher': 'python watchers/whatsapp_watcher.py',
}

def check_and_restart():
    for name, cmd in PROCESSES.items():
        pid_file = Path(f'tmp/{name}.pid')
        if not is_process_running(pid_file):
            logger.warning(f'{name} not running, restarting...')
            proc = subprocess.Popen(cmd.split())
            pid_file.write_text(str(proc.pid))
            notify_human(f'{name} was restarted automatically')

while True:
    check_and_restart()
    time.sleep(60)
```

### 8.4 Graceful Degradation Rules — PDF Section 7.3

| Component Down | Behavior | Recovery |
|---|---|---|
| Gmail API | Queue outgoing emails in /Logs/email_queue.json | Process queue when API restored |
| Odoo ERP | Log error, skip CEO briefing, alert human via /Needs_Action/ | Never generate briefing with missing data |
| Banking API | Write last known data, flag as stale in /Accounting/ | Never retry payments automatically |
| Claude CLI | Watchers keep collecting files in /Needs_Action/ | Process backlog when Claude is available |
| Vault locked | Write to C:\Temp\vault_emergency\ | Sync to vault when lock is released |

---

## 9. FULL CROSS-DOMAIN INTEGRATION — Personal + Business

PDF Requirement 2: "Full cross-domain integration (Personal + Business)". The Ralph Wiggum loop is the integration point — it processes inputs from both domains in a single autonomous run.

| Domain | Watchers | Vault Folders | MCP Actions |
|---|---|---|---|
| Personal | Gmail Watcher, WhatsApp Watcher | /Needs_Action/, /Plans/, /Done/ | send_email (email-mcp) |
| Business — Finance | Finance Watcher, subscription_auditor.py | /Accounting/, /ERP/, /Briefings/ | Odoo MCP (invoices, revenue) |
| Business — Social | linkedin_poster, facebook_poster, instagram_poster, twitter_poster | /Social/Queue/, /Social/Posted/ | Platform APIs (Graph, tweepy, instagrapi) |
| Business — Ops | Claude Reasoning Loop (Ralph Wiggum) | /Autonomous/, /Pending_Approval/ | All MCP servers |

---

## 10. SECURITY RULES

```
Silver's 10 rules apply in Gold without exception. These rules are added:

11. ODOO_API_KEY always in .env — rotate monthly in the Odoo web console
12. Odoo server never exposed to the internet — localhost:8069 only
13. Facebook Page Token uses long-lived token (60 days) — cron to refresh it
14. instagrapi session file added to .gitignore — never committed
15. Twitter API keys in .env — check Twitter Developer Portal monthly
16. Payment actions inside the autonomous loop are ALWAYS blocked — no override possible
17. CEO Briefing contains real financial data — save to vault only, never auto-send
18. MAX_AUTONOMOUS_LOOPS=10 is hard-coded — .env cannot override this value
19. Odoo MCP config file (claude_desktop_config.json) added to .gitignore
20. Use Instagram Business account — personal accounts violate Instagram Terms of Service
```

### 10.1 Permission Boundaries — PDF Section 6.4

| Action Category | Auto-Approve Threshold | Always Require Human Approval |
|---|---|---|
| Email replies | To known contacts (existing clients) | New contacts, bulk sends (2+) |
| Payments | No automatic payments at any amount | Every single payment — including $1 |
| Social media | Scheduled posts already in /Social/Queue/ | Replies, DMs, comments on any platform |
| Odoo invoices | Known clients under $500 (configurable) | New clients, amounts over $500, new payees |
| File operations | Create, read anywhere in vault | Delete, move outside vault |
| Odoo CRM | Update existing client records | Create new customer, merge, delete |

---

## 11. ENVIRONMENT VARIABLES

```env
# .env — GOLD TIER COMPLETE
# NEVER COMMIT — add to .gitignore before anything else

# ── Silver (retain all) ───────────────────────────────────────────
VAULT_PATH=C:\Users\YourName\AI_Employee_Project\AI_Employee_Vault
GMAIL_CREDENTIALS_PATH=C:\Users\YourName\AI_Employee_Project\credentials.json
GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=xxxx_xxxx_xxxx_xxxx
WHATSAPP_SESSION_PATH=C:\Users\YourName\wa_session
LINKEDIN_EMAIL=your@email.com
LINKEDIN_PASSWORD=your_linkedin_password
DRY_RUN=true
MAX_EMAILS_PER_HOUR=10
MAX_PAYMENTS_PER_DAY=3
MAX_LINKEDIN_POSTS_PER_DAY=5
DAILY_BRIEFING_TIME=08:00
WEEKLY_BRIEFING_DAY=SUN
WEEKLY_BRIEFING_TIME=23:00

# ── Odoo ERP (NEW Gold) ───────────────────────────────────────────
ODOO_URL=http://localhost:8069
ODOO_DB=ai_employee_erp
ODOO_USER=ai_employee_api@company.com
ODOO_API_KEY=your_odoo_api_key_here

# ── Facebook (NEW Gold) ───────────────────────────────────────────
FACEBOOK_PAGE_ID=your_facebook_page_id
FACEBOOK_PAGE_TOKEN=your_long_lived_page_access_token

# ── Instagram (NEW Gold) ─────────────────────────────────────────
INSTAGRAM_USERNAME=your_instagram_business_username
INSTAGRAM_PASSWORD=your_instagram_password

# ── Twitter / X (NEW Gold) ───────────────────────────────────────
TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_SECRET=your_access_secret

# ── Banking (NEW Gold) ───────────────────────────────────────────
BANK_STATEMENTS_PATH=C:\Users\YourName\Documents\bank_exports

# ── Gold Safety Flags (NEW) ──────────────────────────────────────
MAX_SOCIAL_POSTS_PER_DAY=10
MAX_AUTONOMOUS_LOOPS=10
AUTONOMOUS_LOOP_ENABLED=true

# ── Accounting Thresholds (NEW) ──────────────────────────────────
MONTHLY_REVENUE_TARGET=10000
MONTHLY_EXPENSE_BUDGET=2000
INVOICE_OVERDUE_WARN_DAYS=15
INVOICE_OVERDUE_CRITICAL_DAYS=30
SUBSCRIPTION_UNUSED_DAYS=30
SUBSCRIPTION_COST_INCREASE_PCT=20
```

---

## 12. WINDOWS TASK SCHEDULER — Gold Scheduled Tasks

```powershell
# PowerShell — Run as Administrator

# ── Silver Tasks (keep — verify they still exist) ──────────────────
schtasks /query /tn "AIEmployee_DailyBriefing"    # Already exists
schtasks /query /tn "AIEmployee_WeeklyBriefing"   # Already exists — CEO briefing uses this
schtasks /query /tn "AIEmployee_LinkedIn"         # Already exists

# ── Gold: Social Broadcast (Daily 9:05 AM) ─────────────────────────
schtasks /create /tn "AIEmployee_SocialBroadcast" `
  /tr "cmd /c claude --cwd ""%VAULT_PATH%"" ""Use social-broadcaster skill. Read Business_Goals.md and Done/ folder. Create multi-platform post in /Social/Queue/ scheduled for 09:00 tomorrow.""" `
  /sc daily /st 09:05 /ru "%USERNAME%" /f

# ── Gold: Subscription Audit (Monday 9 AM) ─────────────────────────
schtasks /create /tn "AIEmployee_SubAudit" `
  /tr "python C:\Users\YourName\AI_Employee_Project\watchers\subscription_auditor.py" `
  /sc weekly /d MON /st 09:00 /ru "%USERNAME%" /f

# ── Verify all 5 tasks ─────────────────────────────────────────────
schtasks /query /fo LIST /v | findstr "AIEmployee"
# Expected: DailyBriefing, WeeklyBriefing, LinkedIn, SocialBroadcast, SubAudit
```

---

## 13. PM2 PROCESS MANAGER — Gold ecosystem.config.js

```javascript
// ecosystem.config.js — GOLD TIER (replace Silver version)
module.exports = {
  apps: [
    // ── Silver processes (retain all) ────────────────────────────
    { name: 'gmail_watcher',    script: 'watchers/gmail_watcher.py',    interpreter: 'python', autorestart: true, max_restarts: 10 },
    { name: 'whatsapp_watcher', script: 'watchers/whatsapp_watcher.py', interpreter: 'python', autorestart: true, max_restarts: 10 },
    { name: 'orchestrator',     script: 'orchestrator.py',              interpreter: 'python', autorestart: true, max_restarts: 10 },
    { name: 'linkedin_poster',  script: 'watchers/linkedin_poster.py',  interpreter: 'python', autorestart: true },

    // ── Gold processes (new additions) ───────────────────────────
    { name: 'facebook_poster',  script: 'watchers/facebook_poster.py',  interpreter: 'python', autorestart: true },
    { name: 'instagram_poster', script: 'watchers/instagram_poster.py', interpreter: 'python', autorestart: true },
    { name: 'twitter_poster',   script: 'watchers/twitter_poster.py',   interpreter: 'python', autorestart: true },
    { name: 'autonomous_loop',  script: 'autonomous_loop.py',           interpreter: 'python', autorestart: true, max_restarts: 10 },
    { name: 'watchdog',         script: 'watchdog.py',                  interpreter: 'python', autorestart: true },
  ]
};

// pm2 start ecosystem.config.js    ← Start all 9
// pm2 save                          ← Persist across reboots
// pm2 status                        ← Expect 9 processes 'online'
```

---

## 14. API CONTRACT — MCP Servers

```
Base: %APPDATA%\Claude\claude_desktop_config.json

# ── Silver MCP (retain) ──────────────────────────────────────────
email-mcp:
  Tool:   send_email
  Input:  { to, subject, body, attachment? }
  Output: { success, dry_run, message_id? }
  Guard:  DRY_RUN check — if true, log only, do not send

# ── Gold MCP (new) ───────────────────────────────────────────────
odoo-mcp:
  Tool:   create_invoice
  Input:  { partner_name, amount, description, due_date? }
  Output: { success, invoice_id?, dry_run }
  Guard:  DRY_RUN + must only be called AFTER /Pending_Approval/ approved

  Tool:   get_unpaid_invoices
  Input:  {}
  Output: { success, invoices: [{ name, partner_id, amount_total, invoice_date_due }] }
  Guard:  Read-only — no DRY_RUN check needed

  Tool:   upsert_customer
  Input:  { name, email, phone?, company? }
  Output: { success, partner_id, action: "created" | "updated" }
  Guard:  DRY_RUN check + new customer requires approval before creation

  Tool:   get_monthly_revenue
  Input:  { month, year }
  Output: { success, total, invoices: [...] }
  Guard:  Read-only — no DRY_RUN check needed
```

```json
// %APPDATA%\Claude\claude_desktop_config.json — Gold version
{
  "mcpServers": {
    "email": {
      "command": "node",
      "args": ["C:\\Users\\YourName\\AI_Employee_Project\\mcp_servers\\email_mcp\\index.js"]
    },
    "odoo": {
      "command": "node",
      "args": ["C:\\Users\\YourName\\AI_Employee_Project\\mcp_servers\\odoo_mcp\\index.js"],
      "env": {
        "ODOO_URL":    "http://localhost:8069",
        "ODOO_DB":     "ai_employee_erp",
        "ODOO_USER":   "ai_employee_api@company.com",
        "ODOO_API_KEY": "your_key_here",
        "DRY_RUN":     "true"
      }
    }
  }
}
```

---

## 15. COMPANY_HANDBOOK.MD — Gold Tier Rules

Append the following to Company_Handbook.md. Do not remove or change any existing Silver rules.

```markdown
## Gold Tier — Odoo ERP Rules
- Invoice creation: known clients under $500 → auto-approve allowed
- Invoice creation: new clients or amounts $500+ → ALWAYS requires approval
- Payment recording: NEVER auto-execute — human logs payments manually in Odoo
- CRM update (existing client): auto-allowed
- CRM new customer creation: ALWAYS requires approval

## Gold Tier — Multi-Platform Social Rules
- All 4 platforms (LinkedIn, Facebook, Instagram, Twitter): content must be platform-optimized
- Twitter: maximum 240 characters
- Client names must NEVER appear in social posts
- Financial data (revenue, profit, salary) must NEVER appear in social posts
- Maximum 3 posts per platform per day

## Gold Tier — Ralph Wiggum Loop Rules
- HITL rules apply inside the loop — no exceptions
- Payment actions inside the loop: BLOCKED — create approval file, output LOOP_BLOCKED
- Loop maximum: 10 iterations — log error and stop if limit reached
- TASK_COMPLETE: only output this when ALL work is genuinely complete

## Gold Tier — CEO Briefing Rules
- Briefing is saved to vault only — NEVER auto-sent
- Always use real Odoo data — never approximations
- Red Flags must include: invoices 30+ days overdue, revenue < 80% target, unused subscriptions

## Gold Tier — Approval Keywords (additions to Silver)
- REQUIRES_APPROVAL → create /Pending_Approval/ file, stop, wait
- AUTO_APPROVED     → execute directly (social posts, read operations)
- ODOO_REQUIRED     → call create_invoice tool (only after approval)
- LOOP_BLOCKED      → pause autonomous loop, create notification in /Needs_Action/
```

---

## 16. TESTING CHECKLIST — All 12 PDF Requirements

```
# ── Silver Regression Tests (verify Gold did not break anything) ──
[ ] Gmail Watcher: Important email → EMAIL_*.md created in /Needs_Action/
[ ] WhatsApp Watcher: Keyword message → WA_*.md created in /Needs_Action/
[ ] Claude Reasoning Loop: PLAN_*.md created in /Plans/ for every /Needs_Action/ file
[ ] HITL: Sensitive action → /Pending_Approval/ — not directly executed
[ ] Approval Flow: Move to /Approved/ → Orchestrator executes → moves to /Done/
[ ] Rejection Flow: Move to /Rejected/ → action cancelled
[ ] Email MCP: DRY_RUN=true → log only, no real email sent
[ ] LinkedIn: Queue file → post published at scheduled time (dry run)
[ ] PM2: 4 Silver processes show 'online' in pm2 status
[ ] Task Scheduler: 3 Silver tasks visible in schtasks /query
[ ] Silver Skills: 6 SKILL.md files exist in .claude/skills/
[ ] Audit Logs: Every action creates a /Logs/YYYY-MM-DD.json entry
[ ] Dashboard: Dashboard.md updated after every action
[ ] Security: git log shows .env was never committed

# ── Gold Tests — 12 PDF Requirements ─────────────────────────────
[ ] PDF #2  — Cross-Domain: WhatsApp (personal) AND Finance Watcher (business)
               both create files in /Needs_Action/ — same loop processes both
[ ] PDF #3  — Odoo: localhost:8069 accessible. Manual test invoice created in Odoo UI
[ ] PDF #3  — Odoo MCP: create_invoice dry-run → log entry with dry_run: true
[ ] PDF #3  — Odoo MCP: get_unpaid_invoices → returns data (or empty array)
[ ] PDF #3  — Odoo MCP: get_monthly_revenue → returns revenue total
[ ] PDF #4  — Facebook: POST file with "facebook" in platforms: → [DRY RUN] log created
[ ] PDF #4  — Instagram: POST file with "instagram" in platforms: → [DRY RUN] log created
[ ] PDF #5  — Twitter: POST file with "twitter" in platforms: → [DRY RUN] log created
[ ] PDF #6  — Multiple MCPs: Both email-mcp and odoo-mcp callable from Claude
[ ] PDF #7  — CEO Briefing: Sunday task run → /Briefings/Weekly/ file with all sections
[ ] PDF #7  — Accounting Audit: Overdue invoice in Odoo → AUDIT_*.md in /Needs_Action/
[ ] PDF #7  — Subscription Audit: Unused tool in Subscriptions.md → auditor flags it
[ ] PDF #8  — Error Recovery: Kill gmail_watcher → PM2/watchdog restarts within 60 seconds
[ ] PDF #8  — Retry Logic: Simulate transient failure → retry_handler.py retries with backoff
[ ] PDF #8  — Graceful Degradation: Stop Odoo container → error logged, briefing skipped
[ ] PDF #9  — Audit Logging: All Gold action types appear in /Logs/
[ ] PDF #10 — Ralph Wiggum: Drop 3 files in /Needs_Action/ → loop processes all 3
               → outputs TASK_COMPLETE → stops automatically
[ ] PDF #10 — Stop Hook Safety: Loop hits MAX_AUTONOMOUS_LOOPS=10 → stops, error logged
[ ] PDF #10 — Loop HITL: Sensitive action in loop → LOOP_BLOCKED → /Pending_Approval/ created
[ ] PDF #11 — Documentation: README.md with architecture diagram + lessons learned section
[ ] PDF #12 — Agent Skills: 11 SKILL.md files exist in .claude/skills/
[ ] PM2 Gold: pm2 status shows 9 processes 'online'
[ ] Task Scheduler Gold: 5 AIEmployee tasks visible in schtasks /query
[ ] Security: git status shows .env, Instagram session, Odoo config NOT tracked
[ ] End-to-End: WhatsApp "send me an invoice" → Ralph Loop → Plan → Approval
               → Odoo Invoice → Email → /Done/ → Dashboard updated
```

---

## 17. EXISTING CODE INTEGRATION

```
✅ Retain from Silver (no changes):
  - All 6 Silver SKILL.md files — word for word, unchanged
  - orchestrator.py — extend logging section only (add new Gold action types)
  - gmail_watcher.py — untouched
  - whatsapp_watcher.py — untouched
  - email_mcp/index.js — untouched
  - PM2 ecosystem.config.js — add 5 new entries, do not remove existing 4
  - Company_Handbook.md — append Gold rules only, never remove Silver rules
  - Dashboard.md — add Gold sections (ERP Summary, Social Stats, Loop Status)
  - .gitignore — add: instagrapi session, Odoo MCP config

✅ New files to create in Gold:
  - autonomous_loop.py             ← Ralph Wiggum Stop Hook controller
  - retry_handler.py               ← Exponential backoff decorator
  - watchdog.py                    ← PID monitoring and auto-restart
  - watchers/finance_watcher.py    ← Bank CSV download + /Accounting/ writer
  - watchers/facebook_poster.py
  - watchers/instagram_poster.py
  - watchers/twitter_poster.py
  - watchers/subscription_auditor.py
  - mcp_servers/odoo_mcp/index.js
  - 5 new SKILL.md files

❌ Do not:
  - Rename any Silver folder
  - Change any Silver YAML frontmatter schema
  - Rewrite orchestrator.py — extend it only
  - Remove any existing PM2 processes
  - Modify any of the 6 Silver SKILL.md files
  - Commit .env, Instagram session files, or Odoo API config
```

---

## 18. ETHICS & RESPONSIBLE AUTOMATION — PDF Section 8

### When the AI Must NOT Act Autonomously
```
- Emotional contexts: condolence messages, conflict resolution, sensitive negotiations
- Legal matters: contract signing, legal advice, regulatory filings
- Medical decisions: any health-related actions
- Financial edge cases: unusual transactions, new recipients, large amounts
- Irreversible actions: anything that cannot be easily undone
```

### Transparency Principles
```
- Disclose AI involvement: when AI sends emails, add a signature noting AI assistance
- Maintain audit trails: all actions are logged and reviewable in /Logs/
- Allow opt-out: give contacts a way to request human-only communication
- Regular reviews: schedule weekly reviews of AI decisions to catch drift
```

### Required Oversight Schedule
```
Daily   (2 min)    : Check Dashboard.md — look for unprocessed red flags
Weekly  (15 min)   : Review /Logs/ entries — confirm all actions were correct
Monthly (1 hour)   : Full CEO Briefing review + security and credential check
Quarterly (half day): Full security audit + credential rotation + Watchdog review
```

---

## 19. HACKATHON SUBMISSION — Gold Tier Requirements

```
[ ] GitHub repo — public or private with judge access granted
[ ] README.md — complete setup guide + architecture diagram + all 11 skills listed
[ ] Demo video (8-12 minutes) — all 12 PDF Gold features shown live
[ ] Security disclosure — explain .env, Odoo API key, social credentials, Instagram session
[ ] Tier declaration — "Gold" clearly stated in README.md and submission form
[ ] Lessons learned section in README (PDF Requirement 11)
[ ] Submit form: https://forms.gle/JR9T1SJq5rmQyGkGA

Demo video suggested order:
  1. pm2 status → 9 processes online (30 sec)
  2. Ralph Wiggum Loop: 3 files in /Needs_Action/ → loop processes all → TASK_COMPLETE (90 sec)
  3. HITL in loop: sensitive action → LOOP_BLOCKED → /Pending_Approval/ created (45 sec)
  4. Odoo Invoice: move to /Approved/ → Orchestrator calls Odoo MCP → dry-run log (60 sec)
  5. Social Broadcaster: skill run → 4-platform POST file → all 4 platform logs (60 sec)
  6. CEO Briefing: Sunday task run → /Briefings/Weekly/ file with Odoo revenue data (60 sec)
  7. Error Recovery: kill a watcher → PM2/watchdog restarts it → log confirms recovery (30 sec)
  8. Accounting Audit: overdue invoice → AUDIT_*.md in /Needs_Action/ (30 sec)
  9. All 11 Skills: show .claude/skills/ — 11 SKILL.md files (20 sec)
  10. Task Scheduler: schtasks /query → 5 AIEmployee tasks (20 sec)
  11. Security Check: git status → .env and Instagram session not tracked (20 sec)
  12. Architecture: README.md diagram walkthrough + lessons learned (30 sec)
```

### Judging Score Strategy (Gold):

| Criterion | Weight | Gold Strategy |
|---|---|---|
| Functionality | 30% | All 12 PDF requirements demonstrated live using Section 16 checklist as script |
| Innovation | 25% | Ralph Wiggum Stop Hook is the headline — show 3+ files processed autonomously, explain both completion strategies |
| Practicality | 20% | Show real Odoo invoice data in CEO Briefing — Monday Morning Briefing format from PDF |
| Security | 15% | Show .env, explain 20 security rules, demonstrate MAX_AUTONOMOUS_LOOPS hard limit, payment blocking in loop |
| Documentation | 10% | README architecture diagram + all 11 skills + lessons learned (PDF Requirement 11) |

---

## PDF REQUIREMENTS COVERAGE SUMMARY

| PDF Requirement | Status | Covered In |
|---|---|---|
| 1. All Silver requirements | ✅ COVERED | Section 4.1 — Silver rules retained |
| 2. Full cross-domain integration | ✅ COVERED | Section 9 — Personal + Business table |
| 3. Odoo Community + JSON-RPC MCP | ✅ COVERED | Sections 2, 4.3, 7.4, 14 |
| 4. Facebook + Instagram integration | ✅ COVERED | Sections 2, 4.4, 7.2, 11 |
| 5. Twitter/X integration | ✅ COVERED | Sections 2, 4.4, 7.2, 11 |
| 6. Multiple MCP servers | ✅ COVERED | Section 14 — email-mcp + odoo-mcp |
| 7. Weekly Audit + CEO Briefing | ✅ COVERED | Sections 4.5, 7.3, 7.6, 12 |
| 8. Error recovery + graceful degradation | ✅ COVERED | Section 8 — full error recovery system |
| 9. Comprehensive audit logging | ✅ COVERED | Section 7.5 — extended log schema |
| 10. Ralph Wiggum / Stop Hook loop | ✅ COVERED | Sections 4.2, 7.1, 16 |
| 11. Architecture + lessons learned | ✅ COVERED | Section 19 — README requirement |
| 12. All AI as Agent Skills | ✅ COVERED | Section 6 — 11 SKILL.md files |
```

## Response

Created Gold Tier constitution file with comprehensive specifications for autonomous business operations.