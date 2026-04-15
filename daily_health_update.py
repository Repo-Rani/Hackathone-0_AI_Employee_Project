import subprocess
import json
import requests
import time
import os
from pathlib import Path
from datetime import datetime

def check_pm2_process(pm2_name: str) -> bool:
    """Check if a PM2 process is online"""
    try:
        result = subprocess.run(
            ['pm2', 'jlist'], capture_output=True, text=True
        )
        processes = json.loads(result.stdout)
        for p in processes:
            if p['name'] == pm2_name:
                return p['pm2_env']['status'] == 'online'
        return False
    except:
        return False

def check_odoo_health(url: str) -> bool:
    """Check if Odoo is healthy"""
    try:
        r = requests.get(url, timeout=10)
        return r.status_code == 200
    except:
        return False

def check_vault_sync(vault_path: str) -> bool:
    """Check if vault sync is working"""
    try:
        result = subprocess.run(
            ['git', '-C', vault_path, 'log', '-1', '--format=%ct'],
            capture_output=True, text=True
        )
        if result.stdout.strip():
            last_commit_time = int(result.stdout.strip())
            return (time.time() - last_commit_time) < 1800  # 30 min
        return False
    except:
        return False

def count_done_files_last_24h(vault_path: Path) -> int:
    """Count files processed in the last 24 hours"""
    try:
        done_dir = Path(vault_path) / 'Done'
        count = 0
        for file in done_dir.glob('*.md'):
            if time.time() - file.stat().st_mtime < 86400:  # 24 hours in seconds
                count += 1
        return count
    except:
        return 0

def count_pending_approvals(vault_path: Path) -> int:
    """Count pending approval files"""
    try:
        pending_dir = Path(vault_path) / 'Pending_Approval'
        count = 0
        for domain_dir in pending_dir.iterdir():
            if domain_dir.is_dir():
                count += len(list(domain_dir.glob('*.md')))
        return count
    except:
        return 0

def write_daily_health_update(vault_path: Path):
    """Write daily health update to /Updates/ directory"""
    odoo_url = "https://your-domain.com/web/health"  # This should come from env
    odoo_url = f"{os.getenv('ODOO_URL', 'https://your-domain.com')}/web/health"

    health_data = {
        'gmail_watcher': check_pm2_process('gmail-watcher'),
        'orchestrator': check_pm2_process('cloud-orchestrator'),
        'odoo': check_odoo_health(odoo_url),
        'vault_sync': check_vault_sync(str(vault_path)),
        'tasks_processed_24h': count_done_files_last_24h(vault_path),
        'pending_approvals': count_pending_approvals(vault_path),
    }

    update_file = vault_path / 'Updates' / f'HEALTH_{datetime.now().strftime("%Y-%m-%d")}.md'
    update_file.write_text(f"""---
type: health_update
generated: {datetime.now().isoformat()}
---
## ☁️ Cloud Agent Health — {datetime.now().strftime("%B %d, %Y")}

| Component | Status |
|---|---|
| Gmail Watcher | {'✅ Online' if health_data['gmail_watcher'] else '❌ Down'} |
| Cloud Orchestrator | {'✅ Online' if health_data['orchestrator'] else '❌ Down'} |
| Odoo | {'✅ Online' if health_data['odoo'] else '❌ Down'} |
| Vault Sync | {'✅ Synced' if health_data['vault_sync'] else '⚠️ Stale'} |

## Activity (Last 24h)
- Tasks Processed: {health_data['tasks_processed_24h']}
- Pending Your Approval: {health_data['pending_approvals']}
""")

if __name__ == "__main__":
    import os
    vault_path = Path(os.getenv('VAULT_PATH', '~/AI_Employee_Vault'))
    write_daily_health_update(vault_path)