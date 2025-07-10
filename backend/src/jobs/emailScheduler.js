const cron = require("node-cron");
const EmailLog = require("../models/EmailLog");
const EmailTemplate = require("../models/EmailTemplate");
const Agent = require("../models/Agent");
const Guest = require("../models/Guest");
const Trip = require("../models/Trip");
const { parseTemplate } = require("../utils/templateParser");
const { sendYahooEmail } = require("../services/emailService");
const { decrypt } = require("../utils/encryption");

const scheduleEmailJob = () => {
  // Run every minute (adjust as needed)
  cron.schedule("* * * * *", async () => {
    console.log("⏰ Running email scheduler...");

    const now = new Date();

    // 1️⃣ Find pending emails
    const pendingEmails = await EmailLog.find({
      status: "scheduled",
      scheduledAt: { $lte: now },
    });

    for (const log of pendingEmails) {
      try {
        console.log(`📧 Processing scheduled email for trip ${log.tripId}`);

        // 2️⃣ Load related data
        const agent = await Agent.findById(log.agentId);
        const guest = await Guest.findById(log.guestId);
        const trip = await Trip.findById(log.tripId);
        const template = await EmailTemplate.findOne({
          agentId: agent._id,
          templateType: log.templateType,
        });

        if (!agent || !guest || !trip || !template) {
          console.warn(
            `⚠️ Missing data for scheduled emailLog ${log._id}, skipping.`
          );
          continue;
        }

        const variables = {
          guestName: guest.name,
          destination: trip.destination,
        };

        const renderedSubject = template.subject
          .replace(/{{guestName}}/g, guest.name)
          .replace(/{{destination}}/g, trip.destination);

        const renderedBody = parseTemplate({
          bodyTemplate: template.body,
          variables,
          agentName: agent.name,
          destination: trip.destination,
        });

        // 🔔 NOTE: For MVP you must decide how to store Yahoo credentials securely!
        // Right now we would need `yahooEmail` + `yahooAppPassword` saved or input by agent.
        // For MVP, this could require manual trigger.

        // Ensure agent has credentials:
        if (!agent.yahooEmail || !agent.yahooAppPassword) {
          console.warn(
            `⚠️ Missing Yahoo credentials for agent ${agent._id}, skipping send.`
          );
          continue;
        }

        // 🔑 Decrypt the App Password before using it:
        let decryptedAppPassword;
        try {
          decryptedAppPassword = decrypt(agent.yahooAppPassword);
        } catch (err) {
          console.error(
            `❌ Failed to decrypt App Password for agent ${agent._id}:`,
            err.message
          );
          continue;
        }

        const result = await sendYahooEmail({
            user: agent.yahooEmail,
            pass: decryptedAppPassword,
            to: guest.email,
            subject: renderedSubject,
            html: renderedBody
          });          

        // 3️⃣ Mark log as sent
        log.status = "sent";
        log.sentAt = new Date();
        log.messageId = result.messageId;
        await log.save();

        console.log(`✅ Sent scheduled email for guest ${guest.name}`);
      } catch (err) {
        console.error(
          `❌ Error processing scheduled emailLog ${log._id}:`,
          err.message
        );
      }
    }
  });
};

module.exports = { scheduleEmailJob };
