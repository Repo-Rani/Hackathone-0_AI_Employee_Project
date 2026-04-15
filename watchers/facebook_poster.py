# watchers/facebook_poster.py
# Watches /Social/Queue/ for POST files with "facebook" in platforms: field
# Constitution: DRY_RUN check on every run, max 3 posts/day, no client names

import os
import sys
import time
import logging
import requests
from pathlib import Path
from datetime import datetime, date

sys.path.append(str(Path(__file__).parent.parent))
from retry_handler import with_retry, TransientError

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('FacebookPoster')

VAULT_PATH        = Path(os.getenv('VAULT_PATH', 'AI_Employee_Vault'))
PAGE_ID           = os.getenv('FACEBOOK_PAGE_ID', '')
PAGE_TOKEN        = os.getenv('FACEBOOK_PAGE_TOKEN', '')
DRY_RUN           = os.getenv('DRY_RUN', 'true').lower() == 'true'
MAX_POSTS_PER_DAY = int(os.getenv('MAX_SOCIAL_POSTS_PER_DAY', '10'))
GRAPH_API_VERSION = 'v19.0'

QUEUE_DIR   = VAULT_PATH / 'Social' / 'Queue'
POSTED_DIR  = VAULT_PATH / 'Social' / 'Facebook'
LOGS_DIR    = VAULT_PATH / 'Logs'

posts_today = 0  # simple in-memory counter


def parse_frontmatter(text: str) -> dict:
    """Extract YAML frontmatter fields from .md file."""
    meta = {}
    if text.startswith('---'):
        end = text.find('---', 3)
        if end != -1:
            for line in text[3:end].strip().splitlines():
                if ':' in line:
                    k, _, v = line.partition(':')
                    meta[k.strip()] = v.strip()
    return meta


def extract_section(text: str, section_name: str) -> str:
    """Extract content under a ## Section header."""
    start = text.find(f'## {section_name}')
    if start == -1:
        return ''
    start = text.find('\n', start) + 1
    next_section = text.find('\n## ', start)
    return text[start:next_section].strip() if next_section != -1 else text[start:].strip()


@with_retry(max_attempts=3, base_delay=1, max_delay=60)
def post_to_facebook(message: str) -> dict:
    """Call Meta Graph API to publish a post."""
    url = f'https://graph.facebook.com/{GRAPH_API_VERSION}/{PAGE_ID}/feed'
    response = requests.post(url, data={
        'message': message,
        'access_token': PAGE_TOKEN
    }, timeout=15)
    if response.status_code == 429:
        raise TransientError(f'Facebook rate limit: {response.text}')
    response.raise_for_status()
    return response.json()


def log_action(filename: str, result: str, post_id: str = ''):
    """Write to /Logs/YYYY-MM-DD.json."""
    import json
    today = date.today().isoformat()
    log_file = LOGS_DIR / f'{today}.json'
    entry = {
        'timestamp': datetime.now().isoformat() + 'Z',
        'action_type': 'social_broadcast',
        'actor': 'facebook_poster',
        'target': f'facebook:{PAGE_ID}',
        'source_file': filename,
        'approval_status': 'auto',
        'result': result,
        'dry_run': DRY_RUN,
        'details': post_id
    }
    existing = []
    if log_file.exists():
        try:
            existing = __import__('json').loads(log_file.read_text())
        except Exception:
            pass
    existing.append(entry)
    log_file.write_text(json.dumps(existing, indent=2))


def process_queue():
    global posts_today
    POSTED_DIR.mkdir(parents=True, exist_ok=True)
    LOGS_DIR.mkdir(parents=True, exist_ok=True)

    for post_file in sorted(QUEUE_DIR.glob('POST_*.md')):
        if posts_today >= MAX_POSTS_PER_DAY:
            logger.warning('Daily post limit reached — stopping')
            break

        text = post_file.read_text(encoding='utf-8')
        meta = parse_frontmatter(text)

        # Constitution: every post file must have a platforms: field
        platforms = meta.get('platforms', '')
        if 'facebook' not in platforms:
            continue

        status = meta.get('status', 'queued')
        if status not in ('queued', 'approved'):
            continue

        # Extract Facebook-specific content
        fb_content = extract_section(text, 'Facebook Version')
        if not fb_content:
            logger.warning(f'{post_file.name}: No "## Facebook Version" section — skipping')
            log_action(post_file.name, 'skipped_no_content')
            continue

        if DRY_RUN:
            logger.info(f'[DRY RUN] Would post to Facebook: {fb_content[:80]}...')
            log_action(post_file.name, 'dry_run')
        else:
            result = post_to_facebook(fb_content)
            post_id = result.get('id', '')
            logger.info(f'Posted to Facebook: {post_id}')
            log_action(post_file.name, 'success', post_id)

            # Move to Facebook archive
            import shutil
            shutil.move(str(post_file), str(POSTED_DIR / post_file.name))

        posts_today += 1


def main():
    logger.info('Facebook Poster started')
    while True:
        try:
            process_queue()
        except Exception as e:
            logger.error(f'Error: {e}')
        time.sleep(300)  # check every 5 minutes


if __name__ == '__main__':
    main()