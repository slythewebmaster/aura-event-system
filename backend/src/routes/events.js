const express = require('express');
const Event = require('../models/Event');
const Invite = require('../models/Invite');
const Guest = require('../models/Guest');
const { generateUniqueCode } = require('../utils/codeGenerator');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Create event + pre-allocate invites (admin only)
router.post('/', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { name, date, location, description, maxGuests = 200 } = req.body;

    if (!name || !date || !location) {
      return res.status(400).json({ message: 'Name, date, and location are required' });
    }

    const event = new Event({ name, date, location, description, maxGuests });
    await event.save();

    const invites = [];
    for (let i = 0; i < maxGuests; i++) {
      const code = await generateUniqueCode();
      invites.push({
        event: event._id,
        code,
        status: 'unused',
      });
    }

    await Invite.insertMany(invites);

    res.status(201).json({
      event,
      message: `Event created with ${maxGuests} pre-allocated invites`,
    });
  } catch (error) {
    next(error);
  }
});

// List events with stats (admin only)
router.get('/', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });

    const eventsWithStats = await Promise.all(
      events.map(async (event) => {
        const totalInvites = await Invite.countDocuments({ event: event._id });
        const registeredCount = await Invite.countDocuments({ event: event._id, status: 'registered' });
        const checkedInCount = await Invite.countDocuments({ event: event._id, status: 'checked_in' });

        return {
          ...event.toObject(),
          stats: {
            totalInvites,
            registered: registeredCount,
            checkedIn: checkedInCount,
          },
        };
      })
    );

    res.json(eventsWithStats);
  } catch (error) {
    next(error);
  }
});

// Single event with stats (admin only)
router.get('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const totalInvites = await Invite.countDocuments({ event: event._id });
    const registeredCount = await Invite.countDocuments({ event: event._id, status: 'registered' });
    const checkedInCount = await Invite.countDocuments({ event: event._id, status: 'checked_in' });

    res.json({
      ...event.toObject(),
      stats: {
        totalInvites,
        registered: registeredCount,
        checkedIn: checkedInCount,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Paginated invites for an event (admin only)
router.get('/:id/invites', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { page = 1, limit = 50, status } = req.query;
    const skip = (page - 1) * limit;

    const filter = { event: req.params.id };
    if (status) {
      filter.status = status;
    }

    const invites = await Invite.find(filter)
      .populate('guest', 'name email phone')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Invite.countDocuments(filter);

    res.json({
      invites,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// CSV export of invites (admin only)
router.get('/:id/invites/export', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const invites = await Invite.find({ event: req.params.id })
      .populate('guest', 'name email phone')
      .sort({ code: 1 });

    const csvRows = ['Invite Code,Assigned To,Status,Guest Name,Guest Email,Guest Phone,Checked In At'];

    invites.forEach((invite) => {
      const guest = invite.guest || {};
      const checkedInAt = invite.status === 'checked_in' && guest.checkinHistory?.[0]
        ? new Date(guest.checkinHistory[0].scannedAt).toISOString()
        : '';
      
      csvRows.push(
        [
          invite.code,
          invite.assignedTo || '',
          invite.status,
          guest.name || '',
          guest.email || '',
          guest.phone || '',
          checkedInAt,
        ]
          .map((field) => `"${String(field).replace(/"/g, '""')}"`)
          .join(',')
      );
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="event-${req.params.id}-invites.csv"`);
    res.send(csvRows.join('\n'));
  } catch (error) {
    next(error);
  }
});

// Guests for an event (admin only)
router.get('/:id/guests', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { event: req.params.id };

    const guests = await Guest.find(filter)
      .populate('invite', 'code status')
      .sort({ createdAt: -1 });

    let filteredGuests = guests;
    if (status === 'checked_in') {
      filteredGuests = guests.filter((g) => g.checkinHistory && g.checkinHistory.length > 0);
    } else if (status === 'registered') {
      filteredGuests = guests.filter((g) => !g.checkinHistory || g.checkinHistory.length === 0);
    }

    res.json(filteredGuests);
  } catch (error) {
    next(error);
  }
});

// Delete event and all associated data (admin only)
router.delete('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Delete all associated invites
    const invitesDeleted = await Invite.deleteMany({ event: req.params.id });
    
    // Delete all associated guests
    const guestsDeleted = await Guest.deleteMany({ event: req.params.id });
    
    // Delete the event
    await Event.findByIdAndDelete(req.params.id);

    console.log(`Event ${event.name} deleted: ${invitesDeleted.deletedCount} invites, ${guestsDeleted.deletedCount} guests removed`);

    res.json({
      message: 'Event deleted successfully',
      deleted: {
        event: event.name,
        invites: invitesDeleted.deletedCount,
        guests: guestsDeleted.deletedCount,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
