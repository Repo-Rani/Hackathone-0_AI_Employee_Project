"""
LinkedIn Poster — Silver Tier
Kaam: Business activity ke basis par professional LinkedIn posts generate karo aur schedule karo
Check interval: 5 minutes for scheduled posts
"""

import os
import json
import time
import shutil
from pathlib import Path
from datetime import datetime, timedelta
from dotenv import load_dotenv
import random

# ── Config ──────────────────────────────────────────────────────
load_dotenv()
VAULT = Path(os.getenv("VAULT_PATH"))
SOCIAL_QUEUE = VAULT / "Social" / "Queue"
SOCIAL_POSTED = VAULT / "Social" / "Posted"
LOGS = VAULT / "Logs"
DRY_RUN = os.getenv("DRY_RUN", "true").lower() == "true"
MAX_POSTS_PER_DAY = int(os.getenv("MAX_LINKEDIN_POSTS_PER_DAY", "5"))
CHECK_INTERVAL = 300  # 5 minutes

import logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [LinkedInPoster] %(levelname)s: %(message)s"
)

# ── Get today's post count ───────────────────────────────────────
def get_today_post_count():
    """Today ki kitni posts hui calculate karta hai"""
    today = datetime.now().strftime('%Y-%m-%d')
    count = 0

    # Check posted folder for today's posts
    for f in SOCIAL_POSTED.glob(f"POST_{today}*.md"):
        count += 1

    # Also check if any scheduled posts today will be published
    for f in SOCIAL_QUEUE.glob("POST_*.md"):
        try:
            content = f.read_text(encoding="utf-8")
            if "---" in content:
                frontmatter = content.split("---")[1]
                scheduled_for = None
                for line in frontmatter.split("\n"):
                    if line.startswith("scheduled_for:"):
                        scheduled_for = line.split(":", 1)[1].strip()
                        break
                if scheduled_for and scheduled_for.startswith(today):
                    count += 1
        except:
            continue

    return count

# ── Publish scheduled posts ──────────────────────────────────────
def publish_scheduled_posts():
    """Scheduled posts ko publish karta hai"""
    current_time = datetime.now()
    today_post_count = get_today_post_count()
    max_daily_limit = MAX_POSTS_PER_DAY

    for f in SOCIAL_QUEUE.glob("POST_*.md"):
        try:
            content = f.read_text(encoding="utf-8")

            # Parse YAML frontmatter to get scheduled_for time
            scheduled_for = None
            if content.startswith("---"):
                end_frontmatter = content.find("---", 3)
                if end_frontmatter != -1:
                    frontmatter = content[4:end_frontmatter]
                    for line in frontmatter.split("\n"):
                        if line.startswith("scheduled_for:"):
                            scheduled_for = line.split(":", 1)[1].strip()
                            break

            if scheduled_for:
                try:
                    post_time = datetime.fromisoformat(scheduled_for.replace("Z", "+00:00"))

                    # Check if it's time to post and we haven't exceeded daily limit
                    if current_time >= post_time and today_post_count < max_daily_limit:
                        if DRY_RUN:
                            logging.info(f"[DRY RUN] Would publish: {f.name}")
                        else:
                            logging.info(f"Publishing: {f.name}")

                        # Move to Posted folder
                        dest = SOCIAL_POSTED / f.name
                        shutil.move(str(f), str(dest))

                        # Log the action
                        log_post_action(f.name, "published")

                        today_post_count += 1
                        if today_post_count >= max_daily_limit:
                            logging.info(f"Daily limit of {max_daily_limit} posts reached")
                            break
                    elif today_post_count >= max_daily_limit:
                        logging.info(f"Daily limit reached, skipping {f.name}")

                except ValueError:
                    logging.error(f"Invalid date format in {f.name}: {scheduled_for}")
        except Exception as e:
            logging.error(f"Error processing {f.name}: {e}")

# ── Log post action ──────────────────────────────────────────────
def log_post_action(post_name: str, result: str, details: str = ""):
    """Post action ko log karta hai"""
    log_file = LOGS / f"{datetime.now().strftime('%Y-%m-%d')}.json"
    entry = {
        "timestamp": datetime.now().isoformat(),
        "action_type": "linkedin_post",
        "actor": "linkedin_poster",
        "target": post_name,
        "approval_status": "auto_approved",
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

# ── Generate sample posts for demo ───────────────────────────────
def check_and_generate_sample_post():
    """If no posts in queue, generate a sample post for demo"""
    if not list(SOCIAL_QUEUE.glob("POST_*.md")):
        # Only generate if there are no recent posts today
        today = datetime.now().strftime('%Y-%m-%d')
        sample_content = f"""---
type: linkedin_post
scheduled_for: {datetime.now().replace(hour=12, minute=0, second=0).isoformat()}
status: queued
auto_approved: true
topic: business_insight
---

# The Future of AI in Small Business Operations

As we continue to integrate AI into our operations, we're seeing remarkable improvements in efficiency and client responsiveness. AI assistants can now handle routine tasks, allowing our team to focus on creative problem-solving and strategic planning.

Key benefits we've observed:
- 40% reduction in routine task time
- Faster response rates to client inquiries
- Improved task tracking and accountability
- Better resource allocation insights

The key is finding the right balance between automation and human oversight.

#AI #Business #Innovation #Efficiency #Technology

What are your thoughts on AI integration in small businesses? How has it impacted your operations?
"""
        filename = f"POST_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
        filepath = SOCIAL_QUEUE / filename
        filepath.write_text(sample_content, encoding="utf-8")
        logging.info(f"Created sample post: {filename}")

# ── Main Loop ───────────────────────────────────────────────────
def run():
    logging.info(f"LinkedIn Poster starting... [DRY RUN MODE: {DRY_RUN}]")

    while True:
        try:
            # Check for scheduled posts
            publish_scheduled_posts()

            # Generate sample post if needed (for demo purposes)
            check_and_generate_sample_post()

            # Log status
            today_count = get_today_post_count()
            logging.info(f"Daily posts so far: {today_count}/{MAX_POSTS_PER_DAY}")

        except Exception as e:
            logging.error(f"LinkedIn poster error: {e}")

        time.sleep(CHECK_INTERVAL)

if __name__ == "__main__":
    run()