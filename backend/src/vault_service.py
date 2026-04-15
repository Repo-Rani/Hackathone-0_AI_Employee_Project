"""
Vault Service - Bridge between file system and API
Reads/writes AI_Employee_Vault files
"""

import os
import json
import re
from pathlib import Path
from datetime import datetime, timezone
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

VAULT_PATH = Path(os.getenv("VAULT_PATH", "C:/Users/HP/AI_Employee_Project/AI_Employee_Vault"))


class VaultService:
    """Service for reading/writing vault files"""

    def __init__(self, vault_path: Optional[Path] = None):
        # Allow override for testing
        if vault_path:
            self.vault_path = vault_path
        else:
            self.vault_path = VAULT_PATH
        
        self.needs_action = self.vault_path / "Needs_Action"
        self.pending_approval = self.vault_path / "Pending_Approval"
        self.approved = self.vault_path / "Approved"
        self.rejected = self.vault_path / "Rejected"
        self.done = self.vault_path / "Done"
        self.plans = self.vault_path / "Plans"
        self.logs = self.vault_path / "Logs"
        self.accounting = self.vault_path / "Accounting"
        self.briefings = self.vault_path / "Briefings"

    def parse_frontmatter(self, content: str) -> dict:
        """Parse YAML-like frontmatter from markdown files"""
        data = {}
        if content.startswith("---"):
            parts = content.split("---", 2)
            if len(parts) >= 2:
                lines = parts[1].strip().split("\n")
                for line in lines:
                    if ":" in line:
                        key, _, val = line.partition(":")
                        data[key.strip()] = val.strip()
        return data

    def get_file_content(self, file_path: Path) -> str:
        """Read file content"""
        if file_path.exists():
            return file_path.read_text(encoding="utf-8")
        return ""

    def write_file(self, file_path: Path, content: str):
        """Write content to file"""
        file_path.parent.mkdir(parents=True, exist_ok=True)
        file_path.write_text(content, encoding="utf-8")

    def list_files(self, directory: Path, extension: str = ".md") -> list[Path]:
        """List files in directory"""
        if not directory.exists():
            return []
        return sorted(
            [f for f in directory.glob(f"*{extension}") if not f.name.startswith(".")],
            key=lambda x: x.stat().st_mtime,
            reverse=True
        )

    # ── Tasks (Needs_Action) ──────────────────────────────────────

    def get_tasks(self) -> list[dict]:
        """Get all tasks from Needs_Action folder"""
        tasks = []
        if not self.needs_action.exists():
            return tasks

        for file_path in self.list_files(self.needs_action):
            content = self.get_file_content(file_path)
            metadata = self.parse_frontmatter(content)

            # Determine task type from filename or metadata
            task_type = "email"
            if file_path.name.startswith("WA_"):
                task_type = "whatsapp"
            elif file_path.name.startswith("FILE_"):
                task_type = "file"
            elif file_path.name.startswith("FINANCE_"):
                task_type = "finance"

            # Determine priority
            priority = metadata.get("priority", "medium")

            tasks.append({
                "id": file_path.stem,
                "type": task_type,
                "priority": priority,
                "status": "pending",
                "title": metadata.get("title", file_path.stem),
                "preview": content[:120] if content else "",
                "fullContent": content,
                "from": metadata.get("from", "unknown"),
                "createdAt": metadata.get("created", datetime.now(timezone.utc).isoformat()),
                "metadata": metadata
            })

        return tasks

    def get_task(self, task_id: str) -> Optional[dict]:
        """Get single task by ID"""
        # Search in Needs_Action
        for file_path in self.needs_action.glob(f"{task_id}*"):
            content = self.get_file_content(file_path)
            metadata = self.parse_frontmatter(content)
            return {
                "id": file_path.stem,
                "type": "email",
                "priority": metadata.get("priority", "medium"),
                "status": "pending",
                "title": metadata.get("title", file_path.stem),
                "preview": content[:120],
                "fullContent": content,
                "from": metadata.get("from", "unknown"),
                "createdAt": metadata.get("created", datetime.now(timezone.utc).isoformat()),
                "metadata": metadata
            }
        return None

    def update_task(self, task_id: str, data: dict) -> dict:
        """Update task status"""
        # Move file based on status
        for file_path in self.needs_action.glob(f"{task_id}*"):
            new_status = data.get("status", "pending")

            if new_status == "done":
                dest = self.done / file_path.name
                file_path.rename(dest)
            elif new_status == "dismissed":
                file_path.unlink()

            return {"id": task_id, "status": new_status}

        return {"id": task_id, "status": "not_found"}

    # ── Approvals ─────────────────────────────────────────────────

    def get_approvals(self) -> list[dict]:
        """Get all approval requests"""
        approvals = []
        if not self.pending_approval.exists():
            return approvals

        for file_path in self.list_files(self.pending_approval):
            content = self.get_file_content(file_path)
            metadata = self.parse_frontmatter(content)

            action_type = metadata.get("action", "unknown")
            approval = {
                "id": file_path.stem,
                "actionType": action_type,
                "title": metadata.get("title", file_path.stem),
                "description": content[content.find("---", 50):] if "---" in content else content,
                "status": "pending",
                "createdAt": metadata.get("created", datetime.now(timezone.utc).isoformat()),
                "expiresAt": metadata.get("expires", ""),
                "metadata": {
                    "amount": float(metadata.get("amount", 0)) if metadata.get("amount") else None,
                    "recipient": metadata.get("to", ""),
                    "subject": metadata.get("subject", ""),
                }
            }
            approvals.append(approval)

        return approvals

    def approve_item(self, approval_id: str) -> dict:
        """Approve an item by moving it to Approved folder"""
        for file_path in self.pending_approval.glob(f"{approval_id}*"):
            dest = self.approved / file_path.name
            file_path.rename(dest)
            return {"id": approval_id, "status": "approved"}

        return {"id": approval_id, "status": "not_found"}

    def reject_item(self, approval_id: str, reason: str = "") -> dict:
        """Reject an item by moving it to Rejected folder"""
        for file_path in self.pending_approval.glob(f"{approval_id}*"):
            dest = self.rejected / file_path.name
            file_path.rename(dest)
            return {"id": approval_id, "status": "rejected", "reason": reason}

        return {"id": approval_id, "status": "not_found"}

    # ── Plans ─────────────────────────────────────────────────────

    def get_plans(self) -> list[dict]:
        """Get all plans"""
        plans = []
        if not self.plans.exists():
            return plans

        for file_path in self.list_files(self.plans):
            content = self.get_file_content(file_path)
            metadata = self.parse_frontmatter(content)

            plans.append({
                "id": file_path.stem,
                "title": metadata.get("title", file_path.stem),
                "objective": content[:200],
                "status": metadata.get("status", "in_progress"),
                "steps": [],
                "currentStepIdx": 0,
                "iteration": int(metadata.get("iteration", 0)),
                "maxIterations": int(metadata.get("max_iterations", 10)),
                "createdAt": metadata.get("created", datetime.now(timezone.utc).isoformat()),
                "updatedAt": metadata.get("updated", datetime.now(timezone.utc).isoformat()),
            })

        return plans

    # ── Briefings ─────────────────────────────────────────────────

    def get_briefings(self) -> list[dict]:
        """Get CEO briefings"""
        briefings = []
        briefings_dir = self.briefings / "Weekly"
        if not briefings_dir.exists():
            briefings_dir = self.briefings

        for file_path in self.list_files(briefings_dir):
            content = self.get_file_content(file_path)
            metadata = self.parse_frontmatter(content)

            briefings.append({
                "id": file_path.stem,
                "date": metadata.get("date", file_path.stem),
                "period": metadata.get("period", ""),
                "title": metadata.get("title", file_path.stem),
                "content": content,
                "kpi": {
                    "revenueThisWeek": 0,
                    "revenueTarget": 0,
                    "revenueTrend": "flat",
                    "revenuePct": 0,
                    "tasksCompleted": 0,
                    "bottlenecksCount": 0,
                    "suggestionsCount": 0,
                },
                "generatedAt": metadata.get("generated", datetime.now(timezone.utc).isoformat()),
            })

        return briefings

    # ── Accounting ────────────────────────────────────────────────

    def get_transactions(self) -> list[dict]:
        """Get accounting transactions"""
        transactions = []
        accounting_file = self.accounting / "Current_Month.md"

        if accounting_file.exists():
            content = self.get_file_content(accounting_file)
            # Parse transactions from markdown
            lines = content.split("\n")
            for line in lines:
                if "|" in line and "$" in line:
                    parts = [p.strip() for p in line.split("|") if p.strip()]
                    if len(parts) >= 4:
                        try:
                            amount = float(parts[3].replace("$", "").replace(",", ""))
                            transactions.append({
                                "id": f"TX_{len(transactions)+1}",
                                "date": parts[0],
                                "description": parts[1],
                                "merchant": parts[1],
                                "category": "Operations",
                                "type": "income" if amount > 0 else "expense",
                                "amount": amount,
                                "flagged": False,
                            })
                        except:
                            pass

        return transactions

    def get_accounting_summary(self) -> dict:
        """Get accounting summary"""
        transactions = self.get_transactions()

        total_income = sum(t["amount"] for t in transactions if t["amount"] > 0)
        total_expenses = abs(sum(t["amount"] for t in transactions if t["amount"] < 0))

        return {
            "period": "This Month",
            "totalIncome": total_income,
            "totalExpenses": total_expenses,
            "netRevenue": total_income - total_expenses,
            "subscriptionCost": 0,
            "flaggedCount": sum(1 for t in transactions if t.get("flagged")),
            "dailyRevenue": [],
            "byCategory": [],
        }

    # ── Logs ──────────────────────────────────────────────────────

    def get_logs(self) -> list[dict]:
        """Get audit logs"""
        logs = []
        if not self.logs.exists():
            return logs

        # Read JSON log files
        for log_file in sorted(self.logs.glob("*.json"), reverse=True):
            try:
                content = log_file.read_text(encoding="utf-8")
                log_entries = json.loads(content)
                if isinstance(log_entries, list):
                    for entry in log_entries:
                        logs.append({
                            "id": f"LOG_{len(logs)+1}",
                            "timestamp": entry.get("timestamp", datetime.now(timezone.utc).isoformat()),
                            "actionType": entry.get("action_type", "system"),
                            "actor": entry.get("actor", "system"),
                            "target": entry.get("target", ""),
                            "approvalStatus": entry.get("approval_status", "not_required"),
                            "result": entry.get("result", "success"),
                            "durationMs": entry.get("duration_ms", 0),
                            "parameters": entry.get("details", {}),
                        })
            except:
                pass

        return logs[:100]  # Return last 100 logs

    # ── System Status ─────────────────────────────────────────────

    def get_system_status(self) -> dict:
        """Get AI system status"""
        # Count files in various folders
        needs_action_count = len(self.list_files(self.needs_action))
        pending_count = len(self.list_files(self.pending_approval))
        approved_count = len(self.list_files(self.approved))

        return {
            "status": "active",
            "currentTask": "Monitoring vault for changes",
            "queueLength": needs_action_count,
            "lastActionAt": datetime.now(timezone.utc).isoformat(),
            "iterationsToday": 0,
            "tasksCompleted": approved_count,
            "uptime": 0,
            "ralphWiggum": None,
        }

    def get_dashboard_stats(self) -> dict:
        """Get dashboard statistics"""
        needs_action_count = len(self.list_files(self.needs_action))
        pending_count = len(self.list_files(self.pending_approval))
        done_count = len(self.list_files(self.done))

        return {
            "revenueMTD": 0,
            "revenueTarget": 10000,
            "revenueChange": 0,
            "pendingApprovals": pending_count,
            "pendingApprovalsUrgent": 0,
            "tasksDoneToday": done_count,
            "tasksTotal": needs_action_count + done_count,
            "activeWatchers": 4,
            "totalWatchers": 4,
            "briefingsGenerated": len(self.list_files(self.briefings)),
        }

    def get_watchers(self) -> list[dict]:
        """Get watcher status"""
        return [
            {
                "id": "gmail",
                "label": "Gmail",
                "status": "live",
                "lastChecked": datetime.now(timezone.utc).isoformat(),
                "itemsFound": len(self.list_files(self.needs_action)),
                "checkInterval": 120,
            },
            {
                "id": "whatsapp",
                "label": "WhatsApp",
                "status": "live",
                "lastChecked": datetime.now(timezone.utc).isoformat(),
                "itemsFound": 0,
                "checkInterval": 30,
            },
            {
                "id": "bank",
                "label": "Bank",
                "status": "idle",
                "lastChecked": datetime.now(timezone.utc).isoformat(),
                "itemsFound": 0,
                "checkInterval": 3600,
            },
            {
                "id": "filesystem",
                "label": "FileSystem",
                "status": "live",
                "lastChecked": datetime.now(timezone.utc).isoformat(),
                "itemsFound": 0,
                "checkInterval": 60,
            },
        ]

    # ── Vault Sections (Done, Rejected, Needs Action) ─────────────

    def get_done_tasks(self) -> list[dict]:
        """Get completed tasks from Done folder"""
        tasks = []
        if not self.done.exists():
            return tasks

        for file_path in self.list_files(self.done):
            content = self.get_file_content(file_path)
            metadata = self.parse_frontmatter(content)
            tasks.append({
                "id": file_path.stem,
                "title": metadata.get("title", file_path.stem),
                "type": metadata.get("type", "unknown"),
                "completedAt": metadata.get("completed", file_path.stat().st_mtime),
                "preview": content[:100] if content else "",
            })

        return tasks

    def get_rejected_items(self) -> list[dict]:
        """Get rejected items"""
        items = []
        if not self.rejected.exists():
            return items

        for file_path in self.list_files(self.rejected):
            content = self.get_file_content(file_path)
            metadata = self.parse_frontmatter(content)
            items.append({
                "id": file_path.stem,
                "title": metadata.get("title", file_path.stem),
                "type": metadata.get("type", "unknown"),
                "rejectedAt": metadata.get("rejected", file_path.stat().st_mtime),
                "reason": metadata.get("reason", "No reason provided"),
            })

        return items

    def get_needs_action_count(self) -> int:
        """Get count of items needing action"""
        return len(self.list_files(self.needs_action))

    def get_done_count(self) -> int:
        """Get count of completed items"""
        return len(self.list_files(self.done))

    def get_rejected_count(self) -> int:
        """Get count of rejected items"""
        return len(self.list_files(self.rejected))

    def get_vault_summary(self) -> dict:
        """Get summary of all vault sections"""
        return {
            "needsAction": self.get_needs_action_count(),
            "pendingApproval": len(self.list_files(self.pending_approval)),
            "approved": len(self.list_files(self.approved)),
            "done": self.get_done_count(),
            "rejected": self.get_rejected_count(),
            "plans": len(self.list_files(self.plans)),
            "logs": len(self.list_files(self.logs)),
        }
