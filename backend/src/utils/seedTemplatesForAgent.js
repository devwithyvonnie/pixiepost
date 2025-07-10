const EmailTemplate = require('../models/EmailTemplate');

const defaultTemplates = [
  {
    templateType: 'pre_30',
    subject: 'Your trip to {{destination}} is 30 days away!',
    body: '<p>Hi {{guestName}},</p><p>Your adventure to {{destination}} is just around the corner! Let us know if you have any questions as you prepare.</p>'
  },
  {
    templateType: 'pre_7',
    subject: '7 days to go — Packing checklist for {{destination}}!',
    body: '<p>Hi {{guestName}},</p><p>Only 7 days left before your trip to {{destination}}! Here’s a quick reminder to pack all the essentials.</p>'
  },
  {
    templateType: 'pre_1',
    subject: 'Tomorrow is the big day — Final tips for {{destination}}!',
    body: '<p>Hi {{guestName}},</p><p>Your trip to {{destination}} starts tomorrow! We’re excited for you and here to help with any last-minute questions.</p>'
  },
  {
    templateType: 'post_1',
    subject: 'Welcome back from {{destination}} — How was your trip?',
    body: '<p>Hi {{guestName}},</p><p>We hope you had an amazing time in {{destination}}. We’d love your feedback or to help you plan your next adventure!</p>'
  }
];

const seedTemplatesForAgent = async (agentId) => {
  try {
    for (const template of defaultTemplates) {
      await EmailTemplate.findOneAndUpdate(
        { agentId, templateType: template.templateType },
        { ...template, agentId },
        { upsert: true, new: true }
      );
    }
    console.log(`Seeded default templates for agent ${agentId}`);
  } catch (err) {
    console.error('Error seeding templates:', err.message);
  }
};

module.exports = seedTemplatesForAgent;
