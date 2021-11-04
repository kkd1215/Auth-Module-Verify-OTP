const authentication = require('./authentication');
const isAuthenticated = require('./is-authenticated');
const validate = require('./validate');

const middlewares = {
  authentication,
  isAuthenticated,
  validate,
};

module.exports = middlewares;