/**
 * ============================================================
 * GramDairy — Delivery Partner Credentials Email Template
 * Triggered: when admin approves a delivery boy application
 *
 * Design theme: official village authority — midnight-green
 * ID card with gold accents, barcode-style employee badge,
 * QR verification, onboarding checklist, and responsibility pledge.
 * ============================================================
 */

import {
  BRAND,
  buildEmail,
  renderHeader,
  renderFooter,
  renderButton,
  renderDivider,
  renderInfoRow,
  renderAlert,
} from './baseLayout.js';

/**
 * Builds the delivery partner on-boarding email.
 *
 * @param {Object} data
 *   data.name             - full name of delivery partner
 *   data.loginEmail       - login email address
 *   data.password         - temporary plain-text password
 *   data.employeeId       - system-assigned employee ID
 *   data.vehicleType      - e.g. "Bicycle" | "Motorcycle"
 *   data.vehicleNumber    - registration number (optional)
 *   data.zone             - assigned delivery zone / area
 *   data.verificationUrl  - URL encoded into QR code
 *
 * @returns {string} - full HTML email string
 */
export const deliveryCredentialsTemplate = (data) => {
  const frontendUrl = process.env.FRONTEND_URL || 'https://gramdairy.com';
  const firstName = (data.name || 'Partner').split(' ')[0];
  const verificationUrl = data.verificationUrl || `${frontendUrl}/verify/${data.employeeId}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(verificationUrl)}&color=1a4a1a&bgcolor=fffdf5&qzone=1`;

  // ── Official ID Card ─────────────────────────────────────────
  const idCard = `
    <div style="background:linear-gradient(135deg,${BRAND.primaryDark} 0%,${BRAND.primary} 55%,#3a7a3a 100%);
                border-radius:18px;padding:0;overflow:hidden;
                box-shadow:0 12px 40px rgba(26,74,26,0.40);margin:28px 0;">

      <!-- Card header strip -->
      <div style="background:rgba(0,0,0,0.20);padding:14px 24px;
                  border-bottom:1px solid rgba(255,255,255,0.12);">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td>
              <span style="font-family:'Helvetica Neue',Arial,sans-serif;
                           font-size:18px;font-weight:900;letter-spacing:3px;
                           color:#ffffff;">GRAMDAIRY</span>
              <span style="font-family:'Helvetica Neue',Arial,sans-serif;
                           font-size:9px;font-weight:600;letter-spacing:2px;
                           color:${BRAND.accent};display:block;">
                OFFICIAL DELIVERY PARTNER
              </span>
            </td>
            <td style="text-align:right;vertical-align:middle;">
              <div style="background:${BRAND.accent};border-radius:6px;
                          padding:5px 12px;display:inline-block;">
                <span style="font-family:'Helvetica Neue',Arial,sans-serif;
                             font-size:9px;font-weight:800;color:${BRAND.primaryDark};
                             letter-spacing:1px;text-transform:uppercase;">
                  ACTIVE
                </span>
              </div>
            </td>
          </tr>
        </table>
      </div>

      <!-- Card body -->
      <div style="padding:24px 24px 20px 24px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <!-- QR column -->
            <td style="width:140px;vertical-align:top;">
              <div style="background:#ffffff;border-radius:12px;padding:8px;
                          box-shadow:0 4px 16px rgba(0,0,0,0.25);">
                <img src="${qrUrl}" alt="Verification QR" width="124" height="124"
                     style="display:block;border-radius:6px;">
              </div>
              <p style="font-family:'Helvetica Neue',Arial,sans-serif;
                        font-size:9px;color:rgba(255,255,255,0.55);text-align:center;
                        margin:8px 0 0 0;letter-spacing:0.5px;">
                SCAN TO VERIFY
              </p>
            </td>

            <!-- Info column -->
            <td style="padding-left:20px;vertical-align:top;">
              <h2 style="font-family:'Helvetica Neue',Arial,sans-serif;
                         font-size:20px;font-weight:900;color:#ffffff;
                         margin:0 0 4px 0;text-transform:uppercase;letter-spacing:0.5px;">
                ${(data.name || '').toUpperCase()}
              </h2>
              <p style="font-family:'Helvetica Neue',Arial,sans-serif;
                        font-size:11px;color:${BRAND.accent};font-weight:600;
                        text-transform:uppercase;letter-spacing:1px;margin:0 0 14px 0;">
                Certified Delivery Partner
              </p>

              <!-- Data rows -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="font-family:'Helvetica Neue',Arial,sans-serif;
                             font-size:10px;color:rgba(255,255,255,0.55);
                             text-transform:uppercase;letter-spacing:0.8px;
                             padding-right:12px;padding-bottom:8px;vertical-align:top;">
                    Employee ID
                  </td>
                  <td style="font-family:'Helvetica Neue',Arial,sans-serif;
                             font-size:13px;color:#ffffff;font-weight:700;
                             padding-bottom:8px;letter-spacing:1px;">
                    ${data.employeeId || 'GD-XXXXX'}
                  </td>
                </tr>
                <tr>
                  <td style="font-family:'Helvetica Neue',Arial,sans-serif;
                             font-size:10px;color:rgba(255,255,255,0.55);
                             text-transform:uppercase;letter-spacing:0.8px;
                             padding-right:12px;padding-bottom:8px;vertical-align:top;">
                    Vehicle
                  </td>
                  <td style="font-family:'Helvetica Neue',Arial,sans-serif;
                             font-size:13px;color:#ffffff;font-weight:600;
                             padding-bottom:8px;">
                    ${data.vehicleType || 'N/A'}
                    ${data.vehicleNumber ? `<span style="color:${BRAND.accent};"> · ${data.vehicleNumber}</span>` : ''}
                  </td>
                </tr>
                ${data.zone ? `
                <tr>
                  <td style="font-family:'Helvetica Neue',Arial,sans-serif;
                             font-size:10px;color:rgba(255,255,255,0.55);
                             text-transform:uppercase;letter-spacing:0.8px;
                             padding-right:12px;vertical-align:top;">
                    Zone
                  </td>
                  <td style="font-family:'Helvetica Neue',Arial,sans-serif;
                             font-size:13px;color:#ffffff;font-weight:600;">
                    ${data.zone}
                  </td>
                </tr>` : ''}
              </table>
            </td>
          </tr>
        </table>
      </div>

      <!-- Card footer strip (barcode decorative) -->
      <div style="background:rgba(0,0,0,0.18);padding:10px 24px;
                  border-top:1px solid rgba(255,255,255,0.10);">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td>
              <!-- Fake barcode art -->
              <div style="line-height:1;letter-spacing:1px;font-size:20px;
                          font-family:monospace;color:rgba(255,255,255,0.25);
                          user-select:none;">
                |||||||  ||| ||||||  || ||||| ||| |||
              </div>
            </td>
            <td style="text-align:right;vertical-align:middle;">
              <span style="font-family:'Helvetica Neue',Arial,sans-serif;
                           font-size:9px;color:rgba(255,255,255,0.35);letter-spacing:1px;">
                🛡️ LEGALLY AUTHORISED
              </span>
            </td>
          </tr>
        </table>
      </div>
    </div>`;

  // ── Credentials box ───────────────────────────────────────────
  const credentialsBox = `
    <div style="background:#ffffff;border-radius:14px;padding:22px 26px;
                border:1px solid ${BRAND.border};margin-bottom:24px;
                box-shadow:0 2px 12px rgba(0,0,0,0.06);">
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;
                font-weight:700;color:${BRAND.primary};text-transform:uppercase;
                letter-spacing:0.8px;margin:0 0 14px 0;">
        🔐 Your Login Credentials
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        ${renderInfoRow('Email', data.loginEmail || '-')}
        ${renderInfoRow('Password',
    `<span style="font-family:monospace;background:${BRAND.primaryLight};
                        padding:3px 10px;border-radius:6px;border:1px dashed ${BRAND.primary};
                        font-size:15px;font-weight:700;letter-spacing:1px;color:${BRAND.primaryDark};">
            ${data.password}
          </span>`,
    '')}
      </table>
      <div style="margin-top:14px;padding:10px 14px;
                  background:${BRAND.accentLight};border-radius:8px;
                  border-left:3px solid ${BRAND.accent};">
        <span style="font-family:'Helvetica Neue',Arial,sans-serif;
                     font-size:12px;color:${BRAND.earth};font-weight:600;">
          ⚠️ Please change this password immediately after your first login.
        </span>
      </div>
    </div>`;

  // ── Onboarding checklist ───────────────────────────────────────
  const checkItem = (text) => `
    <tr>
      <td style="padding:9px 0;vertical-align:top;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="width:24px;vertical-align:top;">
              <div style="width:22px;height:22px;border-radius:50%;
                          background:${BRAND.accent};text-align:center;line-height:22px;
                          font-size:12px;font-weight:800;color:${BRAND.primaryDark};">✓</div>
            </td>
            <td style="padding-left:12px;font-family:'Helvetica Neue',Arial,sans-serif;
                       font-size:14px;color:${BRAND.textMid};line-height:1.5;
                       vertical-align:middle;">
              ${text}
            </td>
          </tr>
        </table>
      </td>
    </tr>`;

  const onboardingList = `
    <div style="background:linear-gradient(135deg,${BRAND.primaryLight} 0%,#d9f0d9 100%);
                border-radius:14px;padding:22px 26px;margin-bottom:24px;">
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;
                font-weight:700;color:${BRAND.primaryDark};text-transform:uppercase;
                letter-spacing:0.8px;margin:0 0 14px 0;">
        📋 Onboarding Checklist
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        ${checkItem('Log in to the GramDairy Partner App or Dashboard')}
        ${checkItem('Change your temporary password immediately')}
        ${checkItem('Complete your profile — add a profile photo')}
        ${checkItem('Review your assigned delivery zone on the map')}
        ${checkItem('Read the Partner Code of Conduct (available in-app)')}
        ${checkItem('Ensure your vehicle documents are uploaded and up-to-date')}
        ${checkItem('Enable location & notification permissions on the app')}
      </table>
    </div>`;

  // ── Responsibility pledge ──────────────────────────────────────
  const pledge = `
    <div style="border:2px solid ${BRAND.primary};border-radius:12px;
                padding:20px 24px;margin-bottom:24px;position:relative;">
      <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                  font-size:13px;font-weight:700;color:${BRAND.primary};
                  text-transform:uppercase;letter-spacing:0.8px;margin-bottom:12px;">
        🌾 The GramDairy Partner Pledge
      </div>
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;
                font-size:13px;color:${BRAND.textMid};line-height:1.8;
                font-style:italic;margin:0;">
        "As a GramDairy Partner, I commit to delivering fresh products on time,
        treating every customer household with respect and courtesy, upholding
        the reputation of our village farmers, and ensuring the purity of every
        delivery entrusted to me."
      </p>
    </div>`;

  // ── Inner body ────────────────────────────────────────────────
  const inner = `
    <h1 style="font-family:'Helvetica Neue',Arial,sans-serif;
               font-size:26px;font-weight:900;color:${BRAND.primary};
               margin:0 0 8px 0;line-height:1.2;">
      You're In, ${firstName}! 🎉
    </h1>

    <p style="font-family:'Helvetica Neue',Arial,sans-serif;
              font-size:15px;color:${BRAND.textMid};line-height:1.7;margin:0 0 12px 0;">
      Congratulations! Your GramDairy Delivery Partner account has been
      <strong style="color:${BRAND.success};">approved and activated</strong>.
      You are now an official part of our village-to-doorstep mission.
    </p>

    <p style="font-family:'Helvetica Neue',Arial,sans-serif;
              font-size:14px;color:${BRAND.textMid};line-height:1.7;margin:0 0 24px 0;">
      Below you'll find your official digital ID card, login credentials,
      and everything you need to get started. Please read through carefully.
    </p>

    ${idCard}
    ${credentialsBox}
    ${onboardingList}
    ${pledge}

    ${renderAlert(
    'Your digital ID card above serves as your official identification during deliveries. Always carry it digitally on your device.',
    'success'
  )}

    ${renderButton(`${frontendUrl}/auth/login`, 'Login to Partner Dashboard 🚀', BRAND.primary)}

    ${renderDivider()}

    <p style="font-family:'Helvetica Neue',Arial,sans-serif;
              font-size:14px;color:${BRAND.textMid};line-height:1.7;margin:0;">
      Welcome aboard,<br>
      <strong style="color:${BRAND.primaryDark};">GramDairy Logistics Team</strong><br>
      <em style="font-size:12px;color:${BRAND.textLight};">Together, we bring the farm to every doorstep.</em>
    </p>`;

  return buildEmail(
    renderHeader('Partner Activation Certificate'),
    inner,
    renderFooter(),
    `Welcome, ${firstName}! Your GramDairy Delivery Partner account is now active. Login to begin.`,
  );
};
