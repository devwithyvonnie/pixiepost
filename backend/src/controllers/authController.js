const Agent = require('../models/Agent');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { sendEmail } = require('../services/sendEmail');  // Ensure this points to your email service

// ✅ Register controller
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({ message: 'Agent already exists' });
    }

    const agent = await Agent.create({ name, email, password });

    const token = jwt.sign({ id: agent._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    return res.status(201).json({
      token,
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

// ✅ Login controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const agent = await Agent.findOne({ email });
if (!agent) {
  return res.status(401).json({ message: 'Invalid email or password' });
}

const isMatch = await agent.matchPassword(password);
if (!isMatch) {
  return res.status(401).json({ message: 'Invalid email or password' });
}

    const token = jwt.sign({ id: agent._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    return res.json({
      token,
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

// ✅ Forgot password controller
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const agent = await Agent.findOne({ email });
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found with this email.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    agent.resetPasswordToken = resetTokenHash;
    agent.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour expiration

    await agent.save();

    const resetUrl = `https://yourfrontend.com/reset-password?token=${resetToken}&email=${encodeURIComponent(agent.email)}`;

    await sendEmail({
      provider: 'gmail',  // Replace with your admin account if needed
      user: process.env.RESET_EMAIL,
      pass: process.env.RESET_EMAIL_PASS,
      to: agent.email,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset.</p><p><a href="${resetUrl}">Reset Password</a></p>`
    });

    return res.json({ message: 'Password reset email sent.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error on forgot password.' });
  }
};

// ✅ Reset password controller
exports.resetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;

  try {
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const agent = await Agent.findOne({
      email,
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!agent) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }

    agent.password = newPassword;  // Pre-save hook will hash this
    agent.resetPasswordToken = undefined;
    agent.resetPasswordExpires = undefined;

    await agent.save();

    return res.json({ message: 'Password reset successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error on password reset.' });
  }
};
