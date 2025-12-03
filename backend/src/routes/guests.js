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
          `<p>Hi ${name},</p>` +
          `<p>Thanks for registering for <strong>${invite.event?.name || 'your Aura event'}</strong>.</p>` +
          (invite.event
            ? `<p><strong>Date:</strong> ${new Date(invite.event.date).toLocaleString()}<br/><strong>Location:</strong> ${
                invite.event.location || 'TBA'
              }</p>`
            : '') +
          `<p>Bring this QR code or invite code <strong>${inviteCode}</strong> to the event for check‑in.</p>` +
          (qrDataUrl ? `<img src=\"${qrDataUrl}\" alt=\"Aura QR Ticket\" style=\"max-width:240px;border:1px solid #e5e7eb;border-radius:12px;padding:12px;\" />` : '') +
          `<p>See you soon,<br/>Aura Events</p>`,
      });
    } catch (e) {
      console.error('Failed to send ticket email', e);
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
