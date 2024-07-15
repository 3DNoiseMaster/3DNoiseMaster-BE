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
  return (err, user, info) => {
    if (err) {
      console.log('Authentication error:', err); // 에러 로그
      return reject(new ErrorResponse(httpStatus.UNAUTHORIZED, httpMessage[httpStatus.UNAUTHORIZED]));
    }
    if (!user) {
      console.log('No user found:', info); // 사용자 없음 로그
      return reject(new ErrorResponse(httpStatus.UNAUTHORIZED, httpMessage[httpStatus.UNAUTHORIZED]));
    }
    console.log('User authenticated:', user); // 인증된 사용자 로그
    req.user = user;
    resolve();
  };
};

/**
 * Authentications
 */
const authorizeAccessToken = (req, res, next) => {
  console.log("Authorization header:", req.headers.authorization); // 토큰요청 확인 로그
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