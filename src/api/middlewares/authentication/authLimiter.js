const slowDown = require('express-slow-down');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  handler: (req, res, next) => {
    res.status(429).json({
      message: 'Too many requests from this IP, please try again after 15 minutes',
    });
  },
});

const slowDownMiddleware = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 100, // allow 100 requests per 15 minutes, then...
  delayMs: () => 500, // new behavior
  validate: { delayMs: false }, // 경고 메시지 제거
});

module.exports = {
  authLimiter,
  slowDownMiddleware,
};
