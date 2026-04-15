# audit_logic.py
# Place in: C:\Users\YourName\AI_Employee_Project\audit_logic.py
# Used by: finance_watcher.py and subscription_auditor.py

SUBSCRIPTION_PATTERNS = {
    'netflix.com':    'Netflix',
    'spotify.com':    'Spotify',
    'adobe.com':      'Adobe Creative Cloud',
    'notion.so':      'Notion',
    'slack.com':      'Slack',
    'github.com':     'GitHub',
    'openai.com':     'OpenAI',
    'anthropic.com':  'Claude API',
    'figma.com':      'Figma',
    'dropbox.com':    'Dropbox',
    'zoom.us':        'Zoom',
    'atlassian.com':  'Atlassian',
    # Add your own subscriptions here
}

def analyze_transaction(transaction: dict) -> dict | None:
    """
    Check if a bank transaction matches a known subscription pattern.
    Returns subscription info dict if matched, None otherwise.
    Constitution: used by Finance Watcher and subscription_auditor.py
    """
    description = transaction.get('description', '').lower()
    for pattern, name in SUBSCRIPTION_PATTERNS.items():
        if pattern in description:
            return {
                'type': 'subscription',
                'name': name,
                'amount': transaction['amount'],
                'date': transaction['date']
            }
    return None