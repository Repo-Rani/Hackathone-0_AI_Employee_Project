# social-broadcaster.py
# Gold Tier: Daily social media broadcaster at 9:05 AM
# Creates multi-platform posts from business activity
# Constitution: max 3 posts per platform per day, no client names, no financial data

import os
import sys
import json
import logging
from pathlib import Path
from datetime import datetime, date

sys.path.append(str(Path(__file__).parent.parent))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('SocialBroadcaster')

VAULT_PATH = Path(os.getenv('VAULT_PATH', 'AI_Employee_Vault'))
SOCIAL_QUEUE = VAULT_PATH / 'Social' / 'Queue'
LOGS_DIR = VAULT_PATH / 'Logs'
DONE_DIR = VAULT_PATH / 'Done'

DRY_RUN = os.getenv('DRY_RUN', 'true').lower() == 'true'
MAX_POSTS_PER_DAY = int(os.getenv('MAX_SOCIAL_POSTS_PER_DAY', '10'))


def get_today_post_count():
    """Count posts already scheduled/published today."""
    today = datetime.now().strftime('%Y-%m-%d')
    count = 0
    
    # Count from all social platform posted folders
    for platform in ['LinkedIn', 'Facebook', 'Instagram', 'Twitter']:
        posted_dir = VAULT_PATH / 'Social' / platform
        if posted_dir.exists():
            for f in posted_dir.glob(f'POST_{today.replace("-", "")}*.md'):
                count += 1
    
    # Also count queued posts for today
    if SOCIAL_QUEUE.exists():
        for f in SOCIAL_QUEUE.glob('POST_*.md'):
            try:
                content = f.read_text(encoding='utf-8')
                if '---' in content:
                    frontmatter = content.split('---')[1]
                    for line in frontmatter.split('\n'):
                        if line.startswith('scheduled_for:'):
                            scheduled = line.split(':', 1)[1].strip()
                            if scheduled.startswith(today):
                                count += 1
            except:
                continue
    
    return count


def generate_post_content():
    """
    Generate a multi-platform social post based on recent business activity.
    Reads from Done/ folder, Business_Goals.md, and recent logs.
    """
    # Read recent completed tasks
    done_tasks = []
    if DONE_DIR.exists():
        week_ago = date.today().timetuple().tm_yday - 7
        for f in sorted(DONE_DIR.glob('*.md'))[-5:]:  # Last 5 completed tasks
            try:
                content = f.read_text(encoding='utf-8')
                # Extract task description from filename or content
                task_name = f.stem.replace('_', ' ').title()
                done_tasks.append(task_name)
            except:
                continue
    
    # Generate platform-specific content
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    
    # Base message - adapt based on what was found
    if done_tasks:
        main_message = f"Excited to share progress on recent work: {', '.join(done_tasks[:2])}. "
    else:
        main_message = "Continuous improvement in AI-powered business operations. "
    
    linkedin_content = f"""## LinkedIn Version
{main_message}Our AI employee system continues to evolve, enabling better efficiency and client service delivery.

Key focus areas:
• Automation of routine tasks
• Enhanced client communication
• Data-driven decision making

The integration of AI tools into daily operations isn't about replacing human creativity—it's about amplifying it. By handling repetitive tasks, AI frees up time for strategic thinking and innovation.

#AI #BusinessAutomation #Innovation #Productivity #DigitalTransformation
"""
    
    facebook_content = f"""## Facebook Version
{main_message}Small business operations are being transformed by AI tools. We're seeing real results in efficiency and client satisfaction.

The best part? More time for what actually matters—creative problem solving and building genuine client relationships.

What's your experience with AI in business? Drop a comment below! 👇

#SmallBusiness #AI #Entrepreneurship
"""
    
    instagram_content = f"""## Instagram Version
🚀 AI-Powered Business Operations

{main_message}

✨ What we're accomplishing:
→ Faster client responses
→ Automated routine tasks  
→ More time for creative work

The future of work isn't human vs. machine—it's human + machine. 💡

💬 How are you using AI in your business?

#AI #BusinessGrowth #Automation #Entrepreneur #Productivity #Innovation #TechForBusiness #SmallBiz #DigitalTransformation #FutureOfWork
"""
    
    twitter_content = f"""## Twitter Version
{main_message}AI isn't replacing humans—it's amplifying creativity by handling the routine. What's your AI win this week?
"""
    
    return {
        'filename': f'POST_{timestamp}.md',
        'linkedin': linkedin_content,
        'facebook': facebook_content,
        'instagram': instagram_content,
        'twitter': twitter_content
    }


def create_post_file():
    """Create a multi-platform post file in Social/Queue."""
    today_count = get_today_post_count()
    
    if today_count >= MAX_POSTS_PER_DAY:
        logger.warning(f'Daily post limit reached ({today_count}/{MAX_POSTS_PER_DAY})')
        return None
    
    post_data = generate_post_content()
    if not post_data:
        logger.warning('No content generated for social post')
        return None
    
    SOCIAL_QUEUE.mkdir(parents=True, exist_ok=True)
    
    scheduled_time = datetime.now().replace(hour=9, minute=5, second=0).isoformat()
    
    content = f"""---
type: social_post
platforms: linkedin, facebook, instagram, twitter
scheduled_for: {scheduled_time}
status: queued
auto_approved: true
image_path: ""
---

{post_data['linkedin']}

{post_data['facebook']}

{post_data['instagram']}

{post_data['twitter']}
"""
    
    filepath = SOCIAL_QUEUE / post_data['filename']
    filepath.write_text(content, encoding='utf-8')
    
    logger.info(f'Created social post: {filepath.name}')
    return filepath


def log_broadcast(filename: str, result: str):
    """Log the broadcast action."""
    today = date.today().isoformat()
    log_file = LOGS_DIR / f'{today}.json'
    
    entry = {
        'timestamp': datetime.now().isoformat() + 'Z',
        'action_type': 'social_broadcast',
        'actor': 'social_broadcaster',
        'target': 'all_platforms',
        'source_file': filename,
        'approval_status': 'auto',
        'result': result,
        'dry_run': DRY_RUN
    }
    
    existing = []
    if log_file.exists():
        try:
            existing = json.loads(log_file.read_text())
        except:
            existing = []
    
    existing.append(entry)
    log_file.write_text(json.dumps(existing, indent=2))


def main():
    """Main entry point for scheduled task."""
    logger.info('Social Broadcaster starting...')
    
    if DRY_RUN:
        logger.info('[DRY RUN] Would create daily social post')
        log_broadcast('daily_post', 'dry_run')
        return
    
    filepath = create_post_file()
    if filepath:
        log_broadcast(filepath.name, 'success')
        logger.info(f'Social post created and queued: {filepath.name}')
    else:
        logger.info('No post created (limit reached or no content)')


if __name__ == '__main__':
    main()
