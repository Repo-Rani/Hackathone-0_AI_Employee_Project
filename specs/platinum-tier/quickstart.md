# Platinum Tier Quickstart Guide

## Overview
This guide will help you set up the Platinum Tier AI Employee with 24/7 Cloud + Local Executive architecture. The system operates with two specialized agents: a Cloud Agent that runs continuously to draft and analyze, and a Local Agent that executes sensitive operations.

## Prerequisites
- Oracle Cloud or AWS account for Cloud VM
- Local machine running Windows/Mac/Linux
- Git installed on both Cloud and Local machines
- Node.js v24+ and npm installed
- Claude Code CLI installed
- PM2 installed for process management

## Cloud VM Setup

### 1. Provision Cloud VM
On Oracle Cloud Free Tier, create a VM with:
- Shape: VM.Standard.A1.Flex (ARM) — 4 OCPUs, 24 GB RAM FREE
- OS: Ubuntu 22.04 LTS
- Storage: 200 GB boot volume (free)

### 2. Install Required Software
```bash
# Initial VM setup after SSH:
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y python3.13 nodejs npm git curl

# Install PM2 for process management
sudo npm install -g pm2

# Install Claude Code
npm install -g @anthropic/claude-code

# Verify installations
claude --version
node --version
python3 --version
```

### 3. Create AI Employee User (Security Best Practice)
```bash
# Create dedicated user for AI Employee
sudo adduser ai_employee
sudo usermod -aG sudo ai_employee
su - ai_employee
```

### 4. Set up Vault Sync on Cloud
```bash
# Clone vault repository
git clone https://github.com/YOUR_USERNAME/ai-employee-vault.git ~/AI_Employee_Vault

# Create .gitignore to prevent sensitive data sync
cat > ~/AI_Employee_Vault/.gitignore << 'EOF'
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
Logs/*.json
.DS_Store
Thumbs.db
*.tmp
EOF

# Create Python project for AI Employee
cd ~/ai_employee_project
pip install uv
uv init
uv add watchdog playwright google-api-python-client requests python-dotenv
```

### 5. Configure Environment Variables on Cloud
```bash
# Create environment file (NEVER commit to vault)
nano ~/.env_cloud
```

Add the following content:
```
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

### 6. Source Environment on Login
```bash
echo "source ~/.env_cloud" >> ~/.bashrc
```

## Vault Directory Structure Setup

### 1. Create Platinum Tier Vault Structure
Run this script on both Cloud and Local to create the correct structure:

```bash
# Create the complete vault directory structure
mkdir -p ~/AI_Employee_Vault/{Needs_Action,In_Progress,Plans,Pending_Approval,Updates,Briefings,Accounting,Logs}
mkdir -p ~/AI_Employee_Vault/Needs_Action/{email,whatsapp,social,accounting,general}
mkdir -p ~/AI_Employee_Vault/In_Progress/{cloud_agent,local_agent}
mkdir -p ~/AI_Employee_Vault/Plans/{email,social,accounting,projects}
mkdir -p ~/AI_Employee_Vault/Pending_Approval/{email,payments,social,odoo}
mkdir -p ~/AI_Employee_Vault/Accounting/{Invoices}

# Create initial markdown files
touch ~/AI_Employee_Vault/{Dashboard.md,Company_Handbook.md,Business_Goals.md}
```

## Local Machine Setup

### 1. Clone Vault on Local Machine
```bash
git clone https://github.com/YOUR_USERNAME/ai-employee-vault.git ~/AI_Employee_Vault

# Set up auto-pull every 5 minutes (add to crontab)
crontab -e
# Add this line:
*/5 * * * * cd ~/AI_Employee_Vault && git pull origin main >> ~/logs/vault_sync.log 2>&1
```

### 2. Configure Local Environment Variables
```bash
# Create environment file for local (NEVER commit to vault)
nano ~/.env_local
```

Add the following content:
```
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

## Cloud Agent Services Setup

### 1. Deploy Cloud Watchers with PM2
```bash
# Navigate to your AI Employee project directory
cd ~/ai_employee_project

# Create the required Python files (see implementation details in vault_sync.py, claim_task.py, etc.)
# Then start all Cloud watchers with PM2
pm2 start gmail_watcher.py --interpreter python3 --name "gmail-watcher"
pm2 start linkedin_watcher.py --interpreter python3 --name "linkedin-watcher"
pm2 start finance_watcher.py --interpreter python3 --name "finance-watcher"
pm2 start cloud_orchestrator.py --interpreter python3 --name "cloud-orchestrator"
pm2 start vault_sync.py --interpreter python3 --name "vault-sync"
pm2 start health_monitor.py --interpreter python3 --name "health-monitor"

# Save process list — survives reboots
pm2 save
pm2 startup  # Follow the printed command to enable on boot

# Monitor status
pm2 status
pm2 logs gmail-watcher --lines 50
```

### 2. Cloud Orchestrator Implementation
The cloud orchestrator should implement the following key functionality:

```python
# cloud_orchestrator.py (overview)
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

## Odoo Integration Setup (Cloud VM)

### 1. Install Odoo 19 Community
```bash
# Install PostgreSQL
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
```

### 2. Configure Odoo
```bash
# Setup Odoo config
sudo nano /etc/odoo.conf
```

Add the following content:
```
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

### 3. HTTPS Setup for Odoo
```bash
# Install Nginx and Certbot
sudo apt-get install nginx certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Configure Nginx for Odoo (follow constitution config)
sudo nano /etc/nginx/sites-available/odoo
```

## Testing the Setup

### 1. Verify Cloud Services are Running
```bash
pm2 status
# Should show all services as online
```

### 2. Test Vault Sync
```bash
# Make a change on Cloud and verify it syncs to Local
cd ~/AI_Employee_Vault
echo "# Test" > test_sync.md
git add . && git commit -m "Test sync" && git push origin main

# On Local, pull and verify
cd ~/AI_Employee_Vault
git pull origin main
# Should show the test_sync.md file
```

### 3. Test Claim-by-Move Protocol
- Create a test file in `/Needs_Action/general/`
- Verify the Cloud agent can claim and process it
- Check that it moves to `/In_Progress/cloud_agent/`

## Security Checks

### 1. Verify .gitignore is Working
- Ensure no .env files, tokens, or sensitive data are being committed
- Check git status shows sensitive files as ignored

### 2. Confirm Draft vs Execution Separation
- Cloud should only create draft invoices in Odoo
- Local should be responsible for posting approvals
- Verify no sensitive operations execute on Cloud

## Health Monitoring

The system includes automatic health monitoring that:
- Checks PM2 processes every 5 minutes
- Verifies Odoo health status
- Confirms vault sync is working
- Auto-restarts failed processes via PM2
- Writes health alerts to the vault for Local agent awareness

## Next Steps

1. Test the complete email scenario: email arrives while Local is offline → Cloud processes → Local executes upon return
2. Set up the daily health briefing that runs every morning at 7 AM
3. Configure the weekly business goals audit and subscription audit
4. Test the complete approval workflow for all sensitive operations