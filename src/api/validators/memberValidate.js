// External module imports
const { body, param, query } = require('express-validator');

// Internal module imports
const {
  isMembernameTaken,
  isObjectId,
  isInRoles,
} = require('./customValidator');

const createMember = [
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
    .custom((value) => !value.includes(' '))
    .withMessage('No spaces are allowed in the ID')
    .isAlphanumeric('en-US', { ignore: ' -' })
    .withMessage('ID must not contain anything other than alphanumeric characters')
    .trim()
    .escape()
    .custom(isMembernameTaken),
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
  body('role').custom(isInRoles).trim().escape(),
];

const getMembers = [
  query('search').optional().notEmpty().trim().escape(),
  query('name').optional().notEmpty().isIn(['asc', 'desc']).trim().escape(),
  query('role').optional().notEmpty().isIn(['asc', 'desc']).trim().escape(),
  query('offset').optional().isInt({ min: 0, allow_leading_zeroes: false }),
  query('page').optional().isInt({ gt: 0, allow_leading_zeroes: false }),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 30, allow_leading_zeroes: false }),
  query('include_metadata').optional().isBoolean(),
];

const getMember = param('memberId').custom(isObjectId);

const updateMember = [
  param('memberId').custom(isObjectId),
  body('name')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Name is required')
    .isAlpha('en-US', { ignore: ' -' })
    .withMessage('Name must not contain anything other than alphabet')
    .trim()
    .escape(),
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password is required and must be at least 8 characters long')
    .isStrongPassword()
    .withMessage(
      'Password should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol'
    ),
  body('phone')
    .optional()
    .notEmpty()
    .withMessage('Phone number is required')
    .isMobilePhone(['en-US', 'bn-BD'], { strictMode: true }),
  body('role').optional().custom(isInRoles).trim().escape(),
  body('isActive').optional().isBoolean().trim().escape(),
];

const deleteMember = param('memberId').custom(isObjectId);

// Module exports
module.exports = {
  createMember,
  getMembers,
  getMember,
  updateMember,
  deleteMember,
};
