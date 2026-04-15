---
name: odoo-connector
description: >
  Use this skill when any invoice needs to be created, a customer record needs
  to be added or updated in CRM, unpaid invoices need to be retrieved, or
  monthly revenue data is needed. Trigger keywords: "invoice", "billing",
  "send invoice", "create invoice", "unpaid", "outstanding", "client record",
  "CRM update", "revenue", "how much did we earn". Also trigger when the
  orchestrator calls create_invoice after an approval file is moved to /Approved/.
  Always check DRY_RUN before calling any write tools.
---

# Odoo Connector Skill

## Purpose
Bridge between Claude and Odoo ERP for financial operations via JSON-RPC MCP.
Handles invoice creation, CRM updates, and revenue reporting.

## Trigger Conditions
- User or orchestrator requests invoice creation
- /Approved/ folder contains an invoice approval file
- CEO briefing skill needs get_unpaid_invoices or get_monthly_revenue data
- "unpaid invoices", "outstanding balance", "who hasn't paid" in any message

## Instructions
1. Read the source file (WhatsApp, Email, or Approval file) to identify:
   - Client name (partner_name)
   - Amount
   - Description of service
   - Due date (optional)
2. Check Company_Handbook.md:
   - Known client under $500 → auto-approve allowed
   - New client or $500+ → REQUIRES_APPROVAL → create /Pending_Approval/ file, stop
3. If approved (file is in /Approved/):
   - Call Odoo MCP: create_invoice with verified details
   - Wait for success response with invoice_id
   - Write /ERP/Invoices/INV_{date}_{client}.md confirmation file
   - Update Dashboard.md with new invoice entry
   - Log action to /Logs/YYYY-MM-DD.json with action_type: odoo_invoice_create
   - Move source files to /Done/
4. Output ODOO_COMPLETE when all steps done

## Rules (from Company_Handbook.md)
- Known clients under $500: auto-approve allowed
- New clients or $500+: ALWAYS requires approval first
- Payment recording: NEVER — human logs payments manually in Odoo
- DRY_RUN=true: log the would-be action, do NOT call Odoo API
- Odoo credentials NEVER appear in any .md file

## Output Format
- /ERP/Invoices/INV_{YYYYMMDD}_{ClientName}.md (confirmation)
- /Logs/YYYY-MM-DD.json entry (audit trail)
- Dashboard.md updated
- Signal: ODOO_COMPLETE

## Error Handling
- Odoo offline → log error, write /Needs_Action/ODOO_OFFLINE_{date}.md, stop
- Partner not found → create /Pending_Approval/ for human to verify client details
- DRY_RUN → log only, no Odoo call, write confirmation with dry_run: true