# Tasks: Gold Tier — Autonomous Business Operator

## Phase 1: Infrastructure Setup

### Task 1.1: Odoo Community Setup
**Status**: Pending
**Owner**:
**Dependencies**:

**Acceptance Criteria**:
- [ ] Docker containers running: odoo17 and odoo-db both "Up"
- [ ] Odoo accessible at http://localhost:8069
- [ ] Database "ai_employee_erp" exists and is accessible
- [ ] API user "AI Employee API" can log in
- [ ] Test invoice created and deleted manually
- [ ] ODOO_API_KEY configured in .env

**Steps**:
1. Create isolated Docker network
2. Start PostgreSQL 15 container
3. Start Odoo 17 container
4. Access Odoo UI and create database
5. Enable developer mode and install modules
6. Create API user with proper permissions
7. Generate API key and store in .env
8. Test with manual invoice creation and deletion

**Test Cases**:
- TC1.1: Verify docker ps shows both containers running
- TC1.2: Verify Odoo UI loads at localhost:8069
- TC1.3: Verify API user can authenticate with key

### Task 1.2: Odoo MCP Server Implementation
**Status**: Pending
**Owner**:
**Dependencies**: Task 1.1

**Acceptance Criteria**:
- [ ] mcp_servers/odoo_mcp directory exists with proper package.json
- [ ] 4 MCP tools implemented: create_invoice, get_unpaid_invoices, upsert_customer, get_monthly_revenue
- [ ] DRY_RUN behavior works correctly for write operations
- [ ] Read-only operations bypass DRY_RUN
- [ ] Claude CLI can call Odoo MCP tools from vault
- [ ] No credentials appear in index.js code

**Steps**:
1. Create mcp_servers/odoo_mcp directory
2. Initialize npm package with xmlrpc and dotenv dependencies
3. Implement XML-RPC helper functions
4. Create authentication verification
5. Implement each MCP tool with proper guards
6. Add Claude Desktop config entry
7. Test with DRY_RUN=true and real operations

**Test Cases**:
- TC2.1: Dry-run invoice creation logs [DRY RUN] message
- TC2.2: get_unpaid_invoices returns empty array when none exist
- TC2.3: get_monthly_revenue returns total number

### Task 1.3: Error Recovery Infrastructure
**Status**: Pending
**Owner**:
**Dependencies**:

**Acceptance Criteria**:
- [ ] retry_handler.py exists with @with_retry decorator
- [ ] TransientError triggers retry with correct exponential backoff
- [ ] AuthenticationError does not retry, fails immediately
- [ ] watchdog.py monitors processes and restarts crashed ones
- [ ] Watchdog writes alert files to /Needs_Action/ when restarting

**Steps**:
1. Create retry_handler.py with TransientError and AuthenticationError
2. Implement @with_retry decorator with exponential backoff
3. Create classify_http_error helper
4. Create watchdog.py to monitor processes
5. Implement process restart and notification logic
6. Test with simulated failures

**Test Cases**:
- TC3.1: TransientError retries 3 times with increasing delays
- TC3.2: AuthenticationError fails immediately without retry
- TC3.3: Kill process manually, watchdog restarts it within 60 seconds

## Phase 2: Watcher Implementation

### Task 2.1: Finance Watcher Development
**Status**: Pending
**Owner**:
**Dependencies**: Task 1.3

**Acceptance Criteria**:
- [ ] FinanceWatcher extends BaseWatcher pattern from PDF Section 2A
- [ ] Reads bank CSV files from BANK_STATEMENTS_PATH
- [ ] Appends transactions to /Accounting/Current_Month.md
- [ ] Detects subscriptions using audit_logic.py patterns
- [ ] Creates subscription alerts in /Needs_Action/ for unused services
- [ ] Finance Watcher never executes payments (read only)

**Steps**:
1. Create watchers/finance_watcher.py extending BaseWatcher
2. Implement check_for_updates to find new CSV files
3. Create action files appending to Current_Month.md
4. Integrate with audit_logic.py for subscription detection
5. Create subscription alert files in /Needs_Action/
6. Test with sample CSV files

**Test Cases**:
- TC4.1: CSV file with "notion.so" creates FINANCE_subscription_*.md file
- TC4.2: Transactions appear in /Accounting/Current_Month.md with proper format
- TC4.3: Finance watcher does not process any payment-related actions

### Task 2.2: Social Media Poster Development
**Status**: Pending
**Owner**:
**Dependencies**: Task 1.3

**Acceptance Criteria**:
- [ ] facebook_poster.py processes /Social/Queue/ files with "facebook" in platforms
- [ ] instagram_poster.py requires business account and session file in .gitignore
- [ ] twitter_poster.py truncates content to 240 chars maximum
- [ ] All posters implement DRY_RUN check
- [ ] Maximum 3 posts per platform per day enforced
- [ ] Client names and financial data never appear in social posts

**Steps**:
1. Create facebook_poster.py with Meta Graph API integration
2. Create instagram_poster.py with instagrapi and business account
3. Create twitter_poster.py with tweepy and OAuth 1.0a
4. Implement platform-specific content extraction
5. Add DRY_RUN functionality to all posters
6. Test with actual API integration

**Test Cases**:
- TC5.1: POST file with platforms containing "facebook" triggers facebook_poster
- TC5.2: Instagram post with missing image_path logs error but doesn't fail silently
- TC5.3: Twitter content over 240 chars gets truncated at sentence boundary

## Phase 3: Core Systems

### Task 3.1: Ralph Wiggum Autonomous Loop
**Status**: Pending
**Owner**:
**Dependencies**:

