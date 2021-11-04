const randomstring = require('randomstring');
const httpStatus = require('http-status');

const { service: EmailService } = require('../../email');
const { model: UserModel } = require('../../user');

const logger = require('../../../lib/logger');

const login = async (req, res, next) => {
  try {
    const { body: { email } } = req;
    
    const loginOtp = randomstring.generate({
      length: 6,
      charset: 'numeric',
    })

    const loginToken = randomstring.generate({
      length: 32,
    });

    let userInstance = await UserModel.findOne({
      email,
      deletedAt: null,
    });

    if (!userInstance) {
      userInstance = await UserModel.create({
        email,
        loginOtp,
        loginToken,
      });
    } else {
      userInstance.loginOtp = loginOtp;
      userInstance.loginToken = loginToken;
      userInstance = await userInstance.save();
    }

    // TRIGGER LOGIN VERIFICATION EMAIL
    EmailService.emit('trigger', {
      type: 'LOGIN_VERIFICATION',
      data: {
        user: userInstance,
      },
    });
    
    return res.status(httpStatus.OK).json({
      message: 'OTP has been sent to your email!',
      token: loginToken,
    });
    
  } catch (err) {
    logger.error('ERROR > AUTH_LOGIN > ', err);
    return next(err);
  }
};

module.exports = login;