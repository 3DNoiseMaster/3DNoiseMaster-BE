// External module imports
const express = require('express');
const passport = require('passport');
const userController = require('../../controllers/userController');
const authController = require('../../controllers/authController');

const router = express.Router();

router.post('/signup', authController.register);
router.post('/login', authController.login);
router.get('/login/status', passport.authenticate('jwt_access', { session: false }), userController.loginStatus);
router.delete('/logout', passport.authenticate('jwt_access', { session: false }), authController.logout);

// Module exports
module.exports = router;
