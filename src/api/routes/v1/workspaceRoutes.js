// External module imports
const express = require('express');
const passport = require('passport');
const workspaceController = require('../../controllers/workspaceController');
const { authorizeAccessToken } = require('../../middlewares/authentication/auth');
const multer = require('multer');

const router = express.Router();

// multer 설정
const upload = multer({ dest: 'uploadsOBJ/' }); // 업로드 디렉토리를 지정

// Protect all routes under workspace with JWT authentication
router.use(authorizeAccessToken);

router.get('/tasks', workspaceController.getTasks);
router.get('/tasks/count', workspaceController.getTaskCount);
router.get('/tasks/download', workspaceController.downloadTasks);
router.delete('/tasks/delete', workspaceController.deleteTask);

// 파일 업로드 미들웨어 추가
router.post('/request/noiseGen', upload.single('file'), workspaceController.requestNoiseGeneration);
router.post('/request/noiseRem', upload.single('file'), workspaceController.requestNoiseRemoval);
router.post('/request/errorComp', upload.fields([{ name: 'file1' }, { name: 'file2' }]), workspaceController.requestErrorComparison);

// Module exports
module.exports = router;
