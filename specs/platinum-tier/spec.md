# Feature Specification: Platinum Tier — Always-On Cloud + Local Executive

## 1. Overview

The Platinum Tier transforms the Gold Tier system into a **production-grade, cloud-local hybrid AI Employee** that runs 24/7 without direct human intervention. The system operates with two specialized agents: a Cloud Agent that runs continuously to draft, analyze, and queue actions, and a Local Agent that serves as the decision-maker, executing sensitive operations.

The AI Employee at Platinum Tier can:
- Run on Cloud VM 24/7 with auto-restart capabilities
- Coordinate between Cloud and Local agents via shared Obsidian Vault
- Implement strict security boundaries (secrets never sync)
- Execute draft-only operations on Cloud, execution-only on Local
- Provide comprehensive health monitoring and alerting
- Maintain proper vault sync infrastructure with claim-by-move protocol

## 2. User Scenarios & Testing

### Scenario 1: Cloud-Local Coordination
- **Actor**: Email arrives at 2:00 AM while Local machine is offline
- **Flow**: Cloud Gmail watcher detects → Drafts reply → Creates approval file → Local reviews and executes upon return online

### Scenario 2: Cloud Draft-Only Operations
- **Actor**: Subscription audit triggers on Cloud
- **Flow**: Cloud detects unused subscription → Drafts alert in vault → Local reviews → Takes action if needed

### Scenario 3: Odoo Draft vs Execution Separation
- **Actor**: Cloud detects need for invoice creation
- **Flow**: Cloud creates draft invoice in Odoo → Creates approval file in vault → Local approves → Executes posting/payment

### Scenario 4: Health Monitoring
- **Actor**: Process failure occurs
- **Flow**: Health monitor detects issue → Auto-restarts via PM2 → Writes alert to vault → Local agent can see status

## 3. Functional Requirements

### 3.1 Cloud Agent Operations
- **FR-1.1**: Cloud agent must run 24/7 on Cloud VM with auto-restart capabilities
- **FR-1.2**: Cloud agent must only draft, analyze, and queue actions (never execute sensitive operations)
- **FR-1.3**: Cloud agent must write only to designated folders: /Needs_Action/, /Plans/, /Pending_Approval/, /Updates/
- **FR-1.4**: Cloud agent must implement claim-by-move protocol to prevent double work

### 3.2 Local Agent Operations
- **FR-2.1**: Local agent must handle all sensitive operations (WhatsApp, payments, email sending)
- **FR-2.2**: Local agent must be the only writer to Dashboard.md
- **FR-2.3**: Local agent must execute MCP actions that touch external systems
- **FR-2.4**: Local agent must hold sensitive credentials (WhatsApp session, banking credentials, payment tokens)

### 3.3 Vault Sync Infrastructure
- **FR-3.1**: System must implement Git-based vault sync between Cloud and Local
- **FR-3.2**: System must enforce .gitignore to prevent secrets from being synced
- **FR-3.3**: System must allow sync of designated folders only (No .env, secrets/, whatsapp_session/, tokens)
- **FR-3.4**: System must implement auto-sync after every agent write operation

### 3.4 Claim-by-Move Protocol
- **FR-4.1**: System must implement claim-by-move protocol to prevent double work
- **FR-4.2**: First agent to move item from /Needs_Action/<domain>/ to /In_Progress/<agent>/ owns the task
- **FR-4.3**: Other agent must ignore already-claimed tasks
- **FR-4.4**: Protocol must work with Git/Syncthing sync to ensure consistent coordination

### 3.5 Odoo Integration with Draft/Execution Separation
- **FR-5.1**: Cloud agent must create draft invoices only (no posting)
- **FR-5.2**: Local agent must post invoices only after human approval
- **FR-5.3**: Cloud agent must create draft expenses only
- **FR-5.4**: Local agent must register payments only

### 3.6 Health Monitoring
- **FR-6.1**: System must monitor PM2 processes and auto-restart if needed
- **FR-6.2**: System must check Odoo health status regularly
- **FR-6.3**: System must verify vault sync is working within 30 minutes
- **FR-6.4**: System must write health alerts to vault for Local agent awareness

### 3.7 Security Boundaries
- **FR-7.1**: System must ensure secrets never sync between Cloud and Local
- **FR-7.2**: Cloud VM must never have access to WhatsApp session
- **FR-7.3**: Cloud VM must never have access to banking credentials
- **FR-7.4**: All sensitive tokens must be stored locally only

## 4. Success Criteria

### 4.1 Performance Metrics
- 100% uptime for Cloud agents with auto-restart capabilities
- Vault sync completed within 5 minutes of changes
- Health checks performed every 5 minutes
- Claim-by-move protocol prevents double work 100% of the time

### 4.2 Quality Metrics
- 0 sensitive operations executed by Cloud agent
- 100% of secrets properly excluded from vault sync
- All draft/execution separation properly enforced
- All audit logs properly maintained with agent attribution

### 4.3 Business Outcomes
- Reduce manual operations by 80% through 24/7 Cloud monitoring
- Maintain 100% security compliance with no data leaks
- Achieve seamless Cloud/Local coordination with no conflicts
- Maintain 99% availability of business operations

## 5. Key Entities

### 5.1 Data Entities
- **Vault Files**: Markdown files coordinated between Cloud and Local agents
- **Approval Requests**: Files requiring human review before execution
- **Health Reports**: System status and monitoring data
- **Audit Logs**: Attributed records of agent actions

### 5.2 Process Entities
- **Cloud Agent**: Always-on processing engine for drafting and analysis
- **Local Agent**: Execution engine for sensitive operations
- **Vault Sync**: Git/Syncthing synchronization mechanism
- **Health Monitor**: System monitoring and alerting engine

## 6. Dependencies & Assumptions

### 6.1 Dependencies
- Oracle Cloud or AWS VM for Cloud deployment
- PM2 for process management and auto-restart
- Git for vault synchronization
- Odoo Community Edition 19+ for ERP integration
- Claude Code for Cloud agent processing
- Obsidian for vault management

### 6.2 Assumptions
- Gold Tier components are fully functional and verified
- Network connectivity for Cloud VM
- Proper API credentials configured per environment
- Vault directory structure follows Platinum Tier specification

## 7. Scope & Boundaries

### 7.1 In Scope
- Cloud VM deployment and setup
- Cloud/Local agent coordination via vault
- Vault sync infrastructure with security boundaries
- Health monitoring and alerting system
- Draft/execution separation for sensitive operations
- Claim-by-move protocol implementation

### 7.2 Out of Scope
- Front-end user interfaces beyond Obsidian vault
- Mobile application development
- Direct customer service beyond automated processing
- Hardware integration beyond standard systems