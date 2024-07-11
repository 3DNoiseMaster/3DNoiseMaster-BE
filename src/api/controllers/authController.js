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
    return next(new ErrorResponse(httpStatus.UNAUTHORIZED, httpMessage['InvalidLogin']));
  }
  res.status(httpStatus.OK).json({ message: httpMessage['userLogged_in'], username: loginResult.user.username, token: loginResult.token });
});

/**
 * @desc Check login status
 * @route GET /api/v1/auth/status
 * @access Private
 */
const loginStatus = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return next(new ErrorResponse(httpStatus.UNAUTHORIZED, httpMessage['userNotLogged_in']));
  }

  const user = await authService.checkLoginStatus(token);
  if (!user) {
    return next(new ErrorResponse(httpStatus.UNAUTHORIZED, httpMessage['userNotLogged_in']));
  }

  res.status(httpStatus.OK).json(
    new SuccessResponse(httpStatus.OK, httpMessage['userLogged_in'], {
      user,
    })
  );
});

module.exports = {
  register,
  login,
  loginStatus,
};
