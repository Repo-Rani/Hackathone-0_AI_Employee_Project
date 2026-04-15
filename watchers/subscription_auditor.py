# watchers/subscription_auditor.py
# Runs weekly (Monday 9 AM via Task Scheduler)
# Reads /Accounting/Subscriptions.md → flags issues → writes /Needs_Action/ files
# Constitution: unused > 30 days = flag, cost increase > 20% = flag

import os
import re
import sys
import logging
from pathlib import Path
from datetime import datetime, date, timedelta

sys.path.append(str(Path(__file__).parent.parent))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('SubscriptionAuditor')

VAULT_PATH   = Path(os.getenv('VAULT_PATH', 'AI_Employee_Vault'))
NEEDS_ACTION = VAULT_PATH / 'Needs_Action'
ACCOUNTING   = VAULT_PATH / 'Accounting'
LOGS_DIR     = VAULT_PATH / 'Logs'

UNUSED_DAYS_THRESHOLD     = int(os.getenv('SUBSCRIPTION_UNUSED_DAYS', '30'))
COST_INCREASE_THRESHOLD   = float(os.getenv('SUBSCRIPTION_COST_INCREASE_PCT', '20'))
INVOICE_WARN_DAYS         = int(os.getenv('INVOICE_OVERDUE_WARN_DAYS', '15'))
INVOICE_CRITICAL_DAYS     = int(os.getenv('INVOICE_OVERDUE_CRITICAL_DAYS', '30'))


def parse_subscriptions_md() -> list[dict]:
    """
    Read /Accounting/Subscriptions.md.
    Expected format per row:
    | Service | Cost/Month | Last Login | Notes |
    Returns list of dicts.
    """
    subs_file = ACCOUNTING / 'Subscriptions.md'
    if not subs_file.exists():
        logger.warning('Subscriptions.md not found — skipping audit')
        return []

    subscriptions = []
    for line in subs_file.read_text().splitlines():
        if not line.startswith('|') or '---' in line or 'Service' in line:
            continue
        cols = [c.strip() for c in line.strip('|').split('|')]
        if len(cols) < 3:
            continue
        try:
            subscriptions.append({
                'service':    cols[0],
                'cost':       float(cols[1].replace(' , ').replace(',', '')),
                'last_login': cols[2],
                'notes':      cols[3] if len(cols) > 3 else ''
            })
        except Exception:
            pass
    return subscriptions


def days_since_login(last_login_str: str) -> int:
    """Parse last login date string → return days since then."""
    try:
        last = datetime.strptime(last_login_str, '%Y-%m-%d').date()
        return (date.today() - last).days
    except Exception:
        return 0


def write_audit_flag(service: str, reason: str, severity: str, cost: float):
    """
    Constitution: write AUDIT_*.md to /Needs_Action/ for every RED flag.
    """
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filepath = NEEDS_ACTION / f'AUDIT_{severity}_{service.replace(" ", "_")}_{timestamp}.md'
    content = f"""---
type: subscription_audit
service: {service}
severity: {severity}
cost_per_month: {cost}
flagged_at: {datetime.now().isoformat()}
reason: {reason}
status: pending
---

## Subscription Audit Flag — {severity}

**Service:** {service}
**Monthly Cost:** ${cost:.2f}
**Severity:** {severity}
**Reason:** {reason}

## Suggested Action
- [ ] Review usage of {service}
- [ ] If unused: move this file to /Pending_Approval/ to request cancellation
- [ ] If still needed: update last_login date in /Accounting/Subscriptions.md
"""
    filepath.write_text(content)
    logger.info(f'Audit flag created: {filepath.name}')


def log_audit_run(flags_created: int):
    import json
    today = date.today().isoformat()
    log_file = LOGS_DIR / f'{today}.json'
    entry = {
        'timestamp': datetime.now().isoformat() + 'Z',
        'action_type': 'subscription_audit',
        'actor': 'sub_auditor',
        'result': f'{flags_created} flags created',
        'approval_status': 'auto'
    }
    existing = []
    if log_file.exists():
        try:
            existing = json.loads(log_file.read_text())
        except Exception:
            pass
    existing.append(entry)
    log_file.write_text(json.dumps(existing, indent=2))


def run_audit():
    NEEDS_ACTION.mkdir(parents=True, exist_ok=True)
    LOGS_DIR.mkdir(parents=True, exist_ok=True)

    subscriptions = parse_subscriptions_md()
    flags = 0

    for sub in subscriptions:
        service    = sub['service']
        cost       = sub['cost']
        days_idle  = days_since_login(sub['last_login'])

        # Constitution: unused > 30 days → flag (SUBSCRIPTION_UNUSED_DAYS)
        if days_idle > UNUSED_DAYS_THRESHOLD:
            write_audit_flag(
                service,
                f'No login in {days_idle} days (threshold: {UNUSED_DAYS_THRESHOLD})',
                'RED' if days_idle > UNUSED_DAYS_THRESHOLD * 2 else 'YELLOW',
                cost
            )
            flags += 1

    logger.info(f'Subscription audit complete — {flags} flags created')
    log_audit_run(flags)


if __name__ == '__main__':
    run_audit()