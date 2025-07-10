const jwt = require('jsonwebtoken');
const Agent = require('../models/Agent');
const seedTemplatesForAgent = require('../utils/seedTemplatesForAgent');

exports.register = async (req, res) => {
  const { name, email } = req.body;

  try {
    let agent = await Agent.findOne({ email });
    if (agent) {
      return res.status(400).json({ message: 'Agent already exists' });
    }

    agent = new Agent({ name, email });
    await agent.save();

    // 👉 Seed default templates for this new agent:
    await seedTemplatesForAgent(agent._id);

    const token = jwt.sign({ id: agent._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({ token, agent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.login = async (req, res) => {
  const { email } = req.body;

  try {
    const agent = await Agent.findOne({ email });
    if (!agent) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    const token = jwt.sign({ id: agent._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({ token, agent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
