const express = require('express');

const eventsRouter = require('./events');
const invitesRouter = require('./invites');
const guestsRouter = require('./guests');
const checkinsRouter = require('./checkins');
const authRouter = require('./auth');

const router = express.Router();

// Health check endpoint
router.get('/', (req, res) => {
  res.json({ 
    message: 'Aura Event System API', 
    status: 'running',
    endpoints: {
      auth: '/api/auth',
      events: '/api/events',
      invites: '/api/invites',
      guests: '/api/guests',
      checkins: '/api/checkins'
    }
  });
});

router.use('/auth', authRouter);
router.use('/events', eventsRouter);
router.use('/invites', invitesRouter);
router.use('/guests', guestsRouter);
router.use('/checkins', checkinsRouter);

module.exports = router;
