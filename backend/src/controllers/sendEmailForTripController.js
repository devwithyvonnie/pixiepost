const Trip = require('../models/Trip');
const Guest = require('../models/Guest');
const EmailTemplate = require('../models/EmailTemplate');
const EmailLog = require('../models/EmailLog');
const { parseTemplate } = require('../utils/templateParser');
const { decrypt } = require('../utils/encryption');
const { sendEmail } = require('../services/sendEmail');
const Agent = require('../models/Agent');

exports.sendEmailForTrip = async (req, res) => {
  const { tripId, templateType, mode, scheduledAt } = req.body;

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

    const renderedSubject = template.subject
      .replace(/{{guestName}}/g, guest.name)
      .replace(/{{destination}}/g, trip.destination);

    const renderedBody = parseTemplate({
      bodyTemplate: template.body,
      variables,
      agentName: agent.name,
      destination: trip.destination
    });

    if (mode === 'sendNow') {
      if (!agent.email || !agent.appPassword || !agent.emailProvider) {
        return res.status(400).json({ message: 'Agent email credentials missing.' });
      }

      // ✅ Single-flight protection here:
      const existingLog = await EmailLog.findOne({
        agentId: agent._id,
        guestId: guest._id,
        tripId: trip._id,
        templateType,
        status: 'sent'
      });

      if (existingLog) {
        return res.status(409).json({
          success: false,
          message: 'Email has already been sent for this trip/template.'
        });
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

    if (mode === 'sendLater') {
        // ✅ Check for existing scheduled email for this trip/template
        const existingScheduled = await EmailLog.findOne({
          agentId: agent._id,
          guestId: guest._id,
          tripId: trip._id,
          templateType,
          status: 'scheduled'
        });
      
        if (existingScheduled) {
          return res.status(409).json({
            success: false,
            message: 'Email has already been scheduled for this trip/template.'
          });
        }
      
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

    return res.status(400).json({ message: 'Invalid mode: must be sendNow or sendLater' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
};
