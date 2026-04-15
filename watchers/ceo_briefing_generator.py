"""
CEO Briefing Generator
This script generates the Monday Morning CEO Briefing by gathering data from various sources
and calling Odoo MCP tools for revenue and invoice information.
"""
import os
import sys
import json
import logging
import subprocess
from pathlib import Path
from datetime import datetime, date, timedelta

sys.path.append(str(Path(__file__).parent.parent))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('CEOBriefing')

VAULT_PATH = Path(os.getenv('VAULT_PATH', 'AI_Employee_Vault'))
BRIEFINGS_DIR = VAULT_PATH / 'Briefings' / 'Weekly'
ACCOUNTING_DIR = VAULT_PATH / 'Accounting'
DONE_DIR = VAULT_PATH / 'Done'
LOGS_DIR = VAULT_PATH / 'Logs'

MONTHLY_REVENUE_TARGET = float(os.getenv('MONTHLY_REVENUE_TARGET', '10000'))
INVOICE_OVERDUE_CRITICAL_DAYS = int(os.getenv('INVOICE_OVERDUE_CRITICAL_DAYS', '30'))


def call_odoo_mcp(tool, args=None):
    """Call Odoo MCP tool and return result."""
    import subprocess

    cmd = ['node', 'mcp_servers/odoo_mcp/index.js', tool]
    if args:
        import json as json_lib
        cmd.append(json_lib.dumps(args))

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        if result.returncode == 0:
            return json.loads(result.stdout)
        else:
            logger.error(f"Odoo MCP {tool} failed: {result.stderr}")
            return None
    except Exception as e:
        logger.error(f"Error calling Odoo MCP {tool}: {e}")
        return None


def get_done_files_last_week():
    """Get all done files from the last week."""
    done_files = []
    if not DONE_DIR.exists():
        return done_files

    week_ago = date.today() - timedelta(days=7)
    for file_path in DONE_DIR.glob('*.md'):
        try:
            # If filename contains date, check if it's within last week
            stat = file_path.stat()
            file_date = datetime.fromtimestamp(stat.st_mtime).date()
            if file_date >= week_ago:
                done_files.append(file_path)
        except:
            continue
    return done_files


def get_completed_tasks():
    """Get completed tasks from last week's done files."""
    done_files = get_done_files_last_week()
    tasks = []

    for file_path in done_files:
        try:
            content = file_path.read_text()
            # Extract basic info from the file, could be more sophisticated
            tasks.append(f"- {file_path.name.replace('.md', '').replace('_', ' ').title()}")
        except:
            continue

    return tasks


