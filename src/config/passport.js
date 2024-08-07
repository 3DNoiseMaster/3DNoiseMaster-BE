// External module imports
const { Strategy, ExtractJwt } = require('passport-jwt');

// Internal module imports
const { User } = require('../api/models');
const config = require('./config');
const { tokenTypes } = require('./tokens');

// Custom token extractor from cookies
const cookieExtractor = {};
const jwtOptions = {};
const jwtStrategy = {};

const defaultOptions = {
  issuer: config.jwt.issuer,
  algorithm: 'HS384',
};

/**
 * Custom Extractors
 */
cookieExtractor.ACCESS = function (req) {
  let token = null;
  if (req && req.cookies && req.cookies.tokens) {
    token = req.cookies.tokens['access_token'];
  }
  return token;
};

/**
 * JWT Strategy Options
 */
jwtOptions.ACCESS = {
  ...defaultOptions,
  secretOrKey: config.jwt.accessSecret,
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    cookieExtractor.ACCESS,
  ]),
};

/**
 * JWT Strategy
 */
jwtStrategy.ACCESS = new Strategy(
  jwtOptions.ACCESS,
  async (jwtPayload, done) => {
    try {
      // Check if the token type is 'ACCESS'
      if (jwtPayload.type === tokenTypes.ACCESS) {
        const user = await User.findById(jwtPayload.id);
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      }
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  }
);
// Module exports
module.exports = (passport) => {
  passport.use('jwt_access', jwtStrategy.ACCESS);
};
