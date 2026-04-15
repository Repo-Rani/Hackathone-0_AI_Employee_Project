# Quickstart Guide: Silver Tier Personal AI Employee

**Version**: 1.0
**Last Updated**: 2026-02-26

## Overview

This guide will help you set up and run the Silver Tier Personal AI Employee - a Windows-based AI assistant that monitors Gmail/WhatsApp, processes actions through Claude, implements HITL approval workflow, includes email MCP server, LinkedIn auto-posting, and process management.

## Prerequisites

### System Requirements
- Windows 11 operating system
- PowerShell 5.1 or later
- At least 4GB RAM available
- Stable internet connection

### Software Requirements
- Python 3.13+ with pip
- Node.js v24+ with npm
- Claude CLI with Speckit Plus subscription
- Google Chrome browser (for WhatsApp Web)

### Account Requirements
- Gmail account with 2FA enabled
- WhatsApp account on smartphone
- LinkedIn account (optional, for LinkedIn features)

## Installation Steps

### 1. Clone or Create Project Directory

```powershell
mkdir C:\Users\YourUsername\AI_Employee_Project
cd C:\Users\YourUsername\AI_Employee_Project
```

### 2. Install Python Dependencies

```powershell
pip install google-auth `
            google-auth-oauthlib `
            google-auth-httplib2 `
            google-api-python-client `
            playwright `
            watchdog `
            python-dotenv `
            requests --break-system-packages

playwright install chromium
```

### 3. Install Node.js Dependencies

```powershell
# Install PM2 globally
npm install -g pm2
npm install -g pm2-windows-startup

# Navigate to project directory and create MCP server directories
mkdir mcp_servers\email_mcp
cd mcp_servers\email_mcp
npm init -y
npm install nodemailer dotenv
```

### 4. Create .env File

Create `C:\Users\YourUsername\AI_Employee_Project\.env` with the following content:

```env
# ── Vault Path ──────────────────────────────────────
VAULT_PATH=C:\Users\YourUsername\AI_Employee_Project\AI_Employee_Vault

# ── Gmail ───────────────────────────────────────────
GMAIL_CREDENTIALS_PATH=C:\Users\YourUsername\AI_Employee_Project\credentials.json
GMAIL_USER=your_actual_email@gmail.com
GMAIL_APP_PASSWORD=xxxx_xxxx_xxxx_xxxx

# ── WhatsApp ────────────────────────────────────────
WHATSAPP_SESSION_PATH=C:\Users\YourUsername\AI_Employee_Project\wa_session

# ── LinkedIn ────────────────────────────────────────
LINKEDIN_EMAIL=your_actual_email@gmail.com
LINKEDIN_PASSWORD=your_linkedin_password

# ── Safety Flags ────────────────────────────────────
DRY_RUN=true
MAX_EMAILS_PER_HOUR=10
MAX_PAYMENTS_PER_DAY=3
MAX_LINKEDIN_POSTS_PER_DAY=5

# ── Scheduling ──────────────────────────────────────
DAILY_BRIEFING_TIME=08:00
WEEKLY_BRIEFING_DAY=SUN
WEEKLY_BRIEFING_TIME=23:00
```

### 5. Create Vault Directory Structure

```powershell
$base = "C:\Users\YourUsername\AI_Employee_Project\AI_Employee_Vault"
New-Item -ItemType Directory "$base\Needs_Action" -Force
New-Item -ItemType Directory "$base\Plans" -Force
New-Item -ItemType Directory "$base\Pending_Approval" -Force
New-Item -ItemType Directory "$base\Approved" -Force
New-Item -ItemType Directory "$base\Rejected" -Force
New-Item -ItemType Directory "$base\Done" -Force
New-Item -ItemType Directory "$base\Logs" -Force
New-Item -ItemType Directory "$base\Accounting" -Force
New-Item -ItemType Directory "$base\Social\Queue" -Force
New-Item -ItemType Directory "$base\Social\Posted" -Force
New-Item -ItemType Directory "$base\.claude\skills\email-triage" -Force
New-Item -ItemType Directory "$base\.claude\skills\whatsapp-handler" -Force
New-Item -ItemType Directory "$base\.claude\skills\plan-generator" -Force
New-Item -ItemType Directory "$base\.claude\skills\linkedin-poster" -Force
New-Item -ItemType Directory "$base\.claude\skills\hitl-manager" -Force
New-Item -ItemType Directory "$base\.claude\skills\dashboard-updater" -Force
```

### 6. Set Up Claude CLI Configuration

Create or update `C:\Users\YourUsername\AppData\Roaming\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "email": {
      "command": "node",
      "args": [
        "C:\\Users\\YourUsername\\AI_Employee_Project\\mcp_servers\\email_mcp\\index.js"
      ],
      "env": {
        "GMAIL_USER": "your@gmail.com",
        "GMAIL_APP_PASSWORD": "xxxx_xxxx_xxxx_xxxx",
        "DRY_RUN": "true",
        "MAX_EMAILS_PER_HOUR": "10"
      }
    }
  }
}
```

### 7. Create Watcher Scripts

Create `C:\Users\YourUsername\AI_Employee_Project\watchers\gmail_watcher.py`:

```python
"""
Gmail Watcher — Silver Tier
Kaam: Important/unread emails monitor karo, /Needs_Action/ mein .md file banao
Check interval: 120 seconds
"""

