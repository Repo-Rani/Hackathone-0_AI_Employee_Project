#!/usr/bin/env python3
"""
Platinum Tier Demo Script
Simulates the Cloud Agent processing a task while Local agent is offline
"""
import time
import os
from pathlib import Path
import shutil
from datetime import datetime

# Set up vault path
VAULT_PATH = Path("AI_Employee_Vault")
AGENT_NAME = "cloud_agent"

print("=== PLATINUM TIER DEMO SCENARIO ===")
print("Simulating: Cloud Agent processing task at 2:00 AM while Local agent offline")
print()

# Step 1: Find and claim the task
needs_action_email = VAULT_PATH / "Needs_Action" / "email"
task_files = list(needs_action_email.glob("*.md"))

if task_files:
    task_file = task_files[0]
    print(f"STEP 1: Cloud Agent found new task: {task_file.name}")

    # Step 2: Claim the task using claim-by-move protocol
    in_progress_dir = VAULT_PATH / "In_Progress" / AGENT_NAME
    in_progress_dir.mkdir(parents=True, exist_ok=True)

    claimed_file = in_progress_dir / task_file.name

    try:
        shutil.move(str(task_file), str(claimed_file))
        print(f"STEP 2: Cloud Agent claimed task via atomic move")
        print(f"       Moved to: {claimed_file}")
    except FileNotFoundError:
        print("ERROR: Task already claimed by another agent")
        exit(1)

    print()

    # Step 3: Process the task (simulate Cloud agent thinking/drafting)
    print("STEP 3: Cloud Agent processing task...")
    print("       - Analyzing email content")
    print("       - Determining required actions")
    print("       - Creating invoice draft in Odoo")
    print("       - Preparing approval request")

    # Simulate processing time
    time.sleep(2)

    # Step 4: Create an approval request in Pending_Approval/odoo/
    pending_approval_dir = VAULT_PATH / "Pending_Approval" / "odoo"
    pending_approval_dir.mkdir(parents=True, exist_ok=True)

    approval_file = pending_approval_dir / f"ODOO_INVOICE_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"

    approval_content = f"""---
type: approval_request
action: odoo_post_invoice
invoice_id: odoo_draft_42
partner: Example Client Corp
amount: 2500.00
description: January 2026 Services
created: {datetime.now().isoformat()}
expires: {datetime.now().replace(day=datetime.now().day+1).isoformat()}
status: pending
agent: cloud_agent
---

## Invoice Details
- Client: Example Client Corp
- Amount: $2,500.00
- Description: January 2026 Services
- Odoo Draft Invoice ID: odoo_draft_42

## Action Required
Cloud Agent has created an invoice draft in Odoo.
To POST (confirm) this invoice and send to client:
1. Review the draft in Odoo
2. Move this file to /Approved/

## To REJECT:
Move this file to /Rejected/

---
*Created by Cloud Agent at {datetime.now().strftime('%H:%M:%S')} (simulated 2:00 AM)*
"""

    approval_file.write_text(approval_content)
    print(f"STEP 4: Cloud Agent created approval request: {approval_file.name}")

    # Step 5: Simulate vault synchronization
    print("STEP 5: Cloud Agent syncing vault to remote repository...")
    # In real scenario: git add, commit, push
    print("       Vault synced successfully")

    print()
    print("=== CLOUD AGENT TASK COMPLETE ===")
    print("The Cloud Agent has:")
    print("- Processed the email task at 2:00 AM")
    print("- Created an Odoo invoice draft")
    print("- Generated an approval request in Pending_Approval/odoo/")
    print("- Synced the vault for Local agent to see")
    print()
    print("Now waiting for Local agent to come online and approve...")

else:
    print("No tasks found in Needs_Action/email/")

print()
print("DEMO PART 1 COMPLETE: Cloud Agent simulation finished")
print("Next step: Local agent will process the approval request")