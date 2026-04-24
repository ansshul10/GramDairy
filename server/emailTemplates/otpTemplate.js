/**
 * ============================================================
 * GramDairy — OTP Verification Email Template
 * Triggered: user registration (first OTP) & forgot password
 *
 * Design theme: warm village dawn — golden sunrise gradients,
 * a large prominent OTP display, countdown reminder, and
 * security notes styled like a physical token card.
 * ============================================================
 */

import {
  BRAND,
  buildEmail,
  renderHeader,
  renderFooter,
  renderDivider,
  renderAlert,
} from './baseLayout.js';

/**
 * Builds the OTP verification email HTML.
 *
 * @param {string} otp           - 6-digit OTP code
 * @param {string} [name]        - recipient first name (optional)
 * @param {'verify'|'reset'} [mode] - determines the title & messaging
 * @returns {string}             - full HTML email string
 */
export const otpTemplate = (otp, name = 'there', mode = 'verify') => {
  const isReset = mode === 'reset';
  const headline = isReset
    ? 'Password Reset Request'
    : 'Confirm Your Email Address';
  const intro = isReset
    ? `We received a request to reset the password linked to your GramDairy account.`
    : `Welcome! To activate your GramDairy account and start enjoying fresh farm products delivered daily, please verify your email using the one-time code below.`;

  const previewText = isReset
    ? `Your GramDairy password reset code is ${otp} — valid for 10 minutes.`
    : `Your GramDairy verification code is ${otp} — expires in 10 minutes.`;

  // ── Token card with each OTP digit in its own box ──────────
  const otpDigits = otp.toString().split('').map(d => `
    <td style="padding:0 6px;">
      <div style="width:48px;height:66px;border-radius:12px;
                  background:#ffffff;
                  border:2.5px solid ${BRAND.accent};
                  font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
                  font-size:34px;font-weight:900;color:${BRAND.primaryDark};
                  box-shadow:0 6px 18px rgba(255,179,0,0.25);
                  text-align:center;line-height:66px;">
        ${d}
      </div>
    </td>`).join('');

  // ── Step indicators ─────────────────────────────────────────
  const steps = isReset
    ? ['Enter the 6-digit code above', 'Create your new secure password', 'Log in and you\'re good to go!']
    : ['Enter the 6-digit code above', 'Your account gets activated instantly', 'Start your fresh dairy subscription'];

  const stepItems = steps.map((s, i) => `
    <tr>
      <td style="padding:10px 0;vertical-align:top;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <!-- Step number circle -->
            <td style="vertical-align:top;">
              <div style="width:28px;height:28px;border-radius:50%;
                          background:${BRAND.primary};color:#fff;
                          font-family:'Helvetica Neue',Arial,sans-serif;
                          font-size:13px;font-weight:800;text-align:center;
                          line-height:28px;min-width:28px;">
                ${i + 1}
              </div>
            </td>
            <!-- Step text -->
            <td style="padding-left:14px;vertical-align:middle;">
              <span style="font-family:'Helvetica Neue',Arial,sans-serif;
                           font-size:14px;color:${BRAND.textMid};line-height:1.5;">
                ${s}
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>`).join('');

  // ── Decorative milk glass art ───────────────────────────────
  const milkGlassArt = `
    <div style="text-align:center;margin:0 0 24px 0;opacity:0.85;">
      <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 70 70">
        <!-- Glass body -->
        <path d="M20,15 L18,60 Q18,64 22,64 L48,64 Q52,64 52,60 L50,15 Z"
              fill="none" stroke="${BRAND.primary}" stroke-width="2.5"
              stroke-linejoin="round"/>
        <!-- Milk fill -->
        <path d="M21,30 L49,30 L47,64 Q47,64 23,64 Z"
              fill="${BRAND.accent}" opacity="0.25"/>
        <!-- Foam top -->
        <ellipse cx="35" cy="30" rx="14" ry="4" fill="white" opacity="0.80"/>
        <!-- Highlight -->
        <line x1="26" y1="20" x2="24" y2="55"
              stroke="rgba(255,255,255,0.7)" stroke-width="2" stroke-linecap="round"/>
        <!-- Steam -->
        <path d="M28,10 Q30,5 28,1" fill="none" stroke="${BRAND.accent}"
              stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
        <path d="M35,9 Q37,4 35,0" fill="none" stroke="${BRAND.accent}"
              stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
        <path d="M42,10 Q44,5 42,1" fill="none" stroke="${BRAND.accent}"
              stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
      </svg>
    </div>`;

  // ── Security tips block ──────────────────────────────────────
  const securityBlock = `
    <div style="background:${BRAND.primaryLight};border-radius:10px;
                padding:18px 22px;margin-top:28px;">
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;
                font-size:12px;font-weight:700;color:${BRAND.primary};
                margin:0 0 10px 0;text-transform:uppercase;letter-spacing:0.8px;">
        🔒 Security Reminders
      </p>
      <ul style="margin:0;padding-left:18px;
                 font-family:'Helvetica Neue',Arial,sans-serif;
                 font-size:13px;color:${BRAND.textMid};line-height:1.9;">
        <li>GramDairy will <strong>never</strong> call or message asking for this code.</li>
        <li>Do <strong>not</strong> share this OTP with anyone.</li>
        <li>This code is valid for <strong>10 minutes only</strong>.</li>
        <li>If you did not request this, you can safely ignore this email.</li>
      </ul>
    </div>`;

  // ── Inner body ────────────────────────────────────────────────
  const inner = `
    <!-- Greeting -->
    <p style="font-family:'Helvetica Neue',Arial,sans-serif;
              font-size:15px;color:${BRAND.textMid};margin:0 0 6px 0;">
      Dear <strong style="color:${BRAND.textDark};">${name}</strong>,
    </p>

    <h1 style="font-family:'Helvetica Neue',Arial,sans-serif;
               font-size:24px;font-weight:800;color:${BRAND.primary};
               margin:0 0 16px 0;line-height:1.3;">
      ${headline}
    </h1>

    <p style="font-family:'Helvetica Neue',Arial,sans-serif;
              font-size:14px;color:${BRAND.textMid};line-height:1.7;margin:0 0 28px 0;">
      ${intro}
    </p>

    ${milkGlassArt}

    <!-- OTP Token Card -->
    <div style="background:linear-gradient(135deg,${BRAND.primaryDark} 0%,${BRAND.primary} 100%);
                border-radius:16px;padding:28px 24px;text-align:center;
                box-shadow:0 8px 30px rgba(45,106,45,0.30);margin-bottom:28px;">

      <p style="font-family:'Helvetica Neue',Arial,sans-serif;
                font-size:11px;font-weight:700;letter-spacing:2px;
                color:rgba(255,255,255,0.65);text-transform:uppercase;margin:0 0 18px 0;">
        Your One-Time Code
      </p>

      <!-- OTP digit boxes -->
      <table role="presentation" cellspacing="0" cellpadding="0" border="0"
             style="margin:0 auto 20px auto;">
        <tr>${otpDigits}</tr>
      </table>

      <!-- Expiry badge -->
      <div style="display:inline-block;background:rgba(255,255,255,0.12);
                  border:1px solid rgba(255,255,255,0.25);border-radius:50px;
                  padding:6px 18px;margin-top:4px;">
        <span style="font-family:'Helvetica Neue',Arial,sans-serif;
                     font-size:12px;font-weight:600;color:rgba(255,255,255,0.80);">
          ⏱ Expires in 10 minutes
        </span>
      </div>
    </div>

    ${renderDivider()}

    <!-- What to do next -->
    <h2 style="font-family:'Helvetica Neue',Arial,sans-serif;
               font-size:16px;font-weight:700;color:${BRAND.textDark};margin:0 0 14px 0;">
      What to do next
    </h2>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      ${stepItems}
    </table>

    ${renderDivider()}

    ${renderAlert(
    isReset
      ? 'If you did not request a password reset, your account is safe. No action is needed.'
      : 'If you did not create a GramDairy account, please ignore this email.',
    isReset ? 'warning' : 'info'
  )}

    ${securityBlock}`;

  return buildEmail(
    renderHeader(isReset ? 'Account Security' : 'Welcome to the Village'),
    inner,
    renderFooter(),
    previewText,
  );
};