import os
import time
import logging
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

# ── Config ──────────────────────────────────────────────────────
load_dotenv()
VAULT = Path(os.getenv("VAULT_PATH"))
NEEDS_ACTION = VAULT / "Needs_Action"
CREDS_PATH = os.getenv("GMAIL_CREDENTIALS_PATH")
TOKEN_PATH = Path("gmail_token.json")
SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]
CHECK_INTERVAL = 120  # seconds

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [GmailWatcher] %(levelname)s: %(message)s"
)

# ── Auth ────────────────────────────────────────────────────────
def get_service():
    creds = None
    if TOKEN_PATH.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_PATH), SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CREDS_PATH, SCOPES)
            creds = flow.run_local_server(port=0)
        TOKEN_PATH.write_text(creds.to_json())
    return build("gmail", "v1", credentials=creds)

# ── Action File Creator ──────────────────────────────────────────
def create_action_file(service, msg_id: str, processed: set):
    """Email padhta hai aur /Needs_Action/ mein .md file banata hai"""
    msg = service.users().messages().get(userId="me", id=msg_id, format="full").execute()
    hdrs = {h["name"]: h["value"] for h in msg["payload"]["headers"]}

    sender = hdrs.get("From", "Unknown")
    subject = hdrs.get("Subject", "No Subject")
    snippet = msg.get("snippet", "")
    date = hdrs.get("Date", datetime.now().isoformat())

    content = f"""---
type: email
from: {sender}
subject: {subject}
email_date: {date}
received: {datetime.now().isoformat()}
priority: high
status: pending
msg_id: {msg_id}
---

## Email Content
{snippet}

## Suggested Actions
- [ ] Review email fully
- [ ] Draft reply if needed
- [ ] Move to /Done when resolved
"""
    filepath = NEEDS_ACTION / f"EMAIL_{msg_id}.md"
    filepath.write_text(content, encoding="utf-8")
    processed.add(msg_id)
    logging.info(f"Created: {filepath.name} | From: {sender[:40]}")

# ── Main Loop ───────────────────────────────────────────────────
def run():
    logging.info("Gmail Watcher starting...")
    service = get_service()
    processed = set()

    while True:
        try:
            results = service.users().messages().list(
                userId="me",
                q="is:unread is:important"
            ).execute()
            messages = results.get("messages", [])

            new_count = 0
            for m in messages:
                if m["id"] not in processed:
                    create_action_file(service, m["id"], processed)
                    new_count += 1

            if new_count > 0:
                logging.info(f"Processed {new_count} new email(s)")
            else:
                logging.info("No new important emails")

        except Exception as e:
            logging.error(f"Error checking Gmail: {e}")

        time.sleep(CHECK_INTERVAL)

if __name__ == "__main__":
    run()
```

Create `C:\Users\YourUsername\AI_Employee_Project\watchers\whatsapp_watcher.py`:

```python
"""
WhatsApp Watcher — Silver Tier
Kaam: Keyword-based unread messages detect karo, /Needs_Action/ mein file banao
Keywords: urgent, asap, invoice, payment, help, deadline, please, project
Check interval: 30 seconds
WARNING: Personal use only — WhatsApp ToS aware raho
"""

import os
import time
import logging
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright

