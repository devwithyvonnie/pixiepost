const nodemailer = require('nodemailer');

const createYahooTransporter = ({ user, pass }) => {
  return nodemailer.createTransport({
    host: process.env.YAHOO_SMTP_HOST || 'smtp.mail.yahoo.com',
    port: process.env.YAHOO_SMTP_PORT || 465,
    secure: true,
    auth: {
      user,
      pass
    }
  });
};

module.exports = createYahooTransporter;
