const HTTPStatus = require('http-status');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const { model: UserModel } = require('../../user');
const { model: AccessTokenModel } = require('../../access-token');
const APIError = require('../../../lib/api-error');

const config = require('../../../config');

const logger = require('../../../lib/logger');

const createLoginToken = async userData => {
  const token = jwt.sign(userData, config.jwtSecret, { expiresIn: '1d' });
  const tokenData = {
    userId: userData.id.toString(),
    token,
    expiry: moment().add(24, 'hours').toISOString(),
  };
  try {
    const loginToken = await AccessTokenModel.create(tokenData);
    return loginToken;
  } catch (err) {
    logger.error('EXEC > CREATE_LOGIN_TOKEN > ', err);
    throw err;
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { body: { otp, token } } = req;

    let userInstance = await UserModel.findOne({
      loginOtp: otp,
      loginToken: token,
    });

    if (!userInstance) {
      const error = new APIError('Invalid OTP', HTTPStatus.FORBIDDEN);
      return next(error);
    }

    if (userInstance.isDisabled) {
      const err = new APIError('Your account has been disabled! Pleasae contact admin support.', HTTPStatus.FORBIDDEN);
      return next(err);
    }

    userInstance.loginOtp = null;
    userInstance.loginToken = null;
    userInstance.lastLogin = moment().toISOString();
    userInstance = await userInstance.save();

    const userData = _.pick(userInstance, ['id']);
    userData.createdAt = moment().toISOString();

    const loginToken = await createLoginToken(userData);

    const resp = {
      loginToken: loginToken.token,
      user: userInstance,
    };

    return res.status(HTTPStatus.OK).json(resp);
  } catch (err) {
    logger.error('ERROR > AUTH_LOGIN > ', err);
    return next(err);
  }
};

module.exports = verifyOtp;