# autonomous_loop.py
# Constitution: MAX_AUTONOMOUS_LOOPS=10 hard-coded, payments always blocked
# Constitution: loop never moves files to /Approved/ — only humans do that

import os
import sys
import json
import time
import logging
import subprocess
from pathlib import Path
from datetime import datetime, date

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [LOOP] %(levelname)s: %(message)s',
    handlers=[
        logging.FileHandler('logs/autonomous_loop.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger('AutonomousLoop')

VAULT_PATH       = Path(os.getenv('VAULT_PATH', 'AI_Employee_Vault'))
NEEDS_ACTION     = VAULT_PATH / 'Needs_Action'
ACTIVE_TASKS     = VAULT_PATH / 'Autonomous' / 'Active_Tasks'
COMPLETED_TASKS  = VAULT_PATH / 'Autonomous' / 'Completed_Tasks'
LOGS_DIR         = VAULT_PATH / 'Logs'

# Constitution: MAX_AUTONOMOUS_LOOPS=10 is hard-coded — .env cannot override
MAX_LOOPS = 10  # DO NOT change this to read from .env
LOOP_WAIT = 30  # seconds between iterations
LOOP_ENABLED = os.getenv('AUTONOMOUS_LOOP_ENABLED', 'true').lower() == 'true'


def log_iteration(task_name: str, iteration: int, result: str):
    """Write every loop iteration to /Logs/YYYY-MM-DD.json"""
    today = date.today().isoformat()
    log_file = LOGS_DIR / f'{today}.json'
    entry = {
        'timestamp': datetime.now().isoformat() + 'Z',
        'action_type': 'autonomous_loop_step',
        'actor': 'autonomous_loop',
        'target': task_name,
        'loop_iteration': iteration,
        'result': result,
        'approval_status': 'auto'
    }
    existing = []
    if log_file.exists():
        try:
            existing = json.loads(log_file.read_text())
        except Exception:
            pass
    existing.append(entry)
    log_file.write_text(json.dumps(existing, indent=2))


def run_claude(vault_path: Path, prompt: str) -> str:
    """
    Run one Claude CLI invocation.
    Returns stdout as string.
    """
    cmd = ['claude', '--cwd', str(vault_path), prompt]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        return result.stdout + result.stderr
    except subprocess.TimeoutExpired:
        return 'TIMEOUT'
    except FileNotFoundError:
        logger.error('claude CLI not found — is it installed?')
        return 'CLAUDE_NOT_FOUND'


def is_complete(output: str) -> bool:
    """
    Constitution: two completion strategies:
    1. Promise-based: Claude outputs <promise>TASK_COMPLETE</promise>
    2. File-movement (checked separately): task file moves to /Done/
    """
    return 'TASK_COMPLETE' in output or '<promise>TASK_COMPLETE</promise>' in output


def is_blocked(output: str) -> bool:
    """Constitution: LOOP_BLOCKED signal means sensitive action found — pause loop."""
    return 'LOOP_BLOCKED' in output


def has_pending_files() -> bool:
    """Check if /Needs_Action/ has unprocessed files."""
    if not NEEDS_ACTION.exists():
        return False
    return any(
        f.suffix == '.md' for f in NEEDS_ACTION.iterdir()
        if not f.name.startswith('.')
    )


def update_task_status(task_file: Path, status: str, loop_count: int):
    """Update the task .json file with current status."""
    try:
        task = json.loads(task_file.read_text())
        task['status'] = status
        task['loop_count'] = loop_count
        task['last_updated'] = datetime.now().isoformat() + 'Z'
        task_file.write_text(json.dumps(task, indent=2))
    except Exception as e:
        logger.error(f'Failed to update task status: {e}')


def run_task(task_file: Path):
    """
    Main Ralph Wiggum loop for a single task.
    Constitution: runs until TASK_COMPLETE or MAX_LOOPS=10 (hard limit).
    """
    task = json.loads(task_file.read_text())
    task_name  = task.get('name', task_file.stem)
    prompt     = task.get('prompt', '')
    max_loops  = min(task.get('max_loops', MAX_LOOPS), MAX_LOOPS)  # never exceed 10

    logger.info(f'Starting task: {task_name} (max {max_loops} iterations)')

    for iteration in range(1, max_loops + 1):
        logger.info(f'[{task_name}] Iteration {iteration}/{max_loops}')
        update_task_status(task_file, 'running', iteration)

        output = run_claude(VAULT_PATH, prompt)
        log_iteration(task_name, iteration, 'step_executed')

        if is_blocked(output):
            logger.info(f'[{task_name}] LOOP_BLOCKED — sensitive action needs approval')
            log_iteration(task_name, iteration, 'loop_blocked')
            update_task_status(task_file, 'blocked', iteration)
            return  # pause — orchestrator will resume when human approves

        if is_complete(output):
            logger.info(f'[{task_name}] TASK_COMPLETE after {iteration} iterations')
            log_iteration(task_name, iteration, 'task_complete')
            update_task_status(task_file, 'complete', iteration)

            # Move to completed archive
            COMPLETED_TASKS.mkdir(parents=True, exist_ok=True)
            task_file.rename(COMPLETED_TASKS / task_file.name)
            return

        if not has_pending_files():
            logger.info(f'[{task_name}] No more pending files — considering complete')
            log_iteration(task_name, iteration, 'task_complete_no_pending')
            update_task_status(task_file, 'complete', iteration)
            COMPLETED_TASKS.mkdir(parents=True, exist_ok=True)
            task_file.rename(COMPLETED_TASKS / task_file.name)
            return

        logger.info(f'[{task_name}] Iteration {iteration} done — waiting {LOOP_WAIT}s')
        time.sleep(LOOP_WAIT)

    # Constitution: hit MAX_LOOPS — log error, stop, never continue
    logger.error(f'[{task_name}] MAX_LOOPS ({MAX_LOOPS}) reached without TASK_COMPLETE')
    log_iteration(task_name, MAX_LOOPS, 'max_loops_exceeded')
    update_task_status(task_file, 'failed_max_loops', MAX_LOOPS)

    # Write human notification
    alert_file = VAULT_PATH / 'Needs_Action' / f'LOOP_MAX_EXCEEDED_{task_name}_{datetime.now().strftime("%Y%m%d")}.md'
    alert_file.write_text(f"""---
type: loop_alert
task: {task_name}
iterations: {MAX_LOOPS}
status: failed_max_loops
---

## Loop Safety Limit Reached

Task `{task_name}` ran for {MAX_LOOPS} iterations without completing.

**Action Required:** Review the task and restart manually if needed.
Check /Logs/ for details on what was accomplished.
""")


def main():
    if not LOOP_ENABLED:
        logger.info('Autonomous loop disabled (AUTONOMOUS_LOOP_ENABLED=false)')
        return

    ACTIVE_TASKS.mkdir(parents=True, exist_ok=True)
    COMPLETED_TASKS.mkdir(parents=True, exist_ok=True)
    LOGS_DIR.mkdir(parents=True, exist_ok=True)

    logger.info('Autonomous Loop started — watching /Autonomous/Active_Tasks/')

    while True:
        for task_file in sorted(ACTIVE_TASKS.glob('*.json')):
            try:
                task = json.loads(task_file.read_text())
                if task.get('status') == 'active':
                    run_task(task_file)
            except Exception as e:
                logger.error(f'Task {task_file.name} error: {e}')

        time.sleep(60)  # check for new tasks every 60s


if __name__ == '__main__':
    main()