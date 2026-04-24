/**
 * ============================================================
 * GramDairy — Delivery Application Rejection Email Template
 * Triggered: when admin rejects a delivery boy application
 *
 * Design theme: soft, empathetic — muted earth tones,
 * no harsh red, instead uses warm amber cautionary accents.
 * Includes reason card, encouragement note, and reapply guidance.
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
 * Builds the delivery application rejection email.
 *
 * @param {string} name    - full name of the applicant
 * @param {string} [reason] - optional rejection reason from admin
 * @returns {string}        - full HTML email string
 */
export const deliveryRejectionTemplate = (name, reason) => {
  const frontendUrl = process.env.FRONTEND_URL || 'https://gramdairy.com';
  const firstName = (name || 'Applicant').split(' ')[0];

  // ── Status banner ─────────────────────────────────────────────
  const statusBanner = `
    <div style="background:linear-gradient(135deg,#5a4a2a 0%,${BRAND.earth} 100%);
                border-radius:14px;padding:24px 28px;margin-bottom:28px;
                text-align:center;box-shadow:0 6px 24px rgba(90,74,42,0.25);">
      <div style="font-size:40px;margin-bottom:10px;">📋</div>
      <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                  font-size:20px;font-weight:800;color:#ffffff;margin-bottom:6px;">
        Application Status Update
      </div>
      <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                  font-size:13px;color:rgba(255,255,255,0.70);">
        GramDairy Delivery Partner Programme
      </div>
    </div>`;

  // ── Reason card (only if reason provided) ────────────────────
  const reasonCard = reason ? `
    <div style="background:${BRAND.accentLight};border-radius:12px;
                border-left:5px solid ${BRAND.accent};padding:20px 24px;
                margin:24px 0;">
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;
                font-weight:700;color:${BRAND.earth};text-transform:uppercase;
                letter-spacing:0.8px;margin:0 0 10px 0;">
        Reason for this Decision
      </p>
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;
                color:${BRAND.textDark};line-height:1.7;margin:0;font-style:italic;">
        "${reason}"
      </p>
    </div>` : '';

  // ── What can be improved cards ────────────────────────────────
  const tipCard = (emoji, title, desc) => `
    <tr>
      <td style="padding:0 0 14px 0;">
        <div style="background:#ffffff;border-radius:12px;padding:16px 20px;
                    border:1px solid ${BRAND.borderLight};
                    box-shadow:0 2px 10px rgba(0,0,0,0.05);">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="font-size:22px;vertical-align:middle;padding-right:14px;">
                ${emoji}
              </td>
              <td style="vertical-align:middle;">
                <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                            font-size:13px;font-weight:700;color:${BRAND.textDark};
                            margin-bottom:4px;">${title}</div>
                <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                            font-size:12px;color:${BRAND.textMid};line-height:1.5;">
                  ${desc}
                </div>
              </td>
            </tr>
          </table>
        </div>
      </td>
    </tr>`;

  const improvementTips = `
    <div style="margin:24px 0;">
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;
                font-weight:700;color:${BRAND.textDark};margin:0 0 14px 0;">
        💡 How to Strengthen a Future Application
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        ${tipCard('📄', 'Complete Documentation', 'Ensure all ID proofs, vehicle registration, and address verification documents are clear and up-to-date.')}
        ${tipCard('🚲', 'Vehicle Readiness', 'Your delivery vehicle should be registered, insured, and in good working condition with a valid RC book.')}
        ${tipCard('📍', 'Verify Your Location', 'Confirm you reside within an active GramDairy operational zone on the service map.')}
        ${tipCard('📞', 'Accurate Contact Details', 'Ensure your phone number is active and linked to a valid WhatsApp account for coordination.')}
      </table>
    </div>`;

  // ── Alternative opportunities section ────────────────────────
  const altSection = `
    <div style="background:${BRAND.primaryLight};border-radius:14px;
                padding:22px 26px;margin:24px 0;">
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;
                font-weight:700;color:${BRAND.primary};text-transform:uppercase;
                letter-spacing:0.8px;margin:0 0 12px 0;">
        🌾 Other Ways to Be Part of GramDairy
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td style="padding:8px 0;font-family:'Helvetica Neue',Arial,sans-serif;
                     font-size:13px;color:${BRAND.textMid};line-height:1.6;
                     vertical-align:top;">
            ▸ <strong>Start as a Customer</strong> — enjoy fresh dairy delivered to your home.<br>
            ▸ <strong>Become a Farm Vendor</strong> — register your farm to supply products.<br>
            ▸ <strong>Reapply in 30 days</strong> — once you have addressed the concerns above.
          </td>
        </tr>
      </table>
    </div>`;

  // ── Encouragement quote ───────────────────────────────────────
  const encouragementQuote = `
    <div style="border-radius:12px;padding:20px 24px;margin:24px 0;
                text-align:center;background:${BRAND.cream};
                border:1px solid ${BRAND.border};">
      <div style="font-size:28px;margin-bottom:10px;">🌱</div>
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;
                font-size:14px;color:${BRAND.textMid};font-style:italic;
                line-height:1.8;margin:0;">
        "Every great harvest begins with a seed. We hope to see you
        grow with us in the near future."
      </p>
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;
                font-size:12px;color:${BRAND.textLight};margin:10px 0 0 0;font-weight:700;">
        — The GramDairy Team
      </p>
    </div>`;

  // ── FAQ block ─────────────────────────────────────────────────
  const faqItem = (q, a) => `
    <div style="margin-bottom:14px;">
      <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                  font-size:13px;font-weight:700;color:${BRAND.textDark};
                  margin-bottom:4px;">Q: ${q}</div>
      <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                  font-size:13px;color:${BRAND.textMid};line-height:1.6;
                  padding-left:14px;border-left:3px solid ${BRAND.border};">
        ${a}
      </div>
    </div>`;

  const faqBlock = `
    <div style="margin:24px 0;">
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;
                font-weight:700;color:${BRAND.textDark};margin:0 0 14px 0;
                text-transform:uppercase;letter-spacing:0.8px;">
        ❓ Frequently Asked Questions
      </p>
      ${faqItem(
    'Can I reapply?',
    'Yes! You may reapply after <strong>30 days</strong> from the date of this decision, once you have addressed the points mentioned above.'
  )}
      ${faqItem(
    'How do I check if I\'m in a serviceable zone?',
    'Visit our website and use the "Check Serviceability" tool on the homepage.'
  )}
      ${faqItem(
    'Can I appeal this decision?',
    'You may contact our support team at <a href="mailto:partners@gramdairy.com" style="color:' + BRAND.primary + ';">partners@gramdairy.com</a> with additional documents.'
  )}
    </div>`;

  // ── Inner body ────────────────────────────────────────────────
  const inner = `
    <p style="font-family:'Helvetica Neue',Arial,sans-serif;
              font-size:15px;color:${BRAND.textMid};margin:0 0 6px 0;">
      Dear <strong style="color:${BRAND.textDark};">${name || 'Applicant'}</strong>,
    </p>

    <h1 style="font-family:'Helvetica Neue',Arial,sans-serif;
               font-size:24px;font-weight:900;color:${BRAND.earth};
               margin:0 0 16px 0;line-height:1.3;">
      Update on Your Partner Application
    </h1>

    ${statusBanner}

    <p style="font-family:'Helvetica Neue',Arial,sans-serif;
              font-size:14px;color:${BRAND.textMid};line-height:1.7;margin:0 0 12px 0;">
      Thank you sincerely for showing interest in joining the GramDairy Delivery Partner
      Programme and for the time you invested in your application.
    </p>

    <p style="font-family:'Helvetica Neue',Arial,sans-serif;
              font-size:14px;color:${BRAND.textMid};line-height:1.7;margin:0 0 24px 0;">
      After a thorough review of your application, we regret to inform you that we are
      unable to proceed further at this time. This decision was made carefully and is
      not a reflection of your character or potential.
    </p>

    ${reasonCard}

    ${renderDivider()}

    ${improvementTips}

    ${altSection}

    ${encouragementQuote}

    ${renderDivider()}

    ${faqBlock}

    ${renderAlert(
    'If you believe this decision was made in error, please email our partner support team at partners@gramdairy.com within 7 days with supporting documentation.',
    'warning'
  )}

    ${renderButton(`${frontendUrl}/contact`, 'Contact Partner Support', BRAND.earth)}

    ${renderDivider()}

    <p style="font-family:'Helvetica Neue',Arial,sans-serif;
              font-size:14px;color:${BRAND.textMid};line-height:1.7;margin:0;">
      We appreciate your interest in GramDairy and wish you all the best.<br><br>
      Warm regards,<br>
      <strong style="color:${BRAND.primaryDark};">HR & Partner Team</strong><br>
      <em style="font-size:12px;color:${BRAND.textLight};">GramDairy Private Limited</em>
    </p>`;

  return buildEmail(
    renderHeader('Partner Programme Update'),
    inner,
    renderFooter(),
    `Dear ${firstName}, we have an update regarding your GramDairy delivery partner application.`,
  );
};
