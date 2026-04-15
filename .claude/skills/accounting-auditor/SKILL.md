---
name: accounting-auditor
description: >
  Use this skill to proactively audit financial health. Trigger keywords:
  "audit", "unpaid invoices", "who hasn't paid", "subscription review",
  "where is the money", "cost audit", "overdue", "financial review",
  "check subscriptions", "are we on track". Also triggered when
  subscription_auditor.py writes AUDIT_*.md files to /Needs_Action/.
  Reads Subscriptions.md, Receivables.md, and calls Odoo MCP for live data.
  Creates flag files for every RED or ORANGE finding.
---

# Accounting Auditor Skill

## Purpose
Proactively audit financial health: flag overdue invoices, unused subscriptions,
budget overruns, and revenue gaps. Creates actionable /Needs_Action/ files for
every problem found.

## Trigger Conditions
- "audit", "financial review", "where is the money" in any message
- AUDIT_*.md files appear in /Needs_Action/ from subscription_auditor.py
- Weekly Monday scheduled task (subscription audit)
- CEO briefing skill calls this as a sub-step

## Instructions
1. Call Odoo MCP: get_unpaid_invoices
2. For each unpaid invoice:
   - 15-30 days overdue → ORANGE flag → create /Needs_Action/AUDIT_ORANGE_*.md
   - 30+ days overdue   → RED flag   → create /Needs_Action/AUDIT_RED_*.md
3. Read /Accounting/Subscriptions.md:
   - No login in 30+ days → YELLOW flag
   - No login in 60+ days → RED flag
4. Read /Accounting/Current_Month.md:
   - Total expenses vs MONTHLY_EXPENSE_BUDGET (.env) → flag if over budget
5. Check revenue: get_monthly_revenue vs MONTHLY_REVENUE_TARGET (.env):
   - Revenue < 80% of target → RED flag
6. Update Dashboard.md with financial summary section
7. Log all findings to /Logs/ with action_type: subscription_audit

## Severity Levels
- 🔴 RED: invoice 30+ days overdue | revenue < 80% target | subscription unused 60+ days
- 🟠 ORANGE: invoice 15-30 days overdue | expense > budget
- 🟡 YELLOW: subscription unused 30+ days | new payee detected

## Rules (from Company_Handbook.md)
- Every RED flag MUST create a /Needs_Action/ AUDIT file
- Financial data in AUDIT files stays in vault — never in social posts
- Never cancel subscriptions automatically — always create /Pending_Approval/ file
- Odoo credentials never appear in any audit output file

## Output Format
- /Needs_Action/AUDIT_{severity}_{service}_{date}.md (one per finding)
- Dashboard.md financial section updated
- /Logs/YYYY-MM-DD.json entry for every flag

## Error Handling
- Odoo offline → skip invoice audit, log error, continue with Subscriptions.md audit
- Missing Subscriptions.md → log warning, skip subscription audit
- No findings → log "audit complete — no flags" entry, do not create empty files