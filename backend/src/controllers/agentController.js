const mongoose = require('mongoose');
const Agent = require('../models/Agent');
const Trip = require('../models/Trip');
const EmailLog = require('../models/EmailLog');
const { encrypt } = require('../utils/encryption');

exports.updateCredentials = async (req, res) => {
  const { emailProvider, email, appPassword } = req.body;

  if (!emailProvider || !['yahoo', 'gmail'].includes(emailProvider)) {
    return res.status(400).json({ message: 'Invalid emailProvider.' });
  }

  if (!email || !appPassword) {
    return res.status(400).json({ message: 'Email and appPassword required.' });
  }

  try {
    const agent = await Agent.findById(req.agent.id);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found.' });
    }

    agent.emailProvider = emailProvider;
    agent.email = email;
    agent.appPassword = encrypt(appPassword);
    await agent.save();

    return res.json({ message: 'Credentials updated successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error updating credentials.' });
  }
};

// ✅ Ensure this is defined and exported!
exports.getAnalytics = async (req, res) => {
  try {
    const agentId = req.agent.id;

    const totalTrips = await Trip.countDocuments({ agentId });

    const tripsByDestinationAgg = await Trip.aggregate([
      { $match: { agentId: new mongoose.Types.ObjectId(agentId) } },
      { $group: { _id: '$destination', count: { $sum: 1 } } }
    ]);

    const tripsByDestination = {};
    tripsByDestinationAgg.forEach(entry => {
      tripsByDestination[entry._id] = entry.count;
    });

    const emailsSent = await EmailLog.countDocuments({ agentId, status: 'sent' });

    return res.json({
      totalTrips,
      tripsByDestination,
      emailsSent
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch analytics.' });
  }
};