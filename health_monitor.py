import requests
import time
import subprocess
import logging
import smtplib
import os
import json
from pathlib import Path
from datetime import datetime

PROCESSES_TO_WATCH = [
    {'name': 'gmail-watcher', 'pm2_name': 'gmail-watcher'},
    {'name': 'cloud-orchestrator', 'pm2_name': 'cloud-orchestrator'},
    {'name': 'vault-sync', 'pm2_name': 'vault-sync'},
]

HEALTH_CHECKS = [
    {'name': 'Odoo', 'url': os.getenv('ODOO_URL', 'https://your-domain.com/web/health')},
    {'name': 'Vault Git', 'check': 'git_sync_check'},
]

class PlatinumHealthMonitor:
    def __init__(self):
        self.alert_email = os.getenv('ALERT_EMAIL')
        self.logger = logging.getLogger('HealthMonitor')
        self.failure_counts = {}

    def check_pm2_process(self, pm2_name: str) -> bool:
        result = subprocess.run(
            ['pm2', 'jlist'], capture_output=True, text=True
        )
        processes = json.loads(result.stdout)
        for p in processes:
            if p['name'] == pm2_name:
                return p['pm2_env']['status'] == 'online'
        return False

    def check_odoo_health(self, url: str) -> bool:
        try:
            r = requests.get(url, timeout=10)
            return r.status_code == 200
        except:
            return False

    def check_vault_sync(self) -> bool:
        # Check last git commit was within 30 minutes
        result = subprocess.run(
            ['git', '-C', os.getenv('VAULT_PATH'),
             'log', '-1', '--format=%ct'],
            capture_output=True, text=True
        )
        if result.stdout.strip():
            last_commit_time = int(result.stdout.strip())
            return (time.time() - last_commit_time) < 1800  # 30 min
        return False

    def send_alert(self, component: str, message: str):
        # Write alert to vault so Local agent also sees it
        alert_file = Path(os.getenv('VAULT_PATH')) / 'Updates' / \
            f'ALERT_{datetime.now().strftime("%Y%m%d_%H%M%S")}.md'
        alert_file.write_text(f"""---
type: health_alert
component: {component}
severity: critical
timestamp: {datetime.now().isoformat()}
---
## 🚨 Health Alert: {component}
{message}

**Action Required**: Check Cloud VM immediately.
""")
        self.logger.critical(f"ALERT: {component} — {message}")

    def run(self):
        while True:
            for proc in PROCESSES_TO_WATCH:
                if not self.check_pm2_process(proc['pm2_name']):
                    # Auto-restart via PM2
                    subprocess.run(['pm2', 'restart', proc['pm2_name']])
                    self.send_alert(
                        proc['name'],
                        f"Process was down — auto-restarted via PM2"
                    )

            odoo_url = os.getenv('ODOO_URL', 'https://your-domain.com/web/health')
            if not self.check_odoo_health(odoo_url):
                self.send_alert('Odoo', 'Health check failed — Odoo may be down')

            if not self.check_vault_sync():
                self.send_alert('Vault Sync', 'No vault sync in 30 minutes')

            time.sleep(300)  # Check every 5 minutes

if __name__ == "__main__":
    monitor = PlatinumHealthMonitor()
    monitor.run()