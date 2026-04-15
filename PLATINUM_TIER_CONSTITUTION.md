# 🏆 PLATINUM TIER CONSTITUTION
## Personal AI Employee — Always-On Cloud + Local Executive
### Building Autonomous FTEs in 2026 | Hackathon Upgrade Guide

> **Status**: Platinum Tier begins where Gold ends. You have completed Bronze → Silver → Gold.
> This document is your constitutional blueprint for the final level: a production-grade, cloud-local hybrid AI Employee that runs 24/7 without you.

---

## TABLE OF CONTENTS

1. [Platinum Overview & Philosophy](#1-platinum-overview--philosophy)
2. [Architecture: Cloud + Local Split](#2-architecture-cloud--local-split)
3. [Work-Zone Specialization Rules](#3-work-zone-specialization-rules)
4. [Vault Sync Infrastructure (Phase 1)](#4-vault-sync-infrastructure-phase-1)
5. [Folder Structure & Claim-by-Move Protocol](#5-folder-structure--claim-by-move-protocol)
6. [Cloud VM Setup (Oracle/AWS)](#6-cloud-vm-setup-oracleaws)
7. [Always-On Watcher Deployment](#7-always-on-watcher-deployment)
8. [Odoo Community Integration](#8-odoo-community-integration)
9. [Security: Secrets Never Sync](#9-security-secrets-never-sync)
10. [Health Monitoring & Watchdog System](#10-health-monitoring--watchdog-system)
11. [A2A Upgrade — Phase 2 (Optional)](#11-a2a-upgrade--phase-2-optional)
12. [Platinum Demo: Minimum Passing Gate](#12-platinum-demo-minimum-passing-gate)
13. [Checklist & Submission Guide](#13-checklist--submission-guide)

---

## 1. PLATINUM OVERVIEW & PHILOSOPHY

### What Makes Platinum Different from Gold?

| Feature | Gold Tier | Platinum Tier |
|---|---|---|
| Availability | Local machine only | Cloud 24/7 + Local hybrid |
| Email handling | Manual trigger or cron | Cloud always watching, drafts while you sleep |
| WhatsApp session | Local machine | Local ONLY (security boundary) |
| Payments/Banking | Local with HITL | Local with HITL + Cloud drafts for approval |
| Odoo | Integrated locally | Deployed on Cloud VM, 24/7 HTTPS |
| Vault sync | None | Git or Syncthing (real-time) |
| Agent coordination | Single agent | Two agents (Cloud + Local) coordinating via Vault |
| Social posting | Manual schedule | Cloud drafts → Local approves → Local posts |
| Fault tolerance | Basic watchdog | Full health monitoring + alerting |

### The Core Platinum Concept

> **Two specialized agents. One shared vault. Zero conflicts.**

- **Cloud Agent** → Always awake, always watching. Drafts everything. Acts on nothing sensitive.
- **Local Agent** → The decision-maker. Approves, executes, sends payments, manages WhatsApp.

They communicate exclusively through the shared Obsidian Vault — like two senior employees sharing a well-organized filing cabinet.

---

## 2. ARCHITECTURE: CLOUD + LOCAL SPLIT

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PLATINUM ARCHITECTURE                            │
└─────────────────────────────────────────────────────────────────────┘

   CLOUD VM (Oracle/AWS — 24/7)
   ┌──────────────────────────────────────────────────────┐
   │  PERCEPTION LAYER (always-on)                        │
   │  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │
   │  │ Gmail       │  │ LinkedIn     │  │ Finance    │  │
   │  │ Watcher     │  │ Watcher      │  │ Watcher    │  │
   │  └──────┬──────┘  └──────┬───────┘  └─────┬──────┘  │
   │         └────────────────┴────────────────┘         │
   │                          │                           │
   │                          ▼                           │
   │  REASONING (Cloud Claude Code)                       │
   │  Read → Draft → Write to Vault → Never Send Directly │
   │                          │                           │
   │                          ▼                           │
   │  OUTPUTS → /Pending_Approval/<domain>/               │
   │          → /Plans/<domain>/                          │
   │          → /Updates/  (signals to Local)             │
   └────────────────────────┬─────────────────────────────┘
                            │
                     [Git / Syncthing]
                    SYNCED VAULT ONLY
                    (no secrets, no tokens)
                            │
   LOCAL MACHINE (Your laptop/mini-PC)
   ┌────────────────────────▼─────────────────────────────┐
   │  OBSIDIAN VAULT (GUI + Memory)                       │
   │  Dashboard.md  │  Company_Handbook.md                │
   │  /Pending_Approval/  │  /Approved/  │  /Done/        │
   └────────────────────────┬─────────────────────────────┘
                            │
   LOCAL AGENT (Local Claude Code)
   ┌────────────────────────▼─────────────────────────────┐
   │  APPROVAL + EXECUTION LAYER                          │
   │  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │
   │  │ WhatsApp    │  │ Payments /   │  │ Final Send │  │
   │  │ Session     │  │ Banking      │  │ / Post     │  │
   │  └─────────────┘  └──────────────┘  └────────────┘  │
   │                                                      │
   │  MCP SERVERS (local only)                            │
   │  email-mcp │ browser-mcp │ odoo-mcp                  │
   └──────────────────────────────────────────────────────┘
```

---

## 3. WORK-ZONE SPECIALIZATION RULES

### 3.1 — What CLOUD Owns (Draft-Only Zone)

Cloud Agent has permission to **read, analyze, draft, and queue** — but NEVER to directly execute sensitive actions.

| Domain | Cloud Agent Action | Example |
|---|---|---|
| Email triage | Reads inbox, categorizes, drafts replies | Draft reply to client inquiry |
| Social media | Drafts LinkedIn/Twitter/Instagram posts | Writes Monday motivational post |
| Task planning | Creates Plan.md files | Breaks down project into sub-tasks |
| Business briefing | Generates CEO briefing markdown | Weekly revenue + bottleneck report |
| Odoo accounting | Drafts invoices, records expenses | Creates draft invoice for Client B |
| Subscription audit | Flags unused subscriptions | Notifies Local: "Notion unused 45 days" |

**Rule**: Cloud writes ONLY to these folders:
- `/Needs_Action/<domain>/`
- `/Plans/<domain>/`
- `/Pending_Approval/<domain>/`
- `/Updates/` (signals, not commands)

### 3.2 — What LOCAL Owns (Execution Zone)

Local Agent is the only one with real credentials for sensitive systems.

| Domain | Local Agent Action |
|---|---|
| WhatsApp | Full session access — read & send messages |
| Payments/Banking | Executes approved payments, never Cloud |
| Email sending | After Cloud drafts + human approves, Local sends |
| Social posting | After Cloud drafts + human approves, Local posts |
| Odoo posting | Posts invoices/payments only after Local approval |
| Dashboard.md | Single writer — only Local updates the main dashboard |

**Rule**: Local is the ONLY agent that:
1. Writes to `Dashboard.md`
2. Executes MCP actions that touch external systems
3. Holds WhatsApp session, banking credentials, payment tokens

### 3.3 — The Single-Writer Rule

```
Dashboard.md → LOCAL ONLY writes here.
Cloud writes to /Updates/<timestamp>.md
Local merges /Updates/ into Dashboard.md on sync.
```

This prevents merge conflicts and data corruption.

---

## 4. VAULT SYNC INFRASTRUCTURE (PHASE 1)

### 4.1 — What Gets Synced (Allowed)

```
✅ SYNC THESE:
/Needs_Action/
/Plans/
/Pending_Approval/
/Approved/
/Rejected/
/Done/
/Updates/
/Briefings/
/Logs/  (markdown logs only, not .json with tokens)
Dashboard.md
Company_Handbook.md
Business_Goals.md
```

### 4.2 — What NEVER Gets Synced (Blocked)

```
❌ NEVER SYNC THESE:
.env files
/secrets/
/whatsapp_session/
banking_credentials.*
*.token
*.key
/Vault/.gitignore must include all of the above
```

### 4.3 — Sync Method: Git (Recommended)

**Setup on Cloud VM:**

```bash
# On Cloud VM — initialize vault as Git repo
cd ~/AI_Employee_Vault
git init
git remote add origin https://github.com/YOUR_USERNAME/ai-employee-vault.git

# Create .gitignore FIRST before any commit
cat > .gitignore << 'EOF'
.env
*.env
secrets/
whatsapp_session/
*.token
*.key
*.pem
banking_credentials*
/Logs/*.json
EOF

git add .
git commit -m "Initial vault commit"
git push origin main
```

**Setup on Local Machine:**

```bash
# Clone vault to local
git clone https://github.com/YOUR_USERNAME/ai-employee-vault.git ~/AI_Employee_Vault

# Auto-pull every 5 minutes (cron)
*/5 * * * * cd ~/AI_Employee_Vault && git pull origin main >> ~/logs/vault_sync.log 2>&1
```

**Cloud Auto-Push after every agent write:**

```python
# vault_sync.py — call this after every agent file write
import subprocess
from pathlib import Path
import logging

def sync_vault_to_remote(vault_path: str, message: str = "Agent update"):
    try:
        result = subprocess.run(
            ['git', '-C', vault_path, 'add', '.'],
            capture_output=True, text=True
        )
        subprocess.run(
            ['git', '-C', vault_path, 'commit', '-m', message],
            capture_output=True, text=True
        )
        subprocess.run(
            ['git', '-C', vault_path, 'push', 'origin', 'main'],
            capture_output=True, text=True
        )
        logging.info(f"Vault synced: {message}")
    except Exception as e:
        logging.error(f"Vault sync failed: {e}")
        # Do NOT halt agent — queue retry
```

### 4.4 — Sync Method: Syncthing (Alternative)

Use Syncthing if you want real-time sync without GitHub dependency:

```bash
# Install on Ubuntu (Cloud VM)
sudo apt-get install syncthing

# Run as service
sudo systemctl enable syncthing@$USER
sudo systemctl start syncthing@$USER

# Access Syncthing UI at http://localhost:8384
# Share folder: ~/AI_Employee_Vault
# Add device: your local machine's Syncthing device ID

# CRITICAL: Set folder type to "Send Only" on Cloud
# Local machine: "Receive Only" for cloud-sourced folders
```

---

## 5. FOLDER STRUCTURE & CLAIM-BY-MOVE PROTOCOL

### 5.1 — Complete Platinum Vault Structure

```
AI_Employee_Vault/
│
├── Dashboard.md                    ← LOCAL ONLY writes here
├── Company_Handbook.md
├── Business_Goals.md
│
├── Needs_Action/
│   ├── email/
│   ├── whatsapp/
│   ├── social/
│   ├── accounting/
│   └── general/
│
├── In_Progress/
│   ├── cloud_agent/               ← Cloud claims tasks here
│   └── local_agent/               ← Local claims tasks here
│
├── Plans/
│   ├── email/
│   ├── social/
│   ├── accounting/
│   └── projects/
│
├── Pending_Approval/
│   ├── email/
│   ├── payments/
│   ├── social/
│   └── odoo/
│
├── Approved/
├── Rejected/
├── Done/
│
├── Updates/                        ← Cloud writes signals here
│   └── YYYY-MM-DD_HH-MM-SS.md
│
├── Briefings/
│   └── YYYY-MM-DD_Monday_Briefing.md
│
├── Accounting/
│   ├── Current_Month.md
│   ├── Subscriptions.md
│   └── Invoices/
│
├── Logs/
│   └── YYYY-MM-DD.md              ← Markdown only (no tokens)
│
└── .gitignore                     ← CRITICAL — keeps secrets out
```

### 5.2 — The Claim-by-Move Rule (Preventing Double Work)

This is the most important coordination mechanism between Cloud and Local agents.

**The Rule:**
> The first agent to **move** an item from `/Needs_Action/<domain>/` to `/In_Progress/<agent>/` becomes the owner. The other agent MUST ignore it.

**Implementation:**

```python
# claim_task.py — used by both Cloud and Local agents
import shutil
from pathlib import Path
import time

def claim_task(task_file: Path, agent_name: str, vault_path: Path) -> bool:
    """
    Attempt to claim a task. Returns True if claimed, False if already claimed.
    agent_name: 'cloud_agent' or 'local_agent'
    """
    in_progress_dir = vault_path / 'In_Progress' / agent_name
    in_progress_dir.mkdir(parents=True, exist_ok=True)

    claimed_file = in_progress_dir / task_file.name

    # Atomic move — if file already moved by other agent, this will fail
    try:
        shutil.move(str(task_file), str(claimed_file))
        # Sync vault immediately after claiming
        sync_vault_to_remote(str(vault_path), f"[{agent_name}] Claimed: {task_file.name}")
        return True
    except FileNotFoundError:
        # Already claimed by the other agent
        return False

# USAGE in orchestrator:
# if claim_task(task_file, 'cloud_agent', vault_path):
#     process_task(task_file)
# else:
#     logger.info(f"Task already claimed, skipping: {task_file.name}")
```

**Why this works:** Git/Syncthing syncs the move operation. Whichever agent's move gets pushed first wins. The other sees an empty source and skips.

---

## 6. CLOUD VM SETUP (ORACLE/AWS)

### 6.1 — Oracle Cloud Free Tier VM (Recommended)

Oracle Cloud offers Always Free VMs that are sufficient for the Platinum tier:

```bash
# Recommended spec (Oracle Free Tier):
# Shape: VM.Standard.A1.Flex (ARM) — 4 OCPUs, 24 GB RAM FREE
# OS: Ubuntu 22.04 LTS
# Storage: 200 GB boot volume (free)
# Network: 10 TB outbound/month (free)

# Initial VM setup after SSH:
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y python3.13 nodejs npm git curl

# Install PM2 for process management
sudo npm install -g pm2

# Install Claude Code
npm install -g @anthropic/claude-code

# Verify
claude --version
node --version
python3 --version
```

### 6.2 — Cloud Environment Setup

```bash
# Create dedicated user for AI Employee (security best practice)
sudo adduser ai_employee
sudo usermod -aG sudo ai_employee
su - ai_employee

# Clone vault
git clone https://github.com/YOUR_USERNAME/ai-employee-vault.git ~/AI_Employee_Vault

# Create Python UV project
cd ~/ai_employee_project
pip install uv
uv init
uv add watchdog playwright google-api-python-client requests python-dotenv

# Set up environment variables (NEVER in vault)
nano ~/.env_ai_employee
# Add:
# GMAIL_CLIENT_ID=...
# GMAIL_CLIENT_SECRET=...
# ANTHROPIC_API_KEY=...
# VAULT_PATH=/home/ai_employee/AI_Employee_Vault

# Source on login
echo "source ~/.env_ai_employee" >> ~/.bashrc
```

### 6.3 — PM2 Process Management on Cloud

```bash
# Start all Cloud watchers with PM2
pm2 start gmail_watcher.py --interpreter python3 --name "gmail-watcher"
pm2 start linkedin_watcher.py --interpreter python3 --name "linkedin-watcher"
pm2 start finance_watcher.py --interpreter python3 --name "finance-watcher"
pm2 start orchestrator.py --interpreter python3 --name "cloud-orchestrator"
pm2 start vault_sync.py --interpreter python3 --name "vault-sync"

# Save process list — survives reboots
pm2 save
pm2 startup  # Follow the printed command to enable on boot

# Monitor
pm2 status
pm2 logs gmail-watcher --lines 50
```

---

## 7. ALWAYS-ON WATCHER DEPLOYMENT

### 7.1 — Cloud Watcher Manifest

These watchers run on Cloud 24/7. They ONLY create files in the vault — they never send, post, or pay.

```python
# cloud_orchestrator.py — Master Cloud Process
import time
import logging
from pathlib import Path
from vault_sync import sync_vault_to_remote
from claim_task import claim_task

VAULT_PATH = Path(os.getenv('VAULT_PATH'))
AGENT_NAME = 'cloud_agent'

class CloudOrchestrator:
    def __init__(self):
        self.needs_action = VAULT_PATH / 'Needs_Action'
        self.logger = logging.getLogger('CloudOrchestrator')

    def scan_and_process(self):
        for domain_folder in self.needs_action.iterdir():
            if not domain_folder.is_dir():
                continue
            # Skip whatsapp — Cloud never touches it
            if domain_folder.name == 'whatsapp':
                continue

            for task_file in domain_folder.glob('*.md'):
                if claim_task(task_file, AGENT_NAME, VAULT_PATH):
                    self.process_task(task_file, domain_folder.name)

    def process_task(self, task_file: Path, domain: str):
        # Call Claude Code to reason about this task
        # Claude reads task, creates Plan.md and Pending_Approval file
        # Cloud NEVER sends/posts/pays — only drafts
        self.logger.info(f"[Cloud] Processing: {task_file.name} in {domain}")
        # ... Claude Code invocation here

    def run(self):
        while True:
            try:
                self.scan_and_process()
            except Exception as e:
                self.logger.error(f"Cloud orchestrator error: {e}")
            time.sleep(120)  # Check every 2 minutes
```

### 7.2 — Watcher Domains on Cloud

| Watcher | Check Interval | Output Folder |
|---|---|---|
| Gmail Watcher | 2 minutes | `/Needs_Action/email/` |
| LinkedIn Watcher | 30 minutes | `/Needs_Action/social/` |
| Finance/Bank Watcher | 1 hour | `/Needs_Action/accounting/` |
| Business Goals Audit | Sunday 11 PM | `/Needs_Action/general/` |
| Subscription Audit | 1st of month | `/Needs_Action/accounting/` |

---

## 8. ODOO COMMUNITY INTEGRATION

### 8.1 — Odoo on Cloud VM (24/7)

```bash
# Install Odoo 19 Community on Cloud VM
sudo apt-get install postgresql postgresql-client -y
sudo -u postgres createuser -s odoo
sudo -u postgres createdb odoo

# Install Odoo dependencies
sudo apt-get install -y python3-pip python3-dev libxml2-dev libxslt1-dev \
  libldap2-dev libsasl2-dev libtiff5-dev libjpeg8-dev zlib1g-dev \
  libfreetype6-dev liblcms2-dev libwebp-dev libharfbuzz-dev libfribidi-dev \
  libxcb1-dev libpq-dev

# Clone Odoo 19
git clone https://github.com/odoo/odoo.git --branch 19.0 --depth 1 ~/odoo19

# Setup Odoo config
sudo nano /etc/odoo.conf
```

```ini
# /etc/odoo.conf
[options]
admin_passwd = YOUR_MASTER_PASSWORD
db_host = localhost
db_port = 5432
db_user = odoo
db_password = YOUR_DB_PASSWORD
addons_path = /home/ai_employee/odoo19/addons
logfile = /var/log/odoo/odoo.log
xmlrpc_port = 8069
```

### 8.2 — HTTPS Setup for Odoo (Nginx + Let's Encrypt)

```bash
# Install Nginx
sudo apt-get install nginx certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Nginx config for Odoo
sudo nano /etc/nginx/sites-available/odoo
```

```nginx
# /etc/nginx/sites-available/odoo
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8069;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

### 8.3 — Odoo MCP Server (JSON-RPC Integration)

```python
# odoo_mcp.py — MCP server for Odoo 19 JSON-RPC API
import xmlrpc.client
import json
import os

class OdooMCPServer:
    """
    Odoo 19 External API integration via JSON-RPC.
    Cloud uses this for DRAFT actions only.
    Local uses this for POSTING/PAYMENT actions.
    """

    def __init__(self):
        self.url = os.getenv('ODOO_URL')          # e.g. https://your-domain.com
        self.db = os.getenv('ODOO_DB')
        self.username = os.getenv('ODOO_USERNAME')
        self.password = os.getenv('ODOO_PASSWORD')
        self.uid = None
        self._authenticate()

    def _authenticate(self):
        common = xmlrpc.client.ServerProxy(f'{self.url}/xmlrpc/2/common')
        self.uid = common.authenticate(self.db, self.username, self.password, {})
        self.models = xmlrpc.client.ServerProxy(f'{self.url}/xmlrpc/2/object')

    def _execute(self, model, method, *args, **kwargs):
        return self.models.execute_kw(
            self.db, self.uid, self.password,
            model, method, list(args), kwargs
        )

    # ── CLOUD AGENT ACTIONS (draft-only) ──────────────────────

    def create_draft_invoice(self, partner_name: str, amount: float,
                              description: str) -> dict:
        """Create invoice in DRAFT state — does NOT post/send."""
        partner_id = self._get_or_create_partner(partner_name)
        invoice_id = self._execute('account.move', 'create', {
            'move_type': 'out_invoice',
            'partner_id': partner_id,
            'state': 'draft',              # DRAFT ONLY
            'invoice_line_ids': [(0, 0, {
                'name': description,
                'quantity': 1,
                'price_unit': amount,
            })]
        })
        return {'invoice_id': invoice_id, 'status': 'draft', 'amount': amount}

    def create_draft_expense(self, name: str, amount: float,
                              category: str) -> dict:
        """Log expense in draft — requires Local approval to confirm."""
        expense_id = self._execute('hr.expense', 'create', {
            'name': name,
            'total_amount': amount,
            'product_id': self._get_expense_product(category),
        })
        return {'expense_id': expense_id, 'status': 'draft'}

    # ── LOCAL AGENT ACTIONS (post/payment — after approval) ───

    def post_invoice(self, invoice_id: int) -> dict:
        """Post (confirm) a draft invoice — LOCAL ONLY after human approval."""
        self._execute('account.move', 'action_post', [invoice_id])
        return {'invoice_id': invoice_id, 'status': 'posted'}

    def register_payment(self, invoice_id: int) -> dict:
        """Register payment against invoice — LOCAL ONLY."""
        payment_vals = self._execute(
            'account.move', 'action_register_payment', [invoice_id]
        )
        return {'status': 'payment_registered', 'invoice_id': invoice_id}

    def _get_or_create_partner(self, name: str) -> int:
        partners = self._execute('res.partner', 'search', [['name', '=', name]])
        if partners:
            return partners[0]
        return self._execute('res.partner', 'create', {'name': name})

    def _get_expense_product(self, category: str) -> int:
        products = self._execute('product.product', 'search',
                                 [['name', 'ilike', category]])
        return products[0] if products else 1
```

### 8.4 — Odoo Approval Workflow (Cloud → Local)

When Cloud detects an invoice needs to be created:

```markdown
# /Vault/Pending_Approval/odoo/INVOICE_ClientB_2026-01-07.md
---
type: approval_request
action: odoo_post_invoice
invoice_id: 42
partner: Client B
amount: 2500.00
description: January 2026 Services
created: 2026-01-07T09:00:00Z
expires: 2026-01-08T09:00:00Z
status: pending
agent: cloud_agent
---

## Invoice Details
- Client: Client B
- Amount: $2,500.00
- Description: January 2026 Services
- Odoo Draft Invoice ID: 42
- Odoo URL: https://your-domain.com/web#id=42

## Draft already created in Odoo.
## To POST (confirm) this invoice:
Move this file to /Approved/

## To REJECT:
Move this file to /Rejected/
```

### 8.5 — Odoo Health & Backup

```bash
# Automated daily backup (add to crontab on Cloud VM)
0 2 * * * pg_dump odoo > /home/ai_employee/backups/odoo_$(date +%Y%m%d).sql
0 3 * * * find /home/ai_employee/backups -name "*.sql" -mtime +30 -delete

# Odoo health check endpoint
curl -s https://your-domain.com/web/health
# Expected: {"status": "pass"}
```

---

## 9. SECURITY: SECRETS NEVER SYNC

### 9.1 — The Platinum Security Boundary

```
┌─────────────────────────────────────────────────────┐
│  CLOUD VM                        LOCAL MACHINE      │
│                                                     │
│  ✅ Vault markdown files  ←→  ✅ Vault markdown     │
│  ✅ Gmail OAuth token         ❌ NOT SYNCED          │
│  ✅ Anthropic API key         ❌ NOT SYNCED          │
│                                                     │
│  ❌ WhatsApp session     →→→  ✅ Local ONLY          │
│  ❌ Banking credentials  →→→  ✅ Local ONLY          │
│  ❌ Payment tokens       →→→  ✅ Local ONLY          │
│  ❌ Odoo admin password  →→→  ✅ Local ONLY          │
└─────────────────────────────────────────────────────┘
```

### 9.2 — Environment Variable Structure

**Cloud VM `~/.env_cloud`:**
```bash
# Cloud VM only — NEVER in vault
ANTHROPIC_API_KEY=sk-ant-...
GMAIL_CLIENT_ID=...
GMAIL_CLIENT_SECRET=...
GMAIL_REFRESH_TOKEN=...
LINKEDIN_ACCESS_TOKEN=...
VAULT_PATH=/home/ai_employee/AI_Employee_Vault
AGENT_NAME=cloud_agent
ODOO_URL=https://your-domain.com
ODOO_DB=odoo
ODOO_USERNAME=admin
ODOO_PASSWORD=...
DRY_RUN=false
```

**Local Machine `~/.env_local`:**
```bash
# Local only — NEVER in vault, NEVER on cloud
ANTHROPIC_API_KEY=sk-ant-...
VAULT_PATH=/Users/yourname/AI_Employee_Vault
AGENT_NAME=local_agent
WHATSAPP_SESSION_PATH=/Users/yourname/.whatsapp_session
BANK_API_TOKEN=...
PAYMENT_SECRET=...
ODOO_URL=https://your-domain.com
ODOO_DB=odoo
ODOO_USERNAME=admin
ODOO_PASSWORD=...
DRY_RUN=false
```

### 9.3 — Vault `.gitignore` (Non-Negotiable)

```gitignore
# /AI_Employee_Vault/.gitignore

# Secrets — absolute blocks
.env
*.env
.env_*
secrets/
*.token
*.key
*.pem
*.p12
banking_credentials*
whatsapp_session/
*.session

# Log files with potential PII
Logs/*.json

# OS files
.DS_Store
Thumbs.db
*.tmp
```

### 9.4 — Permission Boundaries (Platinum Level)

| Action | Auto-Approve | Require Human Approval |
|---|---|---|
| Email replies to known contacts | ✅ Cloud drafts | ✅ Local approves + sends |
| Email to new contacts | ❌ Never auto | ✅ Always human review |
| Payments < $50 recurring | ❌ Cloud can draft | ✅ Local always confirms |
| Payments > $100 | ❌ Never | ✅ Local + human approval |
| Social media scheduled posts | ✅ Cloud drafts | ✅ Local posts after review |
| Social media replies/DMs | ❌ Never auto | ✅ Always human review |
| Odoo draft invoice | ✅ Cloud creates draft | ✅ Local posts after approval |
| Odoo payment register | ❌ Never Cloud | ✅ Local only + human approval |
| Delete any file | ❌ Never | ✅ Always human |

---

## 10. HEALTH MONITORING & WATCHDOG SYSTEM

### 10.1 — Cloud Health Monitor

```python
# health_monitor.py — runs on Cloud VM
import requests
import time
import subprocess
import logging
import smtplib
from pathlib import Path
from datetime import datetime

PROCESSES_TO_WATCH = [
    {'name': 'gmail-watcher', 'pm2_name': 'gmail-watcher'},
    {'name': 'cloud-orchestrator', 'pm2_name': 'cloud-orchestrator'},
    {'name': 'vault-sync', 'pm2_name': 'vault-sync'},
]

HEALTH_CHECKS = [
    {'name': 'Odoo', 'url': 'https://your-domain.com/web/health'},
    {'name': 'Vault Git', 'check': 'git_sync_check'},
]

class PlatinumHealthMonitor:
    def __init__(self):
        self.alert_email = os.getenv('ALERT_EMAIL')
        self.logger = logging.getLogger('HealthMonitor')
        self.failure_counts = {}

    def check_pm2_process(self, pm2_name: str) -> bool:
        result = subprocess.run(
            ['pm2', 'jlist'], capture_output=True, text=True
        )
        processes = json.loads(result.stdout)
        for p in processes:
            if p['name'] == pm2_name:
                return p['pm2_env']['status'] == 'online'
        return False

    def check_odoo_health(self, url: str) -> bool:
        try:
            r = requests.get(url, timeout=10)
            return r.status_code == 200
        except:
            return False

    def check_vault_sync(self) -> bool:
        # Check last git commit was within 30 minutes
        result = subprocess.run(
            ['git', '-C', os.getenv('VAULT_PATH'),
             'log', '-1', '--format=%ct'],
            capture_output=True, text=True
        )
        last_commit_time = int(result.stdout.strip())
        return (time.time() - last_commit_time) < 1800  # 30 min

    def send_alert(self, component: str, message: str):
        # Write alert to vault so Local agent also sees it
        alert_file = Path(os.getenv('VAULT_PATH')) / 'Updates' / \
            f'ALERT_{datetime.now().strftime("%Y%m%d_%H%M%S")}.md'
        alert_file.write_text(f"""---
type: health_alert
component: {component}
severity: critical
timestamp: {datetime.now().isoformat()}
---
## 🚨 Health Alert: {component}
{message}

**Action Required**: Check Cloud VM immediately.
""")
        self.logger.critical(f"ALERT: {component} — {message}")

    def run(self):
        while True:
            for proc in PROCESSES_TO_WATCH:
                if not self.check_pm2_process(proc['pm2_name']):
                    # Auto-restart via PM2
                    subprocess.run(['pm2', 'restart', proc['pm2_name']])
                    self.send_alert(
                        proc['name'],
                        f"Process was down — auto-restarted via PM2"
                    )

            if not self.check_odoo_health('https://your-domain.com/web/health'):
                self.send_alert('Odoo', 'Health check failed — Odoo may be down')

            if not self.check_vault_sync():
                self.send_alert('Vault Sync', 'No vault sync in 30 minutes')

            time.sleep(300)  # Check every 5 minutes
```

### 10.2 — Daily Health Briefing in Vault

```python
# Every morning at 7 AM, Cloud writes a health update:
# /Vault/Updates/HEALTH_2026-01-07.md

def write_daily_health_update(vault_path: Path):
    health_data = {
        'gmail_watcher': check_pm2_process('gmail-watcher'),
        'orchestrator': check_pm2_process('cloud-orchestrator'),
        'odoo': check_odoo_health(ODOO_URL),
        'vault_sync': check_vault_sync(),
        'tasks_processed_24h': count_done_files_last_24h(vault_path),
        'pending_approvals': count_pending_approvals(vault_path),
    }

    update_file = vault_path / 'Updates' / f'HEALTH_{datetime.now().strftime("%Y-%m-%d")}.md'
    update_file.write_text(f"""---
type: health_update
generated: {datetime.now().isoformat()}
---
## ☁️ Cloud Agent Health — {datetime.now().strftime("%B %d, %Y")}

| Component | Status |
|---|---|
| Gmail Watcher | {'✅ Online' if health_data['gmail_watcher'] else '❌ Down'} |
| Cloud Orchestrator | {'✅ Online' if health_data['orchestrator'] else '❌ Down'} |
| Odoo | {'✅ Online' if health_data['odoo'] else '❌ Down'} |
| Vault Sync | {'✅ Synced' if health_data['vault_sync'] else '⚠️ Stale'} |

## Activity (Last 24h)
- Tasks Processed: {health_data['tasks_processed_24h']}
- Pending Your Approval: {health_data['pending_approvals']}
""")
```

---

## 11. A2A UPGRADE — PHASE 2 (OPTIONAL)

### 11.1 — What is A2A?

Phase 2 replaces some file-based handoffs with direct **Agent-to-Agent (A2A) messages** using Anthropic's emerging agent communication standards. The vault still serves as the audit record.

### 11.2 — A2A Message Format

```json
{
  "a2a_version": "1.0",
  "from_agent": "cloud_agent",
  "to_agent": "local_agent",
  "message_id": "msg_2026_01_07_001",
  "task_type": "approval_request",
  "priority": "normal",
  "payload": {
    "action": "send_email",
    "to": "client_a@email.com",
    "subject": "Invoice #42",
    "draft_path": "/Vault/Pending_Approval/email/EMAIL_42.md"
  },
  "audit_record": "/Vault/Logs/2026-01-07.md",
  "expires_at": "2026-01-08T09:00:00Z"
}
```

### 11.3 — When to Upgrade to A2A

Use A2A for:
- Time-sensitive approvals (under 5 minutes SLA)
- Real-time task delegation during active work sessions
- Complex multi-step task chains that need tight coordination

Keep file-based for:
- All audit records (vault is always the source of truth)
- Async tasks (email drafts, weekly briefings)
- Tasks that need human review before execution

---

## 12. PLATINUM DEMO: MINIMUM PASSING GATE

> **This is the scenario you must demonstrate to pass Platinum Tier.**

### The Scenario

> Email arrives at 2:00 AM while your Local machine is offline.
> Cloud Agent processes it, drafts a reply, and creates an approval file.
> You wake up at 8:00 AM, open your laptop, review the approval, and Local executes the send.

### Step-by-Step Demo Walkthrough

**Step 1: Email Arrives (Cloud — 2:00 AM)**
```
Gmail Watcher detects: New important email from client
→ Creates: /Needs_Action/email/EMAIL_client_morning_001.md
→ Cloud claims: moves to /In_Progress/cloud_agent/
→ Cloud drafts reply + creates approval file
→ Syncs vault to Git
```

**Step 2: Cloud Creates Approval File**
```
/Vault/Pending_Approval/email/EMAIL_REPLY_client_001.md
status: awaiting_local_approval
(Cloud goes back to sleep — job done)
```

**Step 3: Vault Sync Happens Automatically**
```
Git push (Cloud) → GitHub → Git pull (Local, 5-min cron)
Local vault now has the pending approval file
```

**Step 4: You Wake Up (8:00 AM — Local)**
```
Open Obsidian → Dashboard.md shows:
"⏳ 1 item awaiting your approval"
Open: /Pending_Approval/email/EMAIL_REPLY_client_001.md
Review the draft. Looks good.
Move file to /Approved/
```

**Step 5: Local Agent Executes (Within 2 minutes)**
```
Local Orchestrator detects file in /Approved/
Calls email-mcp.send_email()
Logs to /Vault/Logs/2026-01-07.md
Moves task to /Done/
Updates Dashboard.md
```

**Step 6: Audit Trail**
```
/Vault/Logs/2026-01-07.md shows:
{
  "time": "08:07:23",
  "action": "email_sent",
  "to": "client@email.com",
  "drafted_by": "cloud_agent",
  "approved_by": "human",
  "executed_by": "local_agent"
}
```

### Demo Checklist

- [ ] Show Cloud VM running (pm2 status)
- [ ] Show email arriving while Local is "offline" (disable Local internet temporarily)
- [ ] Show vault sync happening automatically
- [ ] Show Obsidian Dashboard.md updating with pending approval
- [ ] Show human approving (moving file)
- [ ] Show Local agent executing the send
- [ ] Show complete audit log in /Logs/
- [ ] Show Odoo with a draft invoice (created by Cloud)
- [ ] Show invoice being posted only after Local approval

---

## 13. CHECKLIST & SUBMISSION GUIDE

### Platinum Completion Checklist

**Infrastructure**
- [ ] Cloud VM running 24/7 (Oracle/AWS)
- [ ] PM2 managing all Cloud processes with auto-restart
- [ ] PM2 startup configured (survives VM reboots)
- [ ] Health Monitor running and writing alerts to vault

**Sync**
- [ ] Vault syncing via Git or Syncthing
- [ ] `.gitignore` verified — no secrets in repo
- [ ] Claim-by-move protocol implemented and tested
- [ ] Single-writer rule for `Dashboard.md` enforced

**Work-Zone Split**
- [ ] Cloud: Email triage, draft replies, social drafts ✅
- [ ] Cloud: NEVER sends/posts/pays directly ✅
- [ ] Local: WhatsApp session ✅
- [ ] Local: All payment execution ✅
- [ ] Local: Final email/social send ✅
- [ ] Local: Only writer to `Dashboard.md` ✅

**Odoo**
- [ ] Odoo 19 Community deployed on Cloud VM
- [ ] HTTPS configured (Nginx + Let's Encrypt)
- [ ] Daily backups running (cron)
- [ ] Odoo health check endpoint accessible
- [ ] Odoo MCP server built with draft/post separation
- [ ] Cloud: Draft invoice only ✅
- [ ] Local: Post invoice + register payment ✅

**Security**
- [ ] `.env` files never committed to vault
- [ ] Cloud VM has no WhatsApp session
- [ ] Cloud VM has no banking credentials
- [ ] Audit logs written for every action
- [ ] Dry-run mode tested before live deployment

**Demo**
- [ ] Offline-Local scenario works end-to-end
- [ ] Video recorded (5–10 minutes)
- [ ] README updated with Platinum architecture diagram
- [ ] Submitted at: https://forms.gle/JR9T1SJq5rmQyGkGA

---

## APPENDIX: QUICK REFERENCE

### File → Action Mapping

| File Location | Meaning | Who Acts |
|---|---|---|
| `/Needs_Action/<domain>/` | New task waiting | Cloud or Local (whoever claims first) |
| `/In_Progress/cloud_agent/` | Cloud is working on it | Local ignores |
| `/In_Progress/local_agent/` | Local is working on it | Cloud ignores |
| `/Pending_Approval/<domain>/` | Needs human review | Human moves to /Approved or /Rejected |
| `/Approved/` | Human approved | Local Agent executes |
| `/Rejected/` | Human rejected | Both agents log and skip |
| `/Done/` | Completed | Audit trail only |
| `/Updates/` | Cloud signals to Local | Local merges into Dashboard |

### Emergency Commands

```bash
# Cloud VM — stop everything safely
pm2 stop all

# Cloud VM — check vault sync health
git -C ~/AI_Employee_Vault log --oneline -5

# Cloud VM — check Odoo
curl https://your-domain.com/web/health

# Local — force pull latest vault
cd ~/AI_Employee_Vault && git pull origin main

# Local — count pending approvals
ls ~/AI_Employee_Vault/Pending_Approval/**/*.md | wc -l
```

---

*Constitution Version: 1.0 — Platinum Tier*
*Based on: Personal AI Employee Hackathon 0 — Building Autonomous FTEs in 2026*
*Extends: Gold Tier (Bronze + Silver + Gold requirements fully satisfied)*