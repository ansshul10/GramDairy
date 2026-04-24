/**
 * ============================================================
 * GramDairy Email Templates — Barrel Export
 * Import any template from here: '../emailTemplates/index.js'
 * ============================================================
 */

export { otpTemplate }                 from './otpTemplate.js';
export { welcomeTemplate }             from './welcomeTemplate.js';
export { orderConfirmationTemplate }   from './orderConfirmationTemplate.js';
export { deliveryCredentialsTemplate } from './deliveryCredentialsTemplate.js';
export { deliveryRejectionTemplate }   from './deliveryRejectionTemplate.js';
export { vendorWelcomeTemplate }       from './vendorWelcomeTemplate.js';
export { subscriptionStatusTemplate }  from './subscriptionStatusTemplate.js';
export { paymentConfirmedTemplate }    from './paymentConfirmedTemplate.js';
export { supportCreatedTemplate }      from './supportCreatedTemplate.js';
export { supportReplyTemplate }        from './supportReplyTemplate.js';
export { newsletterWelcomeTemplate, newsletterBlastTemplate } from './newsletterTemplate.js';

// Re-export base layout helpers for any ad-hoc use
export {
  BRAND,
  buildEmail,
  renderHeader,
  renderFooter,
  renderButton,
  renderDivider,
  renderInfoRow,
  renderAlert,
} from './baseLayout.js';
