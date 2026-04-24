/**
 * ============================================================
 * GramDairy — Subscription Status Update Email Template
 * Triggered: when admin pauses / resumes a customer's subscription
 *
 * Design theme: morning milk routine — calm greens/ambers,
 * a subscription calendar visual, status badge, reason card,
 * and next-steps guidance.
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
 * Builds the subscription status update email.
 *
 * @param {Object} data
 *   data.userName      - customer's name
 *   data.userEmail     - customer's email
 *   data.productName   - subscription product name e.g. "Full Cream Milk 500ml"
 *   data.status        - 'Active' | 'Paused' | 'Cancelled' | 'Resumed'
 *   data.reason        - reason for status change (optional)
 *   data.quantity      - e.g. "2 Litres"
 *   data.frequency     - e.g. "Daily"
 *   data.deliverySlot  - e.g. "Morning (6–8 AM)"
 *
 * @returns {string} - full HTML email string
 */
export const subscriptionStatusTemplate = (data) => {
  const frontendUrl = process.env.FRONTEND_URL || 'https://gramdairy.com';
  const firstName = (data.userName || 'Customer').split(' ')[0];
  const isPaused = ['Paused', 'Cancelled'].includes(data.status);
  const isResumed = data.status === 'Active' || data.status === 'Resumed';

  // Colour config per status
  const statusConfig = {
    Active: { color: BRAND.success, bg: BRAND.successLight, icon: '▶️', label: 'Active & Running' },
    Resumed: { color: BRAND.success, bg: BRAND.successLight, icon: '▶️', label: 'Resumed' },
    Paused: { color: BRAND.warning, bg: BRAND.warningLight, icon: '⏸️', label: 'Temporarily Paused' },
    Cancelled: { color: BRAND.danger, bg: BRAND.dangerLight, icon: '🚫', label: 'Cancelled' },
  };
  const cfg = statusConfig[data.status] || statusConfig.Paused;

  // ── Status hero card ──────────────────────────────────────────
  const statusHero = `
    <div style="background:linear-gradient(135deg,${BRAND.primaryDark} 0%,${BRAND.primary} 100%);
                border-radius:16px;padding:26px 28px;margin-bottom:28px;
                box-shadow:0 8px 30px rgba(45,106,45,0.28);">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td style="vertical-align:middle;">
            <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                        font-size:12px;color:rgba(255,255,255,0.60);
                        text-transform:uppercase;letter-spacing:1.2px;margin-bottom:6px;">
              Subscription Update
            </div>
            <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                        font-size:22px;font-weight:900;color:#ffffff;
                        margin-bottom:4px;">
              ${data.productName || 'Your Dairy Plan'}
            </div>
            <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                        font-size:13px;color:rgba(255,255,255,0.70);">
              ${data.quantity ? `${data.quantity}` : ''}
              ${data.frequency ? ` · ${data.frequency}` : ''}
              ${data.deliverySlot ? ` · ${data.deliverySlot}` : ''}
            </div>
          </td>
          <td style="text-align:right;vertical-align:middle;white-space:nowrap;">
            <div style="background:${cfg.bg};border:2px solid ${cfg.color};
                        border-radius:50px;padding:8px 18px;display:inline-block;">
              <span style="font-family:'Helvetica Neue',Arial,sans-serif;
                           font-size:14px;font-weight:800;color:${cfg.color};">
                ${cfg.icon} ${cfg.label}
              </span>
            </div>
          </td>
        </tr>
      </table>
    </div>`;

  // ── Reason card ───────────────────────────────────────────────
  const reasonCard = data.reason ? `
    <div style="background:${BRAND.accentLight};border-left:5px solid ${BRAND.accent};
                border-radius:8px;padding:18px 22px;margin:20px 0;">
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;
                font-weight:700;color:${BRAND.earth};text-transform:uppercase;
                letter-spacing:0.8px;margin:0 0 8px 0;">
        Reason for This Change
      </p>
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;
                color:${BRAND.textDark};line-height:1.7;margin:0;font-style:italic;">
        "${data.reason}"
      </p>
    </div>` : '';

  // ── Calendar strip (7-day visual) ─────────────────────────────
  const today = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const calendarCells = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today); d.setDate(today.getDate() + i);
    const isToday = i === 0;
    const dayStatus = isPaused ? 'paused' : 'active';
    const bgColor = isToday
      ? BRAND.primary
      : (dayStatus === 'paused' ? BRAND.border : BRAND.primaryLight);
    const textColor = isToday ? '#ffffff' : (dayStatus === 'paused' ? BRAND.textLight : BRAND.primary);
    return `
      <td style="text-align:center;padding:0 3px;">
        <div style="border-radius:10px;padding:10px 6px;background:${bgColor};
                    min-width:32px;">
          <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                      font-size:9px;font-weight:600;color:${textColor};
                      text-transform:uppercase;letter-spacing:0.5px;">
            ${dayNames[d.getDay()]}
          </div>
          <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                      font-size:15px;font-weight:800;color:${textColor};margin:4px 0;">
            ${d.getDate()}
          </div>
          <div style="font-size:12px;">
            ${dayStatus === 'paused' ? '⏸' : '🥛'}
          </div>
        </div>
      </td>`;
  }).join('');

  const calendarStrip = `
    <div style="margin:24px 0;">
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;
                font-weight:700;color:${BRAND.textDark};margin:0 0 12px 0;
                text-transform:uppercase;letter-spacing:0.8px;">
        📅 Your Delivery Schedule — Next 7 Days
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>${calendarCells}</tr>
      </table>
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;
                color:${BRAND.textLight};margin:10px 0 0 0;">
        ${isPaused
      ? '⏸ Deliveries are paused. No milk will be delivered until your plan is resumed.'
      : '🥛 Your daily deliveries are active and scheduled as usual.'}
      </p>
    </div>`;

  // ── What happens next ─────────────────────────────────────────
  const nextInfoItem = (emoji, title, body) => `
    <tr>
      <td style="padding:10px 0;vertical-align:top;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="font-size:20px;vertical-align:middle;padding-right:12px;
                       width:32px;">${emoji}</td>
            <td style="vertical-align:middle;">
              <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                          font-size:13px;font-weight:700;color:${BRAND.textDark};
                          margin-bottom:3px;">${title}</div>
              <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                          font-size:12px;color:${BRAND.textMid};line-height:1.5;">
                ${body}
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;

  const nextSteps = isPaused ? `
    <div style="background:${BRAND.primaryLight};border-radius:12px;
                padding:20px 24px;margin:24px 0;">
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;
                font-weight:700;color:${BRAND.primary};margin:0 0 12px 0;
                text-transform:uppercase;letter-spacing:0.8px;">
        ℹ️ What Happens Now
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        ${nextInfoItem('🛑', 'Deliveries Halted', 'No deliveries will occur until your plan is reactivated.')}
        ${nextInfoItem('💳', 'No Charges', 'You will not be charged for any paused delivery days.')}
        ${nextInfoItem('📱', 'Request Reactivation', 'Use the app to send a restart request to our team.')}
        ${nextInfoItem('📞', 'Contact Us', 'Reach our support team if you have questions about your plan.')}
      </table>
    </div>` : `
    <div style="background:${BRAND.successLight};border-radius:12px;
                padding:20px 24px;margin:24px 0;">
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;
                font-weight:700;color:${BRAND.success};margin:0 0 12px 0;
                text-transform:uppercase;letter-spacing:0.8px;">
        🎉 What Happens Now
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        ${nextInfoItem('🥛', 'Deliveries Resume', 'Your morning milk delivery will restart from tomorrow.')}
        ${nextInfoItem('📅', 'Schedule Intact', 'Your original delivery schedule and preferences are preserved.')}
        ${nextInfoItem('💰', 'Billing Resumes', 'Charges will apply only for delivered days going forward.')}
        ${nextInfoItem('📱', 'Track in App', 'Monitor your delivery status in real-time via the GramDairy app.')}
      </table>
    </div>`;

  // ── Helpline block ─────────────────────────────────────────────
  const helpBlock = `
    <div style="text-align:center;background:${BRAND.primaryDark};
                border-radius:12px;padding:18px 24px;margin:24px 0;">
      <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                  font-size:12px;color:${BRAND.accent};font-weight:700;
                  text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">
        Need Help? We're here.
      </div>
      <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                  font-size:13px;color:rgba(255,255,255,0.70);">
        📧 support@gramdairy.com &nbsp;|&nbsp;
        💬 Live Chat in the App &nbsp;|&nbsp;
        📞 1800-GRAM-DAI
      </div>
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
      ${isPaused ? '⏸ Your Milk Plan Has Been Paused' : '▶️ Your Milk Plan is Back On!'}
    </h1>

    <p style="font-family:'Helvetica Neue',Arial,sans-serif;
              font-size:14px;color:${BRAND.textMid};line-height:1.7;margin:0 0 24px 0;">
      ${isPaused
      ? 'We wanted to let you know that your daily dairy subscription has been temporarily paused. Please review the details below.'
      : 'Great news! Your GramDairy daily dairy subscription has been reactivated. Fresh deliveries will resume from tomorrow morning.'}
    </p>

    ${statusHero}
    ${reasonCard}
    ${calendarStrip}

    ${renderDivider()}

    ${nextSteps}

    ${renderAlert(
        isPaused
          ? 'If you did not request this pause, please contact us immediately at support@gramdairy.com.'
          : 'Your next delivery is scheduled for <strong>tomorrow morning</strong>. Make sure your doorstep is accessible.',
        isPaused ? 'warning' : 'success'
      )}

    ${helpBlock}

    ${renderButton(
        `${frontendUrl}/subscriptions`,
        isPaused ? 'Request Reactivation 🔄' : 'View My Subscription 🥛',
        isPaused ? BRAND.warning : BRAND.primary
      )}

    ${renderDivider()}

    <p style="font-family:'Helvetica Neue',Arial,sans-serif;
              font-size:14px;color:${BRAND.textMid};line-height:1.7;margin:0;">
      Warm regards,<br>
      <strong style="color:${BRAND.primaryDark};">GramDairy Subscription Team</strong><br>
      <em style="font-size:12px;color:${BRAND.textLight};">Fresh. Every morning. No exceptions.</em>
    </p>`;

  return buildEmail(
    renderHeader('Subscription Status Update'),
    inner,
    renderFooter(),
    `${firstName}, your GramDairy milk plan status has been updated to: ${data.status}.`,
  );
};
