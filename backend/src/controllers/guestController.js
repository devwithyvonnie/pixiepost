const Guest = require('../models/Guest');

exports.createGuest = async (req, res) => {
  const { name, email } = req.body;
  try {
    const guest = new Guest({
      name,
      email,
      agentId: req.agent.id
    });
    await guest.save();
    res.json(guest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getGuests = async (req, res) => {
  try {
    const guests = await Guest.find({ agentId: req.agent.id });
    res.json(guests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getGuest = async (req, res) => {
  try {
    const guest = await Guest.findOne({ _id: req.params.id, agentId: req.agent.id });
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }
    res.json(guest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateGuest = async (req, res) => {
  const { name, email } = req.body;
  try {
    const guest = await Guest.findOneAndUpdate(
      { _id: req.params.id, agentId: req.agent.id },
      { name, email },
      { new: true }
    );
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }
    res.json(guest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteGuest = async (req, res) => {
  try {
    const guest = await Guest.findOneAndDelete({ _id: req.params.id, agentId: req.agent.id });
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }
    res.json({ message: 'Guest deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
