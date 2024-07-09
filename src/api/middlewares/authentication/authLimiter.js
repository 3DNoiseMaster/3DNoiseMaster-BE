// External module imports
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

// Internal module imports
const { ErrorResponse } = require('../../utils');

const windowMs = 15 * 60 * 1000; // 15 minutes
const maxRequests = 100; // Limit each IP to 100 requests per `window` (here, per 15 minutes)

const rateLimiter = rateLimit({
  windowMs,
  max: maxRequests,
  handler: (req, res, next, options) => {
    const { statusCode, message } = options;
    res.locals.errorMessage = message;
    next(new ErrorResponse(statusCode, message));
  },
});

const speedLimiter = slowDown({
  windowMs,
  delayAfter: maxRequests,
  delayMs: 500, // begin adding 500ms of delay per request above 100:
});

// Module exports
module.exports = [rateLimiter, speedLimiter];
