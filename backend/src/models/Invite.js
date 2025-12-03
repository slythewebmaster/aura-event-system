const mongoose = require('mongoose');

const InviteSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    code: { type: String, required: true, unique: true },
    status: { type: String, enum: ['unused', 'registered', 'checked_in'], default: 'unused', index: true },
    assignedTo: { type: String },
    guest: { type: mongoose.Schema.Types.ObjectId, ref: 'Guest' },
  },
  { timestamps: true }
);

InviteSchema.index({ event: 1, code: 1 }, { unique: true });

module.exports = mongoose.model('Invite', InviteSchema);
