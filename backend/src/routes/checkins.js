const express = require('express');
const Invite = require('../models/Invite');
const Guest = require('../models/Guest');

const router = express.Router();

router.post('/scan', async (req, res, next) => {
  try {
    const { inviteCode, eventId, deviceInfo } = req.body;

    console.log('Check-in scan request:', { inviteCode, eventId, hasDeviceInfo: !!deviceInfo });

    if (!inviteCode) {
      console.error('Missing inviteCode in request');
      return res.status(400).json({ message: 'Invite code is required' });
    }

    const invite = await Invite.findOne({ code: inviteCode }).populate('guest');

    if (!invite) {
      console.error(`Invite not found for code: ${inviteCode}`);
      return res.status(404).json({ message: 'Invalid invite code' });
    }

    console.log(`Invite found: ${inviteCode}, status: ${invite.status}, event: ${invite.event}`);

    // No need to validate eventId - invite codes are unique and already tied to events in the database
    // The eventId in the QR code is optional and mainly for display purposes

    if (invite.status === 'unused') {
      console.warn(`Attempted check-in for unregistered invite: ${inviteCode}`);
      return res.status(400).json({ 
        message: 'This invite has not been registered yet. The guest must complete registration first.',
        inviteCode: inviteCode,
        status: invite.status
      });
    }

    const guest = await Guest.findOne({ invite: invite._id });

    if (!guest) {
      console.error(`Guest not found for invite: ${inviteCode}, invite._id: ${invite._id}`);
      return res.status(404).json({ message: 'Guest not found for this invite' });
    }

    if (invite.status === 'checked_in') {
      return res.status(200).json({
        success: false,
        message: 'Already checked in',
        guest,
        checkedInAt: guest.checkinHistory?.[0]?.scannedAt,
        isDuplicate: true,
      });
    }

    invite.status = 'checked_in';
    await invite.save();

    guest.checkinHistory.push({
      scannedAt: new Date(),
      deviceInfo: deviceInfo || 'Unknown device',
    });
    await guest.save();

    res.json({
      success: true,
      message: 'Check-in successful',
      guest,
      checkedInAt: guest.checkinHistory[guest.checkinHistory.length - 1].scannedAt,
      isDuplicate: false,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/events/:id/summary', async (req, res, next) => {
  try {
    const checkedInCount = await Invite.countDocuments({
      event: req.params.id,
      status: 'checked_in',
    });

    const registeredCount = await Invite.countDocuments({
      event: req.params.id,
      status: 'registered',
    });

    const totalInvites = await Invite.countDocuments({
      event: req.params.id,
    });

    res.json({
      totalInvites,
      registered: registeredCount,
      checkedIn: checkedInCount,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
