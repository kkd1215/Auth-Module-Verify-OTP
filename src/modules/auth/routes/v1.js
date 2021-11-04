const express = require('express');
const {
  body,
} = require('express-validator');

const middlewares = require('../../../middlewares');
const Controller = require('../controllers');

const router = express.Router();

const paramValidation = {
  login: [
    body('email')
      .exists().withMessage('is required')
      .isEmail()
      .withMessage('invalid email')
      // .matches((/@(starbucks\.com$|appmastery\.co$|4sconsult\.com$|appmaster\.ca$)/)) FOR specific domains
      .withMessage('invalid email'),
  ],
  verifyOtp: [
    body('token')
      .exists().withMessage('is required')
      .isString()
      .withMessage('invalid token'),
    body('otp')
      .exists().withMessage('is required')
      .isLength({ min: 6, max: 6 })
      .isString()
      .withMessage('invalid otp'),
  ],
};

router.get('/url', (req, res) => {
  res.status(200).send(`OK - ${req.baseUrl}`);
});

/** POST /api/auth/login - Login API */
router.route('/login')
  .post(middlewares.validate(paramValidation.login),
    Controller.login,
  );

/** POST /api/auth/verify-otp - Verify OTP */
router.route('/verify-otp')
  .post(middlewares.validate(paramValidation.verifyOtp),
    Controller.verifyOtp,
  );

module.exports = router;