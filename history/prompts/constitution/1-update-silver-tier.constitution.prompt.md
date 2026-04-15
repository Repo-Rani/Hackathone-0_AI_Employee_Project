---
id: 1
title: update-silver-tier
stage: constitution
date: 2026-02-26
surface: agent
model: if/qwen3-coder-plus
feature: none
branch: master
user: Claude
command: sp.constitution
labels: [constitution, silver-tier, governance]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - null
---

## Prompt

# SILVER_TIER_CONSTITUTION.md
# Feature: Silver Tier — Functional Assistant
# Project: Personal AI Employee — Building Autonomous FTEs in 2026
# Depends on: Bronze Tier (Obsidian Vault + Dashboard.md + Company_Handbook.md)
# Stack: Windows 11 + Claude CLI + Speckit Plus + Python 3.13 + Node.js v24+
# Version: 1.0

---

## 1. IDENTITY — Yeh Tier Kya Hai

Silver Tier mein hum **Bronze ke reactive vault** se aage jaate hain aur ek **proactive AI Employee** banate hain jo:

- **Suney** — Gmail aur WhatsApp ko 24/7 monitor kare (Watchers)
- **Sooche** — Har incoming message ke liye Plan.md banaye (Claude Reasoning Loop)
- **Action le** — Email bheje, LinkedIn pe post kare — lekin hamesha human approval ke baad (HITL)
- **Schedule kare** — Har roz subah aur weekly tasks Windows Task Scheduler se chalen
- **Zinda rahe** — PM2 se watchers crash hone ke baad khud restart hon
- **Skill ke tor par kaam kare** — Har feature ek `SKILL.md` hogi (Speckit Plus requirement)

> **PDF Rule:** *"All AI functionality should be implemented as Agent Skills"*
> Yeh Silver Tier ki sabse important requirement hai. Koi bhi AI feature bina SKILL.md ke nahi hoga.

---

## 2. TECH STACK — Fixed, Badlega Nahi

### Core
| Layer | Technology | Rule |
|---|---|---|
| OS | Windows 11 | PowerShell use karo, bash nahi |
| AI Brain | Claude CLI | `claude --cwd <vault_path> "..."` |
| Skill System | Speckit Plus | Har feature → SKILL.md |
| Knowledge Base | Obsidian Vault | Local Markdown — cloud nahi |
| Language | Python 3.13+ | Sab watcher scripts |
| Runtime | Node.js v24+ LTS | MCP servers |
| Process Manager | PM2 | Watchers alive rakhne ke liye |
| Scheduler | Windows Task Scheduler | `schtasks` command |
| Credentials | `.env` file | Kabhi hardcode nahi, kabhi commit nahi |

### Watchers
| Watcher | Technology | Rule |
|---|---|---|
| Gmail | `google-api-python-client` + OAuth 2.0 | Har 2 min check |
| WhatsApp | `playwright` (Chromium) | Har 30 sec check — personal use only |
| Filesystem | `watchdog` library | Real-time file drop detection |

### MCP Servers
| Server | Technology | Use |
|---|---|---|
| email-mcp | Node.js + `nodemailer` | Email bhejna (HITL ke baad) |
| browser-mcp | Playwright | Future — payment portals |

### LinkedIn
| Layer | Technology | Rule |
|---|---|---|
| Posting | `linkedin-api` ya Playwright | DRY_RUN=true dev mein |
| Queue | Obsidian `/Social/Queue/` folder | Markdown files as queue |

---

## 3. VAULT FOLDER STRUCTURE — Silver Extension

Bronze ke upar yeh folders add karo. Koi bhi existing folder rename nahi hoga:

