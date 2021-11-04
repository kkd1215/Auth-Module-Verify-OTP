const HTTPStatus = require('http-status');
const APIError = require('../lib/api-error');

const isAuthenticated = async (req, res, next) => {
  if (req.isAuthenticated && req.user) {
    return next();
  }
  const err = new APIError('Unauthenticated', HTTPStatus.UNAUTHORIZED);
  return next(err);
};

module.exports = isAuthenticated;