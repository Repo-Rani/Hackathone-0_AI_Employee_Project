# Platinum Tier Implementation Checklist

## Infrastructure
- [ ] Cloud VM running 24/7 (Oracle/AWS)
- [ ] PM2 managing all Cloud processes with auto-restart
- [ ] PM2 startup configured (survives VM reboots)
- [ ] Health Monitor running and writing alerts to vault
- [ ] All required software installed on Cloud VM (python3.13, nodejs, npm, git, curl, Claude Code)
- [ ] PM2 processes properly configured with auto-start

## Sync
- [ ] Vault syncing via Git or Syncthing
- [ ] `.gitignore` verified — no secrets in repo
- [ ] Claim-by-move protocol implemented and tested
- [ ] Single-writer rule for `Dashboard.md` enforced (Local only)
- [ ] Vault directory structure matches Platinum spec
- [ ] Auto-pull configured on Local (5-min cron)

## Work-Zone Split
- [ ] Cloud: Email triage, draft replies, social drafts ✓
- [ ] Cloud: NEVER sends/posts/pays directly ✓
- [ ] Local: WhatsApp session ✓
- [ ] Local: All payment execution ✓
- [ ] Local: Final email/social send ✓
- [ ] Local: Only writer to `Dashboard.md` ✓
- [ ] Proper environment variable separation (.env_cloud vs .env_local)

## Odoo
- [ ] Odoo 19 Community deployed on Cloud VM
- [ ] HTTPS configured (Nginx + Let's Encrypt)
- [ ] Daily backups running (cron)
- [ ] Odoo health check endpoint accessible
- [ ] Odoo MCP server built with draft/post separation
- [ ] Cloud: Draft invoice only ✓
- [ ] Local: Post invoice + register payment ✓

## Security
- [ ] `.env` files never committed to vault
- [ ] Cloud VM has no WhatsApp session
- [ ] Cloud VM has no banking credentials
- [ ] Audit logs written for every action
- [ ] Dry-run mode tested before live deployment
- [ ] All sensitive tokens properly isolated

## Core Module Implementation
- [ ] vault_sync.py module implemented and tested
- [ ] claim_task.py module with claim-by-move protocol working
- [ ] cloud_orchestrator.py running with proper scanning
- [ ] Odoo MCP server with draft/execution split implemented
- [ ] Health monitor checking all required components
- [ ] All modules properly handle errors and sync operations

## Testing & Validation
- [ ] Cloud-Local coordination scenario works end-to-end
- [ ] Draft/execution separation properly enforced
- [ ] Health monitoring and auto-recovery functional
- [ ] Security boundaries properly maintained
- [ ] Vault sync works without sensitive data exposure
- [ ] Claim-by-move protocol prevents double work 100% of the time

## Specific Scenario Tests
- [ ] Email arrives while Local is offline → Cloud processes → Local executes upon return
- [ ] Cloud creates draft invoice → Local approves → Invoice posted successfully
- [ ] Health monitor detects process failure → Auto-restarts → Alerts written to vault
- [ ] Multiple agents attempt to claim same task → Only one succeeds (claim-by-move)
- [ ] Vault sync failure → Retry mechanism works → No data loss
- [ ] Cloud agent never executes sensitive operations

## File Structure Verification
- [ ] Dashboard.md exists and only Local writes to it
- [ ] Company_Handbook.md exists
- [ ] Business_Goals.md exists
- [ ] Needs_Action/ directories created: email, whatsapp, social, accounting, general
- [ ] In_Progress/ directories created: cloud_agent, local_agent
- [ ] Plans/ directories created: email, social, accounting, projects
- [ ] Pending_Approval/ directories created: email, payments, social, odoo
- [ ] Approved/, Rejected/, Done/, Updates/, Briefings/, Accounting/, Logs/ exist

## Approval Workflows
- [ ] Pending approval files properly created in vault
- [ ] Human can move files to Approved/ or Rejected/
- [ ] Local agent processes Approved files correctly
- [ ] Proper audit trails maintained with agent attribution
- [ ] Rejected files are properly handled

## Performance & Reliability
- [ ] Cloud agents maintain 24/7 uptime
- [ ] Vault sync completes within 5 minutes
- [ ] Health checks run every 5 minutes as expected
- [ ] Error recovery within acceptable timeframes
- [ ] No conflicts between Cloud and Local agents

## Documentation
- [ ] Quickstart guide complete and functional
- [ ] Security boundaries clearly documented
- [ ] Approval workflows clearly documented
- [ ] Emergency procedures documented
- [ ] Health monitoring procedures documented

## Final Demo Verification
- [ ] Cloud VM running (pm2 status)
- [ ] Email arrives while Local "offline" → Cloud processes → Local executes
- [ ] Vault sync happening automatically
- [ ] Dashboard.md updating with pending approval
- [ ] Human approving (moving file) → Local executing
- [ ] Complete audit log in Logs/
- [ ] Odoo with draft invoice created by Cloud
- [ ] Invoice posted only after Local approval