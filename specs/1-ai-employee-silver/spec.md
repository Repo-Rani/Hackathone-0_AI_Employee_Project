# Feature Specification: Silver Tier Personal AI Employee

**Feature Branch**: `1-ai-employee-silver`
**Created**: 2026-02-26
**Status**: Draft
**Input**: User description: "Build Silver Tier Personal AI Employee with Claude CLI - A Windows-based AI assistant that monitors Gmail/WhatsApp, processes actions through Claude, implements HITL approval workflow, includes email MCP server, LinkedIn auto-posting, and process management"

## Clarifications

### Session 2026-02-26

- Q: What authentication mechanisms should be used for external services like Gmail and WhatsApp? → A: OAuth 2.0 for Gmail API and session-based auth for WhatsApp with encrypted credential storage
- Q: What are the performance and uptime requirements for the system? → A: Process files within 5 minutes of detection and maintain 99% uptime
- Q: What are the data retention requirements for logs and business data? → A: 90-day retention for logs, permanent for business-critical data
- Q: How should the system handle and retry failed operations? → A: Retry failed operations 3 times with exponential backoff, then escalate to human
- Q: What level of logging and monitoring is required for audit and operational purposes? → A: Log all actions with timestamps, performance metrics, and error tracking for audit compliance

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Gmail Notification Processing (Priority: P1)

A business owner receives important emails in Gmail and wants the AI employee to automatically detect these emails, create action items, and propose responses without immediately sending them. The system should monitor Gmail every 2 minutes for important/unread emails, create markdown files in a "Needs Action" folder, and allow the owner to review before approval.

**Why this priority**: Critical communication functionality - most business-critical emails will come through Gmail, and having an AI assistant process them immediately provides immediate value.

**Independent Test**: Can be fully tested by setting up Gmail API access, sending test emails marked as important, and verifying that EMAIL_*.md files are created in the Needs_Action folder with proper YAML frontmatter and content.

**Acceptance Scenarios**:

1. **Given** important unread email exists in Gmail, **When** 2 minutes pass and the Gmail Watcher runs, **Then** a new EMAIL_{msg_id}.md file is created in the Needs_Action folder with complete email details and frontmatter
2. **Given** email already processed from previous run, **When** Gmail Watcher runs again, **Then** same email is not processed again

---

### User Story 2 - WhatsApp Message Monitoring (Priority: P2)

A business owner receives important WhatsApp messages with keywords like "urgent", "asap", "invoice", "payment", and wants the AI employee to automatically detect these messages, create action items, and propose responses without immediately sending them. The system should monitor WhatsApp Web every 30 seconds for keyword-matched unread messages.

**Why this priority**: Critical for real-time business communication - WhatsApp is often used for urgent business communications that need immediate attention.

**Independent Test**: Can be fully tested by setting up WhatsApp Web session, sending test messages with keywords, and verifying that WA_*.md files are created in the Needs_Action folder with proper YAML frontmatter and content.

**Acceptance Scenarios**:

1. **Given** unread WhatsApp message exists with keywords like "urgent" or "invoice", **When** 30 seconds pass and the WhatsApp Watcher runs, **Then** a new WA_{timestamp}.md file is created in the Needs_Action folder with keywords detected
2. **Given** same WhatsApp message already processed, **When** WhatsApp Watcher runs again, **Then** same message is not processed again

---

### User Story 3 - Claude AI Processing & Planning (Priority: P3)

A business owner wants Claude to automatically process all files in the "Needs Action" folder, create structured plans, identify sensitive actions that require human approval, and update the dashboard. This enables the AI to handle routine tasks while flagging important decisions for human review.

**Why this priority**: This is the core AI reasoning engine that connects all input sources (email, WhatsApp) to the approval and execution workflow.

**Independent Test**: Can be fully tested by placing test files in Needs_Action folder and running Claude with the specified command to verify PLAN_*.md files are created with proper analysis and approval markings.

