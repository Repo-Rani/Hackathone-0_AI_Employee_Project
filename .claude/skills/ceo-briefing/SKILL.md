---
name: ceo-briefing
description: >
  Use this skill every Sunday night at 11 PM (via scheduled task) or when
  explicitly asked for a business summary, weekly report, or CEO briefing.
  Trigger keywords: "weekly briefing", "CEO report", "business summary",
  "Monday morning briefing", "how did we do this week", "business audit".
  This skill reads Business_Goals.md, all Accounting files, Done/ folder,
  Logs/, and calls Odoo MCP for real revenue and invoice data. Never generate
  this briefing if Odoo is offline — log the error instead.
---

# CEO Briefing Skill

## Purpose
Compile the Monday Morning CEO Briefing from real business data.
The output is a comprehensive weekly business intelligence report saved to
/Briefings/Weekly/ — it is never auto-sent.

## Trigger Conditions
- Sunday 11 PM scheduled task (primary trigger)
- "weekly briefing", "CEO report", "business summary" in any message
- Explicit request from human for a business summary

## Instructions
1. Read these files from vault:
   - Business_Goals.md (targets, KPIs, active projects)
   - Accounting/Current_Month.md (revenue transactions)
   - Accounting/Subscriptions.md (software costs)
   - Done/ folder — all files from the last 7 days (completed tasks)
   - Logs/ — last 7 days of log files (actions taken)
2. Call Odoo MCP tools:
   - get_unpaid_invoices → list all outstanding invoices
   - get_monthly_revenue (current month + year) → total revenue figure
   If Odoo is offline: log to /Logs/, write /Needs_Action/ODOO_OFFLINE_{date}.md, STOP
3. Generate /Briefings/Weekly/CEO_Briefing_{YYYY-MM-DD}.md with ALL 8 sections:
   - Executive Summary (3 sentences max)
   - Revenue Dashboard (Billed, Collected, MTD, vs Target)
   - Unpaid Invoices table (from Odoo data)
   - Subscription Audit (flags from Subscriptions.md)
   - Completed Tasks This Week (from Done/ folder)
   - Bottlenecks (tasks that exceeded their estimated time)
   - Proactive Suggestions (cost, deadlines, follow-ups)
   - Red Flags (overdue invoices, revenue < 80% target, unused subscriptions)
   - Top 3 Priorities for Next Week
4. Output: BRIEFING_COMPLETE

## Rules (from Company_Handbook.md)
- Briefing saved to vault ONLY — NEVER auto-sent via email or WhatsApp
- Use REAL Odoo data — never approximate or estimate revenue figures
- Client email addresses NEVER appear in the briefing
- If any Odoo tool fails: abort briefing, log error, write alert to /Needs_Action/
- Retain briefing files for minimum 90 days

## Output Format
/Briefings/Weekly/CEO_Briefing_{YYYY-MM-DD}.md (exact format from Section 7.3)
Signal: BRIEFING_COMPLETE

## Error Handling
- Odoo offline → write /Needs_Action/ODOO_OFFLINE_{date}.md, do NOT generate briefing
- Missing Business_Goals.md → use defaults from .env (MONTHLY_REVENUE_TARGET etc.)
- Missing Subscriptions.md → skip subscription audit section, note in briefing