import shutil
from pathlib import Path
import time
import logging
from vault_sync import sync_vault_to_remote

def claim_task(task_file: Path, agent_name: str, vault_path: Path) -> bool:
    """
    Attempt to claim a task. Returns True if claimed, False if already claimed.
    agent_name: 'cloud_agent' or 'local_agent'
    """
    in_progress_dir = vault_path / 'In_Progress' / agent_name
    in_progress_dir.mkdir(parents=True, exist_ok=True)

    claimed_file = in_progress_dir / task_file.name

    # Atomic move — if file already moved by other agent, this will fail
    try:
        shutil.move(str(task_file), str(claimed_file))
        # Sync vault immediately after claiming
        sync_vault_to_remote(str(vault_path), f"[{agent_name}] Claimed: {task_file.name}")
        return True
    except FileNotFoundError:
        # Already claimed by the other agent
        return False