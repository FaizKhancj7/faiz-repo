// This file handles the routing for user-related actions.
// It maps the URL paths to the correct functions in the controller.

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateToken } = require('../authUtils');

/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userName, email, mobile, password, confirmPassword, role, secretQuestionAnswer]
 *             properties:
 *               userName:
 *                 type: string
 *               email:
 *                 type: string
 *               mobile:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [Entrepreneur, Mentor]
 *               secretQuestionAnswer:
 *                 type: string
 */
router.post('/signup', userController.signup);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login to an existing account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Logout of the current session
 *     tags: [Authentication]
 */
router.post('/logout', userController.logout);

/**
 * @swagger
 * /user/verify:
 *   get:
 *     summary: Verify the current session token
 *     tags: [Authentication]
 */
router.get('/verify', validateToken, userController.verifyUser);

/**
 * @swagger
 * /user/forgotPassword:
 *   post:
 *     summary: Reset password using secret question
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, secretQuestionAnswer, newPassword, confirmNewPassword]
 *             properties:
 *               email:
 *                 type: string
 *               secretQuestionAnswer:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmNewPassword:
 *                 type: string
 */
router.post('/forgotPassword', userController.forgotPassword);

module.exports = router;