**Acceptance Criteria**:
- [ ] MAX_LOOPS hard-coded to 10 (not from .env)
- [ ] Loop processes files until TASK_COMPLETE or 10 iterations
- [ ] Every iteration creates log entry in /Logs/ with loop_iteration field
- [ ] LOOP_BLOCKED pauses loop and sets task status to 'blocked'
- [ ] Completed tasks move to /Autonomous/Completed_Tasks/
- [ ] Loop never moves files to /Approved/ (humans only)

**Steps**:
1. Create autonomous_loop.py with hard-coded MAX_LOOPS=10
2. Implement task processing with status tracking
3. Add promise-based and file-movement completion strategies
4. Implement LOOP_BLOCKED handling
5. Add logging for each iteration
6. Test with multiple files to verify completion

**Test Cases**:
- TC6.1: Drop 3 files in /Needs_Action/ → loop processes all → TASK_COMPLETE → stops
- TC6.2: Loop reaches 10 iterations without TASK_COMPLETE → LOOP_MAX_EXCEEDED_*.md created
- TC6.3: Payment keyword in Claude output → LOOP_BLOCKED triggered

### Task 3.2: Accounting Audit System
**Status**: Pending
**Owner**:
**Dependencies**: Task 1.1, Task 1.2, Task 2.1

**Acceptance Criteria**:
- [ ] subscription_auditor.py runs weekly on Monday 9 AM
- [ ] Creates AUDIT_*.md files for subscriptions unused > 30 days
- [ ] Correct severity levels: RED (>60 days), YELLOW (>30 days)
- [ ] CEO briefings include all 8 required sections from PDF
- [ ] Briefings use real Odoo data, not hardcoded values
- [ ] If Odoo offline → error logged, briefing skipped

**Steps**:
1. Create subscription_auditor.py to read Subscriptions.md
2. Implement audit logic for unused services
3. Create CEO briefing generator with Odoo data integration
4. Implement all 8 briefing sections
5. Add Odoo offline error handling
6. Test with both online and offline Odoo scenarios

**Test Cases**:
- TC7.1: Subscriptions.md with service >30 days → AUDIT_*.md created in /Needs_Action/
- TC7.2: CEO briefing includes revenue data from Odoo MCP
- TC7.3: Odoo offline → BRIEFING_*.md not generated, error logged

## Phase 4: Skills & Integration

### Task 4.1: Agent Skill Development
**Status**: Pending
**Owner**:
**Dependencies**: All previous tasks

**Acceptance Criteria**:
- [ ] 11 total skills in .claude/skills/ (6 Silver + 5 Gold)
- [ ] odoo-connector skill handles invoice creation and customer updates
- [ ] social-broadcaster skill creates multi-platform POST files
- [ ] autonomous-loop skill manages Ralph Wiggum loop execution
- [ ] ceo-briefing skill generates complete weekly briefings
- [ ] accounting-auditor skill flags financial issues proactively

**Steps**:
1. Create odoo-connector/SKILL.md with invoice creation logic
2. Create social-broadcaster/SKILL.md for multi-platform posting
3. Create autonomous-loop/SKILL.md for loop management
4. Create ceo-briefing/SKILL.md for briefing generation
5. Create accounting-auditor/SKILL.md for financial auditing
6. Update all skills with proper trigger conditions

**Test Cases**:
- TC8.1: Trigger odoo-connector → creates invoice in Odoo (DRY_RUN mode)
- TC8.2: Trigger social-broadcaster → creates POST_*.md with 4 platform sections
- TC8.3: Trigger ceo-briefing → generates complete briefing file

### Task 4.2: PM2 & Task Scheduler Configuration
**Status**: Pending
**Owner**:
**Dependencies**: All previous tasks

**Acceptance Criteria**:
- [ ] PM2 shows exactly 9 processes online (4 Silver + 5 Gold)
- [ ] ecosystem.config.js properly configured with 9 apps
- [ ] 5 Windows Task Scheduler tasks exist and working
- [ ] AIEmployee_SocialBroadcast runs daily at 9:05 AM
- [ ] AIEmployee_SubAudit runs weekly on Monday at 9:00 AM
- [ ] All .env and credential files in .gitignore

**Steps**:
1. Update ecosystem.config.js with 9 processes (4 Silver + 5 Gold)
2. Configure proper logging paths for all processes
3. Create Windows Task Scheduler entries
4. Verify all 5 tasks exist with correct timing
5. Add sensitive files to .gitignore
6. Test process restart and persistence

**Test Cases**:
- TC9.1: pm2 status shows 9 processes all 'online'
- TC9.2: schtasks shows all 5 AIEmployee tasks
- TC9.3: ig_session.json and other credentials not tracked by Git

## Phase 5: Integration & Validation

### Task 5.1: End-to-End Testing
**Status**: Pending
**Owner**:
**Dependencies**: All previous tasks

**Acceptance Criteria**:
- [ ] WhatsApp "send me an invoice" → loop → LOOP_BLOCKED → approval → Odoo invoice → email
- [ ] All 12 PDF requirements verified working
- [ ] All 9 PM2 processes stay online during normal operation
- [ ] All 5 scheduled tasks execute correctly
- [ ] Complete audit trail in /Logs/ for all actions
- [ ] All security requirements satisfied

**Steps**:
1. Execute WhatsApp invoice flow end-to-end
2. Verify all PDF requirements working (2-12)
3. Monitor PM2 processes for stability
4. Verify all scheduled tasks run correctly
5. Validate log completeness and accuracy
6. Perform security review

**Test Cases**:
- TC10.1: Complete WhatsApp to invoice flow works seamlessly
- TC10.2: All 12 PDF requirements pass verification checklist
- TC10.3: System continues operating after individual component failures