```
AI_Employee_Vault/
├── Needs_Action/                  ← Watchers yahan .md files banate hain
├── Plans/                         ← Claude ka Plan.md har action ke liye
├── Pending_Approval/              ← Sensitive actions — human review
├── Approved/                      ← Human ne approve kiya → execute
├── Rejected/                      ← Human ne reject kiya → archive
├── Done/                          ← Completed tasks archive
├── Logs/                          ← Audit trail: YYYY-MM-DD.json
├── Accounting/
│   └── Current_Month.md           ← Finance watcher output
├── Social/
│   ├── Queue/                     ← LinkedIn posts waiting to publish
│   └── Posted/                    ← Published posts archive
├── Dashboard.md                   ← (Bronze) Real-time summary
├── Company_Handbook.md            ← (Bronze) Claude ke rules of engagement
├── Business_Goals.md              ← KPIs, targets, active projects
└── .claude/
    └── skills/                    ← Speckit Plus — sab SKILL.md files yahan
        ├── email-triage/
        │   └── SKILL.md
        ├── whatsapp-handler/
        │   └── SKILL.md
        ├── plan-generator/
        │   └── SKILL.md
        ├── linkedin-poster/
        │   └── SKILL.md
        ├── hitl-manager/
        │   └── SKILL.md
        └── dashboard-updater/
            └── SKILL.md
```

### Project Root (Vault ke bahar):
```
C:\Users\YourName\AI_Employee_Project\
├── .env                           ← GITIGNORE MEIN — kabhi commit nahi
├── .gitignore
├── orchestrator.py                ← Master process — /Approved/ watch karta hai
├── watchers\
│   ├── gmail_watcher.py
│   ├── whatsapp_watcher.py
│   └── linkedin_poster.py
├── mcp_servers\
│   └── email_mcp\
│       ├── package.json
│       └── index.js
└── AI_Employee_Vault\             ← Obsidian vault (upar wala structure)
```

---

## 4. ARCHITECTURE RULES

### 4.1 Watcher Rules
```
✅ KARO:
- Har watcher BaseWatcher pattern follow kare
- Har watcher /Needs_Action/ mein sirf .md files banaye
- .md file mein YAML frontmatter zaroor ho (type, received, priority, status)
- Processed items ka set rakhna — duplicate files nahi banenge
- Har watcher ka apna log file ho /Logs/ mein

❌ MAT KARO:
- Watcher seedha Claude ko call nahi karega — sirf file banayega
- WhatsApp session path .env mein hogi — hardcode nahi
- Watcher crash par poora system band nahi hoga — PM2 restart karega
- Ek watcher doosre watcher ka folder touch nahi karega
```

### 4.2 Claude Reasoning Rules
```
✅ KARO:
- Claude sirf /Needs_Action/ aur /Accounting/ read karega
- Har action ke liye /Plans/PLAN_{source_filename}.md banao
- Sensitive steps REQUIRES_APPROVAL mark karo Plan.md mein
- Sensitive actions ke liye /Pending_Approval/ mein file banao
- Company_Handbook.md rules hamesha follow karo
- Dashboard.md update karo har action ke baad

❌ MAT KARO:
- Claude seedha email nahi bhejega — pehle approval file banayega
- Claude khud /Approved/ mein file nahi daalega — yeh human ka kaam hai
- Claude existing chapter/content files modify nahi karega
- Claude bina Plan.md ke action nahi lega
```

### 4.3 HITL Rules (Non-Negotiable)
```
✅ KARO:
- Har sensitive action /Pending_Approval/ mein file banayega
- File mein action details, expiry time, approve/reject instructions hon
- Orchestrator /Approved/ watch kare — file milne par MCP se execute kare
- Har action ka log entry /Logs/YYYY-MM-DD.json mein ho

❌ MAT KARO:
- Payment actions KABHI auto-execute nahi honge — chahe $1 bhi ho
- Naye contacts ko email KABHI auto-send nahi hogi
- Approved file move karne ka kaam Claude ka nahi — sirf human ka
- Approval expire hone ke baad action execute nahi hoga
```

### 4.4 MCP Server Rules
```
✅ KARO:
- MCP server sirf Orchestrator ke call par chalega
- DRY_RUN=true hone par log karo, execute mat karo
- Har MCP action ka result log karo
- Rate limiting implement karo (max 10 emails/hour)

❌ MAT KARO:
- MCP server directly internet pe expose nahi hoga
- MCP server apni credentials hardcode nahi karega — .env se lega
- MCP server bina HITL approval ke sensitive action nahi karega
```

