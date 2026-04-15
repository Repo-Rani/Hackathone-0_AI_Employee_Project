@echo off
REM Install Backend Dependencies
echo ========================================
echo Installing Backend Dependencies...
echo ========================================

cd backend

REM Create virtual environment if not exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate and install
call venv\Scripts\activate
echo Installing requirements...
pip install -r requirements.txt

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Start backend: start_backend.bat
echo 2. Test API: http://localhost:3001/docs
echo 3. Run tests: pytest tests/ -v
echo.
pause
