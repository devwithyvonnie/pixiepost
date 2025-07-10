const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
  guestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Guest', required: true },
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  templateType: { type: String, required: true },
  status: { type: String, enum: ['sent', 'scheduled'], required: true },
  sentAt: Date,
  scheduledAt: Date,
  messageId: String
}, { timestamps: true });

module.exports = mongoose.model('EmailLog', emailLogSchema);