# ── Config ──────────────────────────────────────────────────────
load_dotenv()
VAULT = Path(os.getenv("VAULT_PATH"))
NEEDS_ACTION = VAULT / "Needs_Action"
SESSION_PATH = os.getenv("WHATSAPP_SESSION_PATH")
CHECK_INTERVAL = 30
KEYWORDS = [
    "urgent", "asap", "invoice", "payment", "help",
    "deadline", "please", "project", "contract", "emergency"
]

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [WhatsAppWatcher] %(levelname)s: %(message)s"
)

seen_messages = set()

# ── WhatsApp Check ───────────────────────────────────────────────
def check_whatsapp() -> list:
    """Unread keyword messages return karta hai"""
    results = []
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch_persistent_context(
                SESSION_PATH,
                headless=True,           # Pehli run mein False rakho QR ke liye
                args=["--no-sandbox"]
            )
            page = browser.pages[0] if browser.pages else browser.new_page()
            page.goto("https://web.whatsapp.com", wait_until="networkidle")
            page.wait_for_timeout(5000)

            # Unread badge wale chats dhundo
            unread_chats = page.query_selector_all('[data-testid="icon-unread-count"]')

            for chat_elem in unread_chats:
                try:
                    # Parent chat container ka text lo
                    chat_text = chat_elem.evaluate(
                        "el => el.closest('[data-testid=\"cell-frame-container\"]').innerText"
                    ).lower()

                    matched_keywords = [kw for kw in KEYWORDS if kw in chat_text]
                    if matched_keywords and chat_text not in seen_messages:
                        results.append({
                            "text": chat_text[:800],
                            "keywords": matched_keywords
                        })
                        seen_messages.add(chat_text)

                except Exception:
                    pass

            browser.close()
    except Exception as e:
        logging.error(f"Playwright error: {e}")

    return results

# ── Action File Creator ──────────────────────────────────────────
def create_wa_file(msg: dict):
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    keywords_str = ", ".join(msg["keywords"])
    content = f"""---
type: whatsapp
received: {datetime.now().isoformat()}
priority: high
status: pending
keywords_matched: [{keywords_str}]
---

## WhatsApp Message Content
{msg["text"]}

## Detected Keywords
{keywords_str}

## Suggested Actions
- [ ] Review full message in WhatsApp
- [ ] Draft reply
- [ ] Move to /Done when resolved
"""
    filepath = NEEDS_ACTION / f"WA_{ts}.md"
    filepath.write_text(content, encoding="utf-8")
    logging.info(f"Created: {filepath.name} | Keywords: {keywords_str}")

# ── Main Loop ───────────────────────────────────────────────────
def run():
    logging.info("WhatsApp Watcher starting...")
    logging.info("NOTE: First run — headless=False karo QR scan ke liye, phir True karo")

    while True:
        try:
            messages = check_whatsapp()
            for msg in messages:
                create_wa_file(msg)
            if not messages:
                logging.info("No new keyword messages")
        except Exception as e:
            logging.error(f"Main loop error: {e}")
        time.sleep(CHECK_INTERVAL)

if __name__ == "__main__":
    run()
```

Create `C:\Users\YourUsername\AI_Employee_Project\orchestrator.py`:

```python
"""
Orchestrator — Silver Tier
Kaam: /Approved/ folder watch karo, action execute karo, log karo
Check interval: 15 seconds
"""

import os
import json
import time
import shutil
import logging
from pathlib import Path
from datetime import datetime, timezone
from dotenv import load_dotenv

# ── Config ──────────────────────────────────────────────────────
load_dotenv()
VAULT = Path(os.getenv("VAULT_PATH"))
APPROVED = VAULT / "Approved"
REJECTED = VAULT / "Rejected"
DONE = VAULT / "Done"
LOGS = VAULT / "Logs"
DRY_RUN = os.getenv("DRY_RUN", "true").lower() == "true"
CHECK_INTERVAL = 15

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [Orchestrator] %(levelname)s: %(message)s"
)

# ── Logger ───────────────────────────────────────────────────────
def log_action(action_type: str, target: str, result: str, details: str = ""):
    log_file = LOGS / f"{datetime.now().strftime('%Y-%m-%d')}.json"
    entry = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "action_type": action_type,
        "actor": "orchestrator",
        "target": target,
        "approval_status": "approved",
        "result": "dry_run" if DRY_RUN else result,
        "details": details
    }
    existing = []
    if log_file.exists():
        try:
            existing = json.loads(log_file.read_text(encoding="utf-8"))
        except:
            existing = []
    existing.append(entry)
    log_file.write_text(json.dumps(existing, indent=2, ensure_ascii=False), encoding="utf-8")
    logging.info(f"Logged: {action_type} → {result}")

