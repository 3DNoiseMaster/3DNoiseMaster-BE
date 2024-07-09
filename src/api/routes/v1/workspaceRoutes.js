// External module imports
const express = require('express');
const passport = require('passport');
const workspaceController = require('../../controllers/workspaceController');

const router = express.Router();

// Protect all routes under workspace with JWT authentication
router.use(passport.authenticate('jwt_access', { session: false }));

router.get('/tasks', workspaceController.getTasks);
router.get('/tasks/count', workspaceController.getTaskCount);
router.get('/tasks/download', workspaceController.downloadTasks);
router.post('/request/noiseRem', workspaceController.requestNoiseRemoval);
router.post('/request/noiseGen', workspaceController.requestNoiseGeneration);
router.post('/request/errorComp', workspaceController.requestErrorComparison);

// Module exports
module.exports = router;
