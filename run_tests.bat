@echo off
REM Run All Tests (Backend + Integration)
echo ========================================
echo Running All Tests...
echo ========================================

cd backend

REM Activate virtual environment
if exist "venv" (
    call venv\Scripts\activate
) else (
    echo Virtual environment not found. Run: install_backend.bat
    pause
    exit /b 1
)

echo.
echo [1/2] Running Backend API Tests...
echo ========================================
pytest tests/test_api.py -v --tb=short

echo.
echo [2/2] Running Integration Tests...
echo ========================================
cd ..
python test_integration.py

echo.
echo ========================================
echo Tests Complete!
echo ========================================
pause