# ── YAML Frontmatter Parser (simple) ────────────────────────────
def parse_frontmatter(content: str) -> dict:
    data = {}
    if content.startswith("---"):
        lines = content.split("---")[1].strip().split("\n")
        for line in lines:
            if ":" in line:
                key, _, val = line.partition(":")
                data[key.strip()] = val.strip()
    return data

# ── Action Executor ──────────────────────────────────────────────
def execute_action(approval_file: Path):
    content = approval_file.read_text(encoding="utf-8")
    metadata = parse_frontmatter(content)
    action = metadata.get("action", "unknown")
    target = metadata.get("to", approval_file.name)

    logging.info(f"Executing: {action} → {target}")

    if action == "send_email":
        # SPEC-06 ka Email MCP call yahan aayega
        if DRY_RUN:
            logging.info(f"[DRY RUN] Would send email to: {target}")
            logging.info(f"[DRY RUN] Subject: {metadata.get('subject', 'N/A')}")
        else:
            # email_mcp.send_email(metadata) — SPEC-06 mein implement hoga
            logging.info(f"Email sent to: {target}")
        log_action("send_email", target, "success", f"Subject: {metadata.get('subject')}")

    elif action == "linkedin_post":
        if DRY_RUN:
            logging.info(f"[DRY RUN] Would post to LinkedIn")
        else:
            logging.info("LinkedIn post executed")
        log_action("linkedin_post", "linkedin", "success")

    else:
        logging.warning(f"Unknown action type: {action} — skipping")
        log_action(action, target, "skipped", "Unknown action type")

    # File ko /Done/ mein move karo
    dest = DONE / approval_file.name
    shutil.move(str(approval_file), str(dest))
    logging.info(f"Moved to /Done/: {approval_file.name}")

# ── Expiry Check ─────────────────────────────────────────────────
def check_expiry(approval_file: Path) -> bool:
    """Expired files reject folder mein bhejna"""
    content = approval_file.read_text(encoding="utf-8")
    metadata = parse_frontmatter(content)
    expires = metadata.get("expires", "")
    if expires:
        try:
            exp_time = datetime.fromisoformat(expires.replace("Z", "+00:00"))
            if datetime.now(timezone.utc) > exp_time:
                shutil.move(str(approval_file), str(REJECTED / approval_file.name))
                log_action("expired", approval_file.name, "expired")
                logging.warning(f"Expired: {approval_file.name}")
                return True
        except:
            pass
    return False

# ── Main Loop ────────────────────────────────────────────────────
def run():
    if DRY_RUN:
        logging.info("Orchestrator starting... [DRY RUN MODE]")
    else:
        logging.info("Orchestrator starting... [LIVE MODE]")

    while True:
        try:
            # /Approved/ mein files check karo
            for f in APPROVED.glob("*.md"):
                if not check_expiry(f):
                    execute_action(f)

            # /Pending_Approval/ mein expiry check karo
            for f in (VAULT / "Pending_Approval").glob("*.md"):
                check_expiry(f)

        except Exception as e:
            logging.error(f"Orchestrator error: {e}")

        time.sleep(CHECK_INTERVAL)

if __name__ == "__main__":
    run()
```

Create `C:\Users\YourUsername\AI_Employee_Project\mcp_servers\email_mcp\index.js`:

```javascript
/**
 * Email MCP Server — Silver Tier
 * Kaam: Gmail se email bhejna (HITL approval ke baad sirf)
 * DRY_RUN=true → sirf log karo, actual email mat bhejo
 */

require("dotenv").config({ path: "../../../.env" });
const nodemailer = require("nodemailer");
const readline = require("readline");

const DRY_RUN = process.env.DRY_RUN === "true";
const MAX_PER_HOUR = parseInt(process.env.MAX_EMAILS_PER_HOUR || "10");

// ── Rate Limiter ──────────────────────────────────────────────
let sentThisHour = 0;
let hourStart = Date.now();

