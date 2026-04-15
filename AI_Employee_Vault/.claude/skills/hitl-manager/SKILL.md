---
name: hitl-manager
description: >
  Sensitive actions ke liye approval requests manage karo.
  Approval workflow coordinate karo aur human oversight ensure karo.
  Trigger: Sensitive action detected | "approval request banao" |
  "human review required" | payment/financial action.
---

# HITL Manager Skill

## Purpose
Sensitive ya financial actions ke liye approval requests create aur manage karo
to ensure human oversight before execution. Follow Company_Handbook.md approval
requirements strictly.

## Trigger Conditions
- Payment ya financial action detected
- New contact interaction
- Sensitive information handling
- User kahe: "approval request banao", "human review required"
- Action marked as REQUIRES_APPROVAL

## Instructions

1. Action details analyze karo completely
2. Approval requirement verify karo based on Company_Handbook.md
3. /Pending_Approval/approval_{type}_{timestamp}.md banao
4. Clear context aur instructions provide karo for approver
5. Expiration time set karo (default: 24 hours)
6. Action type identify karo (email, payment, contract, etc.)
7. Dashboard.md update karo — Pending Approvals section mein add karo

## Rules (Company_Handbook.md se)
- All payment requests require explicit approval
- New contacts require approval for any action
- High-value actions (>$500) require approval
- Contract modifications require approval
- Approval requests expire after 24 hours

## Output Format
- /Pending_Approval/approval_{type}_{timestamp}.md — approval request
- Dashboard.md — updated Pending Approvals section

## Approval Request Structure
```
---
type: approval_request
action: {send_email/payment/linkedin_post/contract/etc.}
to: {recipient}
subject: {subject_line}
attachment_path: {file_path_if_any}
amount: {numeric_amount_if_financial}
new_payee: {true_if_new_recipient}
created: {timestamp}
expires: {expiration_timestamp_24h_later}
status: pending
source_plan: {reference_to_source_plan}
---

# Action Details
Complete details of the action requiring approval

# Context
Relevant background information for decision making

# Approval Instructions
- Move this file to /Approved/ folder to approve
- Move to /Rejected/ folder to reject
- Action will expire after 24 hours if no action taken
```

## Action Types
- send_email: Email sending approval
- payment: Financial transaction approval
- contract: Contract modification/approval
- linkedin_post: LinkedIn post publishing
- data_access: Sensitive data access request

## Error Handling
- Insufficient details → request more information
- Duplicate request → skip and log
- Invalid action type → mark for review