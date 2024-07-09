// Internal module imports
const { SuccessResponse } = require('../utils');
const { asyncHandler } = require('../utils').common;
const { workspaceService } = require('../services');
const { httpStatus, httpMessage } = require('../../config/custom-http-status');

/**
 * @desc Get workspace tasks
 * @route GET /api/v1/workspace/tasks
 * @access Private
 */
const getTasks = asyncHandler(async (req, res, next) => {
  const tasks = await workspaceService.getTasks(req.member.id);
  res.status(httpStatus.OK).json(new SuccessResponse(httpStatus.OK, httpMessage[httpStatus.OK], { tasks }));
});

/**
 * @desc Get task count
 * @route GET /api/v1/workspace/tasks/count
 * @access Private
 */
const getTaskCount = asyncHandler(async (req, res, next) => {
  const count = await workspaceService.getTaskCount(req.member.id);
  res.status(httpStatus.OK).json(new SuccessResponse(httpStatus.OK, httpMessage[httpStatus.OK], { count }));
});

/**
 * @desc Download tasks
 * @route GET /api/v1/workspace/tasks/download
 * @access Private
 */
const downloadTasks = asyncHandler(async (req, res, next) => {
  const tasks = await workspaceService.downloadTasks(req.member.id);
  res.status(httpStatus.OK).json(new SuccessResponse(httpStatus.OK, httpMessage[httpStatus.OK], { tasks }));
});

/**
 * @desc Request noise removal
 * @route POST /api/v1/workspace/request/noiseRem
 * @access Private
 */
const requestNoiseRemoval = asyncHandler(async (req, res, next) => {
  const data = req.body;
  const result = await workspaceService.requestNoiseRemoval(req.member.id, data);
  res.status(httpStatus.OK).json(new SuccessResponse(httpStatus.OK, httpMessage[httpStatus.OK], { result }));
});

/**
 * @desc Request noise generation
 * @route POST /api/v1/workspace/request/noiseGen
 * @access Private
 */
const requestNoiseGeneration = asyncHandler(async (req, res, next) => {
  const data = req.body;
  const result = await workspaceService.requestNoiseGeneration(req.member.id, data);
  res.status(httpStatus.OK).json(new SuccessResponse(httpStatus.OK, httpMessage[httpStatus.OK], { result }));
});

/**
 * @desc Request error comparison
 * @route POST /api/v1/workspace/request/errorComp
 * @access Private
 */
const requestErrorComparison = asyncHandler(async (req, res, next) => {
  const data = req.body;
  const result = await workspaceService.requestErrorComparison(req.member.id, data);
  res.status(httpStatus.OK).json(new SuccessResponse(httpStatus.OK, httpMessage[httpStatus.OK], { result }));
});

// Module exports
module.exports = {
  getTasks,
  getTaskCount,
  downloadTasks,
  requestNoiseRemoval,
  requestNoiseGeneration,
  requestErrorComparison,
};