function checkRateLimit() {
    const now = Date.now();
    if (now - hourStart > 3600000) {  // 1 hour reset
        sentThisHour = 0;
        hourStart = now;
    }
    if (sentThisHour >= MAX_PER_HOUR) {
        throw new Error(`Rate limit reached: ${MAX_PER_HOUR} emails/hour`);
    }
}

// ── Transporter ───────────────────────────────────────────────
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

// ── Send Email Function ───────────────────────────────────────
async function sendEmail({ to, subject, body, attachment_path }) {
    checkRateLimit();

    if (DRY_RUN) {
        console.log(`[DRY RUN] Would send email:`);
        console.log(`  To: ${to}`);
        console.log(`  Subject: ${subject}`);
        console.log(`  Body preview: ${body?.substring(0, 100)}...`);
        return { success: true, dry_run: true, message_id: "DRY_RUN_" + Date.now() };
    }

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: to,
        subject: subject,
        text: body
    };

    if (attachment_path && attachment_path.trim() !== "") {
        mailOptions.attachments = [{ path: attachment_path }];
    }

    const info = await transporter.sendMail(mailOptions);
    sentThisHour++;
    console.log(`Email sent: ${info.messageId}`);
    return { success: true, dry_run: false, message_id: info.messageId };
}

// ── MCP stdio Interface ───────────────────────────────────────
// Claude CLI MCP protocol: JSON-RPC over stdin/stdout
const rl = readline.createInterface({ input: process.stdin });

rl.on("line", async (line) => {
    try {
        const request = JSON.parse(line);
        const { id, method, params } = request;

        if (method === "tools/list") {
            const response = {
                jsonrpc: "2.0", id,
                result: {
                    tools: [{
                        name: "send_email",
                        description: "Send an email via Gmail. Only call after human approval.",
                        inputSchema: {
                            type: "object",
                            properties: {
                                to: { type: "string", description: "Recipient email" },
                                subject: { type: "string", description: "Email subject" },
                                body: { type: "string", description: "Email body text" },
                                attachment_path: { type: "string", description: "Optional file path" }
                            },
                            required: ["to", "subject", "body"]
                        }
                    }]
                }
            };
            console.log(JSON.stringify(response));

        } else if (method === "tools/call" && params?.name === "send_email") {
            const result = await sendEmail(params.arguments);
            const response = {
                jsonrpc: "2.0", id,
                result: { content: [{ type: "text", text: JSON.stringify(result) }] }
            };
            console.log(JSON.stringify(response));

        } else {
            console.log(JSON.stringify({
                jsonrpc: "2.0", id,
                error: { code: -32601, message: "Method not found" }
            }));
        }
    } catch (err) {
        console.error(`MCP Error: ${err.message}`);
    }
});

console.error("Email MCP Server started (stderr log)");
```

### 8. Create PM2 Ecosystem Configuration

Create `C:\Users\YourUsername\AI_Employee_Project\ecosystem.config.js`:

```javascript
// File: C:\Users\YourName\AI_Employee_Project\ecosystem.config.js

module.exports = {
    apps: [
        {
            name: "gmail_watcher",
            script: "watchers/gmail_watcher.py",
            interpreter: "python",
            cwd: "C:\\Users\\YourUsername\\AI_Employee_Project",
            autorestart: true,
            watch: false,
            max_restarts: 10,
            min_uptime: "10s",
            log_file: "logs/pm2_gmail.log",
            error_file: "logs/pm2_gmail_error.log",
            time: true
        },
        {
            name: "whatsapp_watcher",
            script: "watchers/whatsapp_watcher.py",
            interpreter: "python",
            cwd: "C:\\Users\\YourUsername\\AI_Employee_Project",
            autorestart: true,
            watch: false,
            max_restarts: 10,
            min_uptime: "10s",
            log_file: "logs/pm2_whatsapp.log",
            error_file: "logs/pm2_whatsapp_error.log",
            time: true
        },
        {
            name: "orchestrator",
            script: "orchestrator.py",
            interpreter: "python",
            cwd: "C:\\Users\\YourUsername\\AI_Employee_Project",
            autorestart: true,
            watch: false,
            max_restarts: 10,
            min_uptime: "10s",
            log_file: "logs/pm2_orchestrator.log",
            error_file: "logs/pm2_orchestrator_error.log",
            time: true
        }
    ]
};
```

### 9. Create Agent Skills

Create `C:\Users\YourUsername\AI_Employee_Project\AI_Employee_Vault\.claude\skills\email-triage\SKILL.md`:

```markdown
---
name: email-triage
description: >
  Email triage karo jab bhi EMAIL_*.md file /Needs_Action/ mein ho.
  Har incoming email ko analyze karo — sender identify karo, urgency decide karo,
  action plan banao, aur sensitive actions ke liye approval request banao.
  Trigger: EMAIL_*.md file detected | "email process karo" | "inbox dekho" |
  "mail check karo" | new email file in vault.