### 4.5 Agent Skill Rules (Speckit Plus)
```
✅ KARO:
- Har AI feature ka apna SKILL.md hoga
- SKILL.md mein YAML frontmatter: name + description + trigger
- Description mein clearly likho: kab trigger hoga
- Instructions step-by-step numbered list mein
- Rules section mein Company_Handbook.md ke relevant rules copy karo

❌ MAT KARO:
- Ek SKILL.md mein do alag features nahi hongey
- SKILL.md 500 lines se zyada nahi hogi — references/ folder use karo
- Hardcoded values SKILL.md mein nahi hongi — .env se aayengi
```

---

## 5. IMPLEMENTATION ORDER — Step by Step

PDF ke mutabiq aur Windows ke liye best logical order:

```
STEP 1:  Environment Setup — .env + folders + dependencies install
STEP 2:  Gmail Watcher — google-api-python-client + OAuth + /Needs_Action/ writer
STEP 3:  WhatsApp Watcher — playwright + keyword detection + /Needs_Action/ writer
STEP 4:  Claude Reasoning Loop — Plan.md generation + REQUIRES_APPROVAL marking
STEP 5:  HITL Approval Workflow — /Pending_Approval/ + Orchestrator /Approved/ watcher
STEP 6:  Email MCP Server — nodemailer + Claude CLI config + DRY_RUN support
STEP 7:  LinkedIn Auto-Posting — /Social/Queue/ + scheduler + linkedin-api
STEP 8:  Windows Task Scheduler — schtasks se daily + weekly tasks schedule karo
STEP 9:  PM2 Process Manager — sab watchers + orchestrator always-on
STEP 10: Agent Skills (SKILL.md files) — sab features ko Speckit skills mein convert karo
```

---

## 6. AGENT SKILLS — SKILL.md Structure

Har skill yeh format follow karegi:

```markdown
---
name: skill-name
description: >
  [When to trigger — detailed] [What it does] [Trigger keywords]
  Use this skill whenever [specific contexts]. Also trigger when [edge cases].
---

# Skill Title

## Purpose
[1-2 lines — kya karta hai]

## Trigger Conditions
[Kab Claude is skill ko use karega]

## Instructions
1. [Step 1]
2. [Step 2]
...

## Rules (from Company_Handbook.md)
- [Relevant rule 1]
- [Relevant rule 2]

## Output Format
[Expected output ka format]

## Error Handling
[Kya kare agar kuch fail ho]
```

### Required Skills List:

