/**
 * ============================================================
 * GramDairy — Support Ticket Admin Reply Email Template
 * Triggered: when admin sends a reply to a support ticket
 *
 * Design theme: conversation / letter — warm parchment tones,
 * admin reply styled like a handwritten-style letter card,
 * conversation thread, and action prompts.
 * ============================================================
 */

import {
  BRAND,
  buildEmail,
  renderHeader,
  renderFooter,
  renderButton,
  renderDivider,
  renderAlert,
} from './baseLayout.js';

/**
 * Builds the admin reply to support ticket email.
 *
 * @param {Object} ticket
 *   ticket.ticketId     - e.g. "GD-2026-04893"
 *   ticket.name         - customer's name
 *   ticket.email        - customer's email
 *   ticket.subject      - original ticket subject
 *   ticket.category     - e.g. "Delivery"
 *   ticket.status       - current status after reply
 *   ticket.replies      - array of { sender, message, createdAt }
 *
 * @param {string} replyMessage - the latest admin reply message
 * @param {string} trackUrl     - link to ticket tracking page
 * @returns {string} - full HTML email string
 */
export const supportReplyTemplate = (ticket, replyMessage, trackUrl) => {
  const frontendUrl = process.env.FRONTEND_URL || 'https://gramdairy.com';
  const firstName = (ticket.name || 'Customer').split(' ')[0];
  const replyTime = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  // Status badge config
  const statusConfig = {
    Open: { color: BRAND.sky, label: 'Open' },
    Replied: { color: BRAND.primary, label: 'Replied ✓' },
    'In Progress': { color: BRAND.accent, label: 'In Progress' },
    Resolved: { color: BRAND.success, label: 'Resolved ✅' },
    Closed: { color: BRAND.textLight, label: 'Closed' },
  };
  const stCfg = statusConfig[ticket.status] || statusConfig.Replied;

  // ── Ticket reference strip ────────────────────────────────────
  const ticketRefStrip = `
    <div style="background:${BRAND.primaryDark};border-radius:12px;
                padding:14px 22px;margin-bottom:24px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td>
            <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                        font-size:10px;color:rgba(255,255,255,0.55);
                        text-transform:uppercase;letter-spacing:1.5px;">
              Ticket Reference
            </div>
            <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                        font-size:18px;font-weight:900;color:#ffffff;letter-spacing:2px;">
              ${ticket.ticketId || 'N/A'}
            </div>
            <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                        font-size:12px;color:rgba(255,255,255,0.60);margin-top:2px;">
              ${ticket.subject || 'Support Request'}
            </div>
          </td>
          <td style="text-align:right;vertical-align:middle;">
            <div style="background:${stCfg.color};border-radius:50px;
                        padding:6px 16px;display:inline-block;">
              <span style="font-family:'Helvetica Neue',Arial,sans-serif;
                           font-size:12px;font-weight:700;color:#ffffff;">
                ${stCfg.label}
              </span>
            </div>
          </td>
        </tr>
      </table>
    </div>`;

  // ── Admin reply card (letter style) ───────────────────────────
  const replyCard = `
    <div style="position:relative;margin-bottom:28px;">
      <!-- Parchment paper effect -->
      <div style="background:linear-gradient(to bottom,#fffef5,#fffdf0);
                  border-radius:12px;border:1px solid #e8ddb8;
                  box-shadow:0 4px 16px rgba(0,0,0,0.08),
                             inset 0 1px 0 rgba(255,255,255,0.8);
                  overflow:hidden;">

        <!-- Letter header -->
        <div style="background:${BRAND.primary};padding:14px 22px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td>
                <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                            font-size:11px;color:rgba(255,255,255,0.65);
                            text-transform:uppercase;letter-spacing:1px;">
                  Response from GramDairy Support
                </div>
                <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                            font-size:13px;color:#ffffff;font-weight:600;margin-top:2px;">
                  ${replyTime}
                </div>
              </td>
              <td style="text-align:right;">
                <div style="font-size:24px;">💬</div>
              </td>
            </tr>
          </table>
        </div>

        <!-- Letter body -->
        <div style="padding:24px 26px;">
          <p style="font-family:'Helvetica Neue',Arial,sans-serif;
                    font-size:14px;color:${BRAND.textMid};margin:0 0 12px 0;
                    font-style:italic;">
            Dear ${firstName},
          </p>

          <!-- Main reply message -->
          <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                      font-size:15px;color:${BRAND.textDark};line-height:1.8;
                      white-space:pre-line;padding:0 0 16px 0;">
            ${replyMessage}
          </div>

          <!-- Signature area -->
          <div style="border-top:1px dashed #d4c890;padding-top:14px;margin-top:8px;">
            <p style="font-family:'Helvetica Neue',Arial,sans-serif;
                      font-size:13px;color:${BRAND.textMid};margin:0;font-style:italic;">
              Warm regards,
            </p>
            <p style="font-family:'Helvetica Neue',Arial,sans-serif;
                      font-size:14px;font-weight:700;color:${BRAND.primaryDark};
                      margin:4px 0 0 0;">
              GramDairy Support Team
            </p>
            <div style="display:inline-block;background:${BRAND.primary};
                        border-radius:4px;padding:3px 10px;margin-top:8px;">
              <span style="font-family:'Helvetica Neue',Arial,sans-serif;
                           font-size:9px;font-weight:700;color:#ffffff;
                           letter-spacing:1.5px;text-transform:uppercase;">
                OFFICIAL RESPONSE
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  // ── Conversation thread (previous replies) ────────────────────
  const prevReplies = Array.isArray(ticket.replies) && ticket.replies.length > 1
    ? ticket.replies.slice(0, -1).slice(-2) // show last 2 previous
    : [];

  const threadBlock = prevReplies.length > 0 ? `
    <div style="margin:24px 0;">
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;
                font-weight:700;color:${BRAND.textLight};text-transform:uppercase;
                letter-spacing:0.8px;margin:0 0 12px 0;">
        💬 Previous Conversation
      </p>
      ${prevReplies.map(reply => `
        <div style="border-left:3px solid ${reply.sender === 'Admin' ? BRAND.primary : BRAND.border};
                    padding:10px 16px;margin-bottom:12px;
                    background:${reply.sender === 'Admin' ? BRAND.primaryLight : '#f8f8f8'};
                    border-radius:0 8px 8px 0;">
          <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                      font-size:11px;font-weight:700;
                      color:${reply.sender === 'Admin' ? BRAND.primary : BRAND.textLight};
                      text-transform:uppercase;letter-spacing:0.5px;margin-bottom:5px;">
            ${reply.sender === 'Admin' ? '🛠 GramDairy Support' : '👤 You'}
          </div>
          <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                      font-size:13px;color:${BRAND.textMid};line-height:1.6;">
            ${(reply.message || '').substring(0, 150)}${(reply.message || '').length > 150 ? '…' : ''}
          </div>
        </div>`).join('')}
    </div>` : '';

  // ── Satisfaction rating block ──────────────────────────────────
  const satisfactionBlock = `
    <div style="background:#ffffff;border:1px solid ${BRAND.border};
                border-radius:12px;padding:20px 24px;margin:24px 0;text-align:center;">
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;
                font-weight:700;color:${BRAND.textDark};margin:0 0 14px 0;
                text-transform:uppercase;letter-spacing:0.8px;">
        ⭐ How Are We Doing?
      </p>
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;
                color:${BRAND.textMid};margin:0 0 16px 0;line-height:1.6;">
        Was this response helpful? Rate our support:
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0"
             style="margin:0 auto;">
        <tr>
          ${['😞 Poor', '😐 Fair', '🙂 Good', '😄 Great', '🤩 Excellent'].map((label, i) => `
            <td style="padding:0 4px;">
              <a href="${frontendUrl}/support/rate?ticket=${ticket.ticketId}&rating=${i + 1}"
                 style="display:inline-block;background:${BRAND.primaryLight};
                        border:1px solid ${BRAND.border};border-radius:10px;
                        padding:8px 10px;font-family:'Helvetica Neue',Arial,sans-serif;
                        font-size:11px;color:${BRAND.textMid};text-decoration:none;
                        font-weight:600;white-space:nowrap;">
                ${label}
              </a>
            </td>`).join('')}
        </tr>
      </table>
    </div>`;

  // ── Self-serve options ────────────────────────────────────────
  const selfServeOptions = `
    <div style="background:${BRAND.primaryLight};border-radius:12px;
                padding:18px 22px;margin:24px 0;">
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;
                font-weight:700;color:${BRAND.primary};margin:0 0 12px 0;
                text-transform:uppercase;letter-spacing:0.8px;">
        🔧 While We Help You — Self-Service Options
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td style="padding:6px 0;font-family:'Helvetica Neue',Arial,sans-serif;
                     font-size:13px;color:${BRAND.textMid};line-height:1.6;">
            ▸ <a href="${frontendUrl}/orders" style="color:${BRAND.primary};text-decoration:none;">
              Track your orders</a><br>
            ▸ <a href="${frontendUrl}/subscriptions" style="color:${BRAND.primary};text-decoration:none;">
              Manage your subscription</a><br>
            ▸ <a href="${frontendUrl}/billing" style="color:${BRAND.primary};text-decoration:none;">
              View billing &amp; payments</a><br>
            ▸ <a href="${frontendUrl}/help" style="color:${BRAND.primary};text-decoration:none;">
              Browse our Help Centre</a>
          </td>
        </tr>
      </table>
    </div>`;

  // ── Inner body ────────────────────────────────────────────────
  const inner = `
    <p style="font-family:'Helvetica Neue',Arial,sans-serif;
              font-size:15px;color:${BRAND.textMid};margin:0 0 6px 0;">
      Dear <strong style="color:${BRAND.textDark};">${firstName}</strong>,
    </p>

    <h1 style="font-family:'Helvetica Neue',Arial,sans-serif;
               font-size:24px;font-weight:900;color:${BRAND.primary};
               margin:0 0 16px 0;line-height:1.3;">
      💬 New Reply to Your Support Ticket
    </h1>

    <p style="font-family:'Helvetica Neue',Arial,sans-serif;
              font-size:14px;color:${BRAND.textMid};line-height:1.7;margin:0 0 24px 0;">
      Our support team has responded to your ticket
      <strong style="color:${BRAND.primaryDark};">${ticket.ticketId}</strong>.
      Please review the response below.
    </p>

    ${ticketRefStrip}
    ${replyCard}

    ${threadBlock}

    ${renderDivider()}

    ${satisfactionBlock}
    ${selfServeOptions}

    ${renderAlert(
    'Need to follow up? Simply reply to this email or use the "Reply to Ticket" button below — your reply will be automatically attached.',
    'info'
  )}

    ${renderButton(
    trackUrl || `${frontendUrl}/support/track?id=${ticket.ticketId}`,
    'Reply to This Ticket 💬'
  )}

    ${renderDivider()}

    <p style="font-family:'Helvetica Neue',Arial,sans-serif;
              font-size:14px;color:${BRAND.textMid};line-height:1.7;margin:0;">
      Always here for you,<br>
      <strong style="color:${BRAND.primaryDark};">GramDairy Customer Support</strong><br>
      <em style="font-size:12px;color:${BRAND.textLight};">support@gramdairy.com · Mon–Sun, 8 AM to 10 PM</em>
    </p>`;

  return buildEmail(
    renderHeader('Support Response'),
    inner,
    renderFooter(),
    `New response to your ticket ${ticket.ticketId || ''}. ${replyMessage.substring(0, 80)}…`,
  );
};
