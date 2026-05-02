// This file handles the routing for user-related actions.
// It maps the URL paths to the correct functions in the controller.

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateToken } = require('../authUtils');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/verify', validateToken, userController.verifyUser);
router.post('/forgotPassword', userController.forgotPassword);

module.exports = router;