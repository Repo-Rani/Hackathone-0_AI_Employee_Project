import xmlrpc.client
import json
import os

class OdooMCPServer:
    """
    Odoo 19 External API integration via JSON-RPC.
    Cloud uses this for DRAFT actions only.
    Local uses this for POSTING/PAYMENT actions.
    """

    def __init__(self):
        self.url = os.getenv('ODOO_URL')          # e.g. https://your-domain.com
        self.db = os.getenv('ODOO_DB')
        self.username = os.getenv('ODOO_USERNAME')
        self.password = os.getenv('ODOO_PASSWORD')
        self.uid = None
        self._authenticate()

    def _authenticate(self):
        common = xmlrpc.client.ServerProxy(f'{self.url}/xmlrpc/2/common')
        self.uid = common.authenticate(self.db, self.username, self.password, {})
        self.models = xmlrpc.client.ServerProxy(f'{self.url}/xmlrpc/2/object')

    def _execute(self, model, method, *args, **kwargs):
        return self.models.execute_kw(
            self.db, self.uid, self.password,
            model, method, list(args), kwargs
        )

    # ── CLOUD AGENT ACTIONS (draft-only) ──────────────────────

    def create_draft_invoice(self, partner_name: str, amount: float,
                              description: str) -> dict:
        """Create invoice in DRAFT state — does NOT post/send."""
        partner_id = self._get_or_create_partner(partner_name)
        invoice_id = self._execute('account.move', 'create', {
            'move_type': 'out_invoice',
            'partner_id': partner_id,
            'state': 'draft',              # DRAFT ONLY
            'invoice_line_ids': [(0, 0, {
                'name': description,
                'quantity': 1,
                'price_unit': amount,
            })]
        })
        return {'invoice_id': invoice_id, 'status': 'draft', 'amount': amount}

    def create_draft_expense(self, name: str, amount: float,
                              category: str) -> dict:
        """Log expense in draft — requires Local approval to confirm."""
        expense_id = self._execute('hr.expense', 'create', {
            'name': name,
            'total_amount': amount,
            'product_id': self._get_expense_product(category),
        })
        return {'expense_id': expense_id, 'status': 'draft'}

    # ── LOCAL AGENT ACTIONS (post/payment — after approval) ───

    def post_invoice(self, invoice_id: int) -> dict:
        """Post (confirm) a draft invoice — LOCAL ONLY after human approval."""
        self._execute('account.move', 'action_post', [invoice_id])
        return {'invoice_id': invoice_id, 'status': 'posted'}

    def register_payment(self, invoice_id: int) -> dict:
        """Register payment against invoice — LOCAL ONLY."""
        payment_vals = self._execute(
            'account.move', 'action_register_payment', [invoice_id]
        )
        return {'status': 'payment_registered', 'invoice_id': invoice_id}

    def _get_or_create_partner(self, name: str) -> int:
        partners = self._execute('res.partner', 'search', [['name', '=', name]])
        if partners:
            return partners[0]
        return self._execute('res.partner', 'create', {'name': name})

    def _get_expense_product(self, category: str) -> int:
        products = self._execute('product.product', 'search',
                                 [['name', 'ilike', category]])
        return products[0] if products else 1