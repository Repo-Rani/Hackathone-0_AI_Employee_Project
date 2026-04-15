"""
WhatsApp Watcher — Silver Tier
Kaam: Keyword-based unread messages detect karo, /Needs_Action/ mein file banao
Keywords: urgent, asap, invoice, payment, help, deadline, please, project
Check interval: 30 seconds
WARNING: Personal use only — WhatsApp ToS aware raho
"""

import os
import time
import logging
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright

# ── Config ──────────────────────────────────────────────────────
load_dotenv()
VAULT = Path(os.getenv("VAULT_PATH"))
NEEDS_ACTION = VAULT / "Needs_Action"
SESSION_PATH = os.getenv("WHATSAPP_SESSION_PATH")
CHECK_INTERVAL = 30
KEYWORDS = [
    "urgent", "asap", "invoice", "payment", "help",
    "deadline", "please", "project", "contract", "emergency"
]

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [WhatsAppWatcher] %(levelname)s: %(message)s"
)

seen_messages = set()

# ── WhatsApp Check ───────────────────────────────────────────────
def check_whatsapp() -> list:
    """Unread keyword messages return karta hai"""
    results = []
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch_persistent_context(
                SESSION_PATH,
                headless=True,           # Pehli run mein False rakho QR ke liye
                args=["--no-sandbox"]
            )
            page = browser.pages[0] if browser.pages else browser.new_page()
            page.goto("https://web.whatsapp.com", wait_until="networkidle")
            page.wait_for_timeout(5000)

            # Unread badge wale chats dhundo
            unread_chats = page.query_selector_all('[data-testid="icon-unread-count"]')

            for chat_elem in unread_chats:
                try:
                    # Parent chat container ka text lo
                    chat_text = chat_elem.evaluate(
                        "el => el.closest('[data-testid=\"cell-frame-container\"]').innerText"
                    ).lower()

                    matched_keywords = [kw for kw in KEYWORDS if kw in chat_text]
                    if matched_keywords and chat_text not in seen_messages:
                        results.append({
                            "text": chat_text[:800],
                            "keywords": matched_keywords
                        })
                        seen_messages.add(chat_text)

                except Exception:
                    pass

            browser.close()
    except Exception as e:
        logging.error(f"Playwright error: {e}")

    return results

# ── Action File Creator ──────────────────────────────────────────
def create_wa_file(msg: dict):
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    keywords_str = ", ".join(msg["keywords"])
    content = f"""---
type: whatsapp
received: {datetime.now().isoformat()}
priority: high
status: pending
keywords_matched: [{keywords_str}]
processed: false
---

## WhatsApp Message Content
{msg["text"]}

## Detected Keywords
{keywords_str}

## Suggested Actions
- [ ] Review full message in WhatsApp
- [ ] Draft reply
- [ ] Move to /Done when resolved
"""
    filepath = NEEDS_ACTION / f"WA_{ts}.md"
    filepath.write_text(content, encoding="utf-8")
    logging.info(f"Created: {filepath.name} | Keywords: {keywords_str}")

# ── Main Loop ───────────────────────────────────────────────────
def run():
    logging.info("WhatsApp Watcher starting...")
    logging.info("NOTE: First run — headless=False karo QR scan ke liye, phir True karo")

    while True:
        try:
            messages = check_whatsapp()
            for msg in messages:
                create_wa_file(msg)
            if not messages:
                logging.info("No new keyword messages")
        except Exception as e:
            logging.error(f"Main loop error: {e}")
        time.sleep(CHECK_INTERVAL)

if __name__ == "__main__":
    run()