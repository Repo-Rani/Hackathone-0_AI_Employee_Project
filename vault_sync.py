import subprocess
from pathlib import Path
import logging

def sync_vault_to_remote(vault_path: str, message: str = "Agent update"):
    """
    Sync vault to remote repository after every agent write
    """
    try:
        result = subprocess.run(
            ['git', '-C', vault_path, 'add', '.'],
            capture_output=True, text=True
        )
        subprocess.run(
            ['git', '-C', vault_path, 'commit', '-m', message],
            capture_output=True, text=True
        )
        subprocess.run(
            ['git', '-C', vault_path, 'push', 'origin', 'main'],
            capture_output=True, text=True
        )
        logging.info(f"Vault synced: {message}")
    except Exception as e:
        logging.error(f"Vault sync failed: {e}")
        # Do NOT halt agent — queue retry