# watchers/twitter_poster.py
# Constitution: OAuth 1.0a, max 240 chars, no hashtags in main tweet body

import os
import sys
import time
import logging
import tweepy
from pathlib import Path
from datetime import datetime, date

sys.path.append(str(Path(__file__).parent.parent))
from retry_handler import with_retry, TransientError

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('TwitterPoster')

VAULT_PATH = Path(os.getenv('VAULT_PATH', 'AI_Employee_Vault'))
API_KEY    = os.getenv('TWITTER_API_KEY', '')
API_SECRET = os.getenv('TWITTER_API_SECRET', '')
ACC_TOKEN  = os.getenv('TWITTER_ACCESS_TOKEN', '')
ACC_SECRET = os.getenv('TWITTER_ACCESS_SECRET', '')
DRY_RUN    = os.getenv('DRY_RUN', 'true').lower() == 'true'

QUEUE_DIR  = VAULT_PATH / 'Social' / 'Queue'
POSTED_DIR = VAULT_PATH / 'Social' / 'Twitter'
LOGS_DIR   = VAULT_PATH / 'Logs'

TWITTER_MAX_CHARS = 240  # Constitution: "Under 240 chars"


def get_client():
    """Tweepy v4 client — OAuth 1.0a (Read+Write permission required)."""
    return tweepy.Client(
        consumer_key=API_KEY,
        consumer_secret=API_SECRET,
        access_token=ACC_TOKEN,
        access_token_secret=ACC_SECRET
    )


def truncate_for_twitter(text: str) -> str:
    """
    Constitution: Twitter max 240 chars.
    Truncation strategy: cut at last sentence boundary within limit.
    """
    if len(text) <= TWITTER_MAX_CHARS:
        return text
    truncated = text[:TWITTER_MAX_CHARS - 3]
    # Try to end at a sentence
    last_period = max(truncated.rfind('.'), truncated.rfind('!'), truncated.rfind('?'))
    if last_period > TWITTER_MAX_CHARS * 0.6:
        return truncated[:last_period + 1]
    return truncated + '...'


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


def log_action(filename: str, result: str, tweet_id: str = ''):
    import json
    today = date.today().isoformat()
    log_file = LOGS_DIR / f'{today}.json'
    entry = {
        'timestamp': datetime.now().isoformat() + 'Z',
        'action_type': 'social_broadcast',
        'actor': 'twitter_poster',
        'target': 'twitter:@handle',
        'source_file': filename,
        'approval_status': 'auto',
        'result': result,
        'dry_run': DRY_RUN,
        'details': tweet_id
    }
    existing = []
    if log_file.exists():
        try:
            existing = json.loads(log_file.read_text())
        except Exception:
            pass
    existing.append(entry)
    log_file.write_text(json.dumps(existing, indent=2))


@with_retry(max_attempts=3, base_delay=1, max_delay=60)
def post_tweet(client, text: str) -> str:
    response = client.create_tweet(text=text)
    return str(response.data['id'])


def process_queue():
    POSTED_DIR.mkdir(parents=True, exist_ok=True)
    LOGS_DIR.mkdir(parents=True, exist_ok=True)
    client = None

    for post_file in sorted(QUEUE_DIR.glob('POST_*.md')):
        text = post_file.read_text(encoding='utf-8')
        meta = parse_frontmatter(text)

        platforms = meta.get('platforms', '')
        if 'twitter' not in platforms:
            continue

        status = meta.get('status', 'queued')
        if status not in ('queued', 'approved'):
            continue

        tw_content = extract_section(text, 'Twitter Version')
        if not tw_content:
            logger.warning(f'{post_file.name}: No "## Twitter Version" section — skipping')
            log_action(post_file.name, 'skipped_no_content')
            continue

        # Constitution: max 240 chars — truncate if needed
        tw_content = truncate_for_twitter(tw_content)

        if DRY_RUN:
            logger.info(f'[DRY RUN] Would tweet ({len(tw_content)} chars): {tw_content[:80]}...')
            log_action(post_file.name, 'dry_run')
            continue

        try:
            if client is None:
                client = get_client()
            tweet_id = post_tweet(client, tw_content)
            logger.info(f'Tweeted: {tweet_id}')
            log_action(post_file.name, 'success', tweet_id)

            import shutil
            shutil.move(str(post_file), str(POSTED_DIR / post_file.name))
        except Exception as e:
            logger.error(f'Tweet failed: {e}')
            log_action(post_file.name, f'failed: {str(e)[:100]}')


def main():
    logger.info('Twitter Poster started')
    while True:
        try:
            process_queue()
        except Exception as e:
            logger.error(f'Error: {e}')
        time.sleep(300)


if __name__ == '__main__':
    main()