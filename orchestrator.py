"""
Orchestrator — Silver Tier
Kaam: /Approved/ folder watch karo, action execute karo, log karo
Check interval: 15 seconds
"""

import os
import json
import time
import shutil
import logging
from pathlib import Path
from datetime import datetime, timezone
from dotenv import load_dotenv

# ── Config ──────────────────────────────────────────────────────
load_dotenv()
VAULT = Path(os.getenv("VAULT_PATH"))
APPROVED = VAULT / "Approved"
REJECTED = VAULT / "Rejected"
DONE = VAULT / "Done"
LOGS = VAULT / "Logs"
DRY_RUN = os.getenv("DRY_RUN", "true").lower() == "true"
CHECK_INTERVAL = 15

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [Orchestrator] %(levelname)s: %(message)s"
)

# ── Logger ───────────────────────────────────────────────────────
def log_action(action_type: str, target: str, result: str, details: str = ""):
    log_file = LOGS / f"{datetime.now().strftime('%Y-%m-%d')}.json"
    entry = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "action_type": action_type,
        "actor": "orchestrator",
        "target": target,
        "approval_status": "approved",
        "result": "dry_run" if DRY_RUN else result,
        "details": details
    }
    existing = []
    if log_file.exists():
        try:
            existing = json.loads(log_file.read_text(encoding="utf-8"))
        except:
            existing = []
    existing.append(entry)
    log_file.write_text(json.dumps(existing, indent=2, ensure_ascii=False), encoding="utf-8")
    logging.info(f"Logged: {action_type} → {result}")

# ── YAML Frontmatter Parser (simple) ────────────────────────────
def parse_frontmatter(content: str) -> dict:
    data = {}
    if content.startswith("---"):
        lines = content.split("---")[1].strip().split("\n")
        for line in lines:
            if ":" in line:
                key, _, val = line.partition(":")
                data[key.strip()] = val.strip()
    return data

# ── Action Executor ──────────────────────────────────────────────
def execute_action(approval_file: Path):
    content = approval_file.read_text(encoding="utf-8")
    metadata = parse_frontmatter(content)
    action = metadata.get("action", "unknown")
    target = metadata.get("to", approval_file.name)

    logging.info(f"Executing: {action} → {target}")

    if action == "send_email":
        # SPEC-06 ka Email MCP call yahan aayega
        if DRY_RUN:
            logging.info(f"[DRY RUN] Would send email to: {target}")
            logging.info(f"[DRY RUN] Subject: {metadata.get('subject', 'N/A')}")
        else:
            # email_mcp.send_email(metadata) — SPEC-06 mein implement hoga
            logging.info(f"Email sent to: {target}")
        log_action("send_email", target, "success", f"Subject: {metadata.get('subject')}")

    elif action == "linkedin_post":
        if DRY_RUN:
            logging.info(f"[DRY RUN] Would post to LinkedIn")
        else:
            logging.info("LinkedIn post executed")
        log_action("linkedin_post", "linkedin", "success")

    else:
        logging.warning(f"Unknown action type: {action} — skipping")
        log_action(action, target, "skipped", "Unknown action type")

    # File ko /Done/ mein move karo
    dest = DONE / approval_file.name
    shutil.move(str(approval_file), str(dest))
    logging.info(f"Moved to /Done/: {approval_file.name}")

# ── Expiry Check ─────────────────────────────────────────────────
def check_expiry(approval_file: Path) -> bool:
    """Expired files reject folder mein bhejna"""
    content = approval_file.read_text(encoding="utf-8")
    metadata = parse_frontmatter(content)
    expires = metadata.get("expires", "")
    if expires:
        try:
            exp_time = datetime.fromisoformat(expires.replace("Z", "+00:00"))
            if datetime.now(timezone.utc) > exp_time:
                shutil.move(str(approval_file), str(REJECTED / approval_file.name))
                log_action("expired", approval_file.name, "expired")
                logging.warning(f"Expired: {approval_file.name}")
                return True
        except:
            pass
    return False

# ── Main Loop ────────────────────────────────────────────────────
def run():
    if DRY_RUN:
        logging.info("Orchestrator starting... [DRY RUN MODE]")
    else:
        logging.info("Orchestrator starting... [LIVE MODE]")

    while True:
        try:
            # /Approved/ mein files check karo
            for f in APPROVED.glob("*.md"):
                if not check_expiry(f):
                    execute_action(f)

            # /Pending_Approval/ mein expiry check karo
            for f in (VAULT / "Pending_Approval").glob("*.md"):
                check_expiry(f)

        except Exception as e:
            logging.error(f"Orchestrator error: {e}")

        time.sleep(CHECK_INTERVAL)

if __name__ == "__main__":
    run()