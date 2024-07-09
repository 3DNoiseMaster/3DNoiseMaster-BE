// External module imports
const { body, query } = require('express-validator');

// Internal module imports
const {
  isUsernameTaken,
} = require('./customValidator');

const login = [
  body('id')
    .notEmpty()
    .withMessage('ID is required')
    .trim()
    .escape(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password is required and must be at least 8 characters long')
    .isStrongPassword()
    .withMessage(
      'Password should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol'
    ),
];

const register = [
  body('name')
    .isLength({ min: 1 })
    .withMessage('Name is required')
    .isAlpha('en-US', { ignore: ' -' })
    .withMessage('Name must not contain anything other than alphabet')
    .trim()
    .escape(),
  body('id')
    .isLength({ min: 1 })
    .withMessage('ID is required')
    .custom((id) => !id.includes(' '))
    .withMessage('No spaces are allowed in the ID')
    .isAlphanumeric('en-US', { ignore: ' -' })
    .withMessage('ID must not contain anything other than alphanumeric characters')
    .trim()
    .escape()
    .custom(isUsernameTaken),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password is required and must be at least 8 characters long')
    .isStrongPassword()
    .withMessage(
      'Password should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol'
    ),
  body('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .isMobilePhone(['en-US', 'bn-BD'], { strictMode: true }),
];

const forgotPassword = body('id')
  .notEmpty()
  .withMessage('ID is required')
  .trim()
  .escape();

const resetPassword = [
  query('token')
    .notEmpty()
    .withMessage('Token is required')
    .isJWT()
    .withMessage('Invalid token'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password is required and must be at least 8 characters long')
    .isStrongPassword()
    .withMessage(
      'Password should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol'
    ),
];

// Module exports
module.exports = {
  login,
  register,
  forgotPassword,
  resetPassword,
};
