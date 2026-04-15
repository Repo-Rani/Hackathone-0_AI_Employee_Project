# Implementation Plan: Gold Tier — Autonomous Business Operator

## 1. Project Scope & Dependencies

### In Scope
- Autonomous workflow processing with Ralph Wiggum Stop Hook loop
- Odoo ERP integration (create_invoice, get_unpaid_invoices, upsert_customer, get_monthly_revenue)
- Multi-platform social broadcasting (Facebook, Instagram, Twitter)
- CEO briefing generation and financial audit system
- Error recovery infrastructure (retry handler, watchdog)
- Agent skill framework with 5 new skills
- PM2 ecosystem and Task Scheduler configuration

### Out of Scope
- Front-end user interfaces beyond Obsidian vault
- Mobile application development
- Hardware integration

### External Dependencies
- **Odoo ERP**: Community Edition 17+, self-hosted at localhost:8069
- **MCP Servers**: Node.js v24+ for email and odoo integration
- **Social APIs**: Meta Graph API, Instagram API, Twitter API
- **Process Manager**: PM2 for 9-process orchestration
- **Scheduler**: Windows Task Scheduler for 5 automated tasks

## 2. Key Decisions & Rationale

### 2.1 Architecture Decisions
| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| Loop Mechanism | Promise-based \| File-movement | Promise-based | Simpler implementation, easier debugging |
| Odoo Protocol | XML-RPC \| JSON-RPC | XML-RPC | Native Odoo integration protocol |
| Social Authentication | OAuth 1.0a \| OAuth 2.0 | Varied by platform | Each platform uses its required auth method |
| Process Monitoring | PM2 only \| Watchdog \| Both | Both | PM2 handles crashes, Watchdog handles unresponsiveness |
| Error Retry | Fixed delay \| Exponential backoff | Exponential backoff | More resilient to temporary outages |

### 2.2 Security Decisions
| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| Payment Authorization | Automatic \| Human approval | Human approval | Financial security requirement |
| Loop Safety | Configurable \| Hard-coded limit | Hard-coded 10 iterations | Prevent infinite loops |
| Credential Storage | Environment files \| Database \| Memory | .env files | Standard security practice |
| Social Access | Personal account \| Business account | Business account | Instagram ToS requirement |

### 2.3 Operational Decisions
| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| Social Post Limit | Unlimited \| Per platform \| Combined | 3 per platform per day | Prevent spam, comply with platform limits |
| Subscription Audit | Manual \| Weekly \| Daily | Weekly Monday 9 AM | Balance between timeliness and performance |
| Briefing Schedule | Daily \| Weekly \| Monthly | Weekly Sunday 11 PM | Business cycle alignment |

## 3. Implementation Phases

### Phase 1: Infrastructure Setup (Steps 1-3)
**Duration**: 2-3 days
**Responsible**: Full-stack developer

#### 3.1 Odoo Installation & Configuration
- [ ] Set up Docker containers for Odoo and PostgreSQL
- [ ] Configure isolated network and persistent volumes
- [ ] Create database and enable required modules
- [ ] Create API user with proper permissions
- [ ] Generate and test API key

#### 3.2 Odoo MCP Server
- [ ] Create mcp_servers/odoo_mcp directory
- [ ] Implement XML-RPC integration with Odoo
- [ ] Create 4 tools: create_invoice, get_unpaid_invoices, upsert_customer, get_monthly_revenue
- [ ] Implement DRY_RUN support and approval guards
- [ ] Test integration with Claude Desktop config

#### 3.3 Error Recovery Infrastructure
- [ ] Create retry_handler.py with exponential backoff decorator
- [ ] Create watchdog.py with process monitoring
- [ ] Configure PM2 monitoring of watchdog process

### Phase 2: Watcher Implementation (Steps 4-8)
**Duration**: 4-5 days
**Responsible**: Python developer

#### 3.4 Finance Watcher
- [ ] Create finance_watcher.py extending BaseWatcher pattern
- [ ] Implement CSV parsing for bank transactions
- [ ] Integrate with audit_logic.py subscription detection
- [ ] Write transactions to /Accounting/Current_Month.md
- [ ] Create subscription alerts as /Needs_Action/ files

#### 3.5 Social Media Watchers
- [ ] Create facebook_poster.py with Graph API integration
- [ ] Create instagram_poster.py with instagrapi
- [ ] Create twitter_poster.py with tweepy and OAuth 1.0a
- [ ] Implement platform-specific validation and error handling

### Phase 3: Core Systems (Steps 9-11)
**Duration**: 3-4 days
**Responsible**: Full-stack developer

#### 3.6 Ralph Wiggum Autonomous Loop
- [ ] Create autonomous_loop.py with 10-iteration safety limit
- [ ] Implement promise-based and file-movement completion strategies
- [ ] Add loop iteration logging to /Logs/
- [ ] Implement LOOP_BLOCKED handling for sensitive actions

#### 3.7 Accounting Audit System
- [ ] Create subscription_auditor.py for weekly audits
- [ ] Implement subscription flagging by audit thresholds
- [ ] Create CEO briefing generator with Odoo data integration
- [ ] Generate complete briefing format with 8 required sections

