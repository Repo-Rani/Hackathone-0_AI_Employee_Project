"""
FastAPI Backend - Main Application
Bridges AI Employee Vault with Frontend API
"""

import os
import json
from pathlib import Path
from datetime import datetime, timezone
from typing import Optional

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv

from vault_service import VaultService
from vault_watcher import VaultWatcher

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="AI Employee API",
    description="REST API bridge between AI Employee Vault and Frontend Dashboard",
    version="1.0.0",
)

# CORS Middleware - Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Vault Service
# In tests, this will be overridden by fixtures
vault = VaultService()

# Initialize Vault Watcher (for real-time updates)
vault_watcher = None

def broadcast_vault_change(message: dict):
    """Broadcast vault changes to all connected WebSocket clients"""
    import asyncio
    asyncio.create_task(manager.broadcast(message))

@app.on_event("startup")
async def startup_event():
    """Start vault watcher on server startup"""
    global vault_watcher
    vault_watcher = VaultWatcher(vault, broadcast_vault_change)
    vault_watcher.start()
    print("[API] Server started, vault watcher active")

@app.on_event("shutdown")
async def shutdown_event():
    """Stop vault watcher on server shutdown"""
    global vault_watcher
    if vault_watcher:
        vault_watcher.stop()
    print("[API] Server shutting down")

# ── Pydantic Models ───────────────────────────────────────────────

class TaskUpdate(BaseModel):
    status: Optional[str] = "pending"

class ApprovalRequest(BaseModel):
    reason: Optional[str] = ""

class SystemConfig(BaseModel):
    gmailCheckInterval: int = 120
    whatsappCheckInterval: int = 30
    bankCheckInterval: int = 3600
    autoApproveThreshold: int = 50
    ralphMaxIterations: int = 10
    approvalWindowHours: int = 24
    devMode: bool = False
    dryRun: bool = True

# ── WebSocket Manager ─────────────────────────────────────────────

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                disconnected.append(connection)
        
        # Clean up disconnected clients
        for conn in disconnected:
            self.disconnect(conn)

manager = ConnectionManager()

# ── Health Check ──────────────────────────────────────────────────

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "vault_path": str(vault.vault_path),
        "vault_exists": vault.vault_path.exists(),
    }

# ── Tasks Endpoints ───────────────────────────────────────────────

@app.get("/api/tasks")
async def get_tasks():
    """Get all tasks from Needs_Action folder"""
    try:
        tasks = vault.get_tasks()
        return JSONResponse(content=tasks)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/tasks/{task_id}")
async def get_task(task_id: str):
    """Get single task by ID"""
    try:
        task = vault.get_task(task_id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        return JSONResponse(content=task)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/api/tasks/{task_id}")
async def update_task(task_id: str, data: TaskUpdate):
    """Update task status"""
    try:
        result = vault.update_task(task_id, data.model_dump())
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/tasks/{task_id}/create-plan")
async def create_plan_for_task(task_id: str):
    """Create a plan for a task (placeholder - Claude integration needed)"""
    return JSONResponse(content={
        "id": f"PLAN_{task_id}",
        "title": f"Plan for {task_id}",
        "status": "pending_approval",
        "message": "Plan creation requires Claude CLI integration"
    })

# ── Approvals Endpoints ───────────────────────────────────────────

@app.get("/api/approvals")
async def get_approvals():
    """Get all approval requests"""
    try:
        approvals = vault.get_approvals()
        return JSONResponse(content=approvals)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/approvals/{approval_id}/approve")
async def approve_item(approval_id: str):
    """Approve an item"""
    try:
        result = vault.approve_item(approval_id)
        if result["status"] == "not_found":
            raise HTTPException(status_code=404, detail="Approval not found")
        return JSONResponse(content=result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/approvals/{approval_id}/reject")
async def reject_item(approval_id: str, data: ApprovalRequest):
    """Reject an item"""
    try:
        result = vault.reject_item(approval_id, reason=data.reason)
        if result["status"] == "not_found":
            raise HTTPException(status_code=404, detail="Approval not found")
        return JSONResponse(content=result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ── Plans Endpoints ───────────────────────────────────────────────

@app.get("/api/plans")
async def get_plans():
    """Get all plans"""
    try:
        plans = vault.get_plans()
        return JSONResponse(content=plans)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ── Briefings Endpoints ───────────────────────────────────────────

@app.get("/api/briefings")
async def get_briefings():
    """Get CEO briefings"""
    try:
        briefings = vault.get_briefings()
        return JSONResponse(content=briefings)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ── Accounting Endpoints ──────────────────────────────────────────

@app.get("/api/accounting/transactions")
async def get_transactions():
    """Get accounting transactions"""
    try:
        transactions = vault.get_transactions()
        return JSONResponse(content=transactions)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/accounting/summary")
async def get_accounting_summary():
    """Get accounting summary"""
    try:
        summary = vault.get_accounting_summary()
        return JSONResponse(content=summary)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ── Logs Endpoints ────────────────────────────────────────────────

@app.get("/api/logs")
async def get_logs():
    """Get audit logs"""
    try:
        logs = vault.get_logs()
        return JSONResponse(content=logs)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ── System Endpoints ──────────────────────────────────────────────

@app.get("/api/system/status")
async def get_system_status():
    """Get AI system status"""
    try:
        status = vault.get_system_status()
        return JSONResponse(content=status)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/system/stats")
async def get_dashboard_stats():
    """Get dashboard statistics"""
    try:
        stats = vault.get_dashboard_stats()
        return JSONResponse(content=stats)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/system/watchers")
async def get_watchers():
    """Get watcher status"""
    try:
        watchers = vault.get_watchers()
        return JSONResponse(content=watchers)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/system/config")
async def get_system_config():
    """Get system configuration"""
    config = SystemConfig()
    return JSONResponse(content=config.model_dump())

@app.put("/api/system/config")
async def update_system_config(config: SystemConfig):
    """Update system configuration"""
    # In production, this would save to .env or config file
    return JSONResponse(content={"status": "updated", "config": config.model_dump()})

# ── Vault Sections Endpoints ──────────────────────────────────────

@app.get("/api/vault/done")
async def get_done_tasks():
    """Get completed tasks from Done folder"""
    try:
        tasks = vault.get_done_tasks()
        return JSONResponse(content=tasks)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/vault/rejected")
async def get_rejected_items():
    """Get rejected items"""
    try:
        items = vault.get_rejected_items()
        return JSONResponse(content=items)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/vault/summary")
async def get_vault_summary():
    """Get summary of all vault sections"""
    try:
        summary = vault.get_vault_summary()
        return JSONResponse(content=summary)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ── WebSocket Endpoint ────────────────────────────────────────────

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time updates"""
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive
            data = await websocket.receive_text()
            # Echo back for now - in production, broadcast vault changes
            await websocket.send_json({
                "type": "ping",
                "timestamp": datetime.now(timezone.utc).isoformat()
            })
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# ── Root Endpoint ─────────────────────────────────────────────────

@app.get("/")
async def root():
    return {
        "name": "AI Employee API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "vault_path": str(vault.vault_path),
    }

# ── Run Server ────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=3001,
        reload=True,
        log_level="info"
    )
