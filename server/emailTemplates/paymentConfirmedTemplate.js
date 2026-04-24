/**
 * ============================================================
 * GramDairy — Payment Confirmed Email Template
 * Triggered: when admin marks a monthly bill as 'Paid'
 *
 * Design theme: celebration of honesty & trust — warm gold
 * receipt card, payment breakdown, a thank-you note and
 * a next billing cycle preview.
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
 * Builds the payment confirmation email.
 *
 * @param {Object} data
 *   data.userName    - customer's full name
 *   data.amount      - total amount paid (number)
 *   data.billMonth   - billing month (1–12)
 *   data.billYear    - billing year (e.g. 2026)
 *   data.transactionId - payment transaction reference
 *   data.paymentDate - Date object or ISO string of payment
 *   data.productName - subscription product name
 *   data.deliveryDays - number of delivery days in month
 *   data.pendingBalance - any remaining balance (number, default 0)
 *
 * @returns {string} - full HTML email string
 */
export const paymentConfirmedTemplate = (data) => {
  const frontendUrl = process.env.FRONTEND_URL || 'https://gramdairy.com';
  const firstName = (data.userName || 'Customer').split(' ')[0];
  const amount = Number(data.amount || 0).toFixed(2);
  const pendingBal = Number(data.pendingBalance || 0).toFixed(2);
  const monthName = new Date(data.billYear || new Date().getFullYear(), (data.billMonth || 1) - 1)
    .toLocaleString('en-IN', { month: 'long', year: 'numeric' });
  const paymentDate = data.paymentDate
    ? new Date(data.paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  // ── Gold receipt card ─────────────────────────────────────────
  const receiptCard = `
    <div style="background:linear-gradient(145deg,${BRAND.accentDark} 0%,${BRAND.accent} 60%,#f7c948 100%);
                border-radius:18px;padding:30px 28px;margin-bottom:28px;
                box-shadow:0 10px 36px rgba(196,127,10,0.35);text-align:center;
                position:relative;overflow:hidden;">

      <!-- Decorative circles -->
      <div style="position:absolute;top:-20px;left:-20px;width:100px;height:100px;
                  border-radius:50%;background:rgba(255,255,255,0.08);"></div>
      <div style="position:absolute;bottom:-30px;right:-30px;width:140px;height:140px;
                  border-radius:50%;background:rgba(255,255,255,0.06);"></div>

      <!-- Checkmark badge -->
      <div style="width:60px;height:60px;border-radius:50%;background:rgba(255,255,255,0.20);
                  margin:0 auto 14px auto;line-height:60px;font-size:28px;">
        ✅
      </div>

      <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                  font-size:13px;font-weight:700;color:rgba(26,74,26,0.75);
                  text-transform:uppercase;letter-spacing:1.5px;margin-bottom:6px;">
        Payment Received &amp; Verified
      </div>

      <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                  font-size:46px;font-weight:900;color:${BRAND.primaryDark};
                  line-height:1;margin-bottom:4px;">
        ₹${amount}
      </div>

      <div style="font-family:'Helvetica Helvetica Neue',Arial,sans-serif;
                  font-size:14px;color:rgba(26,74,26,0.70);margin-bottom:14px;">
        for ${monthName}
      </div>

      <!-- Receipt number -->
      <div style="display:inline-block;background:rgba(255,255,255,0.25);
                  border-radius:50px;padding:6px 18px;">
        <span style="font-family:monospace;font-size:12px;font-weight:700;
                     color:${BRAND.primaryDark};letter-spacing:1px;">
          TXN: ${data.transactionId || 'N/A'}
        </span>
      </div>
    </div>`;

  // ── Bill details table ────────────────────────────────────────
  const detailsTable = `
    <div style="background:#ffffff;border:1px solid ${BRAND.border};
                border-radius:14px;padding:22px 24px;margin-bottom:24px;
                box-shadow:0 2px 10px rgba(0,0,0,0.05);">
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;
                font-weight:700;color:${BRAND.textDark};text-transform:uppercase;
                letter-spacing:0.8px;margin:0 0 16px 0;">
        🧾 Payment Receipt Details
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr style="border-bottom:1px solid ${BRAND.borderLight};">
          <td style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;
                     color:${BRAND.textLight};padding:9px 0;font-weight:600;
                     text-transform:uppercase;letter-spacing:0.5px;width:140px;">
            Customer
          </td>
          <td style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;
                     color:${BRAND.textDark};padding:9px 0;font-weight:500;">
            ${data.userName}
          </td>
        </tr>
        <tr style="border-bottom:1px solid ${BRAND.borderLight};">
          <td style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;
                     color:${BRAND.textLight};padding:9px 0;font-weight:600;
                     text-transform:uppercase;letter-spacing:0.5px;">
            Subscription
          </td>
          <td style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;
                     color:${BRAND.textDark};padding:9px 0;font-weight:500;">
            ${data.productName || 'Dairy Subscription'}
          </td>
        </tr>
        <tr style="border-bottom:1px solid ${BRAND.borderLight};">
          <td style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;
                     color:${BRAND.textLight};padding:9px 0;font-weight:600;
                     text-transform:uppercase;letter-spacing:0.5px;">
            Billing Period
          </td>
          <td style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;
                     color:${BRAND.textDark};padding:9px 0;font-weight:500;">
            ${monthName}
          </td>
        </tr>
        <tr style="border-bottom:1px solid ${BRAND.borderLight};">
          <td style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;
                     color:${BRAND.textLight};padding:9px 0;font-weight:600;
                     text-transform:uppercase;letter-spacing:0.5px;">
            Delivery Days
          </td>
          <td style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;
                     color:${BRAND.textDark};padding:9px 0;font-weight:500;">
            ${data.deliveryDays || '--'} days
          </td>
        </tr>
        <tr style="border-bottom:1px solid ${BRAND.borderLight};">
          <td style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;
                     color:${BRAND.textLight};padding:9px 0;font-weight:600;
                     text-transform:uppercase;letter-spacing:0.5px;">
            Payment Date
          </td>
          <td style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;
                     color:${BRAND.textDark};padding:9px 0;font-weight:500;">
            ${paymentDate}
          </td>
        </tr>
        <tr style="border-bottom:1px solid ${BRAND.borderLight};">
          <td style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;
                     color:${BRAND.textLight};padding:9px 0;font-weight:600;
                     text-transform:uppercase;letter-spacing:0.5px;">
            Transaction ID
          </td>
          <td style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;
                     color:${BRAND.textDark};padding:9px 0;font-weight:500;
                     font-family:monospace;">
            ${data.transactionId || 'N/A'}
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding:14px 0 4px 0;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                <td style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;
                           font-weight:800;color:${BRAND.primaryDark};">Total Paid</td>
                <td style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:22px;
                           font-weight:900;color:${BRAND.primary};text-align:right;">
                  ₹${amount}
                </td>
              </tr>
              ${Number(pendingBal) > 0 ? `
              <tr>
                <td style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;
                           color:${BRAND.danger};font-weight:600;">Remaining Balance</td>
                <td style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;
                           font-weight:700;color:${BRAND.danger};text-align:right;">
                  ₹${pendingBal}
                </td>
              </tr>` : ''}
            </table>
          </td>
        </tr>
      </table>
    </div>`;

  // ── Loyalty meter ──────────────────────────────────────────────
  const loyaltyBlock = `
    <div style="background:linear-gradient(135deg,${BRAND.primary} 0%,${BRAND.primaryDark} 100%);
                border-radius:14px;padding:22px 26px;margin:24px 0;color:#ffffff;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td>
            <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                        font-size:12px;font-weight:700;color:${BRAND.accent};
                        text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">
              🌟 Customer Loyalty Status
            </div>
            <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                        font-size:16px;font-weight:700;color:#ffffff;margin-bottom:10px;">
              Trusted Dairy Family Member
            </div>
            <!-- Progress bar -->
            <div style="background:rgba(255,255,255,0.15);border-radius:50px;height:8px;overflow:hidden;margin-bottom:6px;">
              <div style="background:${BRAND.accent};height:8px;border-radius:50px;width:72%;"></div>
            </div>
            <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                        font-size:11px;color:rgba(255,255,255,0.60);">
              72 points — 28 more to reach Gold status 🏆
            </div>
          </td>
          <td style="text-align:right;vertical-align:middle;padding-left:20px;">
            <div style="font-size:40px;">🥛</div>
          </td>
        </tr>
      </table>
    </div>`;

  // ── Next billing preview ──────────────────────────────────────
  const nextMonth = new Date(data.billYear || new Date().getFullYear(), data.billMonth || new Date().getMonth() + 1);
  const nextMonthName = nextMonth.toLocaleString('en-IN', { month: 'long', year: 'numeric' });

  const nextBillingBlock = `
    <div style="background:${BRAND.primaryLight};border-radius:12px;
                padding:18px 22px;margin:20px 0;">
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;
                font-weight:700;color:${BRAND.primary};margin:0 0 8px 0;
                text-transform:uppercase;letter-spacing:0.8px;">
        📅 Next Billing Cycle
      </p>
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;
                color:${BRAND.textMid};margin:0;line-height:1.6;">
        Your next bill for <strong>${nextMonthName}</strong> will be generated on
        <strong>10th ${nextMonthName}</strong>. You can view and pay bills any time
        through the GramDairy app.
      </p>
    </div>`;

  // ── Thank you quote ───────────────────────────────────────────
  const thankYouNote = `
    <div style="text-align:center;padding:24px 0 4px 0;">
      <div style="font-size:30px;margin-bottom:10px;">🙏</div>
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;
                font-size:15px;font-weight:700;color:${BRAND.primaryDark};
                margin:0 0 8px 0;">
        Thank you, ${firstName}!
      </p>
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;
                font-size:13px;color:${BRAND.textMid};line-height:1.7;margin:0;">
        Your timely payment keeps our village farmers and delivery partners going.
        Every rupee you pay supports a family in rural India. We are truly grateful.
      </p>
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
      💰 Payment Confirmed!
    </h1>

    <p style="font-family:'Helvetica Neue',Arial,sans-serif;
              font-size:14px;color:${BRAND.textMid};line-height:1.7;margin:0 0 24px 0;">
      We have successfully received and verified your payment of
      <strong style="color:${BRAND.primary};">₹${amount}</strong> for your GramDairy
      dairy subscription. Your account is now fully cleared for ${monthName}.
    </p>

    ${receiptCard}
    ${detailsTable}

    ${Number(pendingBal) > 0
      ? renderAlert(`You have a remaining balance of <strong>₹${pendingBal}</strong>. Please clear it at your earliest convenience to avoid service interruption.`, 'warning')
      : renderAlert('Your account is fully cleared. No pending dues.', 'success')
    }

    ${renderDivider()}

    ${loyaltyBlock}
    ${nextBillingBlock}
    ${thankYouNote}

    ${renderButton(`${frontendUrl}/billing`, 'View All Billing History 📄')}

    ${renderDivider()}

    <p style="font-family:'Helvetica Neue',Arial,sans-serif;
              font-size:14px;color:${BRAND.textMid};line-height:1.7;margin:0;">
      With gratitude,<br>
      <strong style="color:${BRAND.primaryDark};">GramDairy Billing Team</strong><br>
      <em style="font-size:12px;color:${BRAND.textLight};">Every payment keeps a village farmer thriving.</em>
    </p>`;

  return buildEmail(
    renderHeader('Payment Verified ✓'),
    inner,
    renderFooter(),
    `₹${amount} received! Your GramDairy payment for ${monthName} has been confirmed.`,
  );
};
