const { SuccessResponse, ErrorResponse } = require('../utils');
const { asyncHandler } = require('../utils').common;
const authService = require('../services/authService');
const { httpStatus, httpMessage } = require('../../config/custom-http-status');

/**
 * @desc Register user
 * @route POST /api/v1/auth/register
 * @access Public
 */
const register = asyncHandler(async (req, res, next) => {
  const { id, phone, username, password } = req.body;
  const newUser = await authService.registerUser({ id, phone, username, password });
  res.status(httpStatus.CREATED).json(
    new SuccessResponse(httpStatus.CREATED, httpMessage[httpStatus.CREATED], {
      user: newUser,
    })
  );
});

/**
 * @desc Login user
 * @route POST /api/v1/auth/login
 * @access Public
 */
const login = asyncHandler(async (req, res, next) => {
  const { id, password } = req.body;
  const loginResult = await authService.loginUser(id, password);
  if (!loginResult) {
    return next(new ErrorResponse(httpStatus.UNAUTHORIZED, 'Invalid username or password'));
  }
  res.status(httpStatus.OK).json({ message: 'User login', token: loginResult.token });
});

// Module exports
module.exports = {
  register,
  login,
};
