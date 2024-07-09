// External module imports
const express = require('express');

// Internal module imports
const { httpStatus } = require('../../../config/custom-http-status');
const authLimiter = require('../../middleware/authentication/authLimiter');
const { SuccessResponse } = require('../../utils');

const displayRoutes = require('./displayRoutes');
const memberRoutes = require('./memberRoutes');
const workspaceRoutes = require('./workspaceRoutes');

const router = express.Router();

// mount display routes
router.use('/display', displayRoutes);

// mount member routes
router.use('/member', authLimiter, memberRoutes);

// mount workspace routes
router.use('/workspace', workspaceRoutes);

router.get('/ping', (req, res, next) => {
  res.status(httpStatus.OK).json(new SuccessResponse(httpStatus.OK, 'Pong!!'));
});

// Module exports
module.exports = router;
