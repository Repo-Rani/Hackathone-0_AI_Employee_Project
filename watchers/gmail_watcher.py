"""
Gmail Watcher — Silver Tier
Kaam: Important/unread emails monitor karo, /Needs_Action/ mein .md file banao
Check interval: 120 seconds
"""

import os
import time
import logging
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

# ── Config ──────────────────────────────────────────────────────
load_dotenv()
VAULT = Path(os.getenv("VAULT_PATH"))
NEEDS_ACTION = VAULT / "Needs_Action"
CREDS_PATH = os.getenv("GMAIL_CREDENTIALS_PATH")
TOKEN_PATH = Path("gmail_token.json")
SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]

CHECK_INTERVAL = 120  # seconds

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [GmailWatcher] %(levelname)s: %(message)s"
)

# ── Auth ────────────────────────────────────────────────────────
def get_service():
    creds = None
    if TOKEN_PATH.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_PATH), SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CREDS_PATH, SCOPES)
            creds = flow.run_local_server(port=0)
        TOKEN_PATH.write_text(creds.to_json())
    return build("gmail", "v1", credentials=creds)

# ── Action File Creator ──────────────────────────────────────────
def create_action_file(service, msg_id: str, processed: set):
    """Email padhta hai aur /Needs_Action/ mein .md file banata hai"""
    msg = service.users().messages().get(userId="me", id=msg_id, format="full").execute()
    hdrs = {h["name"]: h["value"] for h in msg["payload"]["headers"]}

    sender = hdrs.get("From", "Unknown")
    subject = hdrs.get("Subject", "No Subject")
    snippet = msg.get("snippet", "")
    date = hdrs.get("Date", datetime.now().isoformat())

    content = f"""---
type: email
from: {sender}
subject: {subject}
email_date: {date}
received: {datetime.now().isoformat()}
priority: high
status: pending
msg_id: {msg_id}
processed: false
---

## Email Content
{snippet}

## Suggested Actions
- [ ] Review email fully
- [ ] Draft reply if needed
- [ ] Move to /Done when resolved
"""
    filepath = NEEDS_ACTION / f"EMAIL_{msg_id}.md"
    filepath.write_text(content, encoding="utf-8")
    processed.add(msg_id)
    logging.info(f"Created: {filepath.name} | From: {sender[:40]}")

# ── Main Loop ───────────────────────────────────────────────────
def run():
    logging.info("Gmail Watcher starting...")
    service = get_service()
    processed = set()

    while True:
        try:
            results = service.users().messages().list(
                userId="me",
                q="is:unread is:important"
            ).execute()
            messages = results.get("messages", [])

            new_count = 0
            for m in messages:
                if m["id"] not in processed:
                    create_action_file(service, m["id"], processed)
                    new_count += 1

            if new_count > 0:
                logging.info(f"Processed {new_count} new email(s)")
            else:
                logging.info("No new important emails")

        except Exception as e:
            logging.error(f"Error checking Gmail: {e}")

        time.sleep(CHECK_INTERVAL)

if __name__ == "__main__":
    run()