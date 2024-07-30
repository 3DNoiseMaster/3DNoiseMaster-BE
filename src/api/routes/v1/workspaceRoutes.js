// External module imports
const express = require('express');
const workspaceController = require('../../controllers/workspaceController');
const { authorizeAccessToken } = require('../../middlewares/authentication/auth');
const { singleFileUpload, multipleFileUpload } = require('../../middlewares/users/threeDFileUpload');

const router = express.Router();

// Protect all routes under workspace with JWT authentication
router.use(authorizeAccessToken);

router.get('/tasks', workspaceController.getTasks);
router.get('/tasks/check', workspaceController.getCheckTask);
router.get('/tasks/count', workspaceController.getTaskCount);
router.get('/tasks/download', workspaceController.downloadTasks);
router.delete('/tasks/delete', workspaceController.deleteTask);

// 파일 업로드 미들웨어 추가
router.post('/request/noiseGen', singleFileUpload, workspaceController.requestNoiseGeneration);
router.post('/request/noiseRem', singleFileUpload, workspaceController.requestNoiseRemoval);
router.post('/request/errorComp', multipleFileUpload, workspaceController.requestErrorComparison);

// Module exports
module.exports = router;
