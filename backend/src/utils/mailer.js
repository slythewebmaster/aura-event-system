const sgMail = require('@sendgrid/mail');

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const fromEmail = process.env.SENDGRID_FROM || 'no-reply@aura-events.example';

/**
 * Send ticket email with QR code to registered guest
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML email body
 * @param {Array} options.attachments - Optional attachments array
 * @param {string} options.qrDataUrl - Optional QR code data URL (will be converted to attachment)
 */
async function sendTicketEmail({ to, subject, html, attachments = [], qrDataUrl }) {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SENDGRID_API_KEY not set; skipping email send');
    return;
  }

  // Convert QR code data URL to attachment if provided
  const emailAttachments = [...attachments];
  if (qrDataUrl) {
    // Extract base64 data from data URL
    const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');
    emailAttachments.push({
      content: base64Data,
      filename: 'qr-ticket.png',
      type: 'image/png',
      disposition: 'attachment',
      contentId: 'qr-ticket'
    });
  }

  const msg = {
    to,
    from: fromEmail,
    subject,
    html,
    attachments: emailAttachments.length > 0 ? emailAttachments : undefined,
  };

  try {
    await sgMail.send(msg);
    console.log(`Ticket email sent successfully to ${to}`);
  } catch (error) {
    console.error('SendGrid error:', error.response?.body || error.message);
    throw error;
  }
}

module.exports = { sendTicketEmail };
