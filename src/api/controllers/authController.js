// Internal module imports
const jwt = require('jsonwebtoken');
const { SuccessResponse } = require('../utils');
const { asyncHandler } = require('../utils').common;
const { userService } = require('../services');
const { jwtSecret } = require('../../config/config'); // secret key를 config 파일에서 가져옵니다.
const { httpStatus, httpMessage } = require('../../config/custom-http-status');

/**
 * @desc Register user
 * @route POST /api/v1/auth/register
 * @access Public
 */
const register = asyncHandler(async (req, res, next) => {
  const { name, phoneNumber, username, password } = req.body;
  const newUser = await userService.createUser({ name, phoneNumber, username, password });
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
  const { username, password } = req.body;
  const user = await userService.loginUser(username, password);
  if (!user) {
    return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Invalid username or password' });
  }
  const payload = { sub: user.id, type: 'ACCESS' };
  const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
  res.status(httpStatus.OK).json({ message: 'Member login', token });
});

/**
 * @desc Logout user
 * @route DELETE /api/v1/auth/logout
 * @access Private
 */
const logout = asyncHandler(async (req, res, next) => {
  req.logout(); // Passport.js 내장 함수 사용
  res.status(httpStatus.NO_CONTENT).json(new SuccessResponse(httpStatus.NO_CONTENT));
});

// Module exports
module.exports = {
  register,
  login,
  logout,
};
