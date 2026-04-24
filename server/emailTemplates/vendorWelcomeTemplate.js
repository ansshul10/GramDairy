/**
 * ============================================================
 * GramDairy — Vendor Welcome Email Template
 * Triggered: when admin activates a new farm/vendor account
 *
 * Design theme: lush farm partnership — rich green gradients,
 * a farm-gate motif, credentials card, revenue potential chart,
 * partnership checklist and a milestone tracker.
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
 * Builds the vendor on-boarding email with credentials.
 *
 * @param {string} name     - vendor / farm owner name
 * @param {string} email    - login email address
 * @param {string} password - temporary plain-text password
 * @param {Object} [extra]  - optional extra data
 *   extra.farmName           - name of the farm/shop
 *   extra.vendorId           - system-assigned vendor ID
 *   extra.productCategories  - e.g. "Milk, Ghee, Paneer"
 *   extra.zone               - assigned supply zone
 *
 * @returns {string} - full HTML email string
 */
export const vendorWelcomeTemplate = (name, email, password, extra = {}) => {
  const frontendUrl = process.env.FRONTEND_URL || 'https://gramdairy.com';
  const firstName = (name || 'Partner').split(' ')[0];
  const farmName = extra.farmName || `${firstName}'s Farm`;
  const vendorId = extra.vendorId || 'VND-XXXXX';
  const categories = extra.productCategories || 'Milk, Dairy Products';
  const zone = extra.zone || 'Your Assigned Area';

  // ── Hero partnership banner ───────────────────────────────────
  const heroBanner = `
    <div style="background:linear-gradient(135deg,#064e3b 0%,${BRAND.primary} 55%,#3a7a3a 100%);
                border-radius:16px;padding:30px 28px;margin-bottom:28px;
                box-shadow:0 10px 36px rgba(6,78,59,0.30);text-align:center;">

      <!-- Farm gate SVG art -->
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="70" viewBox="0 0 200 70"
           style="display:block;margin:0 auto 14px auto;">
        <!-- Ground -->
        <line x1="0" y1="65" x2="200" y2="65" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
        <!-- Left post -->
        <rect x="24" y="15" width="8" height="50" rx="3" fill="rgba(255,255,255,0.25)"/>
        <!-- Right post -->
        <rect x="168" y="15" width="8" height="50" rx="3" fill="rgba(255,255,255,0.25)"/>
        <!-- Gate bars top -->
        <rect x="32" y="22" width="136" height="6" rx="3" fill="rgba(255,255,255,0.35)"/>
        <!-- Gate bars bottom -->
        <rect x="32" y="48" width="136" height="6" rx="3" fill="rgba(255,255,255,0.35)"/>
        <!-- Vertical slats -->
        <rect x="55"  y="22" width="4" height="32" rx="2" fill="rgba(255,255,255,0.20)"/>
        <rect x="78"  y="22" width="4" height="32" rx="2" fill="rgba(255,255,255,0.20)"/>
        <rect x="100" y="22" width="4" height="32" rx="2" fill="rgba(255,255,255,0.20)"/>
        <rect x="122" y="22" width="4" height="32" rx="2" fill="rgba(255,255,255,0.20)"/>
        <rect x="144" y="22" width="4" height="32" rx="2" fill="rgba(255,255,255,0.20)"/>
        <!-- Star/badge centre -->
        <circle cx="100" cy="10" r="8" fill="${BRAND.accent}" opacity="0.90"/>
        <text x="100" y="14" text-anchor="middle"
              font-family="Arial" font-size="9" fill="${BRAND.primaryDark}" font-weight="900">★</text>
        <!-- Left tree -->
        <ellipse cx="10" cy="45" rx="9" ry="12" fill="rgba(255,255,255,0.15)"/>
        <!-- Right tree -->
        <ellipse cx="190" cy="45" rx="9" ry="12" fill="rgba(255,255,255,0.15)"/>
      </svg>

      <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                  font-size:22px;font-weight:900;color:#ffffff;margin-bottom:4px;">
        Welcome to the Partner Network, ${firstName}!
      </div>
      <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                  font-size:13px;color:rgba(255,255,255,0.70);letter-spacing:0.5px;">
        ${farmName} is now an Official GramDairy Verified Supplier
      </div>

      <div style="margin-top:16px;display:inline-block;background:${BRAND.accent};
                  border-radius:50px;padding:6px 20px;">
        <span style="font-family:'Helvetica Neue',Arial,sans-serif;
                     font-size:12px;font-weight:800;color:${BRAND.primaryDark};
                     letter-spacing:1px;text-transform:uppercase;">
          ✅ Account Activated
        </span>
      </div>
    </div>`;

  // ── Vendor Info card ──────────────────────────────────────────
  const vendorInfoCard = `
    <div style="background:#ffffff;border-radius:14px;padding:22px 26px;
                border:1px solid ${BRAND.border};margin-bottom:24px;
                box-shadow:0 2px 12px rgba(0,0,0,0.06);">
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;
                font-weight:700;color:${BRAND.primary};text-transform:uppercase;
                letter-spacing:0.8px;margin:0 0 14px 0;">
        🏪 Your Farm / Vendor Profile
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        ${renderInfoRow('Vendor ID', `<strong style="color:${BRAND.primary};letter-spacing:1px;">${vendorId}</strong>`)}
        ${renderInfoRow('Farm Name', farmName)}
        ${renderInfoRow('Owner', name)}
        ${renderInfoRow('Categories', categories)}
        ${renderInfoRow('Supply Zone', zone)}
      </table>
    </div>`;

  // ── Login credentials box ─────────────────────────────────────
  const credBox = `
    <div style="background:${BRAND.primaryLight};border-radius:14px;
                padding:22px 26px;margin-bottom:24px;">
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;
                font-weight:700;color:${BRAND.primary};text-transform:uppercase;
                letter-spacing:0.8px;margin:0 0 14px 0;">
        🔐 Portal Login Credentials
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        ${renderInfoRow('Email',
    `<a href="mailto:${email}" style="color:${BRAND.primary};text-decoration:none;font-weight:600;">${email}</a>`
  )}
        ${renderInfoRow('Password',
    `<span style="font-family:monospace;background:#ffffff;padding:4px 12px;
                        border-radius:6px;border:1px dashed ${BRAND.primary};
                        font-size:16px;font-weight:700;letter-spacing:2px;
                        color:${BRAND.primaryDark};">${password}</span>`,
    ''
  )}
      </table>
      <div style="margin-top:14px;background:${BRAND.accentLight};border-radius:8px;
                  padding:10px 14px;border-left:3px solid ${BRAND.accent};">
        <span style="font-family:'Helvetica Neue',Arial,sans-serif;
                     font-size:12px;color:${BRAND.earth};font-weight:600;">
          ⚠️ Change this password immediately after your first login.
        </span>
      </div>
    </div>`;

  // ── Revenue potential chart (visual bars) ─────────────────────
  const revenueBar = (label, pct, amount) => `
    <tr>
      <td style="padding:6px 0;vertical-align:middle;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td style="font-family:'Helvetica Neue',Arial,sans-serif;
                       font-size:12px;color:${BRAND.textMid};width:90px;">${label}</td>
            <td style="padding:0 12px;">
              <div style="background:${BRAND.border};border-radius:50px;height:10px;overflow:hidden;">
                <div style="background:linear-gradient(90deg,${BRAND.primary},${BRAND.accent});
                            height:10px;border-radius:50px;width:${pct}%;"></div>
              </div>
            </td>
            <td style="font-family:'Helvetica Neue',Arial,sans-serif;
                       font-size:12px;font-weight:700;color:${BRAND.primary};
                       text-align:right;white-space:nowrap;">
              ${amount}
            </td>
          </tr>
        </table>
      </td>
    </tr>`;

  const revenueChart = `
    <div style="background:#ffffff;border-radius:14px;padding:22px 26px;
                border:1px solid ${BRAND.border};margin-bottom:24px;
                box-shadow:0 2px 12px rgba(0,0,0,0.04);">
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;
                font-weight:700;color:${BRAND.textDark};margin:0 0 16px 0;
                text-transform:uppercase;letter-spacing:0.8px;">
        📈 Monthly Revenue Potential (Estimated)
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        ${revenueBar('Milk (50L/day)', 85, '₹45,000+')}
        ${revenueBar('Ghee (10 kg)', 60, '₹28,000+')}
        ${revenueBar('Paneer (20 kg)', 50, '₹18,000+')}
        ${revenueBar('Curd (30 kg)', 40, '₹12,000+')}
        ${revenueBar('Total Potential', 95, '₹1,00,000+')}
      </table>
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;
                color:${BRAND.textLight};margin:12px 0 0 0;line-height:1.6;">
        * Estimates based on average GramDairy vendor performance data. Actual earnings depend on supply volume and product quality.
      </p>
    </div>`;

  // ── Onboarding checklist ──────────────────────────────────────
  const checkItem = (done, text) => `
    <tr>
      <td style="padding:9px 0;vertical-align:top;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="width:26px;vertical-align:top;">
              <div style="width:22px;height:22px;border-radius:50%;
                          background:${done ? BRAND.primary : BRAND.border};
                          text-align:center;line-height:22px;
                          font-size:12px;font-weight:800;color:#ffffff;">
                ${done ? '✓' : '○'}
              </div>
            </td>
            <td style="padding-left:12px;font-family:'Helvetica Neue',Arial,sans-serif;
                       font-size:14px;color:${done ? BRAND.textDark : BRAND.textMid};
                       line-height:1.5;vertical-align:middle;
                       ${done ? '' : 'opacity:0.7;'}">
              ${text}
            </td>
          </tr>
        </table>
      </td>
    </tr>`;

  const checklist = `
    <div style="background:linear-gradient(to bottom,${BRAND.primaryLight},#d9f0d9);
                border-radius:14px;padding:22px 26px;margin-bottom:24px;">
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;
                font-weight:700;color:${BRAND.primaryDark};text-transform:uppercase;
                letter-spacing:0.8px;margin:0 0 14px 0;">
        ✅ Vendor Activation Checklist
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        ${checkItem(true, 'Account created and verified')}
        ${checkItem(true, 'Farm profile approved by GramDairy admin')}
        ${checkItem(false, 'Log in and update your farm description & photos')}
        ${checkItem(false, 'Review your listed products and set inventory levels')}
        ${checkItem(false, 'Configure your daily supply schedule')}
        ${checkItem(false, 'Add your bank/UPI details for payment settlements')}
        ${checkItem(false, 'Complete the Product Quality Agreement (in-app)')}
      </table>
    </div>`;

  // ── Support channels ──────────────────────────────────────────
  const supportBlock = `
    <div style="background:${BRAND.primaryDark};border-radius:12px;
                padding:20px 24px;text-align:center;margin:24px 0;">
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;
                font-weight:700;color:${BRAND.accent};text-transform:uppercase;
                letter-spacing:1px;margin:0 0 10px 0;">
        Your Dedicated Support
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;">
        <tr>
          <td style="padding:0 16px;text-align:center;">
            <div style="font-size:22px;">📧</div>
            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;
                        color:rgba(255,255,255,0.70);margin-top:4px;">
              vendors@gramdairy.com
            </div>
          </td>
          <td style="padding:0 16px;text-align:center;">
            <div style="font-size:22px;">📞</div>
            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;
                        color:rgba(255,255,255,0.70);margin-top:4px;">
              1800-GRAM-DAIRY
            </div>
          </td>
          <td style="padding:0 16px;text-align:center;">
            <div style="font-size:22px;">💬</div>
            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;
                        color:rgba(255,255,255,0.70);margin-top:4px;">
              Live Chat (9 AM–9 PM)
            </div>
          </td>
        </tr>
      </table>
    </div>`;

  // ── Inner body ────────────────────────────────────────────────
  const inner = `
    <p style="font-family:'Helvetica Neue',Arial,sans-serif;
              font-size:15px;color:${BRAND.textMid};margin:0 0 6px 0;">
      Dear <strong style="color:${BRAND.textDark};">${name}</strong>,
    </p>

    <h1 style="font-family:'Helvetica Neue',Arial,sans-serif;
               font-size:24px;font-weight:900;color:${BRAND.primary};
               margin:0 0 16px 0;line-height:1.3;">
      Your Farm is Now on GramDairy! 🌾
    </h1>

    <p style="font-family:'Helvetica Neue',Arial,sans-serif;
              font-size:14px;color:${BRAND.textMid};line-height:1.7;margin:0 0 24px 0;">
      We are thrilled to formally welcome <strong>${farmName}</strong> to the
      GramDairy Verified Supplier Network. Your farm has been reviewed, approved,
      and is now live on our platform — ready to reach thousands of customers who
      value authentic, fresh dairy straight from the village.
    </p>

    ${heroBanner}
    ${vendorInfoCard}
    ${credBox}

    ${renderDivider()}

    ${revenueChart}
    ${checklist}
    ${supportBlock}

    ${renderAlert(
    'For payments and settlements, you must add your bank or UPI details within 7 days of account activation to avoid delays.',
    'warning'
  )}

    ${renderButton(`${frontendUrl}/auth/login`, 'Access Vendor Terminal 🌾', '#064e3b')}

    ${renderDivider()}

    <p style="font-family:'Helvetica Neue',Arial,sans-serif;
              font-size:14px;color:${BRAND.textMid};line-height:1.7;margin:0;">
      Thank you for bringing the goodness of your farm to our customers.<br><br>
      With respect,<br>
      <strong style="color:${BRAND.primaryDark};">GramDairy Partner Onboarding Team</strong><br>
      <em style="font-size:12px;color:${BRAND.textLight};">Together, we sustain the village dairy tradition.</em>
    </p>`;

  return buildEmail(
    renderHeader('Vendor Network — Verified & Active'),
    inner,
    renderFooter(),
    `Congratulations ${firstName}! ${farmName} is now a verified GramDairy supplier. Login to get started.`,
  );
};
