@echo off
REM Start FastAPI Backend Server
echo ========================================
echo Starting AI Employee FastAPI Backend...
echo ========================================

cd backend

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    call venv\Scripts\activate
    echo Installing dependencies...
    pip install -r requirements.txt
) else (
    call venv\Scripts\activate
)

echo.
echo Starting FastAPI server on http://localhost:3001
echo API Docs: http://localhost:3001/docs
echo ========================================
echo.

cd src
python -m uvicorn main:app --host 0.0.0.0 --port 3001 --reload

pause
