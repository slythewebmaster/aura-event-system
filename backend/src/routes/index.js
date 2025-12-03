const express = require('express');

const eventsRouter = require('./events');
const invitesRouter = require('./invites');
const guestsRouter = require('./guests');
const checkinsRouter = require('./checkins');
const authRouter = require('./auth');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/events', eventsRouter);
router.use('/invites', invitesRouter);
router.use('/guests', guestsRouter);
router.use('/checkins', checkinsRouter);

module.exports = router;
