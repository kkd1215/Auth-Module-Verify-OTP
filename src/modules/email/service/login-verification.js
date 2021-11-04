const _ = require('lodash');

const Sendgrid = require('../../../lib/sendgrid');
const logger = require('../../../lib/logger');

const subject = 'Login Verification';

async function loginVerification(inputData) {
  try {
    const { data } = inputData;
    const content = `Verification Code: ${_.get(data, 'user.loginOtp')}`;

    const emailData = {
      to: _.get(data, 'user.email'),
      subject,
      content,
    };

    await Sendgrid.sendEmail(emailData);
  } catch (exec) {
    logger.error('ERROR > LOGIN_VERIFICATION > ', exec);
  }
}

module.exports = loginVerification;