**Acceptance Scenarios**:

1. **Given** EMAIL_*.md file exists in Needs_Action folder, **When** Claude processes the folder, **Then** PLAN_EMAIL_*.md file is created with complete analysis and action steps
2. **Given** action involves payment or external communication, **When** Claude analyzes the situation, **Then** plan marks sensitive steps as REQUIRES_APPROVAL and creates approval request file
3. **Given** all files processed, **When** Claude completes processing, **Then** dashboard is updated and TASK_COMPLETE is output

---

### User Story 4 - Human-in-the-Loop Approval System (Priority: P4)

A business owner wants to review and approve sensitive actions (like sending emails to new contacts, processing payments) before execution. The system should create approval requests, allow the owner to move files to approved/rejected folders, and execute actions only after human approval.

**Why this priority**: Critical safety system to prevent AI from executing irreversible business actions without human oversight.

**Independent Test**: Can be fully tested by running the Orchestrator script and moving files between Pending_Approval, Approved, Rejected, and Done folders to verify execution logic works properly.

**Acceptance Scenarios**:

1. **Given** file exists in Pending_Approval folder, **When** owner moves it to Approved folder, **Then** associated action is executed and file is moved to Done folder
2. **Given** file exists in Approved folder with 24-hour expiry, **When** 24 hours pass, **Then** file is moved to Rejected folder and not executed
3. **Given** DRY_RUN=true, **When** approved action executes, **Then** only logs are generated without actual execution

---

### User Story 5 - LinkedIn Auto-Posting (Priority: P5)

A business owner wants professional LinkedIn posts generated from business activity and scheduled for publication. Claude should create posts from business goals and completed tasks, and the system should publish them at scheduled times while respecting daily limits.

**Why this priority**: Important for business presence but not critical for core AI employee functionality - can be built after core communication functions work.

**Independent Test**: Can be fully tested by creating post files in Social/Queue folder with scheduled_for timestamps and verifying they're moved to Posted folder at the right time with DRY_RUN logs.

**Acceptance Scenarios**:

1. **Given** post exists in Social/Queue with future scheduled_for time, **When** current time reaches scheduled time, **Then** post is published (or DRY_RUN log generated) and moved to Posted folder
2. **Given** daily posting limit reached, **When** additional posts are scheduled, **Then** they are not published until next day or are rejected appropriately

---

### User Story 6 - Auto-Start and Process Management (Priority: P6)

A business owner wants all AI employee services to run continuously and restart automatically after crashes or system restarts. The system should use PM2 for process management and Windows Task Scheduler for scheduled tasks.

**Why this priority**: Critical for reliability - the AI employee must be always available to monitor communications.

**Independent Test**: Can be fully tested by starting PM2 processes and verifying they remain alive, and by testing Windows Task Scheduler for daily/weekly tasks.

**Acceptance Scenarios**:

1. **Given** system restarts, **When** auto-start executes, **Then** all watcher processes start automatically
2. **Given** process crashes, **When** crash detection occurs, **Then** PM2 automatically restarts the process
3. **Given** scheduled time for daily briefing, **When** Windows Task Scheduler triggers, **Then** Claude executes the briefing command

---

### Edge Cases

