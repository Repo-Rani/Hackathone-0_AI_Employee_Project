---
name: autonomous-loop
description: >
  Use this skill when a batch of tasks needs to be processed without repeated
  human triggers. Trigger keywords: "process all", "handle everything in inbox",
  "run autonomously", "work through the queue", "batch process", "handle all
  pending items". Also triggered by the daily 8 AM scheduled task. This skill
  implements the Ralph Wiggum Stop Hook pattern from PDF Section 2D — Claude
  keeps working until all items are done, then outputs TASK_COMPLETE. Only use
  when Company_Handbook.md rules are fully loaded and active.
---

# Autonomous Loop Skill

## Purpose
Execute multi-step workflows end-to-end without manual triggering between steps.
Uses the Ralph Wiggum Stop Hook — Claude iterates until TASK_COMPLETE or until
a sensitive action requires human approval (LOOP_BLOCKED).

## Trigger Conditions
- "process all files in /Needs_Action/"
- Daily 8 AM automated task
- Multiple items in /Needs_Action/ that need sequential processing
- "work through everything", "clear the inbox"

## Instructions
1. Read ALL files currently in /Needs_Action/ — note the count
2. For EACH file (process one at a time):
   a. Read the file completely
   b. Determine required action using Company_Handbook.md
   c. If action is SENSITIVE (payment, new contact email, new Odoo customer):
      - Create /Pending_Approval/ file
      - Output: LOOP_BLOCKED: {reason}
      - Stop processing (wait for human approval)
   d. If action is AUTO_APPROVED:
      - Create PLAN_*.md in /Plans/
      - Execute the action (call appropriate MCP tool)
      - Mark source file: processed: true in frontmatter
      - Update Dashboard.md
      - Move source file to /Done/
3. After processing ALL files: output <promise>TASK_COMPLETE</promise>
4. If interrupted mid-loop: next run picks up from unprocessed files

## Rules (from Company_Handbook.md — ALL apply inside the loop)
- Payments: ALWAYS BLOCKED — output LOOP_BLOCKED, create /Pending_Approval/
- New contact emails: BLOCKED — create /Pending_Approval/
- New Odoo customers $500+: BLOCKED — create /Pending_Approval/
- Maximum 10 iterations (enforced by autonomous_loop.py — not overridable)
- Loop NEVER moves files to /Approved/ — only humans do that

## Output Format
- After each file processed: "STEP_DONE: processed {filename}"
- On sensitive action: "LOOP_BLOCKED: {reason}"
- On completion: "<promise>TASK_COMPLETE</promise>"
- Every iteration logged to /Logs/YYYY-MM-DD.json

## Error Handling
- If Claude CLI times out: autonomous_loop.py logs TIMEOUT, retries next iteration
- If /Needs_Action/ is empty on start: output TASK_COMPLETE immediately
- If a file is corrupted: log error, skip file, continue with next