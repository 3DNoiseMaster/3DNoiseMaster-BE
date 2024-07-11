// External module imports
const express = require('express');
const { authorizeAccessToken } = require('../../middlewares/authentication/auth');
const userController = require('../../controllers/userController');
const authController = require('../../controllers/authController');

const router = express.Router();

router.post('/signup', authController.register);
router.post('/login', authController.login);
router.get('/login/status', authorizeAccessToken, authController.loginStatus);

// Module exports
module.exports = router;
