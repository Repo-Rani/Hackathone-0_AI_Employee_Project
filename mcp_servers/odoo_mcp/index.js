require('dotenv').config({ path: '../../.env' });
const xmlrpc = require('xmlrpc');

const ODOO_URL  = process.env.ODOO_URL  || 'http://localhost:8069';
const ODOO_DB   = process.env.ODOO_DB   || 'ai_employee_erp';
const ODOO_USER = process.env.ODOO_USER || '';
const ODOO_KEY  = process.env.ODOO_API_KEY || '';
const DRY_RUN   = process.env.DRY_RUN === 'true';

// ── Odoo JSON-RPC helper ────────────────────────────────────────────
function odooCall(model, method, args, kwargs = {}) {
  return new Promise((resolve, reject) => {
    const client = xmlrpc.createClient({ url: `${ODOO_URL}/xmlrpc/2/object` });
    client.methodCall('execute_kw', [
      ODOO_DB, ODOO_USER, ODOO_KEY, model, method, args, kwargs
    ], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

// ── Authenticate first ──────────────────────────────────────────────
async function getUid() {
  return new Promise((resolve, reject) => {
    const client = xmlrpc.createClient({ url: `${ODOO_URL}/xmlrpc/2/common` });
    client.methodCall('authenticate', [ODOO_DB, ODOO_USER, ODOO_KEY, {}],
      (err, uid) => { if (err) reject(err); else resolve(uid); });
  });
}

// ── MCP Tool: create_invoice ────────────────────────────────────────
// Constitution: Guard: DRY_RUN + must only be called AFTER /Pending_Approval/ approved
async function create_invoice({ partner_name, amount, description, due_date }) {
  if (DRY_RUN) {
    console.log(JSON.stringify({
      success: true,
      dry_run: true,
      message: `[DRY RUN] Would create invoice for ${partner_name}: ${amount}`
    }));
    return;
  }

  // Find or create partner
  let partners = await odooCall('res.partner', 'search_read',
    [[['name', 'ilike', partner_name]]], { fields: ['id', 'name'], limit: 1 });

  let partner_id;
  if (partners.length === 0) {
    partner_id = await odooCall('res.partner', 'create', [{ name: partner_name }]);
  } else {
    partner_id = partners[0].id;
  }

  // Create invoice
  const invoice_vals = {
    partner_id,
    move_type: 'out_invoice',
    invoice_date: new Date().toISOString().split('T')[0],
    invoice_date_due: due_date || null,
    invoice_line_ids: [[0, 0, {
      name: description,
      quantity: 1,
      price_unit: parseFloat(amount)
    }]]
  };

  const invoice_id = await odooCall('account.move', 'create', [invoice_vals]);
  // Post (confirm) the invoice
  await odooCall('account.move', 'action_post', [[invoice_id]]);

  console.log(JSON.stringify({
    success: true,
    dry_run: false,
    invoice_id,
    partner_name,
    amount
  }));
}

// ── MCP Tool: get_unpaid_invoices ───────────────────────────────────
// Constitution: Read-only — no DRY_RUN check needed
async function get_unpaid_invoices() {
  const invoices = await odooCall('account.move', 'search_read',
    [[['move_type', '=', 'out_invoice'], ['payment_state', '!=', 'paid']]],
    { fields: ['name', 'partner_id', 'amount_total', 'invoice_date_due', 'payment_state'] }
  );

  console.log(JSON.stringify({ success: true, invoices }));
}

// ── MCP Tool: upsert_customer ───────────────────────────────────────
// Constitution: DRY_RUN check + new customer requires approval before creation
async function upsert_customer({ name, email, phone, company }) {
  if (DRY_RUN) {
    console.log(JSON.stringify({
      success: true,
      dry_run: true,
      message: `[DRY RUN] Would upsert customer: ${name} (${email})`
    }));
    return;
  }

  const existing = await odooCall('res.partner', 'search_read',
    [[['email', '=', email]]], { fields: ['id', 'name'], limit: 1 });

  let partner_id, action;
  if (existing.length > 0) {
    partner_id = existing[0].id;
    await odooCall('res.partner', 'write', [[partner_id], { name, phone: phone || false }]);
    action = 'updated';
  } else {
    partner_id = await odooCall('res.partner', 'create', [{
      name, email, phone: phone || false,
      company_name: company || false
    }]);
    action = 'created';
  }

  console.log(JSON.stringify({ success: true, partner_id, action, dry_run: false }));
}

// ── MCP Tool: get_monthly_revenue ───────────────────────────────────
// Constitution: Read-only — no DRY_RUN check needed
async function get_monthly_revenue({ month, year }) {
  const date_start = `${year}-${String(month).padStart(2, '0')}-01`;
  const date_end   = `${year}-${String(month).padStart(2, '0')}-31`;

  const invoices = await odooCall('account.move', 'search_read', [[
    ['move_type', '=', 'out_invoice'],
    ['state', '=', 'posted'],
    ['invoice_date', '>=', date_start],
    ['invoice_date', '<=', date_end]
  ]], { fields: ['name', 'partner_id', 'amount_total', 'payment_state'] });

  const total = invoices.reduce((sum, inv) => sum + inv.amount_total, 0);
  console.log(JSON.stringify({ success: true, total, month, year, invoices }));
}

// ── MCP dispatcher — reads tool name from argv ──────────────────────
async function main() {
  const tool = process.argv[2];
  const args = process.argv[3] ? JSON.parse(process.argv[3]) : {};

  try {
    await getUid(); // verify auth
    switch (tool) {
      case 'create_invoice':      await create_invoice(args);      break;
      case 'get_unpaid_invoices': await get_unpaid_invoices();      break;
      case 'upsert_customer':     await upsert_customer(args);      break;
      case 'get_monthly_revenue': await get_monthly_revenue(args);  break;
      default:
        console.log(JSON.stringify({ error: `Unknown tool: ${tool}` }));
    }
  } catch (err) {
    console.log(JSON.stringify({ success: false, error: err.message }));
  }
}

main();