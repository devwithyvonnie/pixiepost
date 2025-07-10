const nodemailer = require('nodemailer');

const sendEmail = async ({ provider, user, pass, to, subject, html }) => {
  let host;

  if (provider === 'yahoo') {
    host = 'smtp.mail.yahoo.com';
  } else if (provider === 'gmail') {
    host = 'smtp.gmail.com';
  } else {
    throw new Error(`Unsupported email provider: ${provider}`);
  }

  const transporter = nodemailer.createTransport({
    host,
    port: 465,
    secure: true,
    auth: {
      user,
      pass
    }
  });

  const result = await transporter.sendMail({
    from: user,
    to,
    subject,
    html
  });

  return result;
};

module.exports = { sendEmail };
