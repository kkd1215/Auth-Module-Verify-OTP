const jwt = require('jsonwebtoken');
const HTTPStatus = require('http-status');

const { model: AccessTokenModel } = require('../modules/access-token');

const config = require('../config');
const APIError = require('../lib/api-error');
const logger = require('../lib/logger');

const authentication = async (req, res, next) => {
  let token = req.get('Authorization') || req.get('authorization') || req.query.access_token;
  if (!token) {
    req.isAuthenticated = false;
    return next();
  }
  if (typeof token === 'string') {
    token = token.replace('Bearer ', '');
  }
  try {
    const filter = {
      token,
    };
    const accessToken = await AccessTokenModel.findOne(filter).populate('user');
    if (!accessToken) {
      req.isAuthenticated = false;
      return next();
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    req.accessToken = {
      token,
      data: decoded || {},
      obj: accessToken,
    };
    req.user = accessToken.user;
    req.isAuthenticated = true;
    return next();
  } catch (exec) {
    let message = 'Unauthorized!';
    if (exec.message && exec.message.indexOf('expired') > -1) {
      message = 'Your session has expired. Please login again!';
    }
    logger.error('EXEC > INVALID_TOKEN > ', exec);
    const err = new APIError(message, HTTPStatus.UNAUTHORIZED);
    return next(err);
  }
};

module.exports = authentication;