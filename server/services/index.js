/**
 * ============================================================
 * GramDairy — Email & Auth Services
 * All transactional emails now use templates from
 * ../emailTemplates/index.js (dairy/village themed, 250+ lines each).
 * ============================================================
 */

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { Otp, RefreshToken } from '../models/AccountModels.js';
import {
  otpTemplate,
  welcomeTemplate,
  orderConfirmationTemplate,
  deliveryCredentialsTemplate,
  deliveryRejectionTemplate,
  vendorWelcomeTemplate,
  subscriptionStatusTemplate,
  paymentConfirmedTemplate,
  supportCreatedTemplate,
  supportReplyTemplate,
  newsletterWelcomeTemplate,
  newsletterBlastTemplate,
  buildEmail,
  renderHeader,
  renderFooter,
  renderButton,
  renderAlert,
  BRAND,
} from '../emailTemplates/index.js';

dotenv.config();

// ── SMTP Transporter ──────────────────────────────────────────

const transporter = process.env.EMAIL_SERVICE === 'brevo'
  ? nodemailer.createTransport({
      host:   process.env.BREVO_SMTP_HOST,
      port:   Number(process.env.BREVO_SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS,
      },
    })
  : nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GOOGLE_SMTP_USER,
        pass: process.env.GOOGLE_SMTP_PASS,
      },
    });

// ── Generic Send Email ────────────────────────────────────────

/**
 * Low-level mailer — send any email with a pre-built HTML body.
 * @param {{ email: string, subject: string, html: string }} options
 */
export const sendEmail = async (options) => {
  const mailOptions = {
    from: `"${process.env.FROM_NAME || 'GramDairy'}" <${process.env.FROM_EMAIL || 'noreply@gramdairy.com'}>`,
    to:      options.email,
    subject: options.subject,
    html:    options.html,
  };
  await transporter.sendMail(mailOptions);
};

// ── Standalone Fallback Template Builder ─────────────────────
// Used by ad-hoc sendEmail calls in controllers that haven't
// been migrated to a named template yet.

/**
 * Builds a simple branded transactional email.
 * @param {string} title
 * @param {string} message
 * @param {string|null} [buttonText]
 * @param {string|null} [buttonUrl]
 * @returns {string} full HTML
 */
export const getEmailTemplate = (title, message, buttonText = null, buttonUrl = null) => {
  const inner = `
    <h1 style="font-family:'Helvetica Neue',Arial,sans-serif;
               font-size:22px;font-weight:800;color:${BRAND.primary};
               margin:0 0 16px 0;line-height:1.3;">
      ${title}
    </h1>
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;
                font-size:14px;color:${BRAND.textMid};line-height:1.8;
                white-space:pre-line;margin:0 0 24px 0;">
      ${message}
    </div>
    ${buttonText && buttonUrl ? renderButton(buttonUrl, buttonText) : ''}
    <p style="font-family:'Helvetica Neue',Arial,sans-serif;
              font-size:12px;color:${BRAND.textLight};text-align:center;
              margin-top:28px;">
      &copy; ${new Date().getFullYear()} GramDairy Private Limited. All rights reserved.
    </p>`;

  return buildEmail(renderHeader(), inner, renderFooter(), title);
};

// ── OTP Email ─────────────────────────────────────────────────

/**
 * Send a verification or password-reset OTP to the user.
 * @param {string} email
 * @param {string} otp           - 6-digit code
 * @param {string} [name]        - user's display name
 * @param {'verify'|'reset'} [mode]
 */
export const sendOtpEmail = async (email, otp, name = 'there', mode = 'verify') => {
  const isReset = mode === 'reset';
  await sendEmail({
    email,
    subject: isReset
      ? 'GramDairy — Your Password Reset Code'
      : 'GramDairy — Please Verify Your Email',
    html: otpTemplate(otp, name, mode),
  });
};

// ── Welcome Email ─────────────────────────────────────────────

/**
 * Send the welcome email after OTP verification.
 * @param {string} email
 * @param {string} name
 */
export const sendWelcomeEmail = async (email, name) => {
  await sendEmail({
    email,
    subject: '🌾 Welcome to GramDairy — Your Fresh Dairy Journey Begins!',
    html: welcomeTemplate(name),
  });
};

// ── Order Confirmation Email ──────────────────────────────────

/**
 * Send order confirmation after a new order is placed.
 * @param {Object} order - populated Mongoose order document
 */
