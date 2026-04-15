# Accounts Receivable Tracker

Track all outstanding invoices and payments due.

## Instructions
- Updated automatically by Odoo MCP integration
- Manual payment logging: update "Payment Status" when payments received
- Red flag: Invoices 30+ days overdue require immediate follow-up

| Invoice # | Client | Amount | Issue Date | Due Date | Status | Days Overdue |
|-----------|--------|--------|------------|----------|--------|--------------|
| INV-2026-001 | Example Corp | $2,500.00 | 2026-02-01 | 2026-02-15 | Unpaid | 16 |
| INV-2026-002 | Sample LLC | $1,200.00 | 2026-02-10 | 2026-02-24 | Unpaid | 7 |

## Summary
- **Total Outstanding:** $3,700.00
- **Overdue (15-30 days):** $2,500.00
- **Overdue (30+ days):** $0.00

## Collection Notes
- Follow up on overdue invoices via email/WhatsApp
- Escalate critically overdue (30+ days) to human review