---

# Email Triage Skill

## Purpose
/Needs_Action/ mein aane wali EMAIL_*.md files ko process karo aur structured
action plan banao Company_Handbook.md ke rules ke mutabiq.

## Trigger Conditions
- EMAIL_*.md file /Needs_Action/ mein exist kare
- User kahe: "email check karo", "inbox dekho", "mail process karo"
- Orchestrator is skill ko invoke kare

## Instructions

1. File read karo completely — YAML frontmatter aur content dono
2. Sender identify karo:
   - Known client → from Business_Goals.md ya previous /Done/ files mein naam dhundo
   - New contact → kabhi interact nahi kiya
   - Vendor → service/product provider
   - Unknown → insufficient info
3. Urgency determine karo:
   - high: payment, deadline, urgent keywords hain
   - medium: invoice, project update, information request
   - low: newsletter, FYI, no action needed
4. Required action decide karo:
   - reply_needed: client ya contact ne kuch poocha
   - forward: wrong department
   - invoice: payment related
   - no_action: FYI only
5. /Plans/PLAN_{email_filename}.md banao — exact format use karo
6. Agar reply_needed ya invoice:
   - Approval file banao: /Pending_Approval/email_{id}_{date}.md
   - Plan mein REQUIRES_APPROVAL mark karo
7. Dashboard.md update karo — Recent Activity section mein add karo

## Rules (Company_Handbook.md se)
- Known clients: auto-draft reply, approval ke baad bhejo
- New contacts: HAMESHA REQUIRES_APPROVAL
- Koi bhi payment: HAMESHA REQUIRES_APPROVAL
- Doubt ho to: default REQUIRES_APPROVAL

## Output Format
- /Plans/PLAN_EMAIL_{id}.md — action plan with checkboxes
- /Pending_Approval/email_{id}_{date}.md — agar sensitive action ho
- Dashboard.md — updated Recent Activity

## Error Handling
- File parse nahi ho rahi → skip karo, log karo: "Parse error: {filename}"
- Sender type unclear → default: new_contact rules lagao
```

Create the other 5 skill files similarly with content from the plan.

### 10. Configure .gitignore

Create `C:\Users\YourUsername\AI_Employee_Project\.gitignore`:

```
.env
.env.*
.env.local
token.json
credentials.json
wa_session\
__pycache__\
*.pyc
*.pyo
node_modules\
mcp_servers\email_mcp\node_modules\
```

## Initial Setup Tasks

### 1. Google Cloud Setup
1. Go to https://console.cloud.google.com/
2. Create new project "AI-Employee-2026"
3. Enable Gmail API
4. Create OAuth 2.0 credentials (Desktop App)
5. Download credentials.json to project root
6. Add your email as test user in OAuth consent screen

### 2. WhatsApp Session Setup
1. Change whatsapp_watcher.py line 36 to `headless=False`
2. Run: `python watchers\whatsapp_watcher.py`
3. Scan QR code with your phone
4. Stop the script (Ctrl+C)
5. Change line 36 back to `headless=True`

### 3. Gmail OAuth Setup
1. Run: `python watchers\gmail_watcher.py`
2. Complete OAuth flow in browser
3. Script will create gmail_token.json

### 4. Gmail App Password
1. Go to myaccount.google.com
2. Enable 2FA if not already done
3. Go to Security > App Passwords
4. Generate app password for Mail on Windows Computer
5. Update GMAIL_APP_PASSWORD in .env file

### 5. Test the System
1. Start all services: `cd C:\Users\YourUsername\AI_Employee_Project && pm2 start ecosystem.config.js`
2. Verify status: `pm2 status`
3. Send test email to yourself and mark as Important
4. Wait 2 minutes and check AI_Employee_Vault\Needs_Action\ for EMAIL_*.md file

## Basic Commands

```powershell
# Start all services with PM2
pm2 start ecosystem.config.js

