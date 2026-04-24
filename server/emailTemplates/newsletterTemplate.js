import { buildEmail, renderHeader, renderFooter, renderButton, BRAND } from './baseLayout.js';

/**
 * Thank you for subscribing to GramDairy Newsletter
 */
export const newsletterWelcomeTemplate = (email, unsubscribeUrl) => {
  const header = renderHeader('Stay Fresh. Stay Informed.');
  const footer = renderFooter();

  const inner = `
    <div style="text-align:center;">
      <h1 style="color:${BRAND.primary}; font-size:28px; font-weight:900; margin-bottom:16px;">
        WELCOME TO THE FAMILY!
      </h1>
      <p style="color:${BRAND.textMid}; font-size:16px; line-height:1.6; margin-bottom:24px;">
        High five! You've successfully subscribed to the GramDairy Newsletter. 
        You are now part of a community that values purity, health, and farm-fresh quality.
      </p>
      
      <div style="background:${BRAND.primaryLight}; border-radius:12px; padding:32px; margin-bottom:32px;">
        <h3 style="color:${BRAND.primaryDark}; font-size:20px; margin-bottom:12px; font-weight:800;">
          WHAT TO EXPECT?
        </h3>
        <ul style="text-align:left; color:${BRAND.textDark}; font-size:15px; line-height:1.8; padding-left:20px;">
          <li>Exclusive sneak peeks at new farm products.</li>
          <li>Seasonal offers and subscriber-only discounts.</li>
          <li>Healthy dairy recipes and nutritional tips.</li>
          <li>Updates on our farm-to-table journey.</li>
        </ul>
      </div>

      <p style="color:${BRAND.textMid}; font-size:15px; margin-bottom:32px;">
        We promise not to clutter your inbox — only the freshest news, just like our milk!
      </p>

      ${renderButton(process.env.FRONTEND_URL || '#', 'SHOP FRESH PRODUCTS')}

      <p style="margin-top:40px; font-size:12px; color:${BRAND.textLight};">
        If you didn't mean to subscribe, you can 
        <a href="${unsubscribeUrl}" style="color:${BRAND.primary}; text-decoration:underline;">unsubscribe here</a>.
      </p>
    </div>
  `;

  return buildEmail(header, inner, footer, "Welcome to GramDairy Newsletter! 🥛");
};

/**
 * General Newsletter Blast Template
 */
export const newsletterBlastTemplate = (subject, message, unsubscribeUrl) => {
  const header = renderHeader();
  const footer = renderFooter();

  const inner = `
    <div>
      <h1 style="color:${BRAND.primary}; font-size:24px; font-weight:800; margin-bottom:20px; text-transform:uppercase;">
        ${subject}
      </h1>
      <div style="color:${BRAND.textMid}; font-size:16px; line-height:1.7; margin-bottom:30px; white-space: pre-wrap;">
        ${message}
      </div>
      
      ${renderButton(process.env.FRONTEND_URL || '#', 'VISIT GRAMDAIRY')}

      <p style="margin-top:40px; font-size:11px; color:${BRAND.textLight}; text-align:center; border-top:1px solid ${BRAND.borderLight}; padding-top:20px;">
        You're receiving this because you subscribed to GramDairy updates. <br/>
        <a href="${unsubscribeUrl}" style="color:${BRAND.primary}; text-decoration:underline;">Click here to unsubscribe</a>
      </p>
    </div>
  `;

  return buildEmail(header, inner, footer, subject);
};
