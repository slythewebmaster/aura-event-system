const express = require('express');
const Invite = require('../models/Invite');
const Guest = require('../models/Guest');

const router = express.Router();

router.post('/scan', async (req, res, next) => {
  try {
    const { inviteCode, eventId, deviceInfo } = req.body;

    if (!inviteCode) {
      return res.status(400).json({ message: 'Invite code is required' });
    }

    const invite = await Invite.findOne({ code: inviteCode }).populate('guest');

    if (!invite) {
      return res.status(404).json({ message: 'Invalid invite code' });
    }

    // Validate eventId if provided - normalize both to strings for comparison
    // Note: Since invite codes are unique, this validation is optional but helps prevent cross-event check-ins
    if (eventId) {
      // invite.event is an ObjectId reference, convert to string for comparison
      const inviteEventId = String(invite.event).trim();
      const providedEventId = String(eventId).trim();
      if (inviteEventId !== providedEventId) {
        console.warn(`Event ID mismatch for invite ${inviteCode}: invite event=${inviteEventId}, provided=${providedEventId}`);
        return res.status(400).json({ message: 'Invite code does not match this event' });
      }
    }

    if (invite.status === 'unused') {
      return res.status(400).json({ message: 'This invite has not been registered yet' });
    }

    const guest = await Guest.findOne({ invite: invite._id });

    if (!guest) {
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
