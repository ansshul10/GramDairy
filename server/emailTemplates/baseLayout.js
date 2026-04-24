/**
 * ============================================================
 * GramDairy Email Base Layout
 * Shared foundation for all transactional email templates.
 * Includes: base wrapper, header with logo art, footer,
 *           dividers, button, info-row, and alert-box helpers.
 * ============================================================
 */

// ── Brand Tokens ─────────────────────────────────────────────
export const BRAND = {
  primary: '#1b5e20',   // more vibrant forest green
  primaryDark: '#0a360d',   // darker, richer forest
  primaryLight: '#f1f8f1',   // very light green tint
  accent: '#ffb300',   // vibrant golden amber
  accentDark: '#f57c00',   // deeper amber/orange
  accentLight: '#fffcf0',   // creamy ivory background
  earth: '#6d4c41',   // dark clay brown
  sky: '#039be5',   // deep sky blue
  cream: '#ffffff',   // pure white for maximum clarity in body
  textDark: '#0a1f0a',   // high-contrast near-black
  textMid: '#2e3d2e',   // high-contrast body text
  textLight: '#5c6b5c',   // darker label text for readability
  border: '#c8e6c9',   // slightly more visible border
  borderLight: '#e8f5e9',   // very light border
  danger: '#d32f2f',   // solid error red
  dangerLight: '#ffebee',   // light red background
  success: '#2e7d32',   // solid success green
  successLight: '#e8f5e9',   // light success bg
  warning: '#ef6c00',   // solid warning orange
  warningLight: '#fff3e0',   // warm warning bg
  containerWidth: 640,
  year: new Date().getFullYear(),
};

// ── SVG Decorative Elements ───────────────────────────────────

/** Top decorative wave divider between header and body */
const headerWave = `
  <div style="margin:0;padding:0;line-height:0;background:${BRAND.primaryDark};">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 40" preserveAspectRatio="none"
         style="display:block;width:100%;height:40px;">
      <path d="M0,20 C160,40 480,0 640,20 L640,40 L0,40 Z" fill="${BRAND.cream}"/>
    </svg>
  </div>`;

/** Bottom decorative wave above footer */
const footerWave = `
  <div style="margin:0;padding:0;line-height:0;background:${BRAND.cream};">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 40" preserveAspectRatio="none"
         style="display:block;width:100%;height:40px;">
      <path d="M0,20 C160,0 480,40 640,20 L640,0 L0,0 Z" fill="${BRAND.primaryDark}"/>
    </svg>
  </div>`;

// ── Reusable HTML Blocks ──────────────────────────────────────

/**
 * Renders a CTA button
 * @param {string} url
 * @param {string} text
 * @param {string} [color] - background colour, defaults to primary
 */
export const renderButton = (url, text, color = BRAND.primary) => `
  <table role="presentation" cellspacing="0" cellpadding="0" border="0"
         style="margin:32px auto 0 auto;">
    <tr>
      <td style="border-radius:50px;background:${color};
                 box-shadow:0 6px 20px rgba(0,0,0,0.15);">
        <a href="${url}"
           style="display:inline-block;padding:16px 48px;
                  font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
                  font-size:16px;font-weight:700;letter-spacing:0.5px;
                  color:#ffffff;text-decoration:none;border-radius:50px;
                  white-space:nowrap;">
          ${text}
        </a>
      </td>
    </tr>
  </table>`;

/**
 * Renders a labelled info row (e.g. "Email: john@doe.com")
 * @param {string} label
 * @param {string} value
 * @param {string} [valueStyle] - extra inline CSS for the value cell
 */
export const renderInfoRow = (label, value, valueStyle = '') => `
  <tr>
    <td style="padding:10px 0;font-size:14px;color:${BRAND.textLight};
               font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
               width:140px;vertical-align:top;font-weight:700;
               text-transform:uppercase;letter-spacing:0.8px;">
      ${label}
    </td>
    <td style="padding:10px 0;font-size:16px;color:${BRAND.textDark};
               font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
               font-weight:500;${valueStyle}">
      ${value}
    </td>
  </tr>`;

