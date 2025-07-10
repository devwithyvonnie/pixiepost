const { destinationHeaderImages, DEFAULT_HEADER_IMAGE_URL } = require('./destinationHeaderImages');

const parseTemplate = ({
  bodyTemplate = '',
  variables = {},
  agentName = 'Your Travel Agent',
  destination = ''
}) => {
  const key = destination.toLowerCase().trim();
  const headerImageUrl = destinationHeaderImages[key] || DEFAULT_HEADER_IMAGE_URL;

  let renderedBody = bodyTemplate;
  Object.keys(variables).forEach(key => {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    renderedBody = renderedBody.replace(placeholder, variables[key]);
  });

  renderedBody = renderedBody.replace(/{{agentName}}/g, agentName);

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Email from ${agentName}</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { width: 100%; max-width: 600px; background-color: #ffffff; margin: 0 auto; border-radius: 8px; overflow: hidden; }
        .header img { width: 100%; display: block; }
        .content { padding: 20px; font-size: 16px; line-height: 1.5; color: #333333; }
        .footer { background-color: #eeeeee; text-align: center; padding: 10px; font-size: 12px; color: #888888; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${headerImageUrl}" alt="Header for ${destination}">
        </div>
        <div class="content">
          ${renderedBody}
        </div>
        <div class="footer">
          Sent by ${agentName} — Thank you for traveling with us!
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
};

module.exports = { parseTemplate };
