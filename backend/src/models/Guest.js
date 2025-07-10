const mongoose = require('mongoose');

const GuestSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
  name: String,
  email: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Guest', GuestSchema);
