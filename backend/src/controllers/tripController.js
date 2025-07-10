const Trip = require('../models/Trip');

exports.createTrip = async (req, res) => {
  const { guestId, destination, departureDate, returnDate } = req.body;
  try {
    const trip = new Trip({
      guestId,
      agentId: req.agent.id,
      destination,
      departureDate,
      returnDate
    });
    await trip.save();
    res.json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ agentId: req.agent.id }).populate('guestId');
    res.json(trips);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, agentId: req.agent.id }).populate('guestId');
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTrip = async (req, res) => {
  const { destination, departureDate, returnDate } = req.body;
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, agentId: req.agent.id },
      { destination, departureDate, returnDate },
      { new: true }
    );
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, agentId: req.agent.id });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json({ message: 'Trip deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
