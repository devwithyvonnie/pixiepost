const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema({
  name: String,
  email: String,
  emailProvider: { type: String, enum: ['yahoo', 'gmail'] },
  appPassword: String,  // ✅ This must exactly match the property you’re setting in controller
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Agent', AgentSchema);