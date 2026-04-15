# Gold Tier Constitution - Personal AI Employee

## Core Principles

### I. Autonomous Business Operator (Gold Tier)
The system operates as a semi-autonomous business operator that processes multi-step workflows end-to-end using the Ralph Wiggum Stop Hook loop. The AI can run accounting (Odoo), broadcast on social platforms, generate CEO briefings, audit subscriptions, and handle error recovery with minimal human intervention. Human approval is still required for sensitive operations like payments, new client invoices over $500, and bulk communications. The system must respect the MAX_AUTONOMOUS_LOOPS=10 safety limit and output appropriate completion signals (TASK_COMPLETE, BRIEFING_COMPLETE, LOOP_BLOCKED).

### II. Human-in-the-Loop (HITL) Approval in Autonomous Context
All sensitive actions must flow through human-in-the-loop approval even within autonomous loops. Payment actions are ALWAYS blocked inside loops with LOOP_BLOCKED output. Invoice creation for new clients or amounts over $500 requires approval. The system creates approval requests in Pending_Approval/ folder and continues processing other tasks while waiting for human approval. Inside autonomous loops, sensitive actions must create approval files and output LOOP_BLOCKED rather than failing.

### III. Extended Agent Skills Architecture
All AI functionality must be implemented as agent skills following the Speckit Plus framework. The system now uses 11 total skills: 6 Silver retained (email-triage, whatsapp-handler, plan-generator, linkedin-poster, hitl-manager, dashboard-updater) and 5 new Gold skills (odoo-connector, social-broadcaster, autonomous-loop, ceo-briefing, accounting-auditor). Each skill must have proper YAML frontmatter, follow the defined structure, and implement appropriate error handling. The skills enable cross-domain integration between personal and business operations.

### IV. Enhanced Watcher System Architecture
The system uses specialized watchers for monitoring different channels. All Gold Tier watchers (finance_watcher, facebook_poster, instagram_poster, twitter_poster, subscription_auditor) must follow the BaseWatcher pattern from the PDF Section 2A. Each watcher outputs only .md files to /Needs_Action/ folder, includes proper YAML frontmatter, maintains processed items to avoid duplicates, and has its own log file. Finance Watcher must download bank transactions, write to /Accounting/Current_Month.md, and use audit_logic.py patterns.

### V. Extended Obsidian Vault Integration
The system uses a local Obsidian vault with expanded folder structure to support Gold Tier operations. The vault now includes additional folders: ERP/ (Invoices/, Customers/, Payments/), Briefings/ (Weekly/, Monthly/), Social/ (Facebook/, Instagram/, Twitter/), Autonomous/ (Active_Tasks/, Completed_Tasks/), and Accounting/ (Subscriptions.md, Receivables.md). The system must maintain existing Silver Tier structure while extending with Gold Tier folders and file formats as specified.

### VI. Enhanced Security Requirements
The system implements comprehensive security measures including all Silver requirements plus: ODOO_API_KEY always in .env (never in code), Odoo server localhost:8069 only (never internet-facing), Facebook long-lived tokens (60 days), Instagram Business account only (not personal), Twitter API keys in .env, MAX_AUTONOMOUS_LOOPS=10 hard-coded (no .env override), instagrapi session files in .gitignore, Odoo MCP config in .gitignore, and payment blocking inside loops. All financial data must be secured appropriately.

### VII. Ralph Wiggum Autonomous Loop
The system implements the Ralph Wiggum Stop Hook loop for autonomous workflow execution. The loop processes files from /Needs_Action/, executes multi-step tasks, and continues until TASK_COMPLETE is output or the 10-iteration safety limit is reached. Promise-based completion requires Claude to output `<promise>TASK_COMPLETE</promise>` when done. File-movement strategy detects when files move to /Done/. The system logs every iteration to /Logs/YYYY-MM-DD.json and updates /Autonomous/Active_Tasks/ status on crashes.

### VIII. Odoo ERP Integration
The system integrates with Odoo Community Edition (localhost:8069) via JSON-RPC MCP server for business operations. Key operations: create_invoice (with approval for new clients/$500+), get_unpaid_invoices, upsert_customer, get_monthly_revenue. ODOO_API_KEY in .env only. Invoice creation for known clients under $500 auto-approved; over $500 requires approval. Payment recording never auto-executed (manual in Odoo). Confirmation files in /ERP/Invoices/ or /ERP/Customers/. DRY_RUN support required.

