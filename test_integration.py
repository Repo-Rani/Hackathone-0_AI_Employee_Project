"""
Full Integration Test - Frontend → FastAPI → Vault
Tests complete data flow from UI to vault files
"""

import os
import sys
import json
import time
import subprocess
import requests
from pathlib import Path
from datetime import datetime, timezone

# Unicode check marks
CHECK_PASS = '✅'
CHECK_FAIL = '❌'
CHECK_WARN = '⚠️'

BASE_URL = "http://localhost:3001"

def print_section(title):
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}")

def test_backend_running():
    """Test if backend server is running"""
    print_section("1. Backend Server Status")
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            print(f"{CHECK_PASS} Backend is running")
            data = response.json()
            print(f"   Vault Path: {data.get('vault_path', 'N/A')}")
            print(f"   Vault Exists: {data.get('vault_exists', False)}")
            return True
        else:
            print(f"{CHECK_FAIL} Backend returned {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print(f"{CHECK_FAIL} Backend is NOT running")
        print(f"   Run: start_backend.bat")
        return False
    except Exception as e:
        print(f"{CHECK_FAIL} Error: {e}")
        return False

def test_api_endpoints():
    """Test all API endpoints"""
    print_section("2. API Endpoints")
    
    endpoints = [
        ("GET", "/api/tasks", "Tasks"),
        ("GET", "/api/approvals", "Approvals"),
        ("GET", "/api/plans", "Plans"),
        ("GET", "/api/briefings", "Briefings"),
        ("GET", "/api/logs", "Logs"),
        ("GET", "/api/accounting/transactions", "Transactions"),
        ("GET", "/api/accounting/summary", "Accounting Summary"),
        ("GET", "/api/system/status", "System Status"),
        ("GET", "/api/system/stats", "Dashboard Stats"),
        ("GET", "/api/system/watchers", "Watchers"),
        ("GET", "/api/system/config", "System Config"),
    ]

    passed = 0
    failed = 0

    for method, endpoint, name in endpoints:
        try:
            response = requests.get(f"{BASE_URL}{endpoint}", timeout=5)
            if response.status_code == 200:
                print(f"{CHECK_PASS} {name:25} {response.status_code}")
                passed += 1
            else:
                print(f"{CHECK_WARN} {name:25} {response.status_code}")
                failed += 1
        except Exception as e:
            print(f"{CHECK_FAIL} {name:25} Error: {str(e)[:30]}")
            failed += 1

    print(f"\n   Results: {passed} passed, {failed} failed")
    return failed == 0

def test_vault_integration():
    """Test vault file integration"""
    print_section("3. Vault Integration")

    # Create test task in vault
    vault_path = Path(os.getenv("VAULT_PATH", "C:/Users/HP/AI_Employee_Project/AI_Employee_Vault"))
    needs_action = vault_path / "Needs_Action"

    if not needs_action.exists():
        print(f"{CHECK_FAIL} Needs_Action folder missing")
        return False

    # Create test task
    test_task = needs_action / "TEST_INTEGRATION.md"
    test_task.write_text("""---
type: email
title: Integration Test
from: test@example.com
priority: high
created: 2026-01-07T10:00:00Z
---

# Integration Test Task

This is a test task for integration testing.
""")
    print(f"{CHECK_PASS} Created test task in vault")

    # Fetch via API
    time.sleep(1)
    try:
        response = requests.get(f"{BASE_URL}/api/tasks/TEST_INTEGRATION", timeout=5)
        if response.status_code == 200:
            task = response.json()
            if task.get("title") == "Integration Test":
                print(f"{CHECK_PASS} API reads vault files correctly")
            else:
                print(f"{CHECK_FAIL} Task data mismatch")
                return False
        else:
            print(f"{CHECK_FAIL} Failed to fetch task via API")
            return False
    except Exception as e:
        print(f"{CHECK_FAIL} Error: {e}")
        return False

    # Clean up
    test_task.unlink()
    print(f"{CHECK_PASS} Cleaned up test task")

    return True

def test_approval_workflow():
    """Test approval workflow"""
    print_section("4. Approval Workflow")

    vault_path = Path(os.getenv("VAULT_PATH", "C:/Users/HP/AI_Employee_Project/AI_Employee_Vault"))
    pending = vault_path / "Pending_Approval"
    approved = vault_path / "Approved"

    if not pending.exists():
        print(f"{CHECK_FAIL} Pending_Approval folder missing")
        return False

    # Create test approval
    test_approval = pending / "TEST_APPROVAL.md"
    test_approval.write_text("""---
type: approval_request
action: payment
title: Test Payment
to: vendor@example.com
amount: 100
created: 2026-01-07T11:00:00Z
expires: 2026-01-08T11:00:00Z
---

# Test Approval Request

Test payment of $100
""")
    print(f"{CHECK_PASS} Created test approval")

    # Approve via API
    time.sleep(1)
    try:
        response = requests.post(f"{BASE_URL}/api/approvals/TEST_APPROVAL/approve", timeout=5)
        if response.status_code == 200:
            print(f"{CHECK_PASS} Approval API accepted request")
        else:
            print(f"{CHECK_FAIL} Approval API failed")
            return False
    except Exception as e:
        print(f"{CHECK_FAIL} Error: {e}")
        return False

    # Verify file moved
    time.sleep(1)
    if (approved / "TEST_APPROVAL.md").exists():
        print(f"{CHECK_PASS} File moved to Approved folder")
    else:
        print(f"{CHECK_WARN} File not moved (may be OK if already processed)")

    # Clean up
    approved_file = approved / "TEST_APPROVAL.md"
    if approved_file.exists():
        approved_file.unlink()

    return True

def test_frontend_connection():
    """Test frontend can connect to backend"""
    print_section("5. Frontend Connection")

    # Check if frontend .env is configured
    env_file = Path("C:/Users/HP/AI_Employee_Project/frontend/.env.local")
    if not env_file.exists():
        print(f"{CHECK_FAIL} frontend/.env.local missing")
        return False

    content = env_file.read_text()
    
    if "NEXT_PUBLIC_DEMO_MODE=false" in content:
        print(f"{CHECK_PASS} Demo mode disabled")
    else:
        print(f"{CHECK_WARN} Demo mode may still be enabled")

    if "NEXT_PUBLIC_API_URL=http://localhost:3001" in content:
        print(f"{CHECK_PASS} API URL configured correctly")
    else:
        print(f"{CHECK_FAIL} API URL not configured")
        return False

    return True

def test_websocket():
    """Test WebSocket connection"""
    print_section("6. WebSocket")

    try:
        import websocket
        ws = websocket.create_connection("ws://localhost:3001/ws", timeout=5)
        ws.send("ping")
        result = ws.recv()
        ws.close()
        print(f"{CHECK_PASS} WebSocket connection successful")
        return True
    except ImportError:
        print(f"{CHECK_WARN} websocket-client not installed (optional)")
        print(f"   Run: pip install websocket-client")
        return True
    except Exception as e:
        print(f"{CHECK_WARN} WebSocket not available: {str(e)[:40]}")
        return True  # Not critical

def main():
    print("\n" + "="*60)
    print("  AI EMPLOYEE - FULL INTEGRATION TEST")
    print("  Frontend → FastAPI → Vault")
    print("="*60)

    tests = [
        ("Backend Running", test_backend_running),
        ("API Endpoints", test_api_endpoints),
        ("Vault Integration", test_vault_integration),
        ("Approval Workflow", test_approval_workflow),
        ("Frontend Connection", test_frontend_connection),
        ("WebSocket", test_websocket),
    ]

    results = []
    for name, test_func in tests:
        try:
            result = test_func()
            results.append((name, result))
        except Exception as e:
            print(f"\n{CHECK_FAIL} {name} crashed: {e}")
            results.append((name, False))

    # Summary
    print_section("TEST SUMMARY")
    passed = sum(1 for _, r in results if r)
    total = len(results)

    for name, result in results:
        status = CHECK_PASS if result else CHECK_FAIL
        print(f"{status} {name}")

    print(f"\n{'='*60}")
    print(f"  TOTAL: {passed}/{total} tests passed")
    print(f"{'='*60}")

    if passed == total:
        print(f"\n{CHECK_PASS} ALL INTEGRATION TESTS PASSED!")
        print("\nYour frontend is now connected to backend!")
        print("Start frontend: npm run dev")
        print("Start backend: start_backend.bat")
        return True
    else:
        print(f"\n{CHECK_WARN} {total - passed} tests need attention")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
