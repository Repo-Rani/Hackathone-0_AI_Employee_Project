# Implementation Plan: Platinum Tier — Always-On Cloud + Local Executive

## 1. Architecture & Design Decisions

### 1.1 Cloud vs Local Agent Separation
**Decision**: Implement strict separation between Cloud Agent (draft-only) and Local Agent (execution-only)
- **Rationale**: Security and operational efficiency - Cloud runs 24/7 to monitor and draft, Local handles sensitive operations
- **Trade-offs**:
  - Pros: 24/7 monitoring, proper security boundaries, fault tolerance
  - Cons: More complex coordination required, additional infrastructure cost
- **Options Considered**:
  - Single agent with conditional logic (rejected - doesn't meet 24/7 requirement)
  - Full feature parity between agents (rejected - violates security principles)

### 1.2 Vault-Based Communication
**Decision**: Use shared Obsidian Vault as the sole communication channel between agents
- **Rationale**: Simple, auditable, file-based coordination with human-in-the-loop
- **Trade-offs**:
  - Pros: Natural audit trail, simple synchronization, human review integration
  - Cons: Potential sync delays, coordination complexity
- **Options Considered**:
  - Direct agent-to-agent communication (rejected - adds complexity, harder to audit)

### 1.3 Git vs Syncthing for Vault Sync
**Decision**: Implement Git as primary vault sync method with Syncthing as alternative
- **Rationale**: Git provides version control, audit trail, and familiar workflow
- **Trade-offs**:
  - Git: More complex setup, potential merge conflicts, version control overhead
  - Syncthing: Real-time sync, simpler setup, but less audit capability
- **Options Considered**:
  - Cloud storage (Dropbox, Google Drive) (rejected - less control, potential security concerns)

## 2. Implementation Approach

### 2.1 Phased Rollout Strategy
The implementation will follow a phased approach to minimize risk:

**Phase 1**: Infrastructure setup and vault sync
**Phase 2**: Cloud agent core functionality
**Phase 3**: Local agent integration and coordination
**Phase 4**: Health monitoring and security hardening
**Phase 5**: Testing and validation

### 2.2 Security-First Design
All components will be designed with security boundaries as the primary concern:
- Secrets never sync between environments
- Clear separation of draft vs execution operations
- Comprehensive audit logging for all operations

## 3. Technical Architecture

### 3.1 Directory Structure
Implement the complete Platinum Tier vault structure:
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
│   ├── cloud_agent/
│   └── local_agent/
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
├── Updates/
├── Briefings/
├── Accounting/
├── Logs/
└── .gitignore
```

### 3.2 Core Components

#### 3.2.1 Vault Sync Module
**Purpose**: Synchronize vault changes between Cloud and Local environments
**Implementation**: Git-based sync with automatic commit/push after each agent operation
**Interfaces**: CLI commands, environment variables for vault path

#### 3.2.2 Claim-Task Module
**Purpose**: Implement claim-by-move protocol to prevent double work
**Implementation**: Atomic file move operation with vault sync
**Interfaces**: Path-based task claiming with agent identification

#### 3.2.3 Cloud Orchestrator
**Purpose**: Main Cloud Agent process that scans and processes tasks
**Implementation**: Continuous loop that scans /Needs_Action/, claims tasks, processes them
**Interfaces**: File system, vault sync, claim-task module

#### 3.2.4 Health Monitor
**Purpose**: Monitor system health and restart failed processes
**Implementation**: Continuous loop checking PM2 processes, Odoo health, vault sync
**Interfaces**: PM2 API, HTTP health checks, vault writing for alerts

#### 3.2.5 Odoo MCP Server (Draft/Execution Split)
**Purpose**: Separate draft and execution operations in Odoo integration
**Implementation**: Clear method separation for Cloud (draft) vs Local (execution)
**Interfaces**: Odoo JSON-RPC API, environment-based behavior changes

## 4. Data Flow Design

### 4.1 Task Processing Flow
1. New task appears in /Needs_Action/<domain>/
2. Cloud or Local agent claims task via atomic move to /In_Progress/<agent>/
3. Agent processes task, creates Plan.md and/or Pending_Approval file
4. Cloud agent writes to /Pending_Approval/ (for human review)
5. Human moves file to /Approved/ or /Rejected/
6. Local agent detects approved task and executes
7. Both agents log to /Logs/ and update as needed

### 4.2 Security Flow
1. Environment variables properly separated (.env_cloud vs .env_local)
2. .gitignore prevents sensitive files from syncing
3. Draft-only operations on Cloud, execution-only on Local
4. All sensitive operations require human approval via vault file movement

## 5. Error Handling & Recovery

### 5.1 Process Failure Recovery
- PM2 auto-restart for all Cloud processes
- Health monitor detection and restart
- Vault sync retry mechanism
- Graceful degradation when components are unavailable

### 5.2 Sync Conflict Resolution
- Git conflict detection and resolution
- Claim-by-move protocol prevents double work
- Clear ownership rules for Dashboard.md
- Audit trail for all operations

## 6. Monitoring & Observability

### 6.1 Health Checks
- PM2 process status monitoring
- Odoo health endpoint checking
- Vault sync status verification
- Alerting via vault files for Local agent awareness

### 6.2 Operational Metrics
- Task processing rates
- System uptime
- Sync delay measurements
- Error rates and recovery times

## 7. Deployment Strategy

### 7.1 Cloud VM Setup
- Oracle Cloud Free Tier VM configuration
- PM2 process management setup
- Environment variable configuration
- Auto-start configuration for system reboots

### 7.2 Local Setup
- Vault clone and synchronization
- MCP server configuration
- Environment variable setup
- Coordination with Cloud agent

## 8. Risk Mitigation

### 8.1 Security Risks
- Risk: Accidental sync of sensitive data
  - Mitigation: Comprehensive .gitignore, environment separation, security scanning
- Risk: Cloud agent executing sensitive operations
  - Mitigation: Code-level restrictions, thorough testing, audit logging

### 8.2 Operational Risks
- Risk: Coordination failures between agents
  - Mitigation: Claim-by-move protocol, clear ownership rules, health monitoring
- Risk: Vault sync failures
  - Mitigation: Multiple sync methods, error detection, manual fallback procedures