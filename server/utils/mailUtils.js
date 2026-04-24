import nodemailer from 'nodemailer';

/**
 * Send an email using SMTP
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Email message (plain text)
 * @param {string} [options.html] - Email message (HTML)
 */
export const sendEmail = async (options) => {
  // Create a transporter
  // Note: For production, these should be in .env
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || (process.env.EMAIL_SERVICE === 'google' ? 'smtp.gmail.com' : 'smtp.mailtrap.io'),
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true', // Use TLS
    auth: {
      user: process.env.SMTP_USER || process.env.GOOGLE_SMTP_USER || process.env.BREVO_SMTP_USER,
      pass: process.env.SMTP_PASS || process.env.GOOGLE_SMTP_PASS || process.env.BREVO_SMTP_PASS,
    },
  });

  // Define email options
  const mailOptions = {
    from: `${process.env.FROM_NAME || 'GramDairy Admin'} <${process.env.FROM_EMAIL || 'admin@gramdairy.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // Send the email
  const info = await transporter.sendMail(mailOptions);

  console.log('Message sent: %s', info.messageId);
};

/**
 * Generate a standard HTML template for GramDairy emails
 */
export const getEmailTemplate = (title, message, actionText, actionLink) => {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
      <h2 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 10px;">${title}</h2>
      <p style="font-size: 16px; color: #333; line-height: 1.6;">${message}</p>
      ${actionLink ? `
        <div style="margin-top: 30px; text-align: center;">
          <a href="${actionLink}" style="background-color: #10b981; color: white; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 4px;">${actionText || 'View Details'}</a>
        </div>
      ` : ''}
      <div style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #999; text-align: center;">
        <p>GramDairy - Fresh Daily Deliveries</p>
        <p>This is an automated message, please do not reply.</p>
      </div>
    </div>
  `;
};
