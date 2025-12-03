const mongoose = require('mongoose');

const CheckinSchema = new mongoose.Schema(
  {
    scannedAt: { type: Date, default: Date.now },
    deviceInfo: { type: String },
  },
  { _id: false }
);

const GuestSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    invite: { type: mongoose.Schema.Types.ObjectId, ref: 'Invite', required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    checkinHistory: [CheckinSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Guest', GuestSchema);
