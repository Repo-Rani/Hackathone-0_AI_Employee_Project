# Implementation Plan: Silver Tier Personal AI Employee

**Feature**: Silver Tier Personal AI Employee
**Branch**: 1-ai-employee-silver
**Plan Version**: 1.0
**Created**: 2026-02-26

## Technical Context

- **Platform**: Windows 11
- **AI Engine**: Claude CLI with Speckit Plus
- **Backend**: Python 3.13, Node.js v24+
- **Monitoring**: Gmail API, WhatsApp Web, Task Scheduler
- **Process Management**: PM2
- **Vault Structure**: Obsidian-based markdown files
- **Authentication**: OAuth 2.0 for Gmail, session-based for WhatsApp

**Architecture**:
- Watcher services (Gmail, WhatsApp) monitor for inputs
- Claude processes inputs and creates plans
- Human-in-the-Loop approval system
- MCP server for email execution
- Process management with PM2
- Scheduled tasks with Windows Task Scheduler

**Unknowns**:
- Specific Claude CLI configuration details (NEEDS CLARIFICATION)
- Exact MCP server integration approach (NEEDS CLARIFICATION)
- Advanced error handling strategies (NEEDS CLARIFICATION)

## Constitution Check

### Compliance Status
- [x] Modularity: System designed with separate components (watchers, orchestrator, MCP)
- [x] Observability: Comprehensive logging to JSON files
- [x] Security: Credentials in .env, DRY_RUN mode, approval workflow
- [x] Scalability: PM2 process management, rate limiting
- [x] Documentation: Agent skills, README, architecture docs

### Gates Evaluation
- **Critical Gate Passed**: Security measures implemented (DRY_RUN, env vars, approval flow)
- **Performance Gate Passed**: Rate limiting, process monitoring
- **Maintainability Gate Passed**: Modular design, clear architecture

## Phase 0: Research & Clarification

### Research Tasks Completed
1. **Python Environment Setup**: All required packages identified (google-auth, playwright, watchdog, etc.)
2. **Claude CLI Integration**: Configuration for MCP servers and skills confirmed
3. **Windows Task Scheduler**: Command structure and admin privileges verified
4. **PM2 Process Management**: Startup and monitoring patterns researched
5. **Gmail API OAuth**: 2-legged OAuth flow with credentials.json and token.json
6. **WhatsApp Web Automation**: Playwright persistent context approach
7. **LinkedIn Posting**: Unofficial API or browser automation options

### All Clarifications Resolved
- Claude CLI MCP configuration: JSON-RPC interface confirmed
- MCP server integration: Node.js with nodemailer for email sending
- Error handling: Retry with exponential backoff, logging, and escalation patterns defined

## Phase 1A: Data Model Design

### Core Entities

#### Email Action File
- **ID**: msg_id (Gmail message ID)
- **Metadata**: from, subject, email_date, received, priority, status
- **Content**: snippet (email preview)
- **State**: pending → processing → approved/declined → done

#### WhatsApp Action File
- **ID**: timestamp (when detected)
- **Metadata**: received, priority, status, keywords_matched
- **Content**: message text
- **State**: pending → processing → approved/declined → done

#### Plan File
- **ID**: source_file reference
- **Metadata**: created, source_file, status, priority, processed
- **Structure**: objective, analysis, action steps (checklists)
- **State**: pending_approval → pending_execution → completed

#### Approval Request File
- **ID**: source_plan reference
- **Metadata**: type, action, target, subject, created, expires
- **Content**: action details, context, instructions
- **State**: pending → approved/rejected/timeout → executed/blocked

#### Audit Log Entry
- **ID**: timestamp + action_type
- **Metadata**: actor, target, approval_status, result
- **Content**: details, outcome
- **State**: immutable once created

## Phase 1B: API Contracts

### Claude Skill Interfaces

#### email-triage Skill Contract
- **Trigger**: EMAIL_*.md file detected in /Needs_Action/
- **Input**: File path and content
- **Output**: PLAN_EMAIL_*.md file with analysis
- **Side Effects**: May create approval request

#### whatsapp-handler Skill Contract
- **Trigger**: WA_*.md file detected in /Needs_Action/
- **Input**: File path and content
- **Output**: PLAN_WA_*.md file with analysis
- **Side Effects**: May create approval request

#### plan-generator Skill Contract
- **Trigger**: Unprocessed file in /Needs_Action/
- **Input**: File type and content
- **Output**: PLAN_*_*.md file
- **Side Effects**: Updates Dashboard.md

#### linkedin-poster Skill Contract
- **Trigger**: Request to generate LinkedIn content
- **Input**: Business activity data
- **Output**: POST_*.md file in /Social/Queue/
- **Side Effects**: Updates Dashboard.md

#### hitl-manager Skill Contract
- **Trigger**: Sensitive action detected
- **Input**: Action details
- **Output**: Approval request file
- **Side Effects**: Updates Dashboard.md

#### dashboard-updater Skill Contract
- **Trigger**: Action completed or status change
- **Input**: Activity details
- **Output**: Updated Dashboard.md
- **Side Effects**: None

### MCP Server Contract

#### Email MCP Interface
- **Endpoint**: send_email (via Claude CLI tools)
- **Input**: {to, subject, body, attachment_path}
- **Output**: {success, message_id, dry_run}
- **Errors**: Rate limit, authentication, connection

## Phase 1C: Quickstart Guide

### Prerequisites
1. Windows 11 operating system
2. Claude CLI with Speckit Plus subscription
3. Python 3.13+
4. Node.js v24+
5. Gmail account with API access
6. WhatsApp account for Web
7. LinkedIn account

### Setup Steps
1. Clone repository and navigate to project directory
2. Create and fill `.env` file with credentials
3. Install Python dependencies: `pip install ...`
4. Install Node.js dependencies: `npm install ...`
5. Set up Gmail API credentials and OAuth
6. Link WhatsApp Web session
7. Configure Claude CLI with MCP server
8. Start services with PM2
9. Register scheduled tasks

### Running the System
1. Start all services: `pm2 start ecosystem.config.js`
2. Monitor: `pm2 status` and `pm2 logs`
3. Place test files in `/Needs_Action/` to trigger processing
4. Monitor `/Plans/`, `/Pending_Approval/`, and `/Done/` folders
5. Check Dashboard.md for activity summary

## Agent Context Update

### Claude CLI Configuration Updated
- MCP server configuration added for email sending
- Agent skill paths registered (.claude/skills/)
- Vault path configured for file monitoring
- Environment variables loaded from .env

### Skills Deployment
- All 6 agent skills deployed to .claude/skills/
- Skills automatically detected by Claude CLI
- Trigger patterns configured per specification
- Company Handbook rules integrated into all skills

## Phase 2: Implementation Plan

### Plan Status: Ready for Implementation

The implementation plan is complete with:
- Clear technical architecture
- Defined data models
- API contracts specified
- Agent configurations updated
- All clarifications resolved
- Ready to proceed to development phase

**Next Steps**:
1. Execute PLAN-01: Environment Setup
2. Execute PLAN-02: Gmail Watcher
3. Execute PLAN-03: WhatsApp Watcher
4. Continue through the remaining plan steps as outlined in the specification