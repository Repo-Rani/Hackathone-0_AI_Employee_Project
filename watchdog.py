# watchdog.py
# Place in: C:\Users\YourName\AI_Employee_Project\watchdog.py
# Monitored by PM2 itself (autorestart: true in ecosystem.config.js)

import subprocess
import time
import logging
import os
import sys
from pathlib import Path
from datetime import datetime

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [WATCHDOG] %(levelname)s: %(message)s',
    handlers=[
        logging.FileHandler('logs/watchdog.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

VAULT_PATH = Path(os.getenv('VAULT_PATH', 'AI_Employee_Vault'))
NEEDS_ACTION = VAULT_PATH / 'Needs_Action'
LOGS_DIR = VAULT_PATH / 'Logs'

# Processes to monitor — name: command
PROCESSES = {
    'orchestrator':     [sys.executable, 'orchestrator.py'],
    'autonomous_loop':  [sys.executable, 'autonomous_loop.py'],
    'gmail_watcher':    [sys.executable, 'watchers/gmail_watcher.py'],
    'whatsapp_watcher': [sys.executable, 'watchers/whatsapp_watcher.py'],
}

# Track running processes
running = {}

def is_alive(name):
    proc = running.get(name)
    if proc is None:
        return False
    return proc.poll() is None  # None means still running

def start_process(name):
    cmd = PROCESSES[name]
    logger.warning(f'Starting {name}: {" ".join(cmd)}')
    proc = subprocess.Popen(cmd, cwd=os.getcwd())
    running[name] = proc
    return proc

def notify_human(name, reason):
    """Write a /Needs_Action/ file so Claude can alert the human."""
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filepath = NEEDS_ACTION / f'WATCHDOG_restart_{name}_{timestamp}.md'
    content = f"""---
type: watchdog_alert
process: {name}
reason: {reason}
restarted_at: {datetime.now().isoformat()}
status: pending
---

## Watchdog Alert: {name} Restarted

The process `{name}` crashed and was automatically restarted by Watchdog.

**Reason:** {reason}
**Action Required:** Check /Logs/watchdog.log for details.
"""
    filepath.write_text(content)
    logger.info(f'Notification written: {filepath.name}')

def log_action(name, action):
    """Append to daily JSON log."""
    import json
    today = datetime.now().strftime('%Y-%m-%d')
    log_file = LOGS_DIR / f'{today}.json'

    entry = {
        'timestamp': datetime.now().isoformat() + 'Z',
        'action_type': 'watchdog_restart',
        'actor': 'watchdog',
        'target': name,
        'result': action
    }

    existing = []
    if log_file.exists():
        try:
            existing = json.loads(log_file.read_text())
        except Exception:
            existing = []

    existing.append(entry)
    log_file.write_text(json.dumps(existing, indent=2))

def check_and_restart():
    for name in PROCESSES:
        if not is_alive(name):
            reason = 'process not running' if name not in running else 'process crashed'
            start_process(name)
            notify_human(name, reason)
            log_action(name, 'restarted')

def main():
    logger.info('Watchdog started — monitoring all critical processes')

    # Initial start
    for name in PROCESSES:
        start_process(name)
        time.sleep(2)  # stagger starts

    # Monitor loop — check every 60 seconds (PDF Section 7.4)
    while True:
        time.sleep(60)
        check_and_restart()

if __name__ == '__main__':
    main()