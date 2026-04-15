# Approval Workflow Example

This is an example of how the approval workflow would work in the Platinum Tier system, following the pattern specified in the constitution.

---

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

---
*Created by Cloud Agent at 2026-01-07 09:00:00*