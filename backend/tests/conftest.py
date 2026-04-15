"""
Pytest Configuration & Fixtures
"""

import os
import sys
import pytest
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from vault_service import VaultService


@pytest.fixture
def test_vault(tmp_path):
    """Create a temporary vault for testing"""
    vault = tmp_path / "AI_Employee_Vault"
    vault.mkdir()

    # Create required directories
    (vault / "Needs_Action").mkdir()
    (vault / "Pending_Approval").mkdir()
    (vault / "Approved").mkdir()
    (vault / "Rejected").mkdir()
    (vault / "Done").mkdir()
    (vault / "Plans").mkdir()
    (vault / "Logs").mkdir()
    (vault / "Accounting").mkdir()
    (vault / "Briefings").mkdir()
    (vault / "Briefings" / "Weekly").mkdir()

    return vault


@pytest.fixture
def vault_service(test_vault):
    """Create vault service with test vault"""
    return VaultService(vault_path=test_vault)


@pytest.fixture
def sample_task_file(test_vault):
    """Create a sample task file"""
    task_content = """---
type: email
title: Invoice Request
from: client@example.com
priority: high
created: 2026-01-07T10:30:00Z
---

# Invoice Request

Please send invoice for January services.

**Client:** Test Client
**Amount:** $1,500
**Due Date:** January 15, 2026
"""
    task_file = test_vault / "Needs_Action" / "EMAIL_001.md"
    task_file.write_text(task_content)
    return task_file


@pytest.fixture
def sample_approval_file(test_vault):
    """Create a sample approval file"""
    approval_content = """---
type: approval_request
action: payment
title: Client Payment
to: vendor@example.com
amount: 500
created: 2026-01-07T11:00:00Z
expires: 2026-01-08T11:00:00Z
---

# Payment Approval Request

Payment of $500 to Vendor for services rendered.

**Amount:** $500
**Recipient:** Vendor
**Reference:** INV-2026-001
"""
    approval_file = test_vault / "Pending_Approval" / "APPROVAL_001.md"
    approval_file.write_text(approval_content)
    return approval_file


@pytest.fixture
def sample_log_file(test_vault):
    """Create a sample log file"""
    import json
    log_entries = [
        {
            "timestamp": "2026-01-07T11:30:00Z",
            "action_type": "email_send",
            "actor": "orchestrator",
            "target": "client@example.com",
            "result": "success",
            "approval_status": "approved"
        },
        {
            "timestamp": "2026-01-07T11:28:00Z",
            "action_type": "watcher_trigger",
            "actor": "gmail_watcher",
            "target": "Gmail",
            "result": "success"
        }
    ]
    log_file = test_vault / "Logs" / "2026-01-07.json"
    log_file.write_text(json.dumps(log_entries, indent=2))
    return log_file


@pytest.fixture
def sample_briefing_file(test_vault):
    """Create a sample briefing file"""
    briefing_content = """---
type: briefing
date: 2026-01-06
period: Jan 1-6, 2026
title: Monday Morning CEO Briefing
generated: 2026-01-06T08:00:00Z
---

# CEO Weekly Briefing

## Revenue
- Weekly Revenue: $11,100
- Target: $12,000
- Trend: Up 8%

## Completed Tasks
- Process Q1 contracts
- Schedule client meetings
"""
    briefing_file = test_vault / "Briefings" / "Weekly" / "CEO_Briefing_2026-01-06.md"
    briefing_file.write_text(briefing_content)
    return briefing_file


@pytest.fixture
def sample_accounting_file(test_vault):
    """Create a sample accounting file"""
    accounting_content = """# Current Month Transactions

| Date | Description | Category | Amount |
|------|-------------|----------|--------|
| 2026-01-06 | Client Payment | Income | $5000 |
| 2026-01-05 | Software Subscription | Expense | $-99.99 |
| 2026-01-04 | Payment Processing | Expense | $-25.50 |
"""
    accounting_file = test_vault / "Accounting" / "Current_Month.md"
    accounting_file.write_text(accounting_content)
    return accounting_file
