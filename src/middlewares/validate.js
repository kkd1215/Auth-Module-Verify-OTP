const { validationResult } = require('express-validator');
const HTTPStatus = require('http-status');
const APIError = require('../lib/api-error');

// sequential processing, stops running validations chain if the previous one have failed.
const validate = validations => async (req, res, next) => {
  for (const validation of validations) {
    const result = await validation.run(req);
    if (!result.isEmpty()) break;
  }
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return next(new APIError(`${errors.array()[0].param} - ${errors.array()[0].msg}`, HTTPStatus.BAD_REQUEST));
};

module.exports = validate;