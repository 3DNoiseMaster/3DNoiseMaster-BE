// Internal module imports
const { SuccessResponse } = require('../utils');
const { asyncHandler } = require('../utils').common;
const { httpStatus } = require('../../config/custom-http-status');

/**
 * @desc Get login status
 * @route GET /api/v1/user/login/status
 * @access Private
 */
const loginStatus = asyncHandler(async (req, res, next) => {
  res.status(httpStatus.OK).json(
    new SuccessResponse(httpStatus.OK, 'User login status', {
      user: req.user,
    })
  );
});

// Module exports
module.exports = {
  loginStatus,
};
