const Agent = require('../models/Agent');
const Trip = require('../models/Trip');
const Guest = require('../models/Guest');
const EmailTemplate = require('../models/EmailTemplate');
const EmailLog = require('../models/EmailLog');
const { parseTemplate } = require('../utils/templateParser');
const { decrypt } = require('../utils/encryption');
const { sendEmail } = require('../services/sendEmail');

exports.sendEmailForTrip = async (req, res) => {
  const { tripId, templateType, mode, scheduledAt } = req.body;

  try {
    // ✅ 1️⃣ Load agent securely from auth token
    const agent = await Agent.findById(req.agent.id);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    // ✅ 2️⃣ Load trip with populated guest info
    const trip = await Trip.findOne({ _id: tripId, agentId: agent._id }).populate('guestId');
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const guest = trip.guestId;

    // ✅ 3️⃣ Load the correct email template
    const template = await EmailTemplate.findOne({
      agentId: agent._id,
      templateType
    });
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // ✅ 4️⃣ Render subject and body
    const variables = {
      guestName: guest.name,
      destination: trip.destination
    };

    const renderedSubject = template.subject
      .replace(/{{guestName}}/g, guest.name)
      .replace(/{{destination}}/g, trip.destination);

    const renderedBody = parseTemplate({
      bodyTemplate: template.body,
      variables,
      agentName: agent.name,
      destination: trip.destination
    });

    // ✅ 5️⃣ Handle Send Now
    if (mode === 'sendNow') {
      if (!agent.email || !agent.appPassword || !agent.emailProvider) {
        return res.status(400).json({ message: 'Agent email credentials missing.' });
      }

      const decryptedAppPassword = decrypt(agent.appPassword);

      const result = await sendEmail({
        provider: agent.emailProvider,
        user: agent.email,
        pass: decryptedAppPassword,
        to: guest.email,
        subject: renderedSubject,
        html: renderedBody
      });

      await EmailLog.create({
        agentId: agent._id,
        guestId: guest._id,
        tripId: trip._id,
        templateType,
        sentAt: new Date(),
        status: 'sent',
        messageId: result.messageId
      });

      return res.json({ success: true, message: 'Email sent successfully!' });
    }

    // ✅ 6️⃣ Handle Send Later
    if (mode === 'sendLater') {
      await EmailLog.create({
        agentId: agent._id,
        guestId: guest._id,
        tripId: trip._id,
        templateType,
        scheduledAt: new Date(scheduledAt),
        status: 'scheduled'
      });

      return res.json({ success: true, message: `Email scheduled for ${scheduledAt}` });
    }

    // ✅ 7️⃣ Invalid mode fallback
    return res.status(400).json({ message: 'Invalid mode: must be sendNow or sendLater' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
};

exports.getScheduledEmails = async (req, res) => {
  try {
    const agentId = req.agent.id;

    const {
      status = 'scheduled',
      guestId,
      tripId,
      limit = 10,
      page = 1
    } = req.query;

    const query = {
      agentId,
      status
    };

    if (guestId) {
      query.guestId = guestId;
    }

    if (tripId) {
      query.tripId = tripId;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const total = await EmailLog.countDocuments(query);

    const logs = await EmailLog.find(query)
      .sort({ scheduledAt: 1 })  // 📅 upcoming first
      .skip(skip)
      .limit(parseInt(limit))
      .populate('guestId', 'name email')
      .populate('tripId', 'destination scheduledAt');

    return res.json({
      total,
      page: parseInt(page),
      pageSize: parseInt(limit),
      emails: logs
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch scheduled emails.' });
  }
};

exports.deleteScheduledEmail = async (req, res) => {
  const agentId = req.agent.id;
  const emailId = req.params.id;

  try {
    const scheduled = await EmailLog.findOneAndDelete({ _id: emailId, agentId, status: 'scheduled' });

    if (!scheduled) {
      return res.status(404).json({ message: 'Scheduled email not found.' });
    }

    return res.json({ success: true, message: 'Scheduled email cancelled successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to cancel scheduled email.' });
  }
};

exports.saveDraftEmail = async (req, res) => {
  const { tripId, templateType, customSubject, customBody } = req.body;

  try {
    const agent = await Agent.findById(req.agent.id);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    const trip = await Trip.findOne({ _id: tripId, agentId: agent._id }).populate('guestId');
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const guest = trip.guestId;

    const template = await EmailTemplate.findOne({
      agentId: agent._id,
      templateType
    });
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    const variables = {
      guestName: guest.name,
      destination: trip.destination
    };

    const defaultSubject = template.subject
      .replace(/{{guestName}}/g, guest.name)
      .replace(/{{destination}}/g, trip.destination);

    const defaultBody = parseTemplate({
      bodyTemplate: template.body,
      variables,
      agentName: agent.name,
      destination: trip.destination
    });

    const draft = await EmailLog.create({
      agentId: agent._id,
      guestId: guest._id,
      tripId: trip._id,
      templateType,
      status: 'draft',
      // Allow custom subject/body or fallback to defaults:
      subject: customSubject || defaultSubject,
      body: customBody || defaultBody
    });

    return res.json({ success: true, draft });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to save draft email.' });
  }
};

exports.updateDraftEmail = async (req, res) => {
  const agentId = req.agent.id;
  const draftId = req.params.id;
  const { subject, body, templateType } = req.body;

  try {
    const draft = await EmailLog.findOne({ _id: draftId, agentId, status: 'draft' });

    if (!draft) {
      return res.status(404).json({ message: 'Draft not found.' });
    }

    if (subject) draft.subject = subject;
    if (body) draft.body = body;
    if (templateType) draft.templateType = templateType;

    await draft.save();

    return res.json({ success: true, draft });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to update draft email.' });
  }
};

exports.deleteDraftEmail = async (req, res) => {
  const agentId = req.agent.id;
  const draftId = req.params.id;

  try {
    const draft = await EmailLog.findOneAndDelete({ _id: draftId, agentId, status: 'draft' });

    if (!draft) {
      return res.status(404).json({ message: 'Draft not found.' });
    }

    return res.json({ success: true, message: 'Draft deleted successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to delete draft email.' });
  }
};
