const EmailTemplate = require('../models/EmailTemplate');

// Create a template
exports.createTemplate = async (req, res) => {
  const { templateType, subject, body } = req.body;

  try {
    const template = new EmailTemplate({
      agentId: req.agent.id,
      templateType,
      subject,
      body
    });

    await template.save();
    res.status(201).json(template);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating template' });
  }
};

// Get all templates for agent
exports.getTemplates = async (req, res) => {
  try {
    const templates = await EmailTemplate.find({ agentId: req.agent.id });
    res.json(templates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching templates' });
  }
};

// Get template by type
exports.getTemplateByType = async (req, res) => {
  const { templateType } = req.params;

  try {
    const template = await EmailTemplate.findOne({
      agentId: req.agent.id,
      templateType
    });

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json(template);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching template' });
  }
};

// Update template by type
exports.updateTemplateByType = async (req, res) => {
  const { templateType } = req.params;
  const { subject, body } = req.body;

  try {
    const template = await EmailTemplate.findOneAndUpdate(
      { agentId: req.agent.id, templateType },
      { subject, body, updatedAt: new Date() },
      { new: true }
    );

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json(template);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating template' });
  }
};

// Delete template by type
exports.deleteTemplateByType = async (req, res) => {
  const { templateType } = req.params;

  try {
    const template = await EmailTemplate.findOneAndDelete({
      agentId: req.agent.id,
      templateType
    });

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json({ message: 'Template deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting template' });
  }
};