/**
 * Renders a coloured alert box
 * @param {string} text
 * @param {'info'|'success'|'warning'|'danger'} [variant]
 */
export const renderAlert = (text, variant = 'info') => {
  const map = {
    info: { bg: BRAND.primaryLight, border: BRAND.primary, icon: 'ℹ️' },
    success: { bg: BRAND.successLight, border: BRAND.success, icon: '✅' },
    warning: { bg: BRAND.warningLight, border: BRAND.warning, icon: '⚠️' },
    danger: { bg: BRAND.dangerLight, border: BRAND.danger, icon: '🚫' },
  };
  const v = map[variant] || map.info;
  return `
    <div style="background:${v.bg};border-left:5px solid ${v.border};
                border-radius:8px;padding:16px 20px;margin:24px 0;
                font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
                font-size:15px;color:${BRAND.textDark};line-height:1.7;">
      <span style="font-size:18px;margin-right:10px;vertical-align:middle;">${v.icon}</span>${text}
    </div>`;
};

/** Horizontal rule divider */
export const renderDivider = () =>
  `<hr style="border:none;border-top:1px solid ${BRAND.border};margin:32px 0;">`;

// ── Header ────────────────────────────────────────────────────

/**
 * Full email header with logo art, tagline and decorative wave.
 * @param {string} [subtitle] - optional one-liner under the brand name
 */
export const renderHeader = (subtitle = 'Pure. Fresh. Farm-to-Doorstep.') => `
  <!-- ░░░ HEADER ░░░ -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td style="background:linear-gradient(135deg,${BRAND.primaryDark} 0%,${BRAND.primary} 100%);
                 padding:44px 44px 36px 44px;text-align:center;">

        <!-- Decorative milk drop / leaf art -->
        <div style="display:inline-block;margin-bottom:12px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 56 56">
            <ellipse cx="28" cy="28" rx="20" ry="24"
                     fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
            <path d="M28,12 C28,12 20,22 20,30 C20,34.4 23.6,38 28,38
                     C32.4,38 36,34.4 36,30 C36,22 28,12 28,12 Z"
                  fill="rgba(255,255,255,0.95)"/>
            <ellipse cx="24" cy="26" rx="3" ry="5" fill="rgba(255,255,255,0.6)"/>
          </svg>
        </div>

        <!-- Brand name -->
        <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
                    font-size:36px;font-weight:900;letter-spacing:4px;
                    color:#ffffff;text-transform:uppercase;line-height:1;">
          GRAM<span style="color:${BRAND.accent};">DAIRY</span>
        </div>

        <!-- Tagline -->
        <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
                    font-size:13px;letter-spacing:2.5px;color:rgba(255,255,255,0.8);
                    margin-top:10px;text-transform:uppercase;font-weight:600;">
          ${subtitle}
        </div>

        <!-- Decorative dots row -->
        <div style="margin-top:22px;">
          <span style="display:inline-block;width:7px;height:7px;border-radius:50%;
                       background:${BRAND.accent};margin:0 4px;opacity:1;"></span>
          <span style="display:inline-block;width:7px;height:7px;border-radius:50%;
                       background:rgba(255,255,255,0.6);margin:0 4px;"></span>
          <span style="display:inline-block;width:7px;height:7px;border-radius:50%;
                       background:${BRAND.accent};margin:0 4px;opacity:1;"></span>
        </div>
      </td>
    </tr>
  </table>
  ${headerWave}`;

// ── Footer ────────────────────────────────────────────────────

/**
 * Full email footer with village-art quote, social links and legal block.
 */
