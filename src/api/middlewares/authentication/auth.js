// External module imports
const passport = require('passport');

// Internal module imports
const config = require('../../../config/config');
const { httpStatus, httpMessage } = require('../../../config/custom-http-status');
const { ErrorResponse } = require('../../utils');

// callback - object scaffolding
const verifyCallback = {};

/**
 * Callbacks
 */
verifyCallback.ACCESS = (req, resolve, reject) => {
  return (err, member, info) => {
    if (err || !member) {
      return reject(new ErrorResponse(httpStatus.UNAUTHORIZED, httpMessage[httpStatus.UNAUTHORIZED]));
    }
    // set member to request object
    req.member = member;
    resolve();
  };
};

/**
 * Authentications
 */
const authorizeAccessToken = (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt_access', { session: config.jwt.session }, verifyCallback.ACCESS(req, resolve, reject))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

// Module exports
module.exports = {
  authorizeAccessToken,
};