export const sendOrderConfirmationEmail = async (order) => {
  await sendEmail({
    email: order.user.email,
    subject: `✅ Order Confirmed — #${order.shortCode || order._id}`,
    html: orderConfirmationTemplate(order),
  });
};

// ── Delivery Partner Credentials Email ───────────────────────

/**
 * Send login credentials to a newly approved delivery partner.
 * @param {string} email
 * @param {Object} data - see deliveryCredentialsTemplate for shape
 */
export const sendDeliveryCredentialsEmail = async (email, data) => {
  await sendEmail({
    email,
    subject: '🚀 Welcome to the GramDairy Team — Your Partner Account is Active',
    html: deliveryCredentialsTemplate(data),
  });
};

// ── Delivery Application Rejection Email ─────────────────────

/**
 * Notify an applicant that their delivery application was rejected.
 * @param {string} email
 * @param {string} name
 * @param {string} [reason]
 */
export const sendDeliveryRejectionEmail = async (email, name, reason) => {
  await sendEmail({
    email,
    subject: 'Update on Your GramDairy Partner Application',
    html: deliveryRejectionTemplate(name, reason),
  });
};

// ── Admin Contact / Direct Message Email ─────────────────────

/**
 * Send an admin message directly to a delivery partner.
 * @param {string} email
 * @param {Object} data - { name, adminName, subject, message }
 */
export const sendAdminContactEmail = async (email, data) => {
  const inner = `
    <h1 style="font-family:'Helvetica Neue',Arial,sans-serif;
               font-size:22px;font-weight:800;color:${BRAND.primary};
               margin:0 0 16px 0;">
      📩 Message from GramDairy Admin
    </h1>

    <p style="font-family:'Helvetica Neue',Arial,sans-serif;
              font-size:14px;color:${BRAND.textMid};line-height:1.7;margin:0 0 20px 0;">
      Dear <strong style="color:${BRAND.textDark};">${data.name}</strong>,<br>
      You have received a message from <strong>${data.adminName || 'GramDairy Admin'}</strong>:
    </p>

    <div style="background:${BRAND.primaryLight};border-left:4px solid ${BRAND.primary};
                border-radius:8px;padding:18px 22px;margin:0 0 24px 0;">
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;
                font-size:15px;color:${BRAND.textDark};line-height:1.8;
                margin:0;font-style:italic;white-space:pre-line;">
        "${data.message}"
      </p>
    </div>

    <p style="font-family:'Helvetica Neue',Arial,sans-serif;
              font-size:14px;color:${BRAND.textMid};line-height:1.7;margin:0 0 24px 0;">
      Please act on the above message accordingly. If you have any questions,
      contact GramDairy support.
    </p>

    ${renderButton(`${process.env.FRONTEND_URL || 'https://gramdairy.com'}/auth/login`, 'Open Dashboard')}

    <p style="font-family:'Helvetica Neue',Arial,sans-serif;
              font-size:14px;color:${BRAND.textMid};line-height:1.7;margin:24px 0 0 0;">
      Regards,<br>
      <strong style="color:${BRAND.primaryDark};">GramDairy Admin Team</strong>
    </p>`;

  await sendEmail({
    email,
    subject: `GramDairy Admin: ${data.subject || 'Important Message'}`,
    html: buildEmail(renderHeader('Admin Communication'), inner, renderFooter(), data.subject),
  });
};

// ── Vendor Welcome Email ──────────────────────────────────────

/**
 * Send credentials + onboarding email to a newly activated vendor.
 * @param {string} email
 * @param {string} name
 * @param {string} password
 * @param {Object} [extra]   - extra vendor data (farmName, vendorId, etc.)
 */
export const sendVendorWelcomeEmail = async (email, name, password, extra = {}) => {
  await sendEmail({
    email,
    subject: '🌾 Vendor Account Activated — Welcome to GramDairy Partner Network',
    html: vendorWelcomeTemplate(name, email, password, extra),
  });
};

// ── Subscription Status Update Email ─────────────────────────

/**
 * Notify a customer when their subscription status changes.
 * @param {string} email
 * @param {Object} data - see subscriptionStatusTemplate for shape
 */
export const sendSubscriptionStatusEmail = async (email, data) => {
  const isPaused = ['Paused', 'Cancelled'].includes(data.status);
  await sendEmail({
    email,
    subject: isPaused
      ? `⏸ Your GramDairy Milk Plan Has Been ${data.status}`
      : `▶️ Your GramDairy Milk Plan is Back On!`,
    html: subscriptionStatusTemplate(data),
  });
};

