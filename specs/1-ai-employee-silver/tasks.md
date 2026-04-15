# Silver Tier Personal AI Employee - Implementation Tasks

## Feature Overview
**Feature**: Personal AI Employee - Silver Tier - Functional Assistant
**Tech Stack**: Windows 11, Claude CLI, Speckit Plus, Python 3.13, Node.js v24+
**Priority Order**: Based on User Stories from spec.md
**Dependencies**: Bronze Tier complete, Claude CLI with Speckit Plus, Python 3.13+, Node.js v24+

---

## USER STORY PRIORITY ORDER
1. **US1-P1**: Gmail Notification Processing (Critical)
2. **US2-P2**: WhatsApp Message Monitoring (High)
3. **US3-P3**: Claude AI Processing & Planning (High)
4. **US4-P4**: Human-in-the-Loop Approval System (Critical)
5. **US5-P5**: LinkedIn Auto-Posting (Medium)
6. **US6-P6**: Auto-Start and Process Management (Critical)

---

## PHASE 1: SETUP TASKS
> Goal: Project structure and environment ready

- [X] T001 Create project directory structure: C:\Users\YourName\AI_Employee_Project
- [X] T002 Create .gitignore with sensitive file patterns (.env, credentials, session data)
- [X] T003 Create .env file with all required environment variables from spec
- [X] T004 Create all vault directories from Silver Tier spec (Needs_Action, Plans, Pending_Approval, Approved, Rejected, Done, Logs, Accounting, Social/Queue, Social/Posted, .claude/skills/*)
- [ ] T005 [P] Install Python dependencies: google-auth, google-auth-oauthlib, google-auth-httplib2, google-api-python-client, playwright, watchdog, python-dotenv, requests
- [ ] T006 [P] Install Node.js dependencies: pm2, pm2-windows-startup globally
- [X] T007 Create Business_Goals.md with real business metrics and targets
- [X] T008 Update Company_Handbook.md with Silver Tier rules per spec

---

## PHASE 2: FOUNDATIONAL TASKS
> Goal: Core infrastructure components ready (blocking for all user stories)

- [ ] T009 [P] Set up Google Cloud Project for Gmail API access
- [ ] T010 [P] Create Gmail API OAuth credentials and download credentials.json
- [ ] T011 [P] Create WhatsApp session directory and configure for Playwright
- [ ] T012 [P] Set up Gmail API OAuth flow for token refresh in gmail_token.json
- [ ] T013 [P] Set up WhatsApp Web QR authentication flow with persistent session
- [ ] T014 [P] Install and configure Playwright Chromium browser for WhatsApp
- [ ] T015 [P] Test environment variables with load_dotenv functionality
- [ ] T016 [P] Validate all vault directories exist and are writable

---

## PHASE 3: USER STORY 1 - GMAIL NOTIFICATION PROCESSING [US1]
> Goal: Gmail monitored every 2 minutes, EMAIL_*.md files created automatically

- [X] T017 [US1] Write gmail_watcher.py with OAuth flow and Gmail API integration
- [X] T018 [US1] Implement 2-minute polling logic with duplicate prevention in Gmail watcher
- [X] T019 [US1] Create EMAIL_*.md files with complete YAML frontmatter in Needs_Action folder
- [X] T020 [US1] Validate Gmail watcher handles OAuth token refresh automatically
- [ ] T021 [US1] Test Gmail watcher with important/unread email detection
- [X] T022 [US1] Verify duplicate email prevention mechanism works correctly

---

## PHASE 4: USER STORY 2 - WHATSAPP MESSAGE MONITORING [US2]
> Goal: WhatsApp keyword messages trigger WA_*.md files in /Needs_Action/

- [X] T023 [US2] Write whatsapp_watcher.py with Playwright and WhatsApp Web integration
- [X] T024 [US2] Implement 30-second polling for unread messages with keyword matching
- [X] T025 [US2] Create WA_*.md files with keywords_matched field in Needs_Action folder
- [X] T026 [US2] Implement duplicate message prevention using seen_messages set
- [ ] T027 [US2] Test WhatsApp watcher with keyword-matched message detection
- [X] T028 [US2] Verify keywords list configuration: urgent, asap, invoice, payment, help, deadline, please, project

---

## PHASE 5: USER STORY 3 - CLAUDE AI PROCESSING & PLANNING [US3]
> Goal: Claude processes all files and creates structured plans

- [ ] T029 [US3] Implement Claude CLI command that processes all files in Needs_Action folder
- [ ] T030 [US3] Create PLAN_*.md files with complete structure per spec format
- [ ] T031 [US3] Implement sender type detection: known_client, new_contact, vendor, unknown
- [ ] T032 [US3] Implement urgency classification: high, medium, low based on content
- [ ] T033 [US3] Mark sensitive actions with REQUIRES_APPROVAL flag
- [ ] T034 [US3] Create approval request files in Pending_Approval folder for sensitive actions
- [ ] T035 [US3] Update Dashboard.md with recent activity entries
- [ ] T036 [US3] Verify TASK_COMPLETE output when all files processed

---

## PHASE 6: USER STORY 4 - HITL APPROVAL SYSTEM [US4]
> Goal: Create approval workflow for sensitive actions

- [X] T037 [US4] Write orchestrator.py to monitor Approved folder for files
- [X] T038 [US4] Implement execution of approved actions with DRY_RUN capability
- [X] T039 [US4] Create audit log entries in Logs/YYYY-MM-DD.json for executed actions
- [X] T040 [US4] Implement 24-hour expiry check for approval requests
- [X] T041 [US4] Move expired files to Rejected folder automatically
- [X] T042 [US4] Move processed files to Done folder after execution
- [ ] T043 [US4] Test full approval workflow: Pending_Approval → Approved → Done
- [X] T044 [US4] Validate DRY_RUN mode logs actions without executing them

---

## PHASE 7: USER STORY 5 - EMAIL MCP SERVER [US5]
> Goal: Email MCP server for executing email actions after approval

- [X] T045 [US5] Setup email MCP server project in mcp_servers/email_mcp
- [X] T046 [US5] Install nodemailer and dotenv dependencies for email MCP
- [X] T047 [US5] Implement JSON-RPC server for Claude CLI MCP protocol
- [X] T048 [US5] Create send_email tool with rate limiting functionality
- [X] T049 [US5] Configure DRY_RUN mode for email MCP server
- [ ] T050 [US5] Integrate email MCP server with Claude CLI configuration
- [ ] T051 [US5] Test email MCP server with orchestrator integration
- [ ] T052 [US5] Validate email rate limits (MAX_EMAILS_PER_HOUR) work correctly

---

## PHASE 8: USER STORY 6 - LINKEDIN AUTO-POSTING [US6]
> Goal: Professional LinkedIn posts generated and scheduled for publication

- [X] T053 [US6] Write linkedin_poster.py with scheduled posting functionality
- [X] T054 [US6] Implement 5-minute polling for scheduled posts in Social/Queue
- [X] T055 [US6] Publish posts at scheduled_for time with DRY_RUN capability
- [X] T056 [US6] Move published posts to Social/Posted folder automatically
- [X] T057 [US6] Implement daily posting limit enforcement (MAX_LINKEDIN_POSTS_PER_DAY)
- [ ] T058 [US6] Create Claude command to generate LinkedIn posts from business activity
- [ ] T059 [US6] Test LinkedIn post generation with Business_Goals.md and Done folder
- [ ] T060 [US6] Validate proper hashtag inclusion (3-5 hashtags per post)

---

## PHASE 9: USER STORY 7 - AGENT SKILLS [US7]
> Goal: Implement all 6 Claude agent skills for Silver Tier functionality

- [X] T061 [US7] Create email-triage SKILL.md with complete email processing instructions
- [X] T062 [US7] Create whatsapp-handler SKILL.md with WhatsApp message handling instructions
- [X] T063 [US7] Create plan-generator SKILL.md with generic plan generation instructions
- [X] T064 [US7] Create linkedin-poster SKILL.md with LinkedIn post generation instructions
- [X] T065 [US7] Create hitl-manager SKILL.md with approval request management instructions
- [X] T066 [US7] Create dashboard-updater SKILL.md with dashboard update instructions
- [ ] T067 [US7] Test all 6 agent skills with Claude CLI integration
- [ ] T068 [US7] Validate agent skills trigger correctly based on file types and keywords

---

## PHASE 10: USER STORY 8 - PROCESS MANAGEMENT [US8]
> Goal: All services run continuously with auto-restart capability

- [X] T069 [US8] Create PM2 ecosystem.config.js with all 3 service configurations
- [X] T070 [US8] Configure PM2 to run gmail_watcher, whatsapp_watcher, and orchestrator
- [ ] T071 [US8] Enable PM2 auto-start on Windows boot with pm2-startup install
- [ ] T072 [US8] Test PM2 crash recovery with auto-restart functionality
- [ ] T073 [US8] Validate all 3 processes show "online" status in PM2
- [ ] T074 [US8] Test computer restart to verify auto-start functionality

---

## PHASE 11: USER STORY 9 - TASK SCHEDULER [US9]
> Goal: Scheduled tasks for daily/weekly briefings and LinkedIn queue check

- [ ] T075 [US9] Register Windows Task Scheduler for daily briefing (8 AM)
- [ ] T076 [US9] Register Windows Task Scheduler for weekly CEO briefing (Sunday 11 PM)
- [ ] T077 [US9] Register Windows Task Scheduler for LinkedIn queue check (daily 9 AM)
- [ ] T078 [US9] Test manual execution of all scheduled tasks
- [ ] T079 [US9] Validate scheduled tasks update Dashboard.md correctly
- [ ] T080 [US9] Verify LinkedIn poster runs via scheduled task

---

## PHASE 12: POLISH & CROSS-CUTTING CONCERNS
> Goal: Complete the implementation with testing and documentation

- [X] T081 Update Dashboard.md template with required sections per spec
- [X] T082 Create comprehensive README.md with setup and usage instructions
- [ ] T083 Test full end-to-end workflow with invoice request scenario
- [ ] T084 Validate all security measures: DRY_RUN=true, credential isolation, approval workflow
- [ ] T085 Test error handling and edge cases from spec
- [ ] T086 Create demo video showing all Silver Tier features
- [ ] T087 Final security audit to ensure no credentials committed to git
- [ ] T088 Submit project to hackathon with required deliverables

---

## IMPLEMENTATION STRATEGY

### MVP SCOPE (Minimum Viable Product)
- User Story 1 (Gmail) and User Story 4 (HITL) completed
- Basic Claude processing of email files
- Approval workflow for sensitive actions
- DRY_RUN mode enabled for safety

### INDEPENDENT TEST CRITERIA
- **US1**: Send important email → verify EMAIL_*.md file created within 2 minutes
- **US2**: Send keyword WhatsApp message → verify WA_*.md file created within 30 seconds
- **US3**: Place file in Needs_Action → verify PLAN_*.md created with proper structure
- **US4**: Approve file → verify action executes and logs in JSON file
- **US5**: Email MCP server calls → verify emails sent after approval
- **US6**: LinkedIn post scheduled → verify post published at scheduled time
- **US7**: Agent skill triggered → verify skill executes with proper instructions
- **US8**: Process crashes → verify PM2 auto-restarts the process
- **US9**: Scheduled time reached → verify task executes automatically

### PARALLEL EXECUTION OPPORTUNITIES
- [P] Tasks can run in parallel if they work on different components/files
- Gmail and WhatsApp watchers can be developed simultaneously
- Agent skills can be created in parallel after foundational setup
- MCP server and orchestrator can be developed in parallel

### DEPENDENCY GRAPH
```
Setup Phase → Foundational Phase → US1/Gmail, US2/WhatsApp (in parallel) → US3/Claude → US4/HITL → US5/MCP, US6/LinkedIn (in parallel) → US7/Skills, US8/PM2, US9/Scheduler (in parallel) → Polish
```

### CROSS-CUTTING CONCERNS
- Security: DRY_RUN mode, credential isolation, approval workflow
- Observability: Comprehensive logging to JSON files, Dashboard.md updates
- Reliability: Rate limiting, error handling, auto-restart functionality
- Scalability: Configurable parameters for limits and intervals