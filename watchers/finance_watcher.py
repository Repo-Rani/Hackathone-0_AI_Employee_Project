# watchers/finance_watcher.py
# Extends BaseWatcher pattern from PDF Section 2A
# Downloads bank transactions → writes to /Accounting/Current_Month.md
# Constitution: Finance Watcher never executes payments — read only

import os
import csv
import sys
import time
import logging
from pathlib import Path
from datetime import datetime, date
from abc import ABC, abstractmethod

sys.path.append(str(Path(__file__).parent.parent))
from retry_handler import with_retry, TransientError
from audit_logic import analyze_transaction

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('FinanceWatcher')

VAULT_PATH = Path(os.getenv('VAULT_PATH', 'AI_Employee_Vault'))
BANK_STATEMENTS_PATH = Path(os.getenv('BANK_STATEMENTS_PATH', 'bank_exports'))
NEEDS_ACTION = VAULT_PATH / 'Needs_Action'
ACCOUNTING = VAULT_PATH / 'Accounting'


class BaseWatcher(ABC):
    """
    Base pattern for all Gold watchers — from PDF Section 2A.
    All Gold watchers (finance, facebook, instagram, twitter, sub_auditor)
    must extend this class.
    """
    def __init__(self, vault_path: str, check_interval: int = 60):
        self.vault_path = Path(vault_path)
        self.needs_action = self.vault_path / 'Needs_Action'
        self.check_interval = check_interval
        self.logger = logging.getLogger(self.__class__.__name__)

    @abstractmethod
    def check_for_updates(self) -> list:
        """Return list of new items to process."""
        pass

    @abstractmethod
    def create_action_file(self, item) -> Path:
        """Create .md file in Needs_Action folder."""
        pass

    def run(self):
        self.logger.info(f'Starting {self.__class__.__name__}')
        while True:
            try:
                items = self.check_for_updates()
                for item in items:
                    self.create_action_file(item)
            except Exception as e:
                self.logger.error(f'Error: {e}')
            time.sleep(self.check_interval)


class FinanceWatcher(BaseWatcher):
    """
    Watches BANK_STATEMENTS_PATH for new CSV files.
    Processes each transaction → updates /Accounting/Current_Month.md
    Flags subscriptions using audit_logic.py patterns.
    """

    def __init__(self):
        super().__init__(str(VAULT_PATH), check_interval=300)  # check every 5 min
        self.processed_files = set()
        ACCOUNTING.mkdir(parents=True, exist_ok=True)
        NEEDS_ACTION.mkdir(parents=True, exist_ok=True)

    def check_for_updates(self) -> list:
        """Find new bank CSV files not yet processed."""
        new_txns = []
        if not BANK_STATEMENTS_PATH.exists():
            return []

        for csv_file in BANK_STATEMENTS_PATH.glob('*.csv'):
            if csv_file.name not in self.processed_files:
                try:
                    with open(csv_file, 'r') as f:
                        reader = csv.DictReader(f)
                        for row in reader:
                            new_txns.append({
                                'source_file': csv_file.name,
                                'date': row.get('date', row.get('Date', date.today().isoformat())),
                                'description': row.get('description', row.get('Description', '')),
                                'amount': float(row.get('amount', row.get('Amount', 0))),
                                'type': 'credit' if float(row.get('amount', 0)) > 0 else 'debit'
                            })
                    self.processed_files.add(csv_file.name)
                except Exception as e:
                    self.logger.error(f'Error reading {csv_file.name}: {e}')
        return new_txns

    def create_action_file(self, txn) -> Path:
        """
        Append transaction to /Accounting/Current_Month.md.
        If subscription detected by audit_logic.py → also write /Needs_Action/ file.
        """
        # Append to Current_Month.md
        month_file = ACCOUNTING / 'Current_Month.md'
        line = f"| {txn['date']} | {txn['description']} | ${abs(txn['amount']):.2f} | {txn['type']} |\n"

        if not month_file.exists():
            month_file.write_text(
                f"# Current Month Transactions — {date.today().strftime('%B %Y')}\n\n"
                "| Date | Description | Amount | Type |\n"
                "|------|-------------|--------|------|\n"
            )

        with open(month_file, 'a') as f:
            f.write(line)

        # Check if this is a subscription (audit_logic.py)
        sub = analyze_transaction(txn)
        if sub:
            self._flag_subscription(sub, txn)

        self.logger.info(f'Logged transaction: {txn["description"]} ${txn["amount"]}')
        return month_file

    def _flag_subscription(self, sub_info, txn):
        """Write /Needs_Action/ file for detected subscription — triggers Claude."""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filepath = NEEDS_ACTION / f'FINANCE_subscription_{sub_info["name"].replace(" ", "_")}_{timestamp}.md'
        content = f"""---
type: finance_subscription_detected
subscription_name: {sub_info["name"]}
amount: {txn["amount"]}
date: {txn["date"]}
status: pending
---

## Subscription Detected: {sub_info["name"]}

Finance Watcher detected a subscription charge.

- **Service:** {sub_info["name"]}
- **Amount:** ${abs(txn["amount"]):.2f}/month
- **Date:** {txn["date"]}
- **Transaction:** {txn["description"]}

## Suggested Actions
- [ ] Check last login date for {sub_info["name"]}
- [ ] If no login in 30+ days → create cancellation approval file
- [ ] Update /Accounting/Subscriptions.md
"""
        filepath.write_text(content)
        self.logger.info(f'Subscription flagged: {sub_info["name"]}')


if __name__ == '__main__':
    watcher = FinanceWatcher()
    watcher.run()