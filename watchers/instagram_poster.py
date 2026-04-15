# watchers/instagram_poster.py
# Constitution: Business account only, session file gitignored, DRY_RUN check

import os
import sys
import time
import logging
from pathlib import Path
from datetime import datetime, date

sys.path.append(str(Path(__file__).parent.parent))
from retry_handler import with_retry, TransientError

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('InstagramPoster')

VAULT_PATH    = Path(os.getenv('VAULT_PATH', 'AI_Employee_Vault'))
IG_USERNAME   = os.getenv('INSTAGRAM_USERNAME', '')
IG_PASSWORD   = os.getenv('INSTAGRAM_PASSWORD', '')
DRY_RUN       = os.getenv('DRY_RUN', 'true').lower() == 'true'
SESSION_FILE  = Path('ig_session.json')  # gitignored — Constitution Security Rule 14

QUEUE_DIR   = VAULT_PATH / 'Social' / 'Queue'
POSTED_DIR  = VAULT_PATH / 'Social' / 'Instagram'
LOGS_DIR    = VAULT_PATH / 'Logs'


def get_client():
    """Login to Instagram Business account. Reuse session if available."""
    from instagrapi import Client
    cl = Client()
    if SESSION_FILE.exists():
        cl.load_settings(SESSION_FILE)
        try:
            cl.get_timeline_feed()  # test if session is valid
            logger.info('Instagram: reused existing session')
            return cl
        except Exception:
            logger.info('Instagram: session expired, re-logging in')

    cl.login(IG_USERNAME, IG_PASSWORD)
    cl.dump_settings(SESSION_FILE)
    logger.info('Instagram: new login successful, session saved')
    return cl


def parse_frontmatter(text: str) -> dict:
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
    start = text.find(f'## {section_name}')
    if start == -1:
        return ''
    start = text.find('\n', start) + 1
    next_section = text.find('\n## ', start)
    return text[start:next_section].strip() if next_section != -1 else text[start:].strip()


def log_action(filename: str, result: str, post_id: str = ''):
    import json
    today = date.today().isoformat()
    log_file = LOGS_DIR / f'{today}.json'
    entry = {
        'timestamp': datetime.now().isoformat() + 'Z',
        'action_type': 'social_broadcast',
        'actor': 'instagram_poster',
        'target': f'instagram:{IG_USERNAME}',
        'source_file': filename,
        'approval_status': 'auto',
        'result': result,
        'dry_run': DRY_RUN,
        'details': post_id
    }
    existing = []
    if log_file.exists():
        try:
            existing = json.loads(log_file.read_text())
        except Exception:
            pass
    existing.append(entry)
    log_file.write_text(json.dumps(existing, indent=2))


def process_queue():
    POSTED_DIR.mkdir(parents=True, exist_ok=True)
    LOGS_DIR.mkdir(parents=True, exist_ok=True)
    client = None  # lazy login

    for post_file in sorted(QUEUE_DIR.glob('POST_*.md')):
        text = post_file.read_text(encoding='utf-8')
        meta = parse_frontmatter(text)

        platforms = meta.get('platforms', '')
        if 'instagram' not in platforms:
            continue

        status = meta.get('status', 'queued')
        if status not in ('queued', 'approved'):
            continue

        ig_content = extract_section(text, 'Instagram Version')
        if not ig_content:
            logger.warning(f'{post_file.name}: No "## Instagram Version" section — skipping')
            log_action(post_file.name, 'skipped_no_content')
            continue

        image_path = meta.get('image_path', '').strip()

        if DRY_RUN:
            logger.info(f'[DRY RUN] Would post to Instagram: {ig_content[:80]}...')
            log_action(post_file.name, 'dry_run')
            continue

        # Constitution: log error if image missing — do not silently fail
        if not image_path:
            logger.error(f'{post_file.name}: image_path is empty — Instagram post requires image')
            log_action(post_file.name, 'failed_no_image')
            continue

        if not Path(image_path).exists():
            logger.error(f'{post_file.name}: image not found at {image_path}')
            log_action(post_file.name, 'failed_image_not_found')
            continue

        try:
            if client is None:
                client = get_client()
            media = client.photo_upload(image_path, ig_content)
            post_id = str(media.pk)
            logger.info(f'Posted to Instagram: {post_id}')
            log_action(post_file.name, 'success', post_id)

            import shutil
            shutil.move(str(post_file), str(POSTED_DIR / post_file.name))
        except Exception as e:
            logger.error(f'Instagram post failed: {e}')
            log_action(post_file.name, f'failed: {str(e)[:100]}')


def main():
    logger.info('Instagram Poster started — Business account mode')
    while True:
        try:
            process_queue()
        except Exception as e:
            logger.error(f'Error: {e}')
        time.sleep(300)


if __name__ == '__main__':
    main()