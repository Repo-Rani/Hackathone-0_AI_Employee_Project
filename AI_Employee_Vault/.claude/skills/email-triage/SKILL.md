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