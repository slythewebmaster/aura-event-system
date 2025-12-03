const express = require('express');
const Invite = require('../models/Invite');
const Guest = require('../models/Guest');
const QRCode = require('qrcode');
const { sendTicketEmail } = require('../utils/mailer');

const router = express.Router();

// Public endpoint used by invite links to register a guest and email their QR ticket
router.post('/register', async (req, res, next) => {
  try {
    const { inviteCode, name, email, phone } = req.body;

    if (!inviteCode || !name || !email || !phone) {
      return res.status(400).json({ message: 'Invite code, name, email, and phone are required' });
    }

    const invite = await Invite.findOne({ code: inviteCode }).populate('event', 'name date location');

    if (!invite) {
      return res.status(404).json({ message: 'Invalid invite code' });
    }

    if (invite.status === 'checked_in') {
      return res.status(400).json({ message: 'This invite has already been checked in' });
    }

    if (invite.status === 'registered') {
      const existingGuest = await Guest.findOne({ invite: invite._id });
      if (existingGuest) {
        return res.status(400).json({
          message: 'This invite is already registered',
          guest: existingGuest,
          qrPayload: { inviteCode, eventId: invite.event.toString() },
        });
      }
    }

    const guest = new Guest({
      event: invite.event,
      invite: invite._id,
      name,
      email,
      phone,
    });

    await guest.save();

    invite.status = 'registered';
    invite.guest = guest._id;
    await invite.save();

    const qrPayload = {
      inviteCode,
      eventId: invite.event.toString(),
    };
    let qrDataUrl;
    try {
      qrDataUrl = await QRCode.toDataURL(JSON.stringify(qrPayload), {
        width: 300,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
      });
    } catch (e) {
      // If QR generation fails, continue without email QR
      console.error('Failed to generate QR code for email', e);
    }

    // Send QR code ticket email (best-effort)
    try {
      await sendTicketEmail({
        to: email,
        subject: `Your ticket for ${invite.event?.name || 'your Aura event'}`,
        html:
          `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">` +
          `<h2 style="color: #6366f1; margin-bottom: 20px;">Welcome to ${invite.event?.name || 'your Aura event'}!</h2>` +
          `<p>Hi ${name},</p>` +
          `<p>Thanks for registering for <strong>${invite.event?.name || 'your Aura event'}</strong>.</p>` +
          (invite.event
            ? `<div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">` +
              `<p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(invite.event.date).toLocaleString()}</p>` +
              `<p style="margin: 5px 0;"><strong>Location:</strong> ${invite.event.location || 'TBA'}</p>` +
              `</div>`
            : '') +
          `<p>Your QR code ticket is attached to this email. You can also use your invite code: <strong style="font-size: 18px; color: #6366f1;">${inviteCode}</strong></p>` +
          (qrDataUrl ? `<p style="text-align: center; margin: 20px 0;"><img src="cid:qr-ticket" alt="Aura QR Ticket" style="max-width: 300px; border: 2px solid #e5e7eb; border-radius: 12px; padding: 15px; background: white;" /></p>` : '') +
          `<p style="margin-top: 30px;">Bring this QR code or your invite code to the event for check‑in.</p>` +
          `<p>See you soon!<br/><strong>The Aura Events Team</strong></p>` +
          `</div>`,
        qrDataUrl: qrDataUrl, // Pass QR code as attachment
      });
    } catch (e) {
      console.error('Failed to send ticket email', e);
      // Don't fail the registration if email fails
    }

    res.status(201).json({
      guest,
      qrPayload,
      message: 'Registration successful',
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Guest already registered for this invite' });
    }
    next(error);
  }
});

module.exports = router;
