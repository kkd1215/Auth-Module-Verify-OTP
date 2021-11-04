const sgMail = require('@sendgrid/mail');
const { sendgrid } = require('../../config');
const logger = require('../logger');

sgMail.setApiKey(sendgrid.apiKey);

async function sendEmail(data) {
  try {
    const msg = {
      to: data.to,
      from: sendgrid.from,
      subject: data.subject,
      html: data.content,
    };
    await sgMail.send(msg);
  } catch (exec) {
    logger.error('ERROR > SENDING_MAIL > ', exec);
  }
}

module.exports = sendEmail;