"""
Comprehensive API Endpoint Tests
Tests all FastAPI endpoints using pytest + httpx
"""

import os
import sys
import json
import pytest
import tempfile
from pathlib import Path
from datetime import datetime, timezone
from httpx import AsyncClient, ASGITransport

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from main import app
from vault_service import VaultService


# ── Override vault service for tests ──────────────────────────────

@pytest.fixture(autouse=True)
def setup_test_vault(test_vault, monkeypatch):
    """Override the global vault service with test vault"""
    import main
    main.vault = VaultService(vault_path=test_vault)
    yield


# ── Test Client ───────────────────────────────────────────────────

@pytest.fixture
async def client():
    """Create async test client"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c


# ── Health Check Tests ────────────────────────────────────────────

@pytest.mark.asyncio
async def test_health_check(client, test_vault):
    """Test health check endpoint"""
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "vault_path" in data
    assert data["vault_exists"] is True


@pytest.mark.asyncio
async def test_root_endpoint(client):
    """Test root endpoint"""
    response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "AI Employee API"
    assert data["version"] == "1.0.0"


# ── Tasks Tests ───────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_get_tasks_empty(client, test_vault):
    """Test getting tasks when empty"""
    response = await client.get("/api/tasks")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 0


@pytest.mark.asyncio
async def test_get_tasks_with_data(client, sample_task_file):
    """Test getting tasks with data"""
    response = await client.get("/api/tasks")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["id"] == "EMAIL_001"
    assert data[0]["type"] == "email"
    assert data[0]["priority"] == "high"


@pytest.mark.asyncio
async def test_get_task_by_id(client, sample_task_file):
    """Test getting single task by ID"""
    response = await client.get("/api/tasks/EMAIL_001")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "EMAIL_001"
    assert "Invoice Request" in data["title"]


@pytest.mark.asyncio
async def test_get_task_not_found(client):
    """Test getting non-existent task"""
    response = await client.get("/api/tasks/NONEXISTENT")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_update_task_status(client, sample_task_file):
    """Test updating task status"""
    response = await client.patch(
        "/api/tasks/EMAIL_001",
        json={"status": "done"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "done"


# ── Approvals Tests ───────────────────────────────────────────────

@pytest.mark.asyncio
async def test_get_approvals_empty(client, test_vault):
    """Test getting approvals when empty"""
    response = await client.get("/api/approvals")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_get_approvals_with_data(client, sample_approval_file):
    """Test getting approvals with data"""
    response = await client.get("/api/approvals")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["id"] == "APPROVAL_001"
    assert data[0]["actionType"] == "payment"


@pytest.mark.asyncio
async def test_approve_item(client, sample_approval_file, test_vault):
    """Test approving an item"""
    response = await client.post("/api/approvals/APPROVAL_001/approve")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "approved"

    # Verify file moved to Approved
    approved_file = test_vault / "Approved" / "APPROVAL_001.md"
    assert approved_file.exists()


@pytest.mark.asyncio
async def test_reject_item(client, sample_approval_file, test_vault):
    """Test rejecting an item"""
    response = await client.post(
        "/api/approvals/APPROVAL_001/reject",
        json={"reason": "Not approved"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "rejected"

    # Verify file moved to Rejected
    rejected_file = test_vault / "Rejected" / "APPROVAL_001.md"
    assert rejected_file.exists()


# ── Plans Tests ───────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_get_plans_empty(client, test_vault):
    """Test getting plans when empty"""
    response = await client.get("/api/plans")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 0


# ── Briefings Tests ───────────────────────────────────────────────

@pytest.mark.asyncio
async def test_get_briefings_with_data(client, sample_briefing_file):
    """Test getting briefings with data"""
    response = await client.get("/api/briefings")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert "CEO Briefing" in data[0]["title"]


# ── Accounting Tests ──────────────────────────────────────────────

@pytest.mark.asyncio
async def test_get_transactions_with_data(client, sample_accounting_file):
    """Test getting transactions with data"""
    response = await client.get("/api/accounting/transactions")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_get_accounting_summary(client, sample_accounting_file):
    """Test getting accounting summary"""
    response = await client.get("/api/accounting/summary")
    assert response.status_code == 200
    data = response.json()
    assert "period" in data
    assert "totalIncome" in data
    assert "totalExpenses" in data


# ── Logs Tests ────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_get_logs_with_data(client, sample_log_file):
    """Test getting logs with data"""
    response = await client.get("/api/logs")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 2
    assert data[0]["actionType"] == "email_send"


# ── System Status Tests ───────────────────────────────────────────

@pytest.mark.asyncio
async def test_get_system_status(client):
    """Test getting system status"""
    response = await client.get("/api/system/status")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "queueLength" in data


@pytest.mark.asyncio
async def test_get_dashboard_stats(client):
    """Test getting dashboard stats"""
    response = await client.get("/api/system/stats")
    assert response.status_code == 200
    data = response.json()
    assert "revenueMTD" in data
    assert "pendingApprovals" in data


@pytest.mark.asyncio
async def test_get_watchers(client):
    """Test getting watchers"""
    response = await client.get("/api/system/watchers")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 4
    assert data[0]["id"] == "gmail"


# ── System Config Tests ───────────────────────────────────────────

@pytest.mark.asyncio
async def test_get_system_config(client):
    """Test getting system config"""
    response = await client.get("/api/system/config")
    assert response.status_code == 200
    data = response.json()
    assert "gmailCheckInterval" in data
    assert data["gmailCheckInterval"] == 120


@pytest.mark.asyncio
async def test_update_system_config(client):
    """Test updating system config"""
    new_config = {
        "gmailCheckInterval": 180,
        "whatsappCheckInterval": 45,
        "dryRun": False
    }
    response = await client.put("/api/system/config", json=new_config)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "updated"


# ── Integration Tests ─────────────────────────────────────────────

@pytest.mark.asyncio
async def test_full_approval_workflow(client, test_vault):
    """Test complete approval workflow"""
    # Create approval file
    approval_content = """---
type: approval_request
action: email_send
title: Test Email
to: test@example.com
created: 2026-01-07T10:00:00Z
---

Test approval request
"""
    approval_file = test_vault / "Pending_Approval" / "APPROVAL_TEST.md"
    approval_file.write_text(approval_content)

    # Get approvals
    response = await client.get("/api/approvals")
    assert response.status_code == 200
    approvals = response.json()
    assert len(approvals) == 1

    # Approve
    response = await client.post("/api/approvals/APPROVAL_TEST/approve")
    assert response.status_code == 200

    # Verify moved
    approved_file = test_vault / "Approved" / "APPROVAL_TEST.md"
    assert approved_file.exists()

    # Check approvals again (should be empty)
    response = await client.get("/api/approvals")
    approvals = response.json()
    assert len(approvals) == 0


@pytest.mark.asyncio
async def test_task_lifecycle(client, test_vault):
    """Test complete task lifecycle"""
    # Create task
    task_content = """---
type: email
title: Test Task
from: test@example.com
priority: medium
---

Test task content
"""
    task_file = test_vault / "Needs_Action" / "EMAIL_TEST.md"
    task_file.write_text(task_content)

    # Get tasks
    response = await client.get("/api/tasks")
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) == 1

    # Update task to done
    response = await client.patch("/api/tasks/EMAIL_TEST", json={"status": "done"})
    assert response.status_code == 200

    # Verify moved to Done
    done_file = test_vault / "Done" / "EMAIL_TEST.md"
    assert done_file.exists()
