const express = require('express');
const Invite = require('../models/Invite');

const router = express.Router();

router.get('/:code', async (req, res, next) => {
  try {
    const invite = await Invite.findOne({ code: req.params.code }).populate('event', 'name date location description');

    if (!invite) {
      return res.status(404).json({ message: 'Invite code not found' });
    }

    if (invite.status === 'checked_in') {
      return res.status(400).json({ message: 'This invite has already been checked in' });
    }

    res.json({
      invite: {
        code: invite.code,
        status: invite.status,
        assignedTo: invite.assignedTo,
      },
      event: invite.event,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const { assignedTo, status } = req.body;
    const invite = await Invite.findById(req.params.id);

    if (!invite) {
      return res.status(404).json({ message: 'Invite not found' });
    }

    if (assignedTo !== undefined) invite.assignedTo = assignedTo;
    if (status !== undefined) invite.status = status;

    await invite.save();
    res.json(invite);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
