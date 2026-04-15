# Feature Specification: Gold Tier — Autonomous Business Operator

## 1. Overview

The Gold Tier transforms the Silver Tier proactive assistant into a **semi-autonomous business operator**. The system operates as a semi-autonomous business operator that processes multi-step workflows end-to-end using the **Ralph Wiggum Stop Hook loop** — the human only approves or rejects.

The AI Employee at Gold Tier can:
- Run the accounting system (create real invoices in Odoo Community Edition, update CRM, track monthly revenue)
- Broadcast across all social platforms (LinkedIn, Facebook, Instagram, Twitter/X)
- Work autonomously with the Ralph Wiggum Stop Hook loop
- Generate CEO Briefings every Sunday night
- Handle errors and recover gracefully
- Audit subscriptions and spending automatically
- Operate as Agent Skills

## 2. User Scenarios & Testing

### Scenario 1: Invoice Processing
- **Actor**: Client sends WhatsApp "send me an invoice for January work"
- **Flow**: WhatsApp watcher detects → Ralph Wiggum loop → LOOP_BLOCKED → Human approves → Odoo creates invoice → Email sent → Files moved to Done

### Scenario 2: Social Broadcasting
- **Actor**: Daily scheduler triggers social-broadcaster skill
- **Flow**: Reads Business_Goals.md → Creates multi-platform POST file → Each platform poster processes relevant sections

### Scenario 3: CEO Briefing Generation
- **Actor**: Weekly scheduler runs ceo-briefing skill on Sunday
- **Flow**: Reads Business_Goals.md, Accounting files, calls Odoo MCP → Generates Monday Morning Briefing

### Scenario 4: Subscription Audit
- **Actor**: Weekly scheduler runs accounting-auditor skill
- **Flow**: Checks Subscriptions.md → Flags unused subscriptions → Creates AUDIT files in /Needs_Action/

## 3. Functional Requirements

### 3.1 Autonomous Loop (Ralph Wiggum Stop Hook)
- **FR-1.1**: System must implement Ralph Wiggum Stop Hook loop with promise-based completion
- **FR-1.2**: Loop must have maximum 10 iterations hard-coded (not configurable)
- **FR-1.3**: Loop must pause on sensitive actions and output LOOP_BLOCKED signal
- **FR-1.4**: Loop must respect Company_Handbook.md rules inside the loop

### 3.2 Odoo ERP Integration
- **FR-2.1**: System must create invoices in Odoo via MCP server with create_invoice tool
- **FR-2.2**: System must retrieve unpaid invoices via get_unpaid_invoices tool
- **FR-2.3**: System must update customer records via upsert_customer tool
- **FR-2.4**: System must retrieve monthly revenue via get_monthly_revenue tool
- **FR-2.5**: Invoice creation must require approval for new clients or amounts $500+

### 3.3 Multi-Platform Social Broadcasting
- **FR-3.1**: System must create platform-optimized content for LinkedIn, Facebook, Instagram, Twitter
- **FR-3.2**: Facebook posts must not exceed character limits and handle rate limiting
- **FR-3.3**: Instagram posts must require image_path and use business account
- **FR-3.4**: Twitter posts must be under 240 characters
- **FR-3.5**: No client names or financial data in social posts

### 3.4 CEO Briefing Generation
- **FR-4.1**: System must generate weekly CEO briefings on Sundays
- **FR-4.2**: Briefing must include revenue dashboard from Odoo data
- **FR-4.3**: Briefing must include unpaid invoices from Odoo
- **FR-4.4**: Briefing must include subscription audit from Subscriptions.md
- **FR-4.5**: Briefing must include top 3 priorities for next week

### 3.5 Error Recovery & Graceful Degradation
- **FR-5.1**: System must implement exponential backoff for transient errors
- **FR-5.2**: Authentication errors must alert human and pause operations
- **FR-5.3**: Watchdog must detect crashed processes and restart them
- **FR-5.4**: System must gracefully degrade when components go offline

### 3.6 Finance Monitoring
- **FR-6.1**: Finance watcher must monitor bank transaction CSV files
- **FR-6.2**: System must flag subscription expenses using audit_logic.py
- **FR-6.3**: System must track expenses vs budget thresholds

## 4. Success Criteria

### 4.1 Performance Metrics
- 95% of autonomous tasks complete within 10 loop iterations
- Social posts scheduled within 5 minutes of target time
- CEO briefings generated every Sunday without manual intervention
- Error recovery within 60 seconds of failure detection

### 4.2 Quality Metrics
- 100% of invoice creations properly gated with approval when required
- 0 unauthorized payments executed by autonomous loop
- All financial data properly secured and not exposed in inappropriate channels
- All social content properly optimized per platform requirements

### 4.3 Business Outcomes
- Reduce manual business operations by 80%
- Maintain 100% compliance with approval requirements
- Achieve 95% accuracy in CEO briefing financial data
- Maintain subscription audit compliance with no more than 1 missed audit per month

## 5. Key Entities

### 5.1 Data Entities
- **Invoices**: Odoo invoice records with client, amount, status
- **Subscriptions**: Software cost tracking with usage patterns
- **Social Posts**: Multi-platform content with platform-specific sections
- **CEO Briefings**: Weekly business intelligence reports
- **Audit Records**: Financial compliance and oversight items

### 5.2 Process Entities
- **Ralph Wiggum Loop**: Autonomous workflow processing engine
- **MCP Servers**: Odoo and email integration servers
- **Watchers**: Gmail, WhatsApp, Finance, Social media monitors
- **Skills**: Agent skill framework for different capabilities

## 6. Dependencies & Assumptions

### 6.1 Dependencies
- Odoo Community Edition 17+ running locally
- Claude CLI with MCP server support
- Node.js v24+ for MCP servers
- PM2 for process management
- Windows Task Scheduler for scheduled tasks

### 6.2 Assumptions
- Silver Tier components are fully functional and verified
- Network connectivity for external services (social platforms, Odoo)
- Proper API credentials and permissions configured
- Vault directory structure follows specified format

## 7. Scope & Boundaries

### 7.1 In Scope
- Autonomous workflow processing with Ralph Wiggum loop
- Odoo ERP integration for invoicing and customer management
- Multi-platform social media broadcasting
- CEO briefing generation and financial audit
- Error recovery and process monitoring
- Agent skills architecture implementation

### 7.2 Out of Scope
- Front-end user interfaces beyond Obsidian vault
- Mobile application development
- Hardware integration beyond standard computer systems
- Direct customer service beyond invoice/communication automation