@echo off
REM Full System Test - Backend + Frontend Integration
echo ========================================
echo  AI EMPLOYEE - FULL SYSTEM TEST
echo ========================================
echo.

REM Step 1: Stop any running backend
echo [1/6] Stopping old backend processes...
taskkill /F /IM python.exe 2>nul
timeout /t 2 >nul

REM Step 2: Start backend in background
echo [2/6] Starting FastAPI backend...
cd backend\src
start "Backend Server" cmd /k "..\venv\Scripts\activate && python -m uvicorn main:app --host 0.0.0.0 --port 3001 --reload"
cd ..\..

echo      Waiting for backend to start...
timeout /t 5 >nul

REM Step 3: Test all endpoints
echo.
echo [3/6] Testing Backend Endpoints...
echo ========================================

echo.
echo Testing Health Check:
curl -s http://localhost:3001/health | python -m json.tool

echo.
echo Testing Vault Summary:
curl -s http://localhost:3001/api/vault/summary | python -m json.tool

echo.
echo Testing Tasks:
curl -s http://localhost:3001/api/tasks | python -m json.tool

echo.
echo Testing Done Tasks:
curl -s http://localhost:3001/api/vault/done | python -m json.tool

echo.
echo Testing Rejected Items:
curl -s http://localhost:3001/api/vault/rejected | python -m json.tool

echo.
echo Testing System Status:
curl -s http://localhost:3001/api/system/status | python -m json.tool

echo.
echo Testing Watchers:
curl -s http://localhost:3001/api/system/watchers | python -m json.tool

REM Step 4: Run backend tests
echo.
echo [4/6] Running Backend Unit Tests...
echo ========================================
cd backend
call venv\Scripts\activate
pytest tests/test_api.py -v --tb=short -q
cd ..

REM Step 5: Check frontend
echo.
echo [5/6] Checking Frontend...
echo ========================================
echo Frontend should be running at: http://localhost:3000
echo.
echo Test these pages in your browser:
echo   - http://localhost:3000/dashboard
echo   - http://localhost:3000/inbox
echo   - http://localhost:3000/approvals
echo   - http://localhost:3000/done
echo   - http://localhost:3000/rejected
echo   - http://localhost:3000/approved
echo   - http://localhost:3000/plans
echo   - http://localhost:3000/logs
echo   - http://localhost:3000/accounting
echo   - http://localhost:3000/briefings

REM Step 6: Summary
echo.
echo [6/6] Test Summary
echo ========================================
echo.
echo Backend API Tests:
curl -s http://localhost:3001/health >nul 2>&1
if %errorlevel% equ 0 (
    echo   [PASS] Backend is running
) else (
    echo   [FAIL] Backend is not running
)

curl -s http://localhost:3001/api/vault/summary >nul 2>&1
if %errorlevel% equ 0 (
    echo   [PASS] Vault Summary endpoint
) else (
    echo   [FAIL] Vault Summary endpoint
)

curl -s http://localhost:3001/api/vault/done >nul 2>&1
if %errorlevel% equ 0 (
    echo   [PASS] Done tasks endpoint
) else (
    echo   [FAIL] Done tasks endpoint
)

curl -s http://localhost:3001/api/vault/rejected >nul 2>&1
if %errorlevel% equ 0 (
    echo   [PASS] Rejected items endpoint
) else (
    echo   [FAIL] Rejected items endpoint
)

curl -s http://localhost:3001/api/tasks >nul 2>&1
if %errorlevel% equ 0 (
    echo   [PASS] Tasks endpoint
) else (
    echo   [FAIL] Tasks endpoint
)

echo.
echo ========================================
echo  TEST COMPLETE!
echo ========================================
echo.
echo Next Steps:
echo 1. Open browser: http://localhost:3000/dashboard
echo 2. Check all pages load correctly
echo 3. Verify dark/light theme works
echo 4. Test navigation sidebar
echo.
pause
