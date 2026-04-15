# Research Document: Silver Tier Personal AI Employee

**Feature**: Silver Tier Personal AI Employee
**Date**: 2026-02-26

## Research Findings

### 1. Claude CLI MCP Server Integration

**Decision**: JSON-RPC 2.0 over stdin/stdout for MCP server communication

**Rationale**: Claude CLI uses MCP protocol which requires JSON-RPC communication over standard input/output streams. This allows Claude to call external tools like email servers while maintaining security and control.

**Alternatives Considered**:
- REST API: Would require network security considerations
- Direct library integration: Would break Claude's tool abstraction model
- WebSocket: Overly complex for this use case

### 2. Gmail API Authentication Approach

**Decision**: OAuth 2.0 with credentials.json and token.json files

**Rationale**: Most secure approach that doesn't require storing passwords. Token.json can be refreshed automatically, and credentials.json contains the OAuth client configuration.

**Alternatives Considered**:
- Service account: Requires GCP domain-wide delegation
- App passwords: Less secure than OAuth
- Browser automation: Unreliable and against Gmail ToS

### 3. WhatsApp Web Automation Strategy

**Decision**: Playwright with persistent browser context

**Rationale**: WhatsApp Web is the official way to access WhatsApp on desktop. Playwright's persistent context allows maintaining session across restarts while browser automation ensures compatibility with web interface changes.

**Alternatives Considered**:
- WhatsApp Business API: Requires business verification and approval
- Third-party libraries like yowsup: Unofficial, potentially violating ToS
- Mobile automation: Requires device connection, less reliable

### 4. Process Management Solution

**Decision**: PM2 for process management with Windows startup integration

**Rationale**: PM2 provides enterprise-grade process management with features like auto-restart, monitoring, and log management. It's specifically designed for Node.js and Python processes, and has Windows compatibility.

**Alternatives Considered**:
- Windows Services: More complex to set up and maintain
- Docker containers: Overkill for this desktop application
- Custom monitoring: Reinventing existing solutions

### 5. Task Scheduling Approach

**Decision**: Windows Task Scheduler for recurring tasks

**Rationale**: Native Windows solution that reliably executes scheduled tasks. Well-integrated with the operating system and provides proper logging and error handling.

**Alternatives Considered**:
- Python sched module: Would require keeping Python process running
- Node.js-based scheduler: Less reliable than OS-level scheduling
- Custom cron-like service: Would duplicate existing functionality

### 6. LinkedIn Posting Method

**Decision**: Browser automation with Playwright (unofficial API)

**Rationale**: LinkedIn doesn't provide a public API for posting. Browser automation is the most reliable method for posting content programmatically while respecting rate limits.

**Alternatives Considered**:
- Third-party LinkedIn automation tools: Additional cost and dependencies
- Manual publishing: Defeats automation purpose
- RSS feeds or external services: Less direct control

### 7. Human-in-the-Loop Workflow

**Decision**: File-based approval system with folder monitoring

**Rationale**: Simple, reliable, and transparent approach. Users can easily understand the workflow by looking at folder contents. No complex database or UI needed.

**Alternatives Considered**:
- Web dashboard: More complex to implement and maintain
- Email approvals: Would require additional email processing
- Mobile app: Overly complex for this use case

### 8. Data Storage Format

**Decision**: Markdown files with YAML frontmatter for structured data

**Rationale**: Human-readable, easily editable, and compatible with Obsidian vault. YAML frontmatter provides structured metadata while keeping content in readable format.

**Alternatives Considered**:
- JSON files: Less readable and harder to edit manually
- Database: Unnecessary complexity for this use case
- XML: More verbose than YAML

### 9. Security Implementation

**Decision**: Multi-layered security with DRY_RUN mode and approval workflow

**Rationale**: DRY_RUN prevents accidental execution during development. Approval workflow ensures no irreversible actions happen without human oversight. Credential isolation in .env file.

**Alternatives Considered**:
- Hardcoded limits only: Less flexible
- Manual-only execution: Defeats automation purpose
- Single approval point: Less granular control

### 10. Error Handling Strategy

**Decision**: Retry with exponential backoff and escalation to human

**Rationale**: Automatic retry handles temporary failures. Exponential backoff prevents overwhelming services. Human escalation ensures persistent issues are noticed.

**Alternatives Considered**:
- Fail immediately: Too aggressive, many failures are temporary
- Infinite retries: Could cause resource exhaustion
- Silent failure: Would not alert users to persistent issues