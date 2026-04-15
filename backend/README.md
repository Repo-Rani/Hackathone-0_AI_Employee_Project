# Backend API - FastAPI Server

FastAPI backend that bridges AI Employee Vault with Next.js Frontend.

## Architecture

```
Frontend (Next.js:3000)
         ↓ HTTP/WebSocket
Backend (FastAPI:3001)
         ↓ File I/O
AI_Employee_Vault/
```

## Setup

### 1. Install Dependencies

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment

Create `.env` file in project root:

```env
VAULT_PATH=C:/Users/HP/AI_Employee_Project/AI_Employee_Vault
```

### 3. Start Server

**Option A: Using batch file (Recommended)**
```bash
# From project root
start_backend.bat
```

**Option B: Manual**
```bash
cd backend\src
python -m uvicorn main:app --host 0.0.0.0 --port 3001 --reload
```

Server will start at: `http://localhost:3001`
API Docs: `http://localhost:3001/docs`

## API Endpoints

### Tasks
- `GET /api/tasks` - List all tasks
- `GET /api/tasks/{id}` - Get single task
- `PATCH /api/tasks/{id}` - Update task status
- `POST /api/tasks/{id}/create-plan` - Create plan for task

### Approvals
- `GET /api/approvals` - List all approvals
- `POST /api/approvals/{id}/approve` - Approve item
- `POST /api/approvals/{id}/reject` - Reject item

### Plans
- `GET /api/plans` - List all plans

### Briefings
- `GET /api/briefings` - List CEO briefings

### Accounting
- `GET /api/accounting/transactions` - List transactions
- `GET /api/accounting/summary` - Get accounting summary

### Logs
- `GET /api/logs` - List audit logs

### System
- `GET /api/system/status` - Get system status
- `GET /api/system/stats` - Get dashboard stats
- `GET /api/system/watchers` - Get watcher status
- `GET /api/system/config` - Get system config
- `PUT /api/system/config` - Update system config

### WebSocket
- `WS /ws` - Real-time vault change notifications

### Health
- `GET /health` - Health check
- `GET /` - API info

## Testing

### Run Backend Tests

```bash
cd backend
pytest tests/ -v
```

### Run Integration Tests

```bash
# From project root (backend must be running)
python test_integration.py
```

### Run Frontend Tests

```bash
cd frontend
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
npm run test
```

## How It Works

### Vault Service
- Reads markdown files from `AI_Employee_Vault/`
- Parses YAML frontmatter
- Returns structured JSON to frontend
- Handles file moves (approve/reject/complete)

### Vault Watcher
- Uses `watchdog` to monitor file changes
- Broadcasts changes via WebSocket
- Real-time updates to frontend

### Frontend Integration
- Frontend `.env.local` has `NEXT_PUBLIC_DEMO_MODE=false`
- All API calls go to `http://localhost:3001`
- Real vault data instead of mock data

## File Structure

```
backend/
├── src/
│   ├── main.py              # FastAPI app + routes
│   ├── vault_service.py     # Vault file reader/writer
│   └── vault_watcher.py     # File change detector
├── tests/
│   └── test_api.py          # Comprehensive API tests
├── requirements.txt
└── pytest.ini
```

## Development

### Hot Reload
Server auto-reloads on code changes (`--reload` flag)

### API Documentation
Auto-generated Swagger UI at `http://localhost:3001/docs`

### Debug Mode
Set `log_level="debug"` in uvicorn for verbose logging

## Troubleshooting

### Backend won't start
- Check Python version: `python --version` (need 3.10+)
- Check virtual environment: `venv\Scripts\activate`
- Check dependencies: `pip install -r requirements.txt`

### Frontend can't connect
- Verify backend running: `http://localhost:3001/health`
- Check `.env.local`: `NEXT_PUBLIC_DEMO_MODE=false`
- Check CORS: Backend allows `localhost:3000`

### Vault not reading files
- Check `VAULT_PATH` in `.env`
- Verify vault directories exist
- Check file permissions
