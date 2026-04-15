/**
 * Email MCP Server — Silver Tier
 * Kaam: Gmail se email bhejna (HITL approval ke baad sirf)
 * DRY_RUN=true → sirf log karo, actual email mat bhejo
 */

require("dotenv").config({ path: "../../../.env" });
const nodemailer = require("nodemailer");
const readline = require("readline");

const DRY_RUN = process.env.DRY_RUN === "true";
const MAX_PER_HOUR = parseInt(process.env.MAX_EMAILS_PER_HOUR || "10");

// ── Rate Limiter ──────────────────────────────────────────────
let sentThisHour = 0;
let hourStart = Date.now();

function checkRateLimit() {
    const now = Date.now();
    if (now - hourStart > 3600000) {  // 1 hour reset
        sentThisHour = 0;
        hourStart = now;
    }
    if (sentThisHour >= MAX_PER_HOUR) {
        throw new Error(`Rate limit reached: ${MAX_PER_HOUR} emails/hour`);
    }
}

// ── Transporter ───────────────────────────────────────────────
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

// ── Send Email Function ───────────────────────────────────────
async function sendEmail({ to, subject, body, attachment_path }) {
    checkRateLimit();

    if (DRY_RUN) {
        console.log(`[DRY RUN] Would send email:`);
        console.log(`  To: ${to}`);
        console.log(`  Subject: ${subject}`);
        console.log(`  Body preview: ${body?.substring(0, 100)}...`);
        return { success: true, dry_run: true, message_id: "DRY_RUN_" + Date.now() };
    }

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: to,
        subject: subject,
        text: body
    };

    if (attachment_path && attachment_path.trim() !== "") {
        mailOptions.attachments = [{ path: attachment_path }];
    }

    const info = await transporter.sendMail(mailOptions);
    sentThisHour++;
    console.log(`Email sent: ${info.messageId}`);
    return { success: true, dry_run: false, message_id: info.messageId };
}

// ── MCP stdio Interface ───────────────────────────────────────
// Claude CLI MCP protocol: JSON-RPC over stdin/stdout
const rl = readline.createInterface({ input: process.stdin });

rl.on("line", async (line) => {
    try {
        const request = JSON.parse(line);
        const { id, method, params } = request;

        if (method === "tools/list") {
            const response = {
                jsonrpc: "2.0", id,
                result: {
                    tools: [{
                        name: "send_email",
                        description: "Send an email via Gmail. Only call after human approval.",
                        inputSchema: {
                            type: "object",
                            properties: {
                                to: { type: "string", description: "Recipient email" },
                                subject: { type: "string", description: "Email subject" },
                                body: { type: "string", description: "Email body text" },
                                attachment_path: { type: "string", description: "Optional file path" }
                            },
                            required: ["to", "subject", "body"]
                        }
                    }]
                }
            };
            console.log(JSON.stringify(response));

        } else if (method === "tools/call" && params?.name === "send_email") {
            const result = await sendEmail(params.arguments);
            const response = {
                jsonrpc: "2.0", id,
                result: { content: [{ type: "text", text: JSON.stringify(result) }] }
            };
            console.log(JSON.stringify(response));

        } else {
            console.log(JSON.stringify({
                jsonrpc: "2.0", id,
                error: { code: -32601, message: "Method not found" }
            }));
        }
    } catch (err) {
        console.error(`MCP Error: ${err.message}`);
    }
});

console.error("Email MCP Server started (stderr log)");