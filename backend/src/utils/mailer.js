const sgMail = require('@sendgrid/mail');

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const fromEmail = process.env.SENDGRID_FROM || 'no-reply@aura-events.example';

async function sendTicketEmail({ to, subject, html, attachments }) {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SENDGRID_API_KEY not set; skipping email send');
    return;
  }

  const msg = {
    to,
    from: fromEmail,
    subject,
    html,
    attachments,
  };

  await sgMail.send(msg);
}

module.exports = { sendTicketEmail };