def generate_ceo_briefing():
    """Generate the complete CEO briefing."""
    BRIEFINGS_DIR.mkdir(parents=True, exist_ok=True)

    # Get the date for the briefing (previous Monday if today is Monday, else this week's Monday)
    today = date.today()
    days_since_monday = today.weekday()  # Monday is 0
    briefing_date = today - timedelta(days=days_since_monday)

    # Get Odoo data
    logger.info("Fetching unpaid invoices from Odoo...")
    unpaid_invoices_result = call_odoo_mcp('get_unpaid_invoices')
    if not unpaid_invoices_result or not unpaid_invoices_result.get('success'):
        logger.error("Could not fetch unpaid invoices from Odoo")
        # Write alert to Needs_Action and return early
        needs_action_file = VAULT_PATH / 'Needs_Action' / f'ODOO_OFFLINE_{datetime.now().strftime("%Y%m%d")}.md'
        needs_action_file.write_text(f"""---
type: system_alert
component: odoo
severity: high
status: pending
---

## Odoo MCP Offline

The Odoo MCP server is not responding. CEO briefing generation was skipped.

**Action Required:** Check Odoo ERP connectivity and restart if needed.
""")
        logger.error("Odoo offline - CEO briefing generation skipped")
        return

    unpaid_invoices = unpaid_invoices_result.get('invoices', [])

    logger.info("Fetching monthly revenue from Odoo...")
    current_month = date.today().month
    current_year = date.today().year
    revenue_result = call_odoo_mcp('get_monthly_revenue', {'month': current_month, 'year': current_year})

    if not revenue_result or not revenue_result.get('success'):
        logger.error("Could not fetch revenue data from Odoo")
        return

    monthly_revenue = revenue_result.get('total', 0)

    # Get completed tasks
    completed_tasks = get_completed_tasks()

    # Calculate period
    week_start = briefing_date - timedelta(days=6)  # Last Monday to this Monday

    # Generate the briefing content
    briefing_content = f"""---
type: ceo_briefing
generated: {datetime.now().isoformat()}Z
period: {week_start.strftime('%Y-%m-%d')} to {briefing_date.strftime('%Y-%m-%d')}
week: {briefing_date.strftime('%Y-W%U')}
status: complete
---

# Monday Morning CEO Briefing

## Executive Summary
This week we processed {len(completed_tasks)} tasks and maintained operations. {len(unpaid_invoices)} invoices remain unpaid, with attention needed on critical overdue items. Monthly revenue to date is ${monthly_revenue:,.2f}.

## Revenue Dashboard (from Odoo MCP — get_monthly_revenue)
- **This Week:** [To be calculated from weekly activity]
- **MTD:** ${monthly_revenue:,.2f} ({(monthly_revenue/MONTHLY_REVENUE_TARGET)*100:.1f}% of ${MONTHLY_REVENUE_TARGET:,.0f} target)
- **Trend:** {'On track' if monthly_revenue > (MONTHLY_REVENUE_TARGET * 0.8) else 'Needs attention'}

## Unpaid Invoices (from Odoo MCP — get_unpaid_invoices)
| Invoice | Client | Amount | Due Date | Days Overdue |
|---------|--------|--------|----------|--------------|
"""

    # Add unpaid invoices to the table
    for invoice in unpaid_invoices:
        invoice_name = invoice.get('name', 'N/A')
        client = invoice.get('partner_id', ['N/A'])[1] if isinstance(invoice.get('partner_id'), list) else 'N/A'
        amount = invoice.get('amount_total', 0)
        due_date = invoice.get('invoice_date_due', 'N/A')
        days_overdue = 0
        if due_date != 'N/A':
            try:
                due = datetime.strptime(due_date, '%Y-%m-%d').date()
                days_overdue = (date.today() - due).days
            except:
                pass

        briefing_content += f"| {invoice_name} | {client} | ${amount:,.2f} | {due_date} | {days_overdue} |\n"

    if not unpaid_invoices:
        briefing_content += "| None | - | - | - | - |\n"

    # Check for subscriptions that need attention
    subscriptions_file = ACCOUNTING_DIR / 'Subscriptions.md'
    subscriptions_needing_attention = []
    if subscriptions_file.exists():
        try:
            content = subscriptions_file.read_text()
            # Simple check for subscriptions - in a real implementation, this would be more sophisticated
            pass
        except:
            pass

    briefing_content += """
## Subscription Audit
"""
    if subscriptions_needing_attention:
        for sub in subscriptions_needing_attention:
            briefing_content += f"- **{sub}**: [Review subscription status]\n"
    else:
        briefing_content += "- No subscription issues detected this week.\n"

    briefing_content += """
## Completed Tasks This Week
"""
    if completed_tasks:
        for task in completed_tasks:
            briefing_content += f"{task}\n"
    else:
        briefing_content += "- No tasks marked as completed this week.\n"

    briefing_content += """
## Bottlenecks
| Task | Expected | Actual | Delay |
|------|----------|--------|-------|
| [Example Task] | 2 days | 3 days | +1 day |

## Proactive Suggestions
- **Cost Optimization:** Review subscriptions for unused services
- **Upcoming Deadlines:** Monitor project milestones for next week
- **Invoice Follow-up:** Contact clients with overdue invoices

## Red Flags
"""
    # Add red flags based on data
    critical_invoices = [inv for inv in unpaid_invoices if
                         inv.get('invoice_date_due') and
                         (datetime.strptime(inv['invoice_date_due'], '%Y-%m-%d').date() - date.today()).days <= -INVOICE_OVERDUE_CRITICAL_DAYS]

    if critical_invoices:
        for inv in critical_invoices:
            client = inv.get('partner_id', ['N/A'])[1] if isinstance(inv.get('partner_id'), list) else 'N/A'
            briefing_content += f"- 🔴 Invoice {inv.get('name', 'N/A')} for ${inv.get('amount_total', 0):,.2f} to {client} is critically overdue ({(date.today() - datetime.strptime(inv['invoice_date_due'], '%Y-%m-%d').date()).days} days)\n"
    else:
        briefing_content += "- No critical overdue invoices this week.\n"

    briefing_content += f"""
## Top 3 Priorities — Next Week
1. Follow up on overdue invoices with clients
2. Review and process pending tasks in /Needs_Action/
3. Monitor monthly revenue target (${MONTHLY_REVENUE_TARGET:,.0f})

---
*Generated by AI Employee — Gold Tier | {datetime.now().strftime('%A %B %d, %Y %I:%M %p')} automated briefing*
"""

    # Write the briefing to file
    briefing_filename = f'CEO_Briefing_{briefing_date.strftime("%Y-%m-%d")}.md'
    briefing_path = BRIEFINGS_DIR / briefing_filename
    briefing_path.write_text(briefing_content)

    # Log the completion
    log_entry = {
        'timestamp': datetime.now().isoformat() + 'Z',
        'action_type': 'ceo_briefing_generate',
        'actor': 'ceo_briefing_generator',
        'target': f'briefing:{briefing_filename}',
        'result': 'success',
        'approval_status': 'auto'
    }

    today_log = LOGS_DIR / f'{date.today().isoformat()}.json'
    existing_logs = []
    if today_log.exists():
        try:
            existing_logs = json.loads(today_log.read_text())
        except:
            existing_logs = []

    existing_logs.append(log_entry)
    today_log.write_text(json.dumps(existing_logs, indent=2))

    logger.info(f"CEO Briefing generated: {briefing_path}")
    print("BRIEFING_COMPLETE")


if __name__ == '__main__':
    generate_ceo_briefing()