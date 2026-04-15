---
name: dashboard-updater
description: >
  Dashboard.md ko update karo latest activities, metrics, aur status ke basis par.
  Real-time insights provide karo business operations ke liye.
  Trigger: Action completed | "dashboard update karo" | "status report" |
  scheduled update request.
---

# Dashboard Updater Skill

## Purpose
AI_Employee_Vault/Dashboard.md ko update karo latest activities, pending approvals,
business metrics, aur system status ke basis par. Real-time insights provide karo
business operations aur AI employee performance ke liye.

## Trigger Conditions
- Action completed successfully
- Approval workflow executed
- New pending approval created
- Scheduled update request (every hour)
- User kahe: "dashboard update karo", "status report"

## Instructions

1. Business_Goals.md read karo current targets aur progress ke liye
2. /Pending_Approval/ folder mein files count karo
3. /Done/ folder mein recent activities count karo
4. Active projects identify karo Business_Goals.md se
5. Dashboard.md update karo structured format mein
6. Metrics calculate karo based on recent activities
7. Alerts identify karo if any thresholds crossed

## Dashboard Sections to Update
1. **Business Summary** - Revenue, projects, pending approvals
2. **Pending Approval** - Active approval requests with timestamps
3. **Recent Activity** - Last 10 completed actions
4. **Active Projects** - Current projects with status
5. **Alerts** - Any threshold breaches or important notices

## Output Format
- Dashboard.md — updated with all sections

## Dashboard Template
```
# AI Employee Dashboard
Last Updated: {timestamp}

## 📊 Business Summary
- Revenue MTD: ${revenue} / ${target} target
- Active Projects: {active_projects_count}
- Pending Approvals: {pending_approvals_count}

## ⏳ Pending Approval
| File | Action | Created | Expires |
|------|--------|---------|---------|
| {file1.md} | {action1} | {time1} | {exp1} |
| {file2.md} | {action2} | {time2} | {exp2} |

## 📥 Recent Activity (Last 10)
- [{timestamp}] {action}: {brief_description}
- [{timestamp}] {action}: {brief_description}

## 📋 Active Projects
| Project | Due | Budget | Status |
|---------|-----|--------|--------|
| {project1} | {due1} | {budget1} | {status1} |

## 🔔 Alerts
- {any_threshold_breach_or_important_notice}
```

## Metrics to Track
- Actions processed per hour
- Approval request response time
- Email processing success rate
- System uptime
- Error rates

## Error Handling
- File read error → log and continue with partial update
- Metrics calculation error → skip and log
- Dashboard write error → retry once, then alert user