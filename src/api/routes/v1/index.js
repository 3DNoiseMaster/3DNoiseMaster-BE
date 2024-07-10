// External module imports
const express = require('express');

// Internal module imports
const { httpStatus } = require('../../../config/custom-http-status');
const { authLimiter, slowDownMiddleware } = require('../../middlewares/authentication/authLimiter'); // authLimiter 수정
const { SuccessResponse } = require('../../utils');

const displayRoutes = require('./displayRoutes');
const userRoutes = require('./userRoutes');
const workspaceRoutes = require('./workspaceRoutes');

const router = express.Router();

// mount display routes
router.use('/display', displayRoutes);

// mount user routes with authLimiter and slowDownMiddleware
router.use('/user', authLimiter, slowDownMiddleware, userRoutes);

// mount workspace routes
router.use('/workspace', workspaceRoutes);

router.get('/ping', (req, res, next) => {
  res.status(httpStatus.OK).json(new SuccessResponse(httpStatus.OK, 'Pong!!'));
});

// Module exports
module.exports = router;