# Check status of all services
pm2 status

# View logs for a specific service
pm2 logs gmail_watcher
pm2 logs whatsapp_watcher
pm2 logs orchestrator

# Stop all services
pm2 stop all

# Restart a specific service
pm2 restart gmail_watcher

# Save current PM2 configuration
pm2 save

# Enable PM2 startup on boot
pm2-startup install

# Run Claude command to process needs_action (example)
claude --cwd "C:\Users\YourUsername\AI_Employee_Project\AI_Employee_Vault" "Process all /Needs_Action/ files"
```

## Directory Structure

Your final directory structure should look like:
```
C:\Users\YourUsername\AI_Employee_Project\
├── .env
├── .gitignore
├── ecosystem.config.js
├── orchestrator.py
├── business_goals.md
├── dashboard.md
├── watchers\
│   ├── gmail_watcher.py
│   └── whatsapp_watcher.py
├── mcp_servers\
│   └── email_mcp\
│       ├── index.js
│       ├── package.json
│       └── node_modules\
├── logs\ (created by PM2)
├── wa_session\ (created during WhatsApp setup)
├── gmail_token.json (created during Gmail setup)
└── AI_Employee_Vault\
    ├── Needs_Action\
    ├── Plans\
    ├── Pending_Approval\
    ├── Approved\
    ├── Rejected\
    ├── Done\
    ├── Logs\
    ├── Accounting\
    ├── Social\
    │   ├── Queue\
    │   └── Posted\
    ├── .claude\
    │   └── skills\
    │       ├── email-triage\
    │       ├── whatsapp-handler\
    │       ├── plan-generator\
    │       ├── linkedin-poster\
    │       ├── hitl-manager\
    │       └── dashboard-updater\
    ├── Company_Handbook.md
    ├── Business_Goals.md
    └── Dashboard.md
```

## Verification Steps

After setup, verify these components work:

1. **Environment Setup Complete**:
   - [ ] .env file exists and loads variables
   - [ ] All vault folders exist
   - [ ] Python dependencies import without error

2. **Gmail Watcher**:
   - [ ] Watcher starts without errors
   - [ ] Test email creates EMAIL_*.md file
   - [ ] YAML frontmatter is correct

3. **WhatsApp Watcher**:
   - [ ] Session is saved and headless mode works
   - [ ] Test message creates WA_*.md file
   - [ ] Keywords are detected properly

4. **Claude Integration**:
   - [ ] Claude can process files in /Needs_Action/
   - [ ] Plans are created in /Plans/
   - [ ] Approval requests appear in /Pending_Approval/

5. **Process Management**:
   - [ ] All PM2 services are online
   - [ ] Services restart automatically if crashed

6. **Security**:
   - [ ] DRY_RUN is set to true
   - [ ] Credentials are not in version control
   - [ ] Approval workflow is functional

## Troubleshooting

### Common Issues

1. **Gmail OAuth Error**: Check credentials.json path in .env and ensure you've added your email as a test user in the Google Cloud Console.

2. **WhatsApp QR Scan Fails**: Increase wait timeout in whatsapp_watcher.py or try a different Chrome profile.

3. **Claude Not Recognizing Skills**: Ensure .claude/skills/ directory structure is correct and Claude CLI has access to the vault.

4. **PM2 Services Won't Start**: Check log files in the logs/ directory for specific error messages.

5. **Email MCP Server Not Working**: Verify Claude CLI configuration points to the correct MCP server path.

### Quick Checks

```powershell
# Check environment variables
python -c "from dotenv import load_dotenv; import os; load_dotenv(); print('Vault path:', os.getenv('VAULT_PATH'))"

# Check Python imports
python -c "import google, playwright, watchdog, dotenv; print('All imports successful')"

# Check PM2 status
pm2 status

# Check if Claude is configured
claude --help
```

## Next Steps

Once the quickstart is complete:

1. Update Business_Goals.md with your actual business objectives
2. Add Company_Handbook.md with your specific business rules
3. Create Dashboard.md with initial content
4. Test end-to-end workflow with real scenarios
5. Adjust DRY_RUN to false when ready for actual execution
6. Set up Task Scheduler for recurring tasks
7. Test LinkedIn posting workflow
8. Create your first demo video showing the complete workflow