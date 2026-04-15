import time
import logging
import os
from pathlib import Path
from vault_sync import sync_vault_to_remote
from claim_task import claim_task

VAULT_PATH = Path(os.getenv('VAULT_PATH'))
AGENT_NAME = 'cloud_agent'

class CloudOrchestrator:
    def __init__(self):
        self.needs_action = VAULT_PATH / 'Needs_Action'
        self.logger = logging.getLogger('CloudOrchestrator')

    def scan_and_process(self):
        for domain_folder in self.needs_action.iterdir():
            if not domain_folder.is_dir():
                continue
            # Skip whatsapp — Cloud never touches it
            if domain_folder.name == 'whatsapp':
                continue

            for task_file in domain_folder.glob('*.md'):
                if claim_task(task_file, AGENT_NAME, VAULT_PATH):
                    self.process_task(task_file, domain_folder.name)

    def process_task(self, task_file: Path, domain: str):
        # Call Claude Code to reason about this task
        # Claude reads task, creates Plan.md and Pending_Approval file
        # Cloud NEVER sends/posts/pays — only drafts
        self.logger.info(f"[Cloud] Processing: {task_file.name} in {domain}")
        # ... Claude Code invocation here

    def run(self):
        while True:
            try:
                self.scan_and_process()
            except Exception as e:
                self.logger.error(f"Cloud orchestrator error: {e}")
            time.sleep(120)  # Check every 2 minutes

if __name__ == "__main__":
    orchestrator = CloudOrchestrator()
    orchestrator.run()