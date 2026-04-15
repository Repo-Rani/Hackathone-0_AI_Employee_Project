# Platinum Tier Implementation

## Overview
This document describes the implementation of the Platinum Tier AI Employee system, which features a 24/7 Cloud Agent and a Local Executive Agent working in coordination through a shared Obsidian vault.

## Architecture

### Cloud Agent (Always-On)
- Runs continuously on Cloud VM (Oracle/AWS)
- Monitors for new tasks in `/Needs_Action/`
- Performs drafting, analysis, and queuing operations
- NEVER executes sensitive operations (no sending, posting, or paying)
- Writes to: `/Needs_Action/`, `/Plans/`, `/Pending_Approval/`, `/Updates/`

### Local Agent (Executive)
- Runs on local machine
- Executes approved sensitive operations
- Handles WhatsApp sessions, payments, and final sends
- Updates Dashboard.md (the only agent that writes to it)
- Reads from: `/Approved/` files to execute tasks

## Core Components

### 1. vault_sync.py
Module for synchronizing the vault between Cloud and Local agents using Git. Ensures all changes are properly committed and pushed.

### 2. claim_task.py
Implements the claim-by-move protocol to prevent double work between Cloud and Local agents. Atomic file moves ensure only one agent processes each task.

### 3. cloud_orchestrator.py
Main Cloud Agent process that continuously scans for new tasks, claims them using the claim-by-move protocol, and processes them according to Platinum Tier rules.

### 4. health_monitor.py
Monitors system health including PM2 processes, Odoo status, and vault sync. Auto-restarts failed processes and writes alerts to the vault.

### 5. odoo_mcp.py
Odoo integration module with strict separation between Cloud (draft operations) and Local (execution operations) capabilities.

### 6. Watcher Modules
- `gmail_watcher.py`: Monitors Gmail and creates task files
- `linkedin_watcher.py`: Monitors LinkedIn and creates task files
- `finance_watcher.py`: Monitors financial data and creates task files

### 7. local_orchestrator.py
Process that executes approved tasks and updates Dashboard.md (Local-only operation).

## Security Features

### Vault Sync Security
- Comprehensive `.gitignore` prevents sensitive data from syncing
- Environment variables separated between Cloud and Local
- No secrets, tokens, or sensitive files ever synced between environments

### Draft vs Execution Separation
- Cloud: Draft invoices, draft expenses, draft social posts
- Local: Post invoices, register payments, send emails/posts

### Access Controls
- WhatsApp session only on Local machine
- Banking credentials only on Local machine
- Payment tokens only on Local machine
- Dashboard.md updates only by Local agent

## Directory Structure

```
AI_Employee_Vault/
├── Dashboard.md                    ← LOCAL ONLY writes here
├── Company_Handbook.md
├── Business_Goals.md
├── Needs_Action/
│   ├── email/
│   ├── whatsapp/
│   ├── social/
│   ├── accounting/
│   └── general/
├── In_Progress/
│   ├── cloud_agent/               ← Cloud claims tasks here
│   └── local_agent/               ← Local claims tasks here
├── Plans/
│   ├── email/
│   ├── social/
│   ├── accounting/
│   └── projects/
├── Pending_Approval/
│   ├── email/
│   ├── payments/
│   ├── social/
│   └── odoo/
├── Approved/
├── Rejected/
├── Done/
├── Updates/                        ← Cloud writes signals here
├── Briefings/
├── Accounting/
└── Logs/
```

## Setup Instructions

### Cloud VM Setup
1. Provision Oracle Cloud/AWS VM with appropriate specs
2. Install required software (Python, Node.js, npm, Git, Claude Code)
3. Install PM2 for process management
4. Set up vault sync via Git
5. Create proper environment variables file (.env_cloud)
6. Deploy all required services using PM2

### Local Machine Setup
1. Clone vault repository
2. Set up auto-pull cron job
3. Create local environment variables (.env_local)
4. Configure MCP servers for local execution

## Operational Flow

1. New tasks appear in `/Needs_Action/<domain>/`
2. Cloud or Local agent claims task via atomic move to `/In_Progress/<agent>/`
3. Agent processes task, creates Plan.md and/or Pending_Approval file
4. Cloud agent writes draft results to `/Pending_Approval/` (for human review)
5. Human moves file to `/Approved/` or `/Rejected/`
6. Local agent detects approved task and executes via MCP servers
7. Both agents log to `/Logs/` and update status as needed

## Health Monitoring

The system includes comprehensive health monitoring:
- PM2 process status checking every 5 minutes
- Odoo health endpoint verification
- Vault sync status verification
- Auto-restart of failed processes via PM2
- Health alerts written to vault for Local agent awareness
- Daily health reports generated automatically

## Testing Scenarios

### Main Platinum Scenario
1. Email arrives at 2:00 AM while Local machine is offline
2. Cloud Gmail watcher detects → Creates task file
3. Cloud orchestrator claims and processes → Drafts reply → Creates approval file
4. Vault sync pushes changes
5. User returns online, sees pending approval in Dashboard.md
6. User approves by moving file to `/Approved/`
7. Local orchestrator detects approval → Sends email via MCP
8. Task moved to `/Done/`, audit trail created

## Compliance Checks

- [ ] All sensitive data properly isolated from vault sync
- [ ] Draft/execution separation strictly enforced
- [ ] Claim-by-move protocol prevents double work
- [ ] Dashboard.md only updated by Local agent
- [ ] Health monitoring active and functional
- [ ] All Cloud operations are draft-only
- [ ] All sensitive operations require Local approval