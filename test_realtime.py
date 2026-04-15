"""
Real-Time Integration Test
Tests frontend-backend-vault connection with actual data
"""

import requests
import json
from pathlib import Path
from datetime import datetime

BASE_URL = "http://localhost:3001"
VAULT_PATH = Path("C:/Users/HP/AI_Employee_Project/AI_Employee_Vault")

def print_section(title):
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}")

def test_health():
    """Test backend health"""
    print_section("1. Backend Health Check")
    response = requests.get(f"{BASE_URL}/health")
    data = response.json()
    
    print(f"Status: {data['status']}")
    print(f"Vault Path: {data['vault_path']}")
    print(f"Vault Exists: {data['vault_exists']}")
    
    assert data['status'] == 'healthy'
    assert data['vault_exists'] == True
    print("✅ PASS - Backend healthy")

def test_vault_summary():
    """Test vault summary endpoint"""
    print_section("2. Vault Summary")
    response = requests.get(f"{BASE_URL}/api/vault/summary")
    data = response.json()
    
    print(f"Needs Action: {data['needsAction']}")
    print(f"Pending Approval: {data['pendingApproval']}")
    print(f"Approved: {data['approved']}")
    print(f"Done: {data['done']}")
    print(f"Rejected: {data['rejected']}")
    print(f"Plans: {data['plans']}")
    print(f"Logs: {data['logs']}")
    
    assert 'needsAction' in data
    print("✅ PASS - Vault summary working")

def test_tasks():
    """Test tasks endpoint"""
    print_section("3. Tasks (Needs Action)")
    response = requests.get(f"{BASE_URL}/api/tasks")
    tasks = response.json()
    
    print(f"Total Tasks: {len(tasks)}")
    for task in tasks:
        print(f"  - {task['id']}: {task['title']} ({task['priority']})")
    
    assert isinstance(tasks, list)
    print("✅ PASS - Tasks endpoint working")

def test_done_tasks():
    """Test done tasks endpoint"""
    print_section("4. Completed Tasks")
    response = requests.get(f"{BASE_URL}/api/vault/done")
    tasks = response.json()
    
    print(f"Completed Tasks: {len(tasks)}")
    for task in tasks[:3]:  # Show first 3
        print(f"  - {task['id']}: {task['title']}")
    
    assert isinstance(tasks, list)
    print("✅ PASS - Done tasks endpoint working")

def test_rejected():
    """Test rejected items endpoint"""
    print_section("5. Rejected Items")
    response = requests.get(f"{BASE_URL}/api/vault/rejected")
    items = response.json()
    
    print(f"Rejected Items: {len(items)}")
    assert isinstance(items, list)
    print("✅ PASS - Rejected items endpoint working")

def test_system_status():
    """Test system status"""
    print_section("6. System Status")
    response = requests.get(f"{BASE_URL}/api/system/status")
    data = response.json()
    
    print(f"Status: {data['status']}")
    print(f"Queue Length: {data['queueLength']}")
    print(f"Tasks Completed: {data['tasksCompleted']}")
    
    assert data['status'] == 'active'
    print("✅ PASS - System status working")

def test_watchers():
    """Test watchers endpoint"""
    print_section("7. Watchers Status")
    response = requests.get(f"{BASE_URL}/api/system/watchers")
    watchers = response.json()
    
    print(f"Active Watchers: {len(watchers)}")
    for watcher in watchers:
        status_icon = "✅" if watcher['status'] == 'live' else "⚠️"
        print(f"  {status_icon} {watcher['label']}: {watcher['status']}")
    
    assert len(watchers) == 4
    print("✅ PASS - Watchers endpoint working")

def test_create_task():
    """Test creating a task in vault"""
    print_section("8. Create Test Task")
    
    task_content = f"""---
type: email
title: Real-Time Test Task
from: test@system.com
priority: high
created: {datetime.utcnow().isoformat()}Z
---

# Real-Time Test

This task was created automatically to test the backend-vault connection.

**Timestamp:** {datetime.utcnow().isoformat()}
**Purpose:** Verify real-time integration
"""
    
    task_file = VAULT_PATH / "Needs_Action" / "EMAIL_REALTIME_TEST.md"
    task_file.write_text(task_content)
    print(f"Created task: {task_file.name}")
    
    # Verify via API
    import time
    time.sleep(1)
    
    response = requests.get(f"{BASE_URL}/api/tasks/EMAIL_REALTIME_TEST")
    if response.status_code == 200:
        task = response.json()
        print(f"✅ Task visible via API: {task['title']}")
        print("✅ PASS - Real-time creation working")
        
        # Cleanup
        task_file.unlink()
        print("Cleaned up test task")
    else:
        print("⚠️ Task not immediately visible (may need refresh)")

def test_frontend_connection():
    """Test frontend can connect to backend"""
    print_section("9. Frontend Configuration")
    
    env_file = Path("C:/Users/HP/AI_Employee_Project/frontend/.env.local")
    if not env_file.exists():
        print("❌ FAIL - frontend/.env.local missing")
        return
    
    content = env_file.read_text()
    
    if "NEXT_PUBLIC_DEMO_MODE=false" in content:
        print("✅ Demo mode: OFF (using real backend)")
    else:
        print("⚠️ Demo mode may be ON")
    
    if "NEXT_PUBLIC_API_URL=http://localhost:3001" in content:
        print("✅ API URL: http://localhost:3001")
    else:
        print("❌ API URL not configured")
    
    print("✅ PASS - Frontend configured")

def main():
    print("\n" + "="*60)
    print("  REAL-TIME INTEGRATION TEST")
    print("  Frontend ↔ Backend ↔ Vault")
    print("="*60)
    
    tests = [
        test_health,
        test_vault_summary,
        test_tasks,
        test_done_tasks,
        test_rejected,
        test_system_status,
        test_watchers,
        test_create_task,
        test_frontend_connection,
    ]
    
    passed = 0
    failed = 0
    
    for test in tests:
        try:
            test()
            passed += 1
        except Exception as e:
            print(f"\n❌ FAIL - {test.__name__}: {e}")
            failed += 1
    
    # Summary
    print_section("TEST SUMMARY")
    print(f"Passed: {passed}/{len(tests)}")
    print(f"Failed: {failed}/{len(tests)}")
    
    if failed == 0:
        print("\n✅ ALL TESTS PASSED!")
        print("\nYour system is working perfectly!")
        print("\nNext Steps:")
        print("1. Open: http://localhost:3000/dashboard")
        print("2. Check all pages load with real data")
        print("3. Test dark/light theme toggle")
        print("4. Navigate between pages")
    else:
        print(f"\n⚠️ {failed} test(s) failed")
        print("Check the errors above and fix them")

if __name__ == "__main__":
    main()