| Skill Name | Trigger | Output |
|---|---|---|
| `email-triage` | EMAIL_*.md in /Needs_Action/ | PLAN_email_*.md in /Plans/ |
| `whatsapp-handler` | WA_*.md in /Needs_Action/ | PLAN_wa_*.md in /Plans/ |
| `plan-generator` | Koi bhi /Needs_Action/ file | /Plans/PLAN_*.md |
| `linkedin-poster` | Daily schedule ya manual | /Social/Queue/POST_*.md |
| `hitl-manager` | REQUIRES_APPROVAL detected | /Pending_Approval/*.md |
| `dashboard-updater` | Koi bhi action complete | Dashboard.md updated |

---

## 7. FILE FORMATS — Exact Schema

### /Needs_Action/*.md (Watcher Output)
```yaml
---
type: email | whatsapp | file_drop
from: sender@example.com          # email ke liye
subject: Email Subject             # email ke liye
chat_name: Client Name            # whatsapp ke liye
received: 2026-01-07T10:30:00Z
priority: high | medium | low
status: pending
keywords_matched: [invoice, urgent] # whatsapp ke liye
---

## Content
[Raw message/email snippet]

## Suggested Actions
- [ ] Review and respond
- [ ] Move to /Done when resolved
```

### /Plans/PLAN_*.md (Claude Output)
```yaml
---
created: 2026-01-07T10:30:00Z
source_file: EMAIL_abc123.md
status: pending | in_progress | pending_approval | done
priority: high | medium | low
---

## Objective
[1 line — kya karna hai]

## Analysis
- Sender: [name + type: known_client | new_contact | vendor]
- Urgency: [high | medium | low]
- Context: [relevant background]

## Action Steps
- [x] Source file read kar liya
- [x] Context identify kiya
- [ ] [Next step]
- [ ] [Final step] — REQUIRES_APPROVAL

## REQUIRES_APPROVAL
Action: [action type]
See: /Pending_Approval/[filename].md
```

### /Pending_Approval/*.md (HITL File)
```yaml
---
type: approval_request
action: send_email | linkedin_post | payment | other
to: recipient@example.com
subject: [subject if email]
amount: 0.00                      # payment ke liye
created: 2026-01-07T10:30:00Z
expires: 2026-01-08T10:30:00Z
status: pending
---

## Action Details
[Exactly kya hoga — no ambiguity]

## To APPROVE
Is file ko /Approved/ folder mein move karo.

## To REJECT
Is file ko /Rejected/ folder mein move karo.
```

### /Logs/YYYY-MM-DD.json (Audit Trail)
```json
[
  {
    "timestamp": "2026-01-07T10:30:00Z",
    "action_type": "email_send | linkedin_post | approval_created",
    "actor": "claude_cli | orchestrator | human",
    "target": "client@example.com",
    "source_file": "EMAIL_abc123.md",
    "approval_status": "approved | rejected | auto",
    "result": "success | failed | dry_run",
    "details": "Optional note"
  }
]
```

---

## 8. SECURITY RULES

```
1. .env file kabhi commit nahi hogi — pehla kaam .gitignore add karna
2. DRY_RUN=true development mein HAMESHA — production mein false karo sirf deploy ke baad
3. Gmail App Password use karo — actual Gmail password nahi
4. WhatsApp session path local machine par — cloud sync nahi
5. Payment actions: HAMESHA manual approval — koi auto-execute nahi, chahe $1 bhi ho
6. Naye contacts: HAMESHA approval — known contacts bhi agar pehli baar send
7. Rate limits implement karo: max 10 emails/hour, max 3 payments/day
8. Logs 90 din retain karo — audit ke liye
9. Credentials kabhi SKILL.md ya Dashboard.md mein nahi aayenge
10. MCP config file (.json) bhi .gitignore mein — credentials hoti hain usme
```

---

## 9. ENVIRONMENT VARIABLES

```env
# .env — NEVER COMMIT — .gitignore mein pehle add karo

# ── Paths ────────────────────────────────────────────
VAULT_PATH=C:\Users\YourName\AI_Employee_Project\AI_Employee_Vault

# ── Gmail ────────────────────────────────────────────
GMAIL_CREDENTIALS_PATH=C:\Users\YourName\credentials.json
GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=xxxx_xxxx_xxxx_xxxx    # Google App Password (16 char)

# ── WhatsApp ─────────────────────────────────────────
WHATSAPP_SESSION_PATH=C:\Users\YourName\wa_session

# ── LinkedIn ─────────────────────────────────────────
LINKEDIN_EMAIL=your@email.com
LINKEDIN_PASSWORD=your_password

# ── Safety Flags (dev mein HAMESHA true) ─────────────
DRY_RUN=true
MAX_EMAILS_PER_HOUR=10
MAX_PAYMENTS_PER_DAY=3
MAX_LINKEDIN_POSTS_PER_DAY=5

# ── Scheduling ───────────────────────────────────────
DAILY_BRIEFING_TIME=08:00
WEEKLY_BRIEFING_DAY=SUN
WEEKLY_BRIEFING_TIME=23:00
```

---

## 10. WINDOWS TASK SCHEDULER — Scheduled Tasks

```powershell
# PowerShell (Admin mode mein chalao)

# ── Daily Morning Briefing ───────────────────────────
schtasks /create /tn "AIEmployee_DailyBriefing" `
  /tr "cmd /c claude --cwd \"%VAULT_PATH%\" \"Read /Needs_Action, update Dashboard.md, create daily summary in /Plans/\"" `
  /sc daily /st 08:00 /f

# ── Weekly CEO Briefing (Sunday 11 PM) ───────────────
schtasks /create /tn "AIEmployee_WeeklyBriefing" `
  /tr "python C:\...\orchestrator.py --task weekly_briefing" `
  /sc weekly /d SUN /st 23:00 /f

# ── LinkedIn Queue Processor (Daily 9 AM) ────────────
schtasks /create /tn "AIEmployee_LinkedIn" `
  /tr "python C:\...\watchers\linkedin_poster.py --run-once" `
  /sc daily /st 09:00 /f

# ── Verify tasks ─────────────────────────────────────
schtasks /query /fo LIST /v | findstr "AIEmployee"
```

---

## 11. PM2 PROCESS MANAGER — Always-On Setup

```powershell
# ── Install ──────────────────────────────────────────
npm install -g pm2
npm install -g pm2-windows-startup

# ── Start all watchers ───────────────────────────────
pm2 start watchers\gmail_watcher.py      --interpreter python --name gmail_watcher
pm2 start watchers\whatsapp_watcher.py   --interpreter python --name whatsapp_watcher
pm2 start orchestrator.py                --interpreter python --name orchestrator

# ── Save + Windows startup pe auto-start ─────────────
pm2 save
pm2-startup install

# ── Daily commands ───────────────────────────────────
pm2 status                    # Sab processes check karo
pm2 logs gmail_watcher        # Gmail watcher ke logs dekho
pm2 restart orchestrator      # Orchestrator restart karo
pm2 stop whatsapp_watcher     # Kisi ko band karo
```

---

## 12. API CONTRACT — MCP Servers

```
Base: Claude CLI MCP Config (%APPDATA%\Claude\claude_desktop_config.json)

email-mcp:
  Tool: send_email
  Input:  { to, subject, body, attachment? }
  Output: { success: true/false, dry_run: true/false, message_id? }
  Guard:  DRY_RUN check → agar true to sirf log karo

linkedin-mcp (future):
  Tool: create_post
  Input:  { content, scheduled_for? }
  Output: { success: true/false, post_id?, dry_run: true/false }
```

---

## 13. COMPANY_HANDBOOK.MD — Silver Tier Rules

Bronze ke Company_Handbook.md mein yeh rules add karo:

```markdown
## Silver Tier — Communication Rules
- Known clients ko email: auto-draft karo, approval ke baad bhejo
- Naye contacts ko email: HAMESHA approval required
- Bulk emails (2+): HAMESHA approval required

## Silver Tier — Payment Rules
- Koi bhi payment, chahe $1 bhi: HAMESHA approval required
- Naye payees: HAMESHA approval required
- Banking actions kabhi auto-execute nahi honge

## Silver Tier — Social Media Rules
- Scheduled LinkedIn posts: auto-approve (Queue mein daalo)
- LinkedIn replies/DMs: HAMESHA approval required
- Sensitive topics pe post: HAMESHA approval required

## Silver Tier — Approval Keywords
- REQUIRES_APPROVAL → /Pending_Approval/ mein file banao, ruko
- AUTO_APPROVED    → seedha /Social/Queue/ ya /Done/ mein daalo

## Silver Tier — Escalation Rules
- Agar context unclear ho → default: REQUIRES_APPROVAL
- Agar amount mention ho → default: REQUIRES_APPROVAL
- Agar new person involved → default: REQUIRES_APPROVAL
```

---

## 14. TESTING CHECKLIST

```
[ ] Gmail Watcher: Important email aane par EMAIL_*.md bane /Needs_Action/ mein
[ ] WhatsApp Watcher: Keyword message par WA_*.md bane /Needs_Action/ mein
[ ] Claude Loop: PLAN_*.md bane /Plans/ mein har /Needs_Action/ file ke liye
[ ] HITL: Sensitive action /Pending_Approval/ mein jaaye — seedha execute na ho
[ ] Approval Flow: File /Approved/ mein move karo → Orchestrator execute kare
[ ] Rejection Flow: File /Rejected/ mein move karo → action cancel ho
[ ] Email MCP: DRY_RUN=true → sirf log ho, actual email na jaye
[ ] LinkedIn: /Social/Queue/ mein file ho → scheduled time par post ho (dry run)
[ ] Task Scheduler: schtasks /query se tasks visible hon
[ ] PM2: pm2 status mein sab processes "online" dikhen
[ ] PM2 Restart: kisi watcher ko manually kill karo → PM2 restart kare
[ ] Agent Skills: .claude/skills/ mein sab 6 SKILL.md files exist karti hon
[ ] Logs: Har action ke baad /Logs/YYYY-MM-DD.json mein entry ho
[ ] Dashboard: Har action ke baad Dashboard.md update ho
[ ] Security: .env commit nahi hua (git log check karo)
[ ] Security: DRY_RUN=true hone par koi real action nahi hua
[ ] Dark Mode: Obsidian dark theme mein sab files readable hon
```

---

## 15. EXISTING CODE INTEGRATION

```
✅ Bronze se reuse karo:
  - Obsidian Vault structure (sirf extend karo, replace nahi)
  - Dashboard.md (nayi entries add karo, format same rakho)
  - Company_Handbook.md (rules add karo, existing rules mat hatao)
  - .claude/ folder (skills/ subfolder add karo)

✅ Claude CLI ko batao:
  - --cwd flag se vault path do
  - Company_Handbook.md reference karo har prompt mein
  - Business_Goals.md reference karo weekly briefing mein

❌ Mat todo:
  - Bronze ka koi bhi folder rename mat karo
  - Dashboard.md ka existing format mat todo
  - Company_Handbook.md ke existing rules mat hatao
  - Koi bhi existing .md file ki front matter schema mat badlo
```

---

## 16. HACKATHON SUBMISSION — Silver Tier Requirements

PDF ke mutabiq submission ke liye yeh sab complete hona chahiye:

```
[ ] GitHub repo (public ya private with judge access)
[ ] README.md — setup instructions + architecture overview
[ ] Demo video (5–10 minutes) — sab Silver features live dikhao
[ ] Security disclosure — credentials handling explain karo
[ ] Tier declaration — "Silver" clearly mention karo
[ ] Submit form: https://forms.gle/JR9T1SJq5rmQyGkGA

Demo video mein dikhao:
  1. Gmail email aana → /Needs_Action/ mein file banna
  2. Claude reasoning → Plan.md banana
  3. HITL approval → /Pending_Approval/ → /Approved/ → email execute
  4. LinkedIn post queue → auto-publish
  5. PM2 status → sab processes online
  6. Task Scheduler → scheduled tasks list
  7. Agent Skills → .claude/skills/ folder structure
```

### Judging Score Strategy (Silver ke liye):

| Criterion | Weight | Silver Strategy |
|---|---|---|
| Functionality | 30% | Sab 7 features working dikhao |
| Innovation | 25% | LinkedIn auto-post + Reasoning Loop highlight karo |
| Practicality | 20% | Real credentials se test karo pehle |
| Security | 15% | .env + HITL + DRY_RUN + Logs dikhao |
| Documentation | 10% | README mein architecture diagram + SKILL.md explain karo |
## Response snapshot

# Personal AI Employee Constitution

## Core Principles

### I. Proactive AI Employee (Silver Tier)
The system operates as a proactive AI employee that monitors, reasons, and acts on human behalf while maintaining human-in-the-loop oversight. AI watches communication channels (Gmail, WhatsApp), generates plans for each incoming task, and executes actions only after human approval for sensitive operations. The system must never execute sensitive actions without explicit human approval.

### II. Human-in-the-Loop (HITL) Approval (NON-NEGOTIABLE)
All sensitive actions must flow through a human-in-the-loop approval workflow. The system creates approval requests in Pending_Approval/ folder, and actions are only executed when a human moves the file to Approved/ folder. Sensitive actions include payments, new contact communications, bulk emails, and any action involving amounts over $0. This ensures complete human oversight of all critical operations.

### III. Agent Skills Architecture
All AI functionality must be implemented as agent skills following the Speckit Plus framework. Each feature must have its own SKILL.md file with proper YAML frontmatter including name, description, and trigger conditions. Skills must follow the defined structure with Purpose, Trigger Conditions, Instructions, Rules, Output Format, and Error Handling sections. No AI feature should exist without its corresponding SKILL.md file.

### IV. Watcher System Architecture
The system uses specialized watchers for monitoring different communication channels. Each watcher must follow the BaseWatcher pattern, output only .md files to /Needs_Action/ folder, include proper YAML frontmatter with type, received, priority, and status fields, maintain processed items set to avoid duplicates, and have its own log file in /Logs/ folder. Watchers must never directly call Claude or touch other watcher's folders.

### V. Obsidian Vault Integration
The system uses a local Obsidian vault as its knowledge base with specific folder structure. The vault contains structured folders (Needs_Action/, Plans/, Pending_Approval/, Approved/, Rejected/, Done/, Logs/, Accounting/, Social/Queue/, Social/Posted/) and maintains Dashboard.md and Company_Handbook.md as central reference points. The system must preserve existing vault structure while extending it as needed.

### VI. Security-First Architecture
The system implements comprehensive security measures including: never committing credentials to version control (.env files in .gitignore), using DRY_RUN=true during development, requiring manual approval for all payments regardless of amount, implementing rate limiting for actions (max 10 emails/hour), maintaining audit logs for 90 days, and never hardcoding credentials in source code or skill files. Security measures must never be bypassed or weakened.

## Additional Constraints

### Technology Stack Requirements
The system operates on Windows 11 with Claude CLI as the AI brain, Speckit Plus for skill management, Python 3.13+ for watchers, Node.js v24+ LTS for MCP servers, PM2 for process management, and Windows Task Scheduler for scheduled tasks. The stack must be strictly adhered to without deviation. Third-party dependencies include google-api-python-client, playwright, nodemailer, and watchdog library.

### File Format Standards
All system files must follow exact schema requirements. /Needs_Action/*.md files must include proper YAML frontmatter with type, source, received timestamp, priority, and status. /Plans/PLAN_*.md files must include creation timestamp, source file reference, status tracking, and clear action steps with REQUIRES_APPROVAL marking when appropriate. /Pending_Approval/*.md files must include action details, expiry times, and clear approval instructions.

## Development Workflow

### Implementation Order
Follow the prescribed implementation sequence: Environment Setup with .env and folder creation, Gmail Watcher implementation, WhatsApp Watcher implementation, Claude Reasoning Loop development, HITL Approval Workflow creation, Email MCP Server setup, LinkedIn Auto-Posting implementation, Windows Task Scheduler configuration, PM2 Process Management setup, and Agent Skills creation. Each step must be completed before proceeding to the next.

### Claude Reasoning Rules
Claude must only read from /Needs_Action/ and /Accounting/ folders, generate Plan.md files in /Plans/ for each action, mark sensitive steps with REQUIRES_APPROVAL, follow Company_Handbook.md rules, and update Dashboard.md after each action. Claude must never send emails directly, move files to /Approved/, modify existing content files, or take action without a Plan.md file.

## Governance

The Personal AI Employee Constitution governs all development and operational decisions. All code changes must align with the defined principles. Amendments to this constitution require explicit documentation of the change, approval from project stakeholders, and a migration plan for existing implementations. All pull requests and code reviews must verify compliance with these principles. The system must maintain audit logs of all actions taken, and any deviation from these principles must be documented and justified.

**Version**: 1.1.0 | **Ratified**: 2026-01-07 | **Last Amended**: 2026-02-26

## Outcome

- ✅ Impact: Updated constitution to Silver Tier requirements with 6 core principles and additional constraints
- 🧪 Tests: Not applicable for document update
- 📁 Files: 1 file updated (.specify/memory/constitution.md)
- 🔁 Next prompts: Implementation of Silver Tier features based on updated constitution
- 🧠 Reflection: Constitution now properly reflects Silver Tier requirements for the Personal AI Employee system

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Not applicable
- Prompt variant (if applicable): Standard constitution update
- Next experiment (smallest change to try): Begin implementing Gmail Watcher as per Implementation Order