// ── Payment Confirmed Email ───────────────────────────────────

/**
 * Notify a customer that their bill payment has been verified.
 * @param {string} email
 * @param {Object} data - see paymentConfirmedTemplate for shape
 */
export const sendPaymentConfirmedEmail = async (email, data) => {
  await sendEmail({
    email,
    subject: `💰 Payment of ₹${Number(data.amount || 0).toFixed(2)} Confirmed — GramDairy`,
    html: paymentConfirmedTemplate(data),
  });
};

// ── Support Ticket Created Email ──────────────────────────────

/**
 * Send acknowledgment when a support ticket is created.
 * @param {Object} ticket
 * @param {string} [trackUrl]
 */
export const sendSupportCreatedEmail = async (ticket, trackUrl) => {
  await sendEmail({
    email: ticket.email,
    subject: `[${ticket.ticketId}] Support Request Received — GramDairy`,
    html: supportCreatedTemplate(ticket, trackUrl),
  });
};

// ── Support Reply Email ───────────────────────────────────────

/**
 * Notify the customer when admin replies to their support ticket.
 * @param {Object} ticket
 * @param {string} replyMessage
 * @param {string} [trackUrl]
 */
export const sendSupportReplyEmail = async (ticket, replyMessage, trackUrl) => {
  await sendEmail({
    email: ticket.email,
    subject: `Re: [${ticket.ticketId}] New Support Response — GramDairy`,
    html: supportReplyTemplate(ticket, replyMessage, trackUrl),
  });
};

/**
 * Send the newsletter welcome email.
 */
export const sendNewsletterWelcomeEmail = async (email, unsubscribeUrl) => {
  await sendEmail({
    email,
    subject: 'Welcome to GramDairy Newsletter! 🥛',
    html: newsletterWelcomeTemplate(email, unsubscribeUrl),
  });
};

/**
 * Send a newsletter blast email.
 */
export const sendNewsletterBlastEmail = async (email, subject, message, unsubscribeUrl) => {
  await sendEmail({
    email,
    subject,
    html: newsletterBlastTemplate(subject, message, unsubscribeUrl),
  });
};

// --- Re-export templates for direct use if needed ---
export { newsletterWelcomeTemplate, newsletterBlastTemplate };

// ── OTP Utility Functions ─────────────────────────────────────

/** Generates a cryptographically-safe 6-digit OTP */
export const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/** Saves OTP to DB (hashed with PBKDF2) */
export const saveOtp = async (email, otp) => {
  await Otp.deleteMany({ email });
  const salt      = crypto.randomBytes(16).toString('hex');
  const hashedOtp = crypto.pbkdf2Sync(otp, salt, 1000, 64, 'sha512').toString('hex');
  await Otp.create({ email, otp: `${hashedOtp}.${salt}` });
};

/** Verifies OTP and deletes on success */
export const verifyOtp = async (email, enteredOtp) => {
  const otpRecord = await Otp.findOne({ email });
  if (!otpRecord) return false;

  const [hashedOtp, salt] = otpRecord.otp.split('.');
  const enteredHashed = crypto.pbkdf2Sync(enteredOtp, salt, 1000, 64, 'sha512').toString('hex');

  if (hashedOtp === enteredHashed) {
    await Otp.deleteMany({ email });
    return true;
  }
  return false;
};

// ── Refresh Token Utility Functions ──────────────────────────

/**
 * Hashes a token using SHA-256
 */
const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/** Stores a new refresh token in the DB with metadata (stored hashed) */
export const storeRefreshToken = async (userId, token, metadata = {}) => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const hashedToken = hashToken(token);
  
  await RefreshToken.create({ 
    user: userId, 
    token: hashedToken, 
    expiresAt,
    ip: metadata.ip,
    userAgent: metadata.userAgent,
    deviceInfo: metadata.deviceInfo
  });
};

/** Revokes a single refresh token */
export const revokeRefreshToken = async (token) => {
  const hashedToken = hashToken(token);
  await RefreshToken.deleteOne({ token: hashedToken });
};

/** Revokes all refresh tokens for a user */
export const revokeAllUserTokens = async (userId) => {
  await RefreshToken.deleteMany({ user: userId });
};

/** Checks if a refresh token exists in the DB */
export const isTokenValidInDb = async (token) => {
  const hashedToken = hashToken(token);
  const stored = await RefreshToken.findOne({ token: hashedToken });
  return !!stored;
};
