const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
  guestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Guest' },
  destination: String,
  departureDate: Date,
  returnDate: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trip', TripSchema);
