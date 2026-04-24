/**
 * ============================================================
 * GramDairy — Support Ticket Created Email Template
 * Triggered: immediately after a customer submits a support ticket
 *
 * Design theme: trusted helpdesk — calm blues/greens,
 * an official ticket card styled like a stamp/voucher,
 * category icon mapping, expected response timeline,
 * and a self-service FAQ section.
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
 * Builds the support ticket acknowledgment email.
 *
 * @param {Object} ticket
 *   ticket.ticketId    - e.g. "GD-2026-04893"
 *   ticket.name        - submitter's name
 *   ticket.email       - submitter's email
 *   ticket.category    - e.g. "Delivery", "Billing", "Product", "Technical"
 *   ticket.priority    - "Low" | "Medium" | "High" | "Critical"
 *   ticket.subject     - ticket subject line
 *   ticket.message     - customer's message (trimmed)
 *   ticket.createdAt   - Date object or ISO string
 *
 * @param {string} trackUrl - direct URL to track the ticket
 * @returns {string} - full HTML email string
 */
export const supportCreatedTemplate = (ticket, trackUrl) => {
  const frontendUrl = process.env.FRONTEND_URL || 'https://gramdairy.com';
  const firstName = (ticket.name || 'Customer').split(' ')[0];
  const ticketDate = ticket.createdAt
    ? new Date(ticket.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
    : new Date().toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

  // Priority styling
  const priorityConfig = {
    Low: { color: BRAND.success, bg: BRAND.successLight, label: 'Low Priority' },
    Medium: { color: BRAND.accent, bg: BRAND.accentLight, label: 'Medium Priority' },
    High: { color: BRAND.warning, bg: BRAND.warningLight, label: 'High Priority' },
    Critical: { color: BRAND.danger, bg: BRAND.dangerLight, label: '🚨 Critical' },
  };
  const priCfg = priorityConfig[ticket.priority] || priorityConfig.Medium;

  // Category icon mapping
  const categoryIcons = {
    Delivery: '🚚',
    Billing: '💳',
    Product: '🥛',
    Technical: '⚙️',
    Account: '👤',
    Complaint: '📢',
    Feedback: '💬',
    General: '❓',
  };
  const catIcon = categoryIcons[ticket.category] || '📋';

  // Expected response SLA
  const responseSLA = {
    Low: '48–72 business hours',
    Medium: '24–48 business hours',
    High: '8–24 hours',
    Critical: '2–4 hours',
  };
  const sla = responseSLA[ticket.priority] || '24–48 hours';

  // ── Ticket card (stamp-style) ─────────────────────────────────
  const ticketCard = `
    <div style="border:2px solid ${BRAND.primary};border-radius:16px;
                overflow:hidden;margin-bottom:28px;
                box-shadow:0 6px 24px rgba(45,106,45,0.15);">

      <!-- Ticket header -->
      <div style="background:${BRAND.primary};padding:18px 24px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td>
              <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                          font-size:10px;color:rgba(255,255,255,0.60);
                          text-transform:uppercase;letter-spacing:1.5px;margin-bottom:3px;">
                Support Request
              </div>
              <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                          font-size:20px;font-weight:900;color:#ffffff;letter-spacing:2px;">
                ${ticket.ticketId || 'GD-XXXXXXXX'}
              </div>
            </td>
            <td style="text-align:right;vertical-align:middle;">
              <div style="font-size:36px;">${catIcon}</div>
            </td>
          </tr>
        </table>
      </div>

      <!-- Perforated divider -->
      <div style="padding:0;height:2px;background:repeating-linear-gradient(
                    to right,${BRAND.primary} 0px,${BRAND.primary} 8px,
                    ${BRAND.cream} 8px,${BRAND.cream} 14px);"></div>

      <!-- Ticket body -->
      <div style="background:#ffffff;padding:20px 24px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;
                       color:${BRAND.textLight};font-weight:600;text-transform:uppercase;
                       letter-spacing:0.8px;padding-bottom:4px;">
              Subject
            </td>
          </tr>
          <tr>
            <td style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;
                       color:${BRAND.textDark};font-weight:700;padding-bottom:14px;
                       border-bottom:1px dashed ${BRAND.border};">
              ${ticket.subject || 'Support Request'}
            </td>
          </tr>
          <tr><td style="padding:12px 0;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                <td style="width:50%;padding-right:12px;">
                  <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;
                              color:${BRAND.textLight};text-transform:uppercase;
                              letter-spacing:0.8px;margin-bottom:3px;">Category</div>
                  <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;
                              color:${BRAND.textDark};font-weight:600;">
                    ${catIcon} ${ticket.category || 'General'}
                  </div>
                </td>
                <td style="width:50%;">
                  <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;
                              color:${BRAND.textLight};text-transform:uppercase;
                              letter-spacing:0.8px;margin-bottom:3px;">Priority</div>
                  <div style="display:inline-block;background:${priCfg.bg};
                              border:1px solid ${priCfg.color};border-radius:50px;
                              padding:3px 12px;">
                    <span style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;
                                 font-weight:700;color:${priCfg.color};">${priCfg.label}</span>
                  </div>
                </td>
              </tr>
            </table>
          </td></tr>
          <tr>
            <td style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;
                       color:${BRAND.textLight};text-transform:uppercase;letter-spacing:0.8px;
                       padding-bottom:4px;">
              Submitted At
            </td>
          </tr>
          <tr>
            <td style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;
                       color:${BRAND.textMid};padding-bottom:14px;">
              ${ticketDate}
            </td>
          </tr>
        </table>
      </div>

      <!-- Message preview -->
      <div style="background:${BRAND.primaryLight};padding:16px 24px;
                  border-top:1px solid ${BRAND.border};">
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;
                    color:${BRAND.textLight};text-transform:uppercase;
                    letter-spacing:0.8px;margin-bottom:8px;">
          Your Message
        </div>
        <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;
                  color:${BRAND.textMid};line-height:1.7;margin:0;font-style:italic;">
          "${(ticket.message || '').substring(0, 200)}${(ticket.message || '').length > 200 ? '…' : ''}"
        </p>
      </div>

      <!-- Footer stamp -->
      <div style="background:${BRAND.primaryDark};padding:10px 24px;text-align:right;">
        <span style="font-family:monospace;font-size:10px;color:rgba(255,255,255,0.35);
                     letter-spacing:1px;">GramDairy Support System · Ticket #${ticket.ticketId}</span>
      </div>
    </div>`;

  // ── Response timeline ─────────────────────────────────────────
  const timelineStep = (active, label, desc, emoji) => `
    <tr>
      <td style="vertical-align:top;padding:0 0 20px 0;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="width:42px;vertical-align:top;text-align:center;">
              <div style="width:36px;height:36px;border-radius:50%;
                          background:${active ? BRAND.primary : BRAND.border};
                          line-height:36px;font-size:16px;text-align:center;">
                ${emoji}
              </div>
              <div style="width:2px;background:${BRAND.border};height:20px;margin:0 auto;"></div>
            </td>
            <td style="padding-left:14px;vertical-align:top;">
              <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                          font-size:13px;font-weight:700;color:${active ? BRAND.textDark : BRAND.textLight};
                          margin-bottom:3px;">${label}</div>
              <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                          font-size:12px;color:${BRAND.textLight};line-height:1.5;">
                ${desc}
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;

  const responseTimeline = `
    <div style="margin:24px 0;">
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;
                font-weight:700;color:${BRAND.textDark};text-transform:uppercase;
                letter-spacing:0.8px;margin:0 0 16px 0;">
        ⏱ What Happens Next
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
        ${timelineStep(true, 'Ticket Created', 'Your request has been logged and is in our queue.', '✅')}
        ${timelineStep(false, 'Under Review', 'Our support team will review your issue shortly.', '🔍')}
        ${timelineStep(false, 'Response Sent', `Expected within ${sla}.`, '💬')}
        ${timelineStep(false, 'Issue Resolved', 'We\'ll mark it closed once confirmed by you.', '🎯')}
      </table>
    </div>`;

  // ── FAQ quick answers ─────────────────────────────────────────
  const faqItem = (q, a) => `
    <div style="border-bottom:1px solid ${BRAND.borderLight};padding:12px 0;">
      <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;
                  font-weight:700;color:${BRAND.textDark};margin-bottom:5px;">
        ${q}
      </div>
      <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;
                  color:${BRAND.textMid};line-height:1.6;">
        ${a}
      </div>
    </div>`;

  const faqBlock = `
    <div style="background:#ffffff;border:1px solid ${BRAND.border};
                border-radius:12px;padding:18px 22px;margin:24px 0;">
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;
                font-weight:700;color:${BRAND.textDark};margin:0 0 12px 0;
                text-transform:uppercase;letter-spacing:0.8px;">
        ❓ While You Wait — Quick Answers
      </p>
      ${faqItem(
    'How do I track my ticket?',
    `Visit <a href="${trackUrl || frontendUrl + '/support'}" style="color:${BRAND.primary};">your ticket status page</a> or use the Ticket ID above in our support portal.`
  )}
      ${faqItem(
    'Can I add more information?',
    'Yes! Simply reply to this email with any additional details and they will be attached to your ticket automatically.'
  )}
      ${faqItem(
    'What if I need urgent help?',
    'For emergencies, use the Live Chat option in the GramDairy app (available 9 AM–9 PM daily).'
  )}
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
      🎫 We've Got Your Request!
    </h1>

    <p style="font-family:'Helvetica Neue',Arial,sans-serif;
              font-size:14px;color:${BRAND.textMid};line-height:1.7;margin:0 0 24px 0;">
      Your support request has been successfully received and a ticket has been created
      in our system. Please keep your Ticket ID handy — you'll need it to track the
      progress of your request.
    </p>

    ${ticketCard}
    ${responseTimeline}

    ${renderDivider()}

    ${faqBlock}

    ${renderAlert(
    'To provide any updates or additional information, simply reply to this email. Your reply will be automatically linked to your ticket.',
    'info'
  )}

    ${renderButton(
    trackUrl || `${frontendUrl}/support/track?id=${ticket.ticketId}`,
    'Track My Ticket 🔍'
  )}

    ${renderDivider()}

    <p style="font-family:'Helvetica Neue',Arial,sans-serif;
              font-size:14px;color:${BRAND.textMid};line-height:1.7;margin:0;">
      We're here to help,<br>
      <strong style="color:${BRAND.primaryDark};">GramDairy Customer Support</strong><br>
      <em style="font-size:12px;color:${BRAND.textLight};">Mon–Sun: 8 AM to 10 PM · support@gramdairy.com</em>
    </p>`;

  return buildEmail(
    renderHeader('Support Team — Here to Help'),
    inner,
    renderFooter(),
    `Support ticket ${ticket.ticketId || ''} created. We'll respond within ${sla}.`,
  );
};
