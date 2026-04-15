import time
import logging
import os
from pathlib import Path

class LocalOrchestrator:
    def __init__(self):
        self.vault_path = Path(os.getenv('VAULT_PATH', '~/AI_Employee_Vault'))
        self.logger = logging.getLogger('LocalOrchestrator')

    def process_approved_tasks(self):
        """Process tasks that have been approved by human"""
        approved_dir = self.vault_path / 'Approved'

        for task_file in approved_dir.glob('*.md'):
            self.logger.info(f"Processing approved task: {task_file.name}")
            # This would execute the actual task via MCP servers
            # For example, send email, post to social media, execute payment, etc.

            # Move to Done after processing
            done_dir = self.vault_path / 'Done'
            done_dir.mkdir(parents=True, exist_ok=True)
            task_file.rename(done_dir / task_file.name)

    def update_dashboard(self):
        """Update Dashboard.md with current status (Local only)"""
        dashboard_file = self.vault_path / 'Dashboard.md'

        # Read current dashboard
        content = ""
        if dashboard_file.exists():
            content = dashboard_file.read_text()

        # Add update information
        update_info = f"\n\nLast updated: {time.strftime('%Y-%m-%d %H:%M:%S')}\n"

        # Write back to dashboard (Local only writes to Dashboard.md)
        dashboard_file.write_text(content + update_info)

    def run(self):
        while True:
            try:
                self.process_approved_tasks()
                self.update_dashboard()
            except Exception as e:
                self.logger.error(f"Local orchestrator error: {e}")
            time.sleep(120)  # Check every 2 minutes

if __name__ == "__main__":
    orchestrator = LocalOrchestrator()
    orchestrator.run()