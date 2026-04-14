# 🤖 Digital FTE Agent — Personal AI Employee

> *Your life and business on autopilot. Local-first, agent-driven, human-in-the-loop.*

[![Built with Claude Code](https://img.shields.io/badge/Built%20with-Claude%20Code-6C47FF?style=flat-square&logo=anthropic)](https://claude.ai/code)
[![Python](https://img.shields.io/badge/Python-3.13+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![Node.js](https://img.shields.io/badge/Node.js-v24+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Obsidian](https://img.shields.io/badge/Obsidian-v1.10.6+-7C3AED?style=flat-square&logo=obsidian)](https://obsidian.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

## 📌 Overview

**Digital FTE Agent** is a fully autonomous, local-first AI employee built as part of the **Personal AI Employee Hackathon 0 (2026)**. It leverages **Claude Code** as its reasoning brain and **Obsidian** as its memory/dashboard, enabling proactive 24/7 management of personal and business workflows — without waiting for human input.

Think of it as hiring a senior employee who:
- Monitors your Gmail, WhatsApp, and bank transactions
- Drafts replies, generates invoices, and schedules social posts
- Asks for your approval before taking any sensitive action
- Never sleeps, never forgets, never misses a deadline

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🧠 **Claude Code Brain** | Powered by Claude as the primary reasoning and planning engine |
| 📂 **Obsidian Dashboard** | Local Markdown vault as GUI, memory, and audit trail |
| 👁️ **Watchers (Perception Layer)** | Lightweight Python scripts monitoring Gmail, WhatsApp, and filesystem |
| 🤝 **Human-in-the-Loop (HITL)** | File-based approval system — AI never acts on sensitive tasks without your go-ahead |
| 🔁 **Ralph Wiggum Loop** | Stop-hook pattern that keeps Claude iterating until tasks are fully complete |
| 🔧 **MCP Servers (Action Layer)** | Model Context Protocol servers for email, browser automation, and calendar |
| 📊 **Monday Morning CEO Briefing** | Autonomous weekly audit: revenue, bottlenecks, and cost-saving suggestions |
| 🔒 **Security-First Architecture** | `.env` secrets, dry-run mode, rate limiting, and 90-day audit logs |

---

## 🏗️ System Architecture

```
EXTERNAL SOURCES
Gmail │ WhatsApp │ Bank APIs │ Files
         │               │              │            │
         ▼               ▼              ▼            ▼
    ┌─────────────────────────────────────────────┐
    │           PERCEPTION LAYER                  │
    │   GmailWatcher │ WhatsAppWatcher │ FinanceWatcher │
    └────────────────────┬────────────────────────┘
                         │
                         ▼
    ┌─────────────────────────────────────────────┐
    │         OBSIDIAN VAULT (Local)              │
    │  /Needs_Action  /Plans  /Done  /Logs        │
    │  Dashboard.md   Company_Handbook.md         │
    │  /Pending_Approval  /Approved  /Rejected    │
    └────────────────────┬────────────────────────┘
                         │
                         ▼
    ┌─────────────────────────────────────────────┐
    │           REASONING LAYER                   │
    │   Claude Code: Read → Think → Plan → Write  │
    └──────────┬──────────────────────┬───────────┘
               │                      │
               ▼                      ▼
    ┌──────────────────┐   ┌──────────────────────┐
    │  HUMAN-IN-LOOP   │   │    ACTION LAYER       │
    │  Review & Approve│──▶│  MCP: Email, Browser  │
    └──────────────────┘   └──────────┬───────────┘
                                       │
                                       ▼
                           Send Email │ Post Social
                           Log Payment │ Update Calendar
```

---

## 📁 Repository Structure

```
digital-fte-agent/
├── 📂 watchers/
│   ├── base_watcher.py          # Abstract base class for all watchers
│   ├── gmail_watcher.py         # Gmail monitoring via Google API
│   ├── whatsapp_watcher.py      # WhatsApp Web automation via Playwright
│   └── filesystem_watcher.py    # Local file drop monitoring via Watchdog
├── 📂 orchestration/
│   ├── orchestrator.py          # Master process: scheduling + folder watching
│   └── watchdog.py              # Health monitor + auto-restart for all processes
├── 📂 mcp-servers/
│   ├── email-mcp/               # Gmail send/draft/search MCP server
│   └── browser-mcp/             # Playwright-based browser automation MCP
├── 📂 vault-templates/
│   ├── Dashboard.md             # Real-time business dashboard template
│   ├── Company_Handbook.md      # Rules of Engagement for the AI
│   ├── Business_Goals.md        # OKRs and financial targets
│   └── CEO_Briefing_Template.md # Monday Morning Briefing output template
├── 📂 utils/
│   ├── retry_handler.py         # Exponential backoff retry decorator
│   └── audit_logic.py           # Subscription pattern matching for billing audits
├── 📂 docs/
│   ├── ARCHITECTURE.md          # Deep-dive system design docs
│   ├── SECURITY.md              # Credential management and sandboxing guide
│   └── TROUBLESHOOTING.md       # Common issues and fixes
├── .env.example                 # Environment variable template (never commit .env)
├── .gitignore                   # Excludes .env, sessions, credentials
├── requirements.txt             # Python dependencies
├── mcp.json.example             # Claude Code MCP server config template
└── README.md                    # You are here
```

---

## 🚀 Quick Start

### Prerequisites

| Component | Version | Purpose |
|---|---|---|
| Claude Code | Pro / Free (Gemini router) | Reasoning engine |
| Python | 3.13+ | Watcher scripts |
| Node.js | v24+ LTS | MCP servers |
| Obsidian | v1.10.6+ | Dashboard & memory |
| Git | Latest | Version control |

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/digital-fte-agent.git
cd digital-fte-agent
```

### 2. Set Up Python Environment

```bash
# Using UV (recommended)
pip install uv
uv venv
source .venv/bin/activate       # Linux/macOS
.venv\Scripts\activate          # Windows

uv pip install -r requirements.txt
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
# Edit .env with your credentials — NEVER commit this file
```

```env
# .env
GMAIL_CLIENT_ID=your_client_id
GMAIL_CLIENT_SECRET=your_client_secret
BANK_API_TOKEN=your_token
WHATSAPP_SESSION_PATH=/secure/path/to/session
DRY_RUN=true   # Set to false only when ready for live actions
```

### 4. Set Up Obsidian Vault

```bash
# Create the required folder structure
mkdir -p AI_Employee_Vault/{Needs_Action,Plans,Done,Logs,Briefings}
mkdir -p AI_Employee_Vault/{Pending_Approval,Approved,Rejected}
mkdir -p AI_Employee_Vault/{Accounting,Invoices}

# Copy vault templates
cp vault-templates/* AI_Employee_Vault/
```

### 5. Configure Claude Code MCP Servers

```bash
cp mcp.json.example ~/.config/claude-code/mcp.json
# Update paths inside mcp.json to match your installation
```

### 6. Verify Installation

```bash
claude --version
python --version
node --version
```

### 7. Start the Watcher Layer

```bash
# Install PM2 for process management
npm install -g pm2

# Start all watchers
pm2 start watchers/gmail_watcher.py --interpreter python3 --name gmail-watcher
pm2 start watchers/filesystem_watcher.py --interpreter python3 --name file-watcher

# Persist on system reboot
pm2 save
pm2 startup
```

### 8. Launch the Orchestrator

```bash
python orchestration/orchestrator.py
```

---

## 🔄 Example End-to-End Flow: Invoice Generation

```
1. [WhatsApp Watcher]  Detects: "Hey, send me the January invoice"
          │
          ▼
2. [Vault]             Creates: /Needs_Action/WHATSAPP_client_a.md
          │
          ▼
3. [Claude Code]       Reads vault → Creates: /Plans/PLAN_invoice_client_a.md
                       Identifies: Client A → $1,500 → email required
          │
          ▼
4. [HITL]              Creates: /Pending_Approval/EMAIL_invoice_client_a.md
                       ⏸ Waits for human to move file to /Approved
          │
          ▼
5. [Email MCP]         Sends invoice email to client_a@email.com
          │
          ▼
6. [Vault]             Logs to /Logs/2026-01-07.json
                       Moves all task files to /Done/
                       Updates Dashboard.md
```

---

## 📊 Hackathon Tier Achieved

- [x] 🥉 **Bronze** — Vault setup, Gmail Watcher, Claude Code reads/writes vault
- [x] 🥈 **Silver** — Multiple watchers, LinkedIn automation, MCP email server, HITL workflow
- [ ] 🥇 **Gold** — Full cross-domain integration, Odoo accounting, CEO briefing, Ralph Wiggum loop
- [ ] 💎 **Platinum** — Cloud deployment, always-on operation, A2A agent communication

> **Current status:** Silver Tier ✅ — actively working toward Gold

---

## 🔒 Security

- All credentials are stored in `.env` (never committed — see `.gitignore`)
- `DRY_RUN=true` by default — no real actions until explicitly enabled
- Every AI action is logged in `/Vault/Logs/YYYY-MM-DD.json` (90-day retention)
- Payments always require human approval, regardless of amount
- Audit log format:

```json
{
  "timestamp": "2026-01-07T10:30:00Z",
  "action_type": "email_send",
  "actor": "claude_code",
  "target": "client@example.com",
  "approval_status": "approved",
  "approved_by": "human",
  "result": "success"
}
```

See [SECURITY.md](docs/SECURITY.md) for full credential management and sandboxing guide.

---

## 🤖 The Ralph Wiggum Loop

The Ralph Wiggum pattern is a **Stop Hook** that prevents Claude from exiting before a task is complete:

```bash
/ralph-loop "Process all files in /Needs_Action, move to /Done when complete" \
  --completion-promise "TASK_COMPLETE" \
  --max-iterations 10
```

Claude outputs `<promise>TASK_COMPLETE</promise>` only when all steps are done. Until then, the hook re-injects the prompt and continues the loop.

---

## 📅 Weekly CEO Briefing Sample Output

```markdown
# Monday Morning CEO Briefing — Jan 6, 2026

## Revenue
- This Week: $2,450
- MTD: $4,500 (45% of $10,000 target) ✅ On Track

## Bottlenecks
| Task              | Expected | Actual  | Delay   |
|-------------------|----------|---------|---------|
| Client B proposal | 2 days   | 5 days  | +3 days |

## Proactive Suggestions
- Notion: No team activity in 45 days. Cost: $15/mo → Cancel?
- Project Alpha final delivery: Jan 15 (9 days remaining)
```

---

## 📚 Learning Resources

| Resource | Link |
|---|---|
| Claude Code Fundamentals | [agentfactory.panaversity.org](https://agentfactory.panaversity.org/docs/AI-Tool-Landscape/claude-code-features-and-workflows) |
| Claude + Obsidian Integration | [YouTube](https://www.youtube.com/watch?v=sCIS05Qt79Y) |
| Building MCP Servers | [modelcontextprotocol.io](https://modelcontextprotocol.io/quickstart) |
| Agent Skills Overview | [platform.claude.com](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) |
| Playwright Python Docs | [playwright.dev](https://playwright.dev/python/docs/intro) |

---

## 🌐 Hackathon Info

- **Organizer:** Panaversity
- **Research Meeting:** Every Wednesday at 10:00 PM PKT on Zoom
- **Zoom ID:** `871 8870 7642` | Passcode: `744832`
- **YouTube (Live/Recording):** [youtube.com/@panaversity](https://www.youtube.com/@panaversity)
- **Submit Form:** [forms.gle/JR9T1SJq5rmQyGkGA](https://forms.gle/JR9T1SJq5rmQyGkGA)

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. Ensure all sensitive files remain excluded via `.gitignore`.

---

## ⚖️ Ethics & Responsible Automation

This project follows responsible automation principles:
- **Human remains accountable** — AI acts on your behalf, using your credentials
- **Transparency** — AI-sent emails include an AI-assistance disclosure
- **Audit trails** — all actions logged and reviewable
- **Minimal data collection** — local-first, sensitive data never leaves your machine

**Oversight Schedule:**
- Daily: 2-min dashboard check
- Weekly: 15-min action log review
- Monthly: 1-hour comprehensive audit

---

## 📄 License

[MIT](LICENSE) © 2026 — Built for Panaversity Personal AI Employee Hackathon 0