export const renderFooter = () => `
  ${footerWave}
  <!-- ░░░ FOOTER ░░░ -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td style="background:${BRAND.primaryDark};padding:40px 44px;text-align:center;">

        <!-- Village art — stylised cow/tree row -->
        <div style="margin-bottom:20px;font-size:26px;letter-spacing:6px;opacity:0.8;">
          🌾 🐄 🌿 🥛 🌾
        </div>

        <!-- Quote -->
        <p style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
                  font-size:14px;font-style:italic;
                  color:rgba(255,255,255,0.7);margin:0 0 20px 0;line-height:1.8;">
          "From the village fields to your morning cup — every drop tells a story of care."
        </p>

        <!-- Divider line -->
        <div style="border-top:1px solid rgba(255,255,255,0.2);
                    width:240px;margin:0 auto 20px auto;"></div>

        <!-- Links -->
        <p style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
                  font-size:12px;color:rgba(255,255,255,0.6);margin:0 0 16px 0;font-weight:600;">
          <a href="${process.env.FRONTEND_URL || '#'}/help"
             style="color:${BRAND.accent};text-decoration:none;margin:0 10px;">Help Center</a>
          &bull;
          <a href="${process.env.FRONTEND_URL || '#'}/privacy"
             style="color:${BRAND.accent};text-decoration:none;margin:0 10px;">Privacy Policy</a>
          &bull;
          <a href="${process.env.FRONTEND_URL || '#'}/contact"
             style="color:${BRAND.accent};text-decoration:none;margin:0 10px;">Contact Us</a>
        </p>

        <!-- Legal -->
        <p style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
                  font-size:11px;color:rgba(255,255,255,0.4);margin:0;line-height:1.8;">
          &copy; ${BRAND.year} GramDairy Private Limited. All rights reserved.<br>
          This is an automated message — please do not reply directly to this email.<br>
          If you did not expect this email, please ignore it or contact
          <a href="mailto:support@gramdairy.com"
             style="color:rgba(255,255,255,0.6);text-decoration:none;border-bottom:1px solid rgba(255,255,255,0.2);">support@gramdairy.com</a>
        </p>
      </td>
    </tr>
  </table>`;

// ── Body Wrapper ──────────────────────────────────────────────

/**
 * Wraps arbitrary inner HTML inside the full email shell.
 * @param {string} headerHtml   - output of renderHeader()
 * @param {string} innerHtml    - the template-specific body content
 * @param {string} footerHtml   - output of renderFooter()
 * @param {string} [previewText] - shown in inbox snippet
 */
export const buildEmail = (headerHtml, innerHtml, footerHtml, previewText = '') => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>GramDairy</title>
  <style>
    @media only screen and (max-width: 660px) {
      .container-table {
        width: 100% !important;
        max-width: 100% !important;
      }
      .content-padding {
        padding: 30px 20px !important;
      }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f4f7f4;
             font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">

  <!-- Preview text (hidden) -->
  <div style="display:none;font-size:1px;color:#f4f7f4;
              line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    ${previewText}
  </div>

  <!-- Email wrapper -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0"
         width="100%" style="background-color:#f4f7f4;min-height:100vh;">
    <tr>
      <td style="padding:40px 10px;">

        <!-- Email container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0"
               class="container-table"
               width="${BRAND.containerWidth}" style="max-width:${BRAND.containerWidth}px;margin:0 auto;
                                  border-radius:20px;overflow:hidden;
                                  box-shadow:0 12px 50px rgba(0,0,0,0.15);">
          <tr><td>${headerHtml}</td></tr>
          <tr>
            <td class="content-padding" style="background:${BRAND.cream};padding:48px 52px;">
              ${innerHtml}
            </td>
          </tr>
          <tr><td>${footerHtml}</td></tr>
        </table>

        <!-- Unsubscribe / Preferences teaser -->
        <div style="text-align:center;margin-top:30px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:11px;color:${BRAND.textLight};">
          To stop receiving these emails, you can update your <a href="${process.env.FRONTEND_URL || '#'}/profile" style="color:${BRAND.primary};text-decoration:underline;">notification preferences</a>.
        </div>

      </td>
    </tr>
  </table>
</body>
</html>`;