### IX. Multi-Platform Social Integration
The system broadcasts across LinkedIn, Facebook, Instagram, and Twitter with platform-optimized content. Every post file must have platforms: field (linkedin, facebook, instagram, twitter). Content optimized per platform: LinkedIn (150-300 words, B2B), Twitter (<240 chars, punchy), Facebook (100-250 words, conversational), Instagram (2200 chars max, visual first). Maximum 3 posts per platform per day. Client names and financial data never in posts. DRY_RUN support required.

### X. Error Recovery & Graceful Degradation
The system implements comprehensive error handling with classification (Transient, Authentication, Logic, Data, System) and recovery strategies. Transient errors retry with exponential backoff (base 1s, max 60s, 3 attempts). Authentication errors alert humans and pause operations. Logic errors route to /Needs_Action/ with type: review_required. System errors use watchdog.py to restart processes. Graceful degradation: Gmail API queues emails, Odoo offline skips briefings, vault locked writes to temp. Payment retries never automatic.

### XI. CEO Briefing & Audit System
The system generates weekly CEO briefings every Sunday 11 PM with real Odoo data. Briefings include: Executive Summary, Revenue Dashboard (from Odoo), Unpaid Invoices (from get_unpaid_invoices), Subscription Audit, Completed Tasks, Bottlenecks, Proactive Suggestions, Red Flags, Top 3 Priorities. Saved to /Briefings/Weekly/CEO_Briefing_{YYYY-MM-DD}.md with BRIEFING_COMPLETE output. Must use real Odoo data, never approximations. Briefings save to vault only, never auto-sent.

## Technical Implementation

### MCP Server Extensions
The system extends the MCP server architecture with Odoo MCP server alongside the existing email-mcp. Odoo MCP provides: create_invoice (with DRY_RUN and approval guard), get_unpaid_invoices (read-only), upsert_customer (with DRY_RUN and approval guard), get_monthly_revenue (read-only). Both servers must be callable from Claude with proper authentication and safety guards.

### Process Management & Monitoring
PM2 now manages 9 processes (4 Silver + 5 Gold): gmail_watcher, whatsapp_watcher, orchestrator, linkedin_poster (Silver) plus facebook_poster, instagram_poster, twitter_poster, autonomous_loop, watchdog (Gold). All processes have autorestart and max_restarts settings. The watchdog process monitors all 9 processes and restarts them if they die, with human notification capability.

### Task Scheduler Integration
Windows Task Scheduler manages 5 tasks: 3 Silver (DailyBriefing, WeeklyBriefing, LinkedIn) plus 2 Gold (SocialBroadcast daily 9:05 AM, SubAudit weekly Monday 9 AM). Tasks must be created with proper paths and settings. SocialBroadcast creates multi-platform posts. SubAudit runs subscription_auditor.py. All tasks follow Windows PowerShell /schtasks format.

## File Format Standards

### Autonomous Task Format
/Autonomous/Active_Tasks/*.json files must follow the Ralph Wiggum schema:
- name, created timestamp, prompt, completion_promise, max_loops (10), loop_count, status, created_by
- Completion strategies: promise-based or file-movement detection
- Loop safety: respect MAX_LOOPS=10 hard limit

### Multi-Platform Social Format
/Social/Queue/*.md files must include:
- YAML frontmatter: type: social_post, platforms, scheduled_for, status, auto_approved, image_path
- Separate sections: LinkedIn Version, Facebook Version, Instagram Version, Twitter Version
- Platform-specific optimization requirements

### CEO Briefing Format
/Briefings/Weekly/CEO_Briefing_{date}.md must include:
- YAML frontmatter: type, generated, period, week, status
- All required sections: Executive Summary, Revenue Dashboard (from Odoo), Unpaid Invoices, Subscription Audit, Completed Tasks, Bottlenecks, Suggestions, Red Flags, Priorities

### Extended Log Format
/Logs/YYYY-MM-DD.json includes new Gold action types:
- odoo_invoice_create, odoo_customer_upsert, autonomous_loop_step, ceo_briefing_generate, social_broadcast, subscription_audit, finance_watcher, retry_attempt, watchdog_restart
- Loop iteration and retry attempt tracking
- Approval status (approved, auto, dry_run)

## Governance & Compliance

The Gold Tier Constitution extends the Silver Tier governance with autonomous operation requirements. All implementations must comply with the Ralph Wiggum loop safety limits, Odoo API security requirements, multi-platform social posting constraints, and comprehensive audit logging. The system must implement all 12 PDF requirements with proper error recovery and graceful degradation. Weekly oversight includes dashboard review, log verification, and security checks. Monthly reviews include full audit trail examination and credential validation.

**Version**: 2.0 | **Ratified**: 2026-01-08 | **Implementation**: Complete PDF Requirements 2-12