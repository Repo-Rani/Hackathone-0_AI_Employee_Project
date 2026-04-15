#!/usr/bin/env python3
"""
Platinum Tier Demo Script - Part 2
Simulates the Local Agent processing the approval request when user comes online
"""
import time
import os
from pathlib import Path
import shutil
from datetime import datetime

# Set up vault path
VAULT_PATH = Path("AI_Employee_Vault")
AGENT_NAME = "local_agent"

print("=== PLATINUM TIER DEMO SCENARIO - PART 2 ===")
print("Simulating: Local Agent processes approval at 8:00 AM after user review")
print()

# Step 1: Simulate user reviewing Dashboard and finding pending approval
dashboard_file = VAULT_PATH / "Dashboard.md"
try:
    dashboard_content = dashboard_file.read_text(encoding='utf-8')
except UnicodeDecodeError:
    dashboard_content = dashboard_file.read_text(encoding='cp1252')
print("STEP 1: User opens Dashboard.md at 8:00 AM")
print("       Dashboard shows: '1 item awaiting your approval'")
print()

# Step 2: User reviews the approval file
pending_approval_dir = VAULT_PATH / "Pending_Approval" / "odoo"
approval_files = list(pending_approval_dir.glob("*.md"))

if approval_files:
    approval_file = approval_files[0]
    print(f"STEP 2: User reviews approval request: {approval_file.name}")

    # Read the approval file to show its content
    content = approval_file.read_text()
    print("       Content preview:")
    for line in content.split('\n')[:10]:  # Show first 10 lines
        print(f"         {line}")
    print("         ... (content continues)")
    print()

    # Step 3: User approves by moving file to Approved/
    print("STEP 3: User approves the request")
    print("       User moves file from Pending_Approval/ to Approved/")

    approved_dir = VAULT_PATH / "Approved"
    approved_dir.mkdir(parents=True, exist_ok=True)

    approved_file = approved_dir / approval_file.name

    shutil.move(str(approval_file), str(approved_file))
    print(f"       Moved to: {approved_file}")

    print()

    # Step 4: Simulate Local Agent detecting approved file and executing
    print("STEP 4: Local Agent detects approved task")
    print("       Local Agent executing invoice posting via Odoo MCP...")

    # Simulate the actual execution (in real system, this would call Odoo MCP)
    time.sleep(2)
    print("       - Invoice posted to Odoo successfully")
    print("       - Email sent to client with invoice attachment")
    print("       - Accounting records updated")
    print("       - Payment terms applied")

    # Step 5: Local Agent moves task to Done and updates Dashboard
    print()
    print("STEP 5: Local Agent completing task")

    done_dir = VAULT_PATH / "Done"
    done_dir.mkdir(parents=True, exist_ok=True)

    done_file = done_dir / approved_file.name

    shutil.move(str(approved_file), str(done_file))
    print(f"       Task moved to Done/: {done_file.name}")

    # Step 6: Local Agent updates Dashboard (Local only updates Dashboard.md)
    print()
    print("STEP 6: Local Agent updating Dashboard.md")

    # Read with proper encoding handling
    try:
        dashboard_content = dashboard_file.read_text(encoding='utf-8')
    except UnicodeDecodeError:
        dashboard_content = dashboard_file.read_text(encoding='cp1252')

    # Add completion status to dashboard
    update_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    dashboard_update = f"\n\n## Morning Briefing - {update_time}\n- Invoice for Example Client Corp ($2,500.00) processed and sent\n- 1 task completed, 0 pending approvals\n"

    # Write with proper encoding
    dashboard_file.write_text(dashboard_content + dashboard_update, encoding='utf-8')
    print("       Dashboard.md updated with completion status")

    # Step 7: Log the action to audit trail
    print()
    print("STEP 7: Local Agent creating audit log")

    logs_dir = VAULT_PATH / "Logs"
    logs_dir.mkdir(parents=True, exist_ok=True)

    today = datetime.now().strftime('%Y-%m-%d')
    log_file = logs_dir / f"{today}.json"

    import json

    log_entry = {
        "timestamp": datetime.now().isoformat(),
        "action_type": "invoice_posted",
        "actor": "local_agent",
        "target": "odoo",
        "parameters": {"invoice_id": "odoo_draft_42", "amount": 2500.00, "client": "Example Client Corp"},
        "approval_status": "approved_by_human",
        "approved_by": "human",
        "result": "success",
        "error": None
    }

    # Read existing logs if file exists
    existing_logs = []
    if log_file.exists():
        try:
            existing_logs = json.loads(log_file.read_text())
        except:
            existing_logs = []

    existing_logs.append(log_entry)
    log_file.write_text(json.dumps(existing_logs, indent=2))

    print(f"       Audit log created: {log_file.name}")

    print()
    print("=== LOCAL AGENT TASK COMPLETE ===")
    print("The Local Agent has:")
    print("- Detected and executed the approved invoice posting")
    print("- Sent invoice to client")
    print("- Updated Dashboard.md with completion status")
    print("- Created complete audit trail in Logs/")
    print()
    print("DEMO COMPLETE: Full Platinum Tier scenario executed successfully!")

else:
    print("No approval files found in Pending_Approval/odoo/")

print()
print("DEMO PART 2 COMPLETE: Local Agent simulation finished")
print("Platinum Tier end-to-end scenario demonstrated!")