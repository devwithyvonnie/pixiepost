const mongoose = require('mongoose');
const Trip = require('../models/Trip');
const EmailLog = require('../models/EmailLog');

exports.getAnalytics = async (req, res) => {
  try {
    const agentId = req.agent.id;
    const { start, end } = req.query;

    const dateFilter = {};
    if (start) {
      dateFilter.$gte = new Date(start);
    }
    if (end) {
      dateFilter.$lte = new Date(end);
    }

    const tripQuery = { agentId };
    if (start || end) {
      tripQuery.createdAt = dateFilter;
    }

    const totalTrips = await Trip.countDocuments(tripQuery);

    const tripsByDestinationAgg = await Trip.aggregate([
      {
        $match: {
          agentId: new mongoose.Types.ObjectId(agentId),
          ...(start || end ? { createdAt: dateFilter } : {})
        }
      },
      { $group: { _id: '$destination', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const tripsByDestination = {};
    tripsByDestinationAgg.forEach(entry => {
      tripsByDestination[entry._id] = entry.count;
    });

    const emailsSent = await EmailLog.countDocuments({ agentId, status: 'sent' });

    // ✅ Determine top 3 destinations:
    const topDestinations = tripsByDestinationAgg.slice(0, 3).map(entry => entry._id);

    return res.json({
      totalTrips,
      tripsByDestination,
      emailsSent,
      topDestinations
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch analytics.' });
  }
};
