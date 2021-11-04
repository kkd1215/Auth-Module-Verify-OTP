const EventEmitter = require('events');

class MyEmitter extends EventEmitter { }
const service = new MyEmitter();

const logger = require('../../../lib/logger');

const loginVerification = require('./login-verification');

service.on('trigger', inputData => {
  switch (inputData.type) {
    case 'LOGIN_VERIFICATION':
      loginVerification(inputData);
      break;
    default:
      logger.error('INVALID EMAIL TRIGGER > ', inputData);
      break;
  }
});

module.exports = service;