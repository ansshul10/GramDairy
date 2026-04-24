/**
 * ============================================================
 * GramDairy — Welcome Email Template
 * Triggered: after successful OTP verification (first login)
 *
 * Design theme: village sunrise — lush greens, warm amber,
 * a welcoming hero illustration with handshake/cow motifs,
 * "what's next" feature cards, and a personalised greeting.
 * ============================================================
 */

import {
  BRAND,
  buildEmail,
  renderHeader,
  renderFooter,
  renderButton,
  renderDivider,
} from './baseLayout.js';

/**
 * Builds the welcome email for a newly verified user.
 *
 * @param {string} name - the user's display name
 * @returns {string}    - full HTML email string
 */
export const welcomeTemplate = (name) => {
  const firstName = name?.split(' ')[0] || name || 'Friend';
  const frontendUrl = process.env.FRONTEND_URL || 'https://gramdairy.com';

  // ── Feature card renderer ───────────────────────────────────
  const featureCard = (emoji, title, desc, color) => `
    <td style="padding:10px;vertical-align:top;width:33%;">
      <div style="background:#ffffff;border-radius:18px;padding:26px 18px;
                  text-align:center;border-top:5px solid ${color};
                  box-shadow:0 6px 20px rgba(0,0,0,0.08);">
        <div style="font-size:36px;margin-bottom:12px;">${emoji}</div>
        <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
                    font-size:15px;font-weight:700;color:${BRAND.textDark};
                    margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px;">${title}</div>
        <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
                    font-size:13px;color:${BRAND.textMid};line-height:1.6;">
          ${desc}
        </div>
      </div>
    </td>`;

  // ── Hero illustration — sun + cow + tree silhouettes ────────
  const heroArt = `
    <div style="text-align:center;padding:32px 0 16px 0;">
      <svg xmlns="http://www.w3.org/2000/svg" width="300" height="120" viewBox="0 0 260 100">
        <!-- Sun -->
        <circle cx="130" cy="50" r="28" fill="${BRAND.accent}" opacity="0.3"/>
        <circle cx="130" cy="50" r="18" fill="${BRAND.accent}" opacity="0.65"/>
        <!-- Sun rays -->
        <g stroke="${BRAND.accent}" stroke-width="2" opacity="0.5">
          <line x1="130" y1="18" x2="130" y2="10"/>
          <line x1="130" y1="82" x2="130" y2="90"/>
          <line x1="98"  y1="50" x2="90"  y2="50"/>
          <line x1="162" y1="50" x2="170" y2="50"/>
        </g>
        <line x1="20" y1="85" x2="240" y2="85"
              stroke="${BRAND.primary}" stroke-width="2.5" opacity="0.4"/>
        <!-- Left tree trunk -->
        <rect x="42" y="60" width="7" height="25" fill="${BRAND.earth}" rx="2"/>
        <ellipse cx="45" cy="55" rx="14" ry="16" fill="${BRAND.primary}" opacity="0.8"/>
        <!-- Right tree trunk -->
        <rect x="212" y="62" width="7" height="23" fill="${BRAND.earth}" rx="2"/>
        <ellipse cx="215" cy="57" rx="12" ry="14" fill="${BRAND.primary}" opacity="0.8"/>
        <!-- Cow body -->
        <ellipse cx="130" cy="78" rx="22" ry="12" fill="white" stroke="${BRAND.primaryDark}" stroke-width="2"/>
        <ellipse cx="150" cy="72" rx="10" ry="8" fill="white" stroke="${BRAND.primaryDark}" stroke-width="2"/>
        <circle cx="154" cy="71" r="2" fill="${BRAND.primaryDark}"/>
      </svg>
    </div>`;

  // ── Product showcase strip ───────────────────────────────────
  const productStrip = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
           style="margin:32px 0;">
      <tr>
        ${featureCard('🥛', 'Fresh Milk', 'Straight from the farm, chilled and delivered daily.', BRAND.primary)}
        ${featureCard('🧈', 'Pure Ghee', 'Hand-churned small-batch ghee with rich aroma.', BRAND.accent)}
        ${featureCard('🧀', 'Fresh Paneer', 'No preservatives, made fresh for your family.', BRAND.sky)}
      </tr>
    </table>`;

  // ── Benefit rows ──────────────────────────────────────────────
  const benefitRow = (icon, text) => `
    <tr>
      <td style="padding:12px 0;vertical-align:middle;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="font-size:24px;width:44px;text-align:center;vertical-align:middle;">
              ${icon}
            </td>
            <td style="padding-left:16px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
                       font-size:15px;color:${BRAND.textMid};line-height:1.7;
                       vertical-align:middle;">
              ${text}
            </td>
          </tr>
        </table>
      </td>
    </tr>`;

  const benefits = `
    <div style="background:${BRAND.primaryLight};border-radius:18px;
                  padding:28px 32px;margin:32px 0;border:1px solid ${BRAND.border};">
          <p style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
                    font-size:14px;font-weight:700;color:${BRAND.primary};
                    text-transform:uppercase;letter-spacing:1.2px;margin:0 0 16px 0;">
            Why GramDairy Families Love Us
          </p>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            ${benefitRow('🚚', '<strong>Morning doorstep delivery</strong> — fresh before you wake up.')}
            ${benefitRow('📱', '<strong>Smart subscriptions</strong> — pause, adjust or cancel anytime.')}
            ${benefitRow('🌾', '<strong>Verified village farms</strong> — know exactly where your dairy comes from.')}
            ${benefitRow('📊', '<strong>Real-time tracking</strong> — follow your order from farm to door.')}
          </table>
    </div>`;

  // ── Referral teaser ───────────────────────────────────────────
  const referralTeaser = `
    <div style="background:linear-gradient(135deg,${BRAND.primary} 0%,${BRAND.primaryDark} 100%);
                border-radius:18px;padding:28px 32px;margin-top:32px;
                position:relative;overflow:hidden;box-shadow:0 8px 25px rgba(27,94,32,0.3);">
      <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
                  font-size:18px;font-weight:700;color:#ffffff;margin-bottom:10px;">
        🎁 Share the Goodness!
      </div>
      <p style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
                font-size:14px;color:rgba(255,255,255,0.9);
                margin:0;line-height:1.7;">
        Share GramDairy with your friends. When they place their first order,
        you both get a <strong style="color:${BRAND.accent};">₹50 credit</strong> on your next bill.
      </p>
    </div>`;

  // ── Inner body ────────────────────────────────────────────────
  const inner = `
    <h1 style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
               font-size:32px;font-weight:900;color:${BRAND.primary};
               margin:0 0 12px 0;line-height:1.2;">
      Namaste, ${firstName}! 🙏
    </h1>

    <p style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
              font-size:16px;color:${BRAND.textMid};line-height:1.8;margin:0 0 8px 0;">
      Your GramDairy account is now <strong style="color:${BRAND.success};">verified and active</strong>.
      We're honoured to bring the absolute freshest village dairy right to your home — every single morning.
    </p>

    ${heroArt}

    <p style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
              font-size:15px;color:${BRAND.textMid};line-height:1.7;margin:24px 0 8px 0;">
      Our mission is simple: <strong>Purity without compromise.</strong> We source directly from 
      small village farms, ensuring you get dairy that's free from additives and hormones.
    </p>

    ${renderDivider()}

    <h2 style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
               font-size:18px;font-weight:700;color:${BRAND.textDark};margin:0 0 6px 0;
               text-transform:uppercase;letter-spacing:1px;">
      🌟 Explore the Farm
    </h2>
    ${productStrip}

    ${renderDivider()}

    ${benefits}
    ${referralTeaser}

    ${renderButton(`${frontendUrl}/catalog`, 'Browse Fresh Products 🛒')}

    <p style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
              font-size:14px;color:${BRAND.textLight};text-align:center;margin-top:24px;
              line-height:1.6;">
      Need to change delivery settings? Visit your <a href="${frontendUrl}/profile" style="color:${BRAND.primary};
      text-decoration:underline;font-weight:600;">profile dashboard</a>.
    </p>

    ${renderDivider()}

    <p style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
              font-size:16px;color:${BRAND.textMid};line-height:1.7;margin:0;">
      Warm regards,<br>
      <strong style="color:${BRAND.primaryDark};">The GramDairy Family</strong><br>
      <em style="font-size:13px;color:${BRAND.textLight};">Pure. Local. Delivered with love.</em>
    </p>`;

  return buildEmail(
    renderHeader('Welcome to the Green Family!'),
    inner,
    renderFooter(),
    `Welcome, ${firstName}! Your GramDairy account is fully active. Start your fresh dairy journey today.`,
  );
};
