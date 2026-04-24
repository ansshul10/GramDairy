/**
 * ============================================================
 * GramDairy — Order Confirmation Email Template
 * Triggered: immediately after a customer places an order
 *
 * Design theme: harvest warmth — amber gold accents,
 * a clean itemised table with alternating row shading,
 * a QR-code teaser, status timeline, and delivery estimate.
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
 * Builds the order confirmation email HTML.
 *
 * @param {Object} order - populated Mongoose order document
 *   order.user          { name, email }
 *   order._id           MongoDB ObjectId
 *   order.shortCode     short alphanumeric reference
 *   order.orderItems    [{ name, quantity, price }]
 *   order.itemsPrice    number
 *   order.taxPrice      number
 *   order.shippingPrice number
 *   order.totalPrice    number
 *   order.paymentMethod string
 *   order.shippingAddress { street, city, state, postalCode }
 *   order.createdAt     Date
 *
 * @returns {string} - full HTML email string
 */
export const orderConfirmationTemplate = (order) => {
  const frontendUrl = process.env.FRONTEND_URL || 'https://gramdairy.com';
  const orderId = order.shortCode || order._id?.toString()?.slice(-8).toUpperCase();
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const addr = order.shippingAddress || {};

  // ── Order summary banner ─────────────────────────────────────
  const summaryBanner = `
    <div style="background:linear-gradient(135deg,${BRAND.primary} 0%,${BRAND.primaryDark} 100%);
                border-radius:14px;padding:24px 28px;margin-bottom:28px;
                box-shadow:0 6px 24px rgba(45,106,45,0.25);">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td>
            <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                        font-size:11px;letter-spacing:1.5px;font-weight:600;
                        color:rgba(255,255,255,0.60);text-transform:uppercase;
                        margin-bottom:4px;">
              Order Reference
            </div>
            <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                        font-size:26px;font-weight:900;color:#ffffff;letter-spacing:2px;">
              #${orderId}
            </div>
            <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                        font-size:12px;color:rgba(255,255,255,0.60);margin-top:4px;">
              Placed on ${orderDate}
            </div>
          </td>
          <td style="text-align:right;vertical-align:middle;">
            <div style="background:${BRAND.accent};border-radius:50px;
                        padding:8px 18px;display:inline-block;">
              <span style="font-family:'Helvetica Neue',Arial,sans-serif;
                           font-size:13px;font-weight:800;color:${BRAND.primaryDark};">
                ✅ Confirmed
              </span>
            </div>
          </td>
        </tr>
      </table>
    </div>`;

  // ── Items table ──────────────────────────────────────────────
  const itemRows = (order.orderItems || []).map((item, idx) => `
    <tr style="background:${idx % 2 === 0 ? BRAND.cream : BRAND.primaryLight};">
      <td style="padding:12px 14px;font-family:'Helvetica Neue',Arial,sans-serif;
                 font-size:14px;color:${BRAND.textDark};border-bottom:1px solid ${BRAND.border};">
        <div style="font-weight:600;">${item.name}</div>
        ${item.unit ? `<div style="font-size:11px;color:${BRAND.textLight};margin-top:2px;">${item.unit}</div>` : ''}
      </td>
      <td style="padding:12px 14px;text-align:center;
                 font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;
                 color:${BRAND.textMid};border-bottom:1px solid ${BRAND.border};">
        × ${item.quantity}
      </td>
      <td style="padding:12px 14px;text-align:right;
                 font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;
                 font-weight:600;color:${BRAND.textDark};border-bottom:1px solid ${BRAND.border};">
        ₹${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>`).join('');

  const itemsTable = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
           style="border-radius:12px;overflow:hidden;border:1px solid ${BRAND.border};
                  margin:20px 0;">
      <!-- Header -->
      <thead>
        <tr style="background:${BRAND.primary};">
          <th style="padding:12px 14px;font-family:'Helvetica Neue',Arial,sans-serif;
                     font-size:12px;font-weight:700;color:#ffffff;text-align:left;
                     text-transform:uppercase;letter-spacing:0.8px;">
            Product
          </th>
          <th style="padding:12px 14px;font-family:'Helvetica Neue',Arial,sans-serif;
                     font-size:12px;font-weight:700;color:#ffffff;text-align:center;
                     text-transform:uppercase;letter-spacing:0.8px;">
            Qty
          </th>
          <th style="padding:12px 14px;font-family:'Helvetica Neue',Arial,sans-serif;
                     font-size:12px;font-weight:700;color:#ffffff;text-align:right;
                     text-transform:uppercase;letter-spacing:0.8px;">
            Amount
          </th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>`;

  // ── Price breakdown ──────────────────────────────────────────
  const priceBreakdown = `
    <div style="background:#ffffff;border-radius:12px;padding:20px 24px;
                border:1px solid ${BRAND.border};margin-bottom:24px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        ${renderInfoRow('Subtotal', `₹${Number(order.itemsPrice || 0).toFixed(2)}`)}
        ${renderInfoRow('Delivery', `₹${Number(order.shippingPrice || 0).toFixed(2)}`)}
        ${renderInfoRow('Tax (GST)', `₹${Number(order.taxPrice || 0).toFixed(2)}`)}
        <tr><td colspan="2"><hr style="border:none;border-top:2px dashed ${BRAND.border};margin:12px 0;"></td></tr>
        <tr>
          <td style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;
                     font-weight:800;color:${BRAND.primaryDark};">Total Paid</td>
          <td style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:20px;
                     font-weight:900;color:${BRAND.primary};text-align:right;">
            ₹${Number(order.totalPrice || 0).toFixed(2)}
          </td>
        </tr>
      </table>
    </div>`;

  // ── Shipping + payment info ──────────────────────────────────
  const shippingBlock = `
    <div style="background:${BRAND.primaryLight};border-radius:12px;
                padding:20px 24px;margin-bottom:24px;">
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;
                font-weight:700;color:${BRAND.primary};text-transform:uppercase;
                letter-spacing:0.8px;margin:0 0 12px 0;">
        📦 Delivery Details
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        ${renderInfoRow('Address',
    `${addr.street || ''}, ${addr.city || ''}, ${addr.state || ''} — ${addr.postalCode || ''}`.replace(/^[,\s]+|[,\s]+$/g, '')
  )}
        ${renderInfoRow('Payment', order.paymentMethod || 'N/A')}
        ${renderInfoRow('Est. Delivery', 'Before 10 AM tomorrow')}
      </table>
    </div>`;

  // ── Delivery status timeline ─────────────────────────────────
  const timelineStep = (done, label, sub) => `
    <td style="text-align:center;vertical-align:top;padding:0 6px;">
      <div style="width:30px;height:30px;border-radius:50%;margin:0 auto 8px auto;
                  background:${done ? BRAND.primary : BRAND.border};
                  line-height:30px;font-size:14px;color:#ffffff;font-weight:700;">
        ${done ? '✓' : ' '}
      </div>
      <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                  font-size:12px;font-weight:700;color:${done ? BRAND.primary : BRAND.textLight};
                  line-height:1.4;">${label}</div>
      <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                  font-size:10px;color:${BRAND.textLight};margin-top:2px;">${sub}</div>
    </td>`;

  const connector = `
    <td style="vertical-align:middle;padding:0;">
      <div style="height:2px;background:${BRAND.border};margin-top:-22px;"></div>
    </td>`;

  const timeline = `
    <div style="margin:24px 0;">
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;
                font-weight:700;color:${BRAND.textDark};text-transform:uppercase;
                letter-spacing:0.8px;margin:0 0 16px 0;">
        🚀 Order Journey
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          ${timelineStep(true, 'Order Placed', 'Just now')}
          ${connector}
          ${timelineStep(false, 'Farm Picked', 'In progress')}
          ${connector}
          ${timelineStep(false, 'Out for Delivery', 'Tomorrow AM')}
          ${connector}
          ${timelineStep(false, 'Delivered', 'At your door')}
        </tr>
      </table>
    </div>`;

  // ── QR code note ─────────────────────────────────────────────
  const qrNote = `
    <div style="background:#ffffff;border:2px dashed ${BRAND.accent};
                border-radius:12px;padding:18px 22px;text-align:center;margin:24px 0;">
      <div style="font-size:28px;margin-bottom:8px;">📱</div>
      <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                  font-size:14px;font-weight:700;color:${BRAND.textDark};margin-bottom:6px;">
        Your Order QR Code is Ready
      </div>
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;
                font-size:13px;color:${BRAND.textMid};margin:0;line-height:1.6;">
        Open the GramDairy app and go to <strong>My Orders</strong> to view
        your unique QR code. Our delivery partner will scan it to confirm delivery.
      </p>
    </div>`;

  // ── Inner body ────────────────────────────────────────────────
  const inner = `
    <p style="font-family:'Helvetica Neue',Arial,sans-serif;
              font-size:15px;color:${BRAND.textMid};margin:0 0 6px 0;">
      Dear <strong style="color:${BRAND.textDark};">${order.user?.name || 'Valued Customer'}</strong>,
    </p>

    <h1 style="font-family:'Helvetica Neue',Arial,sans-serif;
               font-size:24px;font-weight:900;color:${BRAND.primary};
               margin:0 0 16px 0;line-height:1.3;">
      🎉 Order Confirmed!
    </h1>

    <p style="font-family:'Helvetica Neue',Arial,sans-serif;
              font-size:14px;color:${BRAND.textMid};line-height:1.7;margin:0 0 24px 0;">
      Wonderful news — your order has been received and our farm team is
      already preparing your fresh dairy products for doorstep delivery.
    </p>

    ${summaryBanner}
    ${itemsTable}
    ${priceBreakdown}
    ${shippingBlock}
    ${timeline}
    ${qrNote}

    ${renderAlert('Need to modify or cancel your order? You have up to <strong>2 hours</strong> from placement time to make changes through the app.', 'info')}

    ${renderButton(`${frontendUrl}/orders`, 'Track My Order 📦')}

    ${renderDivider()}

    <p style="font-family:'Helvetica Neue',Arial,sans-serif;
              font-size:14px;color:${BRAND.textMid};line-height:1.7;margin:0;">
      Thank you for choosing GramDairy! 🙏<br>
      <em style="font-size:12px;color:${BRAND.textLight};">
        Questions? Reach us at support@gramdairy.com anytime.
      </em>
    </p>`;

  return buildEmail(
    renderHeader('Your Order is Confirmed!'),
    inner,
    renderFooter(),
    `Order #${orderId} confirmed. Fresh dairy products on their way! Total: ₹${Number(order.totalPrice || 0).toFixed(2)}`,
  );
};
