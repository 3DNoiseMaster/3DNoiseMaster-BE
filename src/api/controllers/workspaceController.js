// Internal module imports
const { SuccessResponse, ErrorResponse } = require('../utils');
const { asyncHandler } = require('../utils').common;
const { workspaceService } = require('../services');
const { httpStatus, httpMessage } = require('../../config/custom-http-status');

/**
 * @desc Get workspace tasks
 * @route GET /api/v1/workspace/tasks
 * @access Private
 */
// 차후 양이 많아질 것을 대비해 Page로 나누어야할것
const getTasks = asyncHandler(async (req, res, next) => {
  const tasks = await workspaceService.getTasks(req.user.user_id);
  res.status(httpStatus.OK).json(new SuccessResponse(httpStatus.OK, httpMessage[httpStatus.OK], { tasks }));
});

/**
 * @desc Get workspace task
 * @route GET /api/v1/workspace/tasks/check
 * @access Private
 */
const getCheckTask = asyncHandler(async (req, res, next) => {
  const { task_id } = req.query;

  if (!task_id) {
    return next(new ErrorResponse(httpStatus.BAD_REQUEST, 'Task ID is required'));
  }

  const task = await workspaceService.getTaskOne(req.user.user_id, task_id);
  if (!task) {
    return next(new ErrorResponse(httpStatus.UNAUTHORIZED, 'Invalid task request'));
  }

  res.status(httpStatus.OK).json(new SuccessResponse(httpStatus.OK, 'Task retrieved successfully', { task }));
});

/**
 * @desc Get task count
 * @route GET /api/v1/workspace/tasks/count
 * @access Private
 */
const getTaskCount = asyncHandler(async (req, res, next) => {
  const count = await workspaceService.getTaskCount(req.user.user_id);
  res.status(httpStatus.OK).json(new SuccessResponse(httpStatus.OK, httpMessage[httpStatus.OK], { count }));
});

/**
 * @desc Download tasks
 * @route GET /api/v1/workspace/tasks/download
 * @access Private
 */
const downloadTasks = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const { task_id } = req.query;
  const threed = await workspaceService.downloadTasks(user.user_id, task_id);
  const taskName = await workspaceService.getTaskNameById(user.user_id, task_id);
  if (!threed || !taskName) {
    return next(new ErrorResponse(httpStatus.UNAUTHORIZED, httpMessage['InvalidFileRequest']));
  }
  const encodedFileName = encodeURIComponent(`${taskName}_result.obj`);
  res.setHeader('Content-Disposition', `attachment; filename=${encodedFileName}.obj`);
  res.setHeader('Content-Type', 'application/x-obj');
  res.send(threed);
});

/**
 * @desc Delete a task
 * @route DELETE /api/v1/workspace/tasks/delete
 * @access Private
 */
const deleteTask = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const { task_id } = req.query;
  const result = await workspaceService.deleteTask(user.user_id, task_id);
  if (result.status == 404) {
    return next(new ErrorResponse(httpStatus.NOT_FOUND, httpMessage[httpStatus.NOT_FOUND]));
  }
  res.status(httpStatus.OK).json(new SuccessResponse(httpStatus.OK, '작업물이 성공적으로 삭제되었습니다.'));
});

/**
 * @desc Request noise removal
 * @route POST /api/v1/workspace/request/noiseRem
 * @access Private
 */
const requestNoiseRemoval = asyncHandler(async (req, res, next) => {
  const data = {
    task_name: req.body.task_name,
    file: req.file.buffer, 
  };
  const result = await workspaceService.requestNoiseRemoval(req.user.user_id, data);
  res.status(httpStatus.CREATED).json(
    new SuccessResponse(httpStatus.CREATED, httpMessage[httpStatus.CREATED], {
      message : "잡음 제거 요청이 성공적으로 처리되었습니다.",
      task_id: result.task_id
    })
  );
});

/**
 * @desc Request noise generation
 * @route POST /api/v1/workspace/request/noiseGen
 * @access Private
 */
const requestNoiseGeneration = asyncHandler(async (req, res, next) => {
  const data = {
    task_name: req.body.task_name,
    noiseType: req.body.noiseType,
    noiseLevel: req.body.noiseLevel,
    file: req.file.buffer, 
  };
  const result = await workspaceService.requestNoiseGeneration(req.user.user_id, data);
  res.status(httpStatus.CREATED).json(
    new SuccessResponse(httpStatus.CREATED, httpMessage[httpStatus.CREATED], {
      message : "잡음 생성 요청이 성공적으로 처리되었습니다.",
      task_id: result.task_id
    })
  );
});

/**
 * @desc Request error comparison
 * @route POST /api/v1/workspace/request/errorComp
 * @access Private
 */
const requestErrorComparison = asyncHandler(async (req, res, next) => {
  const data = {
    task_name: req.body.task_name,
    file1: req.files.file1[0].buffer,
    file2: req.files.file2[0].buffer, 
  };
  const result = await workspaceService.requestErrorComparison(req.user.user_id, data);
  res.status(httpStatus.CREATED).json(
    new SuccessResponse(httpStatus.CREATED, httpMessage[httpStatus.CREATED], {
      message : "오차율 비교 요청이 성공적으로 처리되었습니다.",
      task_id: result.task_id
    })
  );
});

// Module exports
module.exports = {
  getTasks,
  getCheckTask,
  getTaskCount,
  downloadTasks,
  deleteTask,
  requestNoiseRemoval,
  requestNoiseGeneration,
  requestErrorComparison,
};
