---
name: plan-generator
description: >
  Any input file ko analyze karo aur structured plan banao.
  Har input file ke liye detailed objective, analysis aur action steps provide karo.
  Trigger: Any file in /Needs_Action/ | "plan banao" | "analysis karo" |
  "suggestions do" | new file in vault.
---

# Plan Generator Skill

## Purpose
/Needs_Action/ mein aane wale kisi bhi file (EMAIL_*, WA_*, etc.) ko analyze karo aur structured
action plan banao Company_Handbook.md ke rules ke mutabiq.

## Trigger Conditions
- Any file in /Needs_Action/ mein (EMAIL_*, WA_*, etc.)
- User kahe: "plan banao", "analysis karo", "suggestions do"
- Orchestrator is skill ko invoke kare

## Instructions

1. File read karo completely — YAML frontmatter aur content dono
2. Objective determine karo — 1 line mein clear goal
3. Detailed analysis karo:
   - Main points identify karo
   - Context understand karo
   - Potential challenges dhundo
   - Available resources consider karo
4. Action steps create karo — detailed checklist
5. /Plans/PLAN_{filename}.md banao — exact format use karo
6. Agar sensitive action lag raha ho:
   - Approval file banao: /Pending_Approval/{type}_{id}_{date}.md
   - Plan mein REQUIRES_APPROVAL mark karo
7. Dashboard.md update karo — Recent Activity section mein add karo

## Rules (Company_Handbook.md se)
- Always follow company values
- Consider client priority levels
- Apply approval requirements as per handbook
- Maintain professional tone in all outputs

## Output Format
- /Plans/PLAN_{original_filename}.md — detailed action plan with checkboxes
- /Pending_Approval/{type}_{id}_{date}.md — agar sensitive action ho
- Dashboard.md — updated Recent Activity

## Plan Structure
```
---
created: {timestamp}
source_file: {original_file}
status: pending_approval
priority: {high/medium/low}
processed: false
---

# **Objective**
1-line summary of required action

# **Analysis**
Detailed analysis of the situation, including:
- Key concerns
- Available options
- Recommended approach
- Potential risks

# **Action Steps**
- [ ] Step 1
- [ ] Step 2
- [ ] Step 3

# **REQUIRES_APPROVAL**
- Specify sensitive actions that need human approval
- Include context for decision-making
```

## Error Handling
- File parse nahi ho rahi → skip karo, log karo: "Parse error: {filename}"
- Insufficient info → mark for human review