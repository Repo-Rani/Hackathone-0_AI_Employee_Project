---
name: whatsapp-handler
description: >
  WhatsApp message triage karo jab bhi WA_*.md file /Needs_Action/ mein ho.
  Har incoming message ko analyze karo — sender context identify karo, urgency decide karo,
  action plan banao, aur sensitive actions ke liye approval request banao.
  Trigger: WA_*.md file detected | "whatsapp check karo" | "messages dekho" |
  "wa process karo" | new whatsapp file in vault.
---

# WhatsApp Handler Skill

## Purpose
/Needs_Action/ mein aane wali WA_*.md files ko process karo aur structured
action plan banao Company_Handbook.md ke rules ke mutabiq.

## Trigger Conditions
- WA_*.md file /Needs_Action/ mein exist kare
- User kahe: "whatsapp check karo", "messages dekho", "wa process karo"
- Orchestrator is skill ko invoke kare

## Instructions

1. File read karo completely — YAML frontmatter aur content dono
2. Message context identify karo:
   - Known client → from Business_Goals.md ya previous /Done/ files mein naam dhundo
   - New contact → kabhi interact nahi kiya
   - Vendor → service/product provider
   - Unknown → insufficient info
3. Urgency determine karo based on keywords:
   - high: urgent, asap, emergency, payment, invoice
   - medium: deadline, project, help, please
   - low: general conversation, casual inquiry
4. Required action decide karo:
   - reply_needed: contact ne kuch poocha ya help chahiye
   - escalate: sensitive topic ya financial discussion
   - acknowledge: simple message recognition
   - no_action: spam ya irrelevant
5. /Plans/PLAN_{wa_filename}.md banao — exact format use karo
6. Agar financial ya sensitive topic:
   - Approval file banao: /Pending_Approval/wa_{id}_{date}.md
   - Plan mein REQUIRES_APPROVAL mark karo
7. Dashboard.md update karo — Recent Activity section mein add karo

## Rules (Company_Handbook.md se)
- Known clients: auto-draft reply, approval ke baad bhejo
- New contacts: HAMESHA REQUIRES_APPROVAL
- Koi bhi payment: HAMESHA REQUIRES_APPROVAL
- Urgent keywords: Prioritize response
- Doubt ho to: default REQUIRES_APPROVAL

## Output Format
- /Plans/PLAN_WA_{id}.md — action plan with checkboxes
- /Pending_Approval/wa_{id}_{date}.md — agar sensitive action ho
- Dashboard.md — updated Recent Activity

## Error Handling
- File parse nahi ho rahi → skip karo, log karo: "Parse error: {filename}"
- Message context unclear → default: new_contact rules lagao