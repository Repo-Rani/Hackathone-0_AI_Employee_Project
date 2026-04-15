"""
Vault File Watcher - Monitors vault changes and broadcasts via WebSocket
Uses watchdog to detect file changes in AI_Employee_Vault
"""

import os
import time
import json
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, List
from threading import Thread

from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler, FileCreatedEvent, FileModifiedEvent, FileMovedEvent

from vault_service import VaultService


class VaultChangeHandler(FileSystemEventHandler):
    """Handler for vault file changes"""

    def __init__(self, vault_service: VaultService, broadcast_callback):
        self.vault = vault_service
        self.broadcast = broadcast_callback
        self.last_event_time = {}  # Debounce: track last event per file

    def on_created(self, event):
        if not event.is_directory and event.src_path.endswith('.md'):
            self._handle_change(event.src_path, 'created')

    def on_modified(self, event):
        if not event.is_directory and event.src_path.endswith('.md'):
            self._handle_change(event.src_path, 'modified')

    def on_moved(self, event):
        if not event.is_directory:
            self._handle_change(event.dest_path, 'moved')

    def _handle_change(self, file_path: str, change_type: str):
        """Handle file change with debouncing"""
        # Debounce: ignore if same file changed in last 2 seconds
        now = time.time()
        if file_path in self.last_event_time:
            if now - self.last_event_time[file_path] < 2:
                return
        self.last_event_time[file_path] = now

        # Determine change category
        path = Path(file_path)
        category = self._categorize_change(path)

        # Broadcast change
        message = {
            "type": "vault_change",
            "category": category,
            "change_type": change_type,
            "file": path.name,
            "path": str(path),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

        print(f"[Vault Watcher] {change_type}: {path.name} ({category})")
        self.broadcast(message)

    def _categorize_change(self, path: Path) -> str:
        """Categorize the change based on file path"""
        path_str = str(path)

        if "Needs_Action" in path_str:
            return "tasks"
        elif "Pending_Approval" in path_str:
            return "approvals"
        elif "Approved" in path_str:
            return "approvals"
        elif "Plans" in path_str:
            return "plans"
        elif "Logs" in path_str:
            return "logs"
        elif "Accounting" in path_str:
            return "accounting"
        elif "Briefings" in path_str:
            return "briefings"
        elif "Done" in path_str:
            return "tasks"
        else:
            return "general"


class VaultWatcher:
    """Watches vault for changes and broadcasts via WebSocket"""

    def __init__(self, vault_service: VaultService, broadcast_callback):
        self.vault = vault_service
        self.broadcast = broadcast_callback
        self.observer = Observer()
        self.handler = VaultChangeHandler(vault_service, broadcast_callback)

    def start(self):
        """Start watching vault directories"""
        vault_path = self.vault.vault_path

        if not vault_path.exists():
            print(f"[Vault Watcher] Vault path does not exist: {vault_path}")
            return

        # Watch key directories
        watch_dirs = [
            vault_path / "Needs_Action",
            vault_path / "Pending_Approval",
            vault_path / "Approved",
            vault_path / "Done",
            vault_path / "Plans",
            vault_path / "Logs",
            vault_path / "Accounting",
            vault_path / "Briefings",
        ]

        for watch_dir in watch_dirs:
            if watch_dir.exists():
                self.observer.schedule(
                    self.handler,
                    str(watch_dir),
                    recursive=False
                )
                print(f"[Vault Watcher] Watching: {watch_dir}")

        self.observer.start()
        print("[Vault Watcher] Started successfully")

    def stop(self):
        """Stop watching"""
        self.observer.stop()
        self.observer.join()
        print("[Vault Watcher] Stopped")