- What happens when Gmail API rate limits are exceeded?
- How does the system handle expired approval requests?
- What happens when LinkedIn posting limit is reached?
- How does system handle network connectivity issues?
- What if the Claude CLI is not accessible or returns errors?
- How does the system handle malformed YAML frontmatter in action files?

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST monitor Gmail for important/unread emails every 2 minutes
- **FR-002**: System MUST create EMAIL_{msg_id}.md files in Needs_Action folder when important emails are detected
- **FR-003**: System MUST monitor WhatsApp Web for keyword-matched unread messages every 30 seconds
- **FR-004**: System MUST create WA_{timestamp}.md files in Needs_Action folder when keyword messages are detected
- **FR-005**: System MUST use Claude CLI to process all files in Needs_Action folder with provided command
- **FR-006**: System MUST create PLAN_*.md files in Plans folder with structured analysis for each input file
- **FR-007**: System MUST create approval requests in Pending_Approval folder for sensitive actions
- **FR-008**: System MUST use Orchestrator to execute approved actions and log all activities
- **FR-009**: System MUST update Dashboard.md with recent activity for all completed actions
- **FR-010**: System MUST implement DRY_RUN capability that logs actions without executing them
- **FR-011**: System MUST use Email MCP Server to send emails only after human approval
- **FR-012**: System MUST respect rate limits for email sending (MAX_EMAILS_PER_HOUR)
- **FR-013**: System MUST handle expired approval requests and move them to Rejected folder
- **FR-014**: System MUST generate professional LinkedIn posts from business activity data
- **FR-015**: System MUST publish scheduled LinkedIn posts respecting daily limits (MAX_LINKEDIN_POSTS_PER_DAY)
- **FR-016**: System MUST run all watchers and orchestrator continuously using PM2 with auto-restart on crash
- **FR-017**: System MUST execute scheduled tasks (daily/weekly briefings) using Windows Task Scheduler
- **FR-018**: System MUST store all audit logs in JSON format in Logs folder
- **FR-019**: System MUST implement proper security by storing sensitive data in .env file that's not committed
- **FR-020**: System MUST implement 6 Claude CLI skills for email triage, WhatsApp handling, plan generation, LinkedIn posting, HITL management, and dashboard updates
- **FR-021**: System MUST implement OAuth 2.0 for Gmail API and session-based authentication for WhatsApp with encrypted credential storage
- **FR-022**: System MUST process files within 5 minutes of detection and maintain 99% uptime
- **FR-023**: System MUST retain log files for 90 days and store business-critical data permanently
- **FR-024**: System MUST retry failed operations 3 times with exponential backoff before escalating to human intervention
- **FR-025**: System MUST log all actions with timestamps, performance metrics, and error tracking for audit compliance

### Key Entities *(include if feature involves data)*

- **Email Action File**: Represents an important email detected by the system, containing sender, subject, content, and processing status
- **WhatsApp Action File**: Represents a keyword-matched WhatsApp message with detected keywords and content
- **Plan File**: Contains structured analysis and action steps for processing an input file, with approval requirements
- **Approval Request File**: Contains details of an action requiring human approval with expiration time and action type
- **Audit Log Entry**: Contains timestamped record of all executed actions with status and details
- **LinkedIn Post File**: Contains professionally written content for scheduled social media publishing
- **Business Goal**: Represents business objectives, targets, and metrics for the AI employee to reference
- **Dashboard Entry**: Contains summary of business metrics, pending approvals, and recent activity
- **Retry Queue Entry**: Contains failed operations with retry count and escalation status

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: Users can receive email notifications processed by AI within 2 minutes of arrival in Gmail
- **SC-002**: Users can receive WhatsApp message notifications processed by AI within 30 seconds of detection
- **SC-003**: System processes 95% of email and WhatsApp inputs without errors within 5 minutes of detection
- **SC-004**: All sensitive actions requiring approval are properly flagged and do not execute without human approval
- **SC-005**: System maintains 99% uptime with automatic restart of crashed processes
- **SC-006**: Users can approve/reject actions within 24-hour windows before they expire automatically
- **SC-007**: LinkedIn posts are published at scheduled times with 95% success rate
- **SC-008**: All actions are logged for auditability and compliance requirements
- **SC-009**: Daily and weekly scheduled tasks execute successfully 100% of the time
- **SC-010**: System handles up to 10 emails per hour and 5 LinkedIn posts per day without rate limit issues
- **SC-011**: Failed operations are retried up to 3 times with exponential backoff before human escalation
- **SC-012**: System retains logs for 90 days and maintains permanent records of business-critical data