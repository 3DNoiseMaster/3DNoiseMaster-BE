// Internal module imports
const jwt = require('jsonwebtoken');
const { SuccessResponse } = require('../utils');
const { asyncHandler } = require('../utils').common;
const { memberService } = require('../services');
const { jwtSecret } = require('../../config/config'); // secret key를 config 파일에서 가져옵니다.
const { httpStatus, httpMessage } = require('../../config/custom-http-status');

/**
 * @desc Register member
 * @route POST /api/v1/auth/register
 * @access Public
 */
const register = asyncHandler(async (req, res, next) => {
  const { name, phoneNumber, memberName, password } = req.body;
  const newMember = await memberService.createMember({ name, phoneNumber, memberName, password });
  res.status(httpStatus.CREATED).json(
    new SuccessResponse(httpStatus.CREATED, httpMessage[httpStatus.CREATED], {
      member: newMember,
    })
  );
});

/**
 * @desc Login member
 * @route POST /api/v1/auth/login
 * @access Public
 */
const login = asyncHandler(async (req, res, next) => {
  const { memberName, password } = req.body;
  const member = await memberService.loginMember(memberName, password);
  if (!member) {
    return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Invalid memberName or password' });
  }
  const payload = { sub: member.id, type: 'ACCESS' };
  const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
  res.status(httpStatus.OK).json({ message: 'Member login', token });
});

/**
 * @desc Logout member
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
