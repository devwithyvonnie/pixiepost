const mongoose = require('mongoose');

const EmailTemplateSchema = new mongoose.Schema({
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    required: true
  },
  templateType: {
    type: String,
    enum: ['pre_30', 'pre_7', 'pre_1', 'post_1'],  // Add more if needed
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

EmailTemplateSchema.index({ agentId: 1, templateType: 1 }, { unique: true }); 
// Ensure one templateType per agent (but agents can customize their own)

module.exports = mongoose.model('EmailTemplate', EmailTemplateSchema);