### Phase 4: Skills & Integration (Steps 12-15)
**Duration**: 3-4 days
**Responsible**: Full-stack developer

#### 3.8 Agent Skills
- [ ] Create 5 new Gold Tier skills (odoo-connector, social-broadcaster, autonomous-loop, ceo-briefing, accounting-auditor)
- [ ] Update existing Silver skills if needed
- [ ] Implement skill trigger conditions and instructions

#### 3.9 Infrastructure & Testing
- [ ] Update PM2 ecosystem.config.js with 9 processes
- [ ] Configure Windows Task Scheduler with 5 tasks
- [ ] Complete end-to-end integration testing
- [ ] Verify all 12 PDF requirements are met

## 4. Interfaces & API Contracts

### 4.1 MCP Server Contracts
```
Odoo MCP Server API:
- create_invoice({partner_name, amount, description, due_date?})
  → {success, invoice_id?, dry_run}
- get_unpaid_invoices({})
  → {success, invoices: [{ name, partner_id, amount_total, invoice_date_due }]}
- upsert_customer({name, email, phone?, company?})
  → {success, partner_id, action: "created" | "updated"}
- get_monthly_revenue({month, year})
  → {success, total, invoices: [...]}

Guards: DRY_RUN check for write operations, approval requirement
```

### 4.2 File Format Contracts
```
/Social/Queue/*.md:
- YAML frontmatter: platforms, scheduled_for, status, auto_approved
- Sections: ## LinkedIn Version, ## Facebook Version, ## Instagram Version, ## Twitter Version

/Briefings/Weekly/CEO_Briefing_{date}.md:
- YAML frontmatter: type, generated, period, week, status
- Required sections: Executive Summary, Revenue Dashboard, Unpaid Invoices, etc.

/Autonomous/Active_Tasks/*.json:
- Required fields: name, created, prompt, completion_promise, max_loops, status
```

## 5. Non-Functional Requirements

### 5.1 Performance
- **p95 latency**: CEO briefings generated within 30 seconds
- **Throughput**: Process 10+ files per autonomous loop iteration
- **Resource caps**: Each process under 200MB memory usage

### 5.2 Reliability
- **SLOs**: 99.5% uptime for all 9 processes
- **Error budgets**: Allow 0.5% monthly errors for graceful degradation
- **Degradation strategy**: Continue operation when individual services fail

### 5.3 Security
- **Authentication**: API keys per service, refresh procedures
- **Data handling**: Financial data never in social posts
- **Secrets management**: Credentials in .env only, not in code/md files
- **Auditing**: All actions logged with approval status

### 5.4 Cost
- **Unit economics**: $50/month hosting cost for 9 processes
- **Platform costs**: Social API costs, potential Odoo hosting costs

## 6. Data Management

### 6.1 Source of Truth
- **Odoo ERP**: Invoice, customer, and revenue data
- **Vault**: User interactions, plans, and approval status
- **Social platforms**: Published content status

### 6.2 Schema Evolution & Migration
- **Backward compatibility**: Maintain existing Silver file formats
- **Migration strategy**: Automated migration scripts for format changes
- **Data retention**: 90-day log retention as per audit requirements

## 7. Operational Readiness

### 7.1 Observability
- **Logs**: Structured JSON logs in /Logs/YYYY-MM-DD.json with action_type field
- **Metrics**: Process health via PM2 and watchdog
- **Traces**: Loop iteration tracking with step-by-step logging

### 7.2 Alerting
- **Thresholds**: Process restarts >3 times per hour, loop failures
- **On-call owners**: System administrators for infrastructure issues
- **Runbooks**: Common task procedures and troubleshooting guides

### 7.3 Deployment & Rollback
- **Rolling updates**: Zero-downtime deployment via PM2
- **Feature flags**: DRY_RUN mode for safe testing
- **Compatibility**: Backward compatibility with Silver Tier

## 8. Risk Analysis

### 8.1 Top 3 Risks
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Payment automation bypass | High | Low | Hard-coded payment blocking in autonomous loop |
| Odoo ERP downtime | Medium | Medium | Graceful degradation: skip briefings, queue operations |
| Social API rate limits | Medium | Medium | Exponential backoff, batch scheduling |

### 8.2 Blast Radius & Guardrails
- **Payment guardrails**: No automatic payments regardless of amount
- **Loop guardrails**: 10-iteration hard limit, sensitive action blocking
- **Data guardrails**: Financial data never in social posts

## 9. Evaluation & Validation

### 9.1 Definition of Done
- **Tests**: All 15 specification steps implemented and tested
- **Scans**: Security scan passes, no credential leaks
- **Safety**: All PDF requirements verified and working
- **Documentation**: All skills documented in .claude/skills/

### 9.2 Output Validation
- **Format requirements**: All file formats match specification exactly
- **Content requirements**: All required fields present and correctly formatted
- **Safety requirements**: No violations of Company_Handbook.md rules