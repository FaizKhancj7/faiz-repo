/**
 * startupSubmissionRoutes.js
 * This file defines the routes for startup submissions.
 * It includes file upload configuration using Multer and role-based protection.
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Import the controller
const submissionController = require('../controllers/startupSubmissionController');

// Import authentication and authorization middleware
const { validateToken, checkRole } = require('../authUtils');

// --- 1. MULTER CONFIGURATION ---

// We define where the files should be saved and what they should be named
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // We save files in the 'uploads/' folder
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // We name the file using a timestamp to avoid name collisions
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// We create the multer middleware with size limits and storage rules
const upload = multer({ 
    storage: storage,
    limits: { 
        fileSize: 10 * 1024 * 1024 // 10MB maximum file size
    },
    fileFilter: (req, file, cb) => {
        // We only allow PDF files for the pitch deck
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed for the pitch deck.'));
        }
    }
});

// --- 2. ROUTE DEFINITIONS ---

/**
 * @swagger
 * /submission/create:
 *   post:
 *     summary: Submit a new startup pitch idea
 *     tags: [Submissions]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [startupProfileId, marketPotential, launchYear, expectedFunding, address, pitchDeckFile]
 *             properties:
 *               startupProfileId:
 *                 type: string
 *               marketPotential:
 *                 type: number
 *               launchYear:
 *                 type: string
 *                 format: date
 *               expectedFunding:
 *                 type: number
 *               address:
 *                 type: string
 *               pitchDeckFile:
 *                 type: string
 *                 format: binary
 */
router.post(
    '/create', 
    validateToken, 
    checkRole('Entrepreneur'), 
    upload.single('pitchDeckFile'), 
    submissionController.createSubmission
);

/**
 * @swagger
 * /submission/my-submissions:
 *   get:
 *     summary: Get submissions (Entrepreneur view)
 *     tags: [Submissions]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected, withdrawn]
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 */
router.get(
    '/my-submissions',
    validateToken,
    checkRole('Entrepreneur'),
    submissionController.getEntrepreneurSubmissions
);

/**
 * @swagger
 * /submission/delete/{id}:
 *   delete:
 *     summary: Delete an entrepreneur's own submission
 *     tags: [Submissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.delete(
    '/delete/:id',
    validateToken,
    checkRole('Entrepreneur'),
    submissionController.deleteEntrepreneurSubmission
);

/**
 * @swagger
 * /submission/{id}/withdraw:
 *   put:
 *     summary: Withdraw a shortlisted submission
 *     tags: [Submissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reason]
 *             properties:
 *               reason:
 *                 type: string
 */
router.put(
    '/:id/withdraw',
    validateToken,
    checkRole('Entrepreneur'),
    submissionController.withdrawSubmission
);

// --- MENTOR ROUTES ---

/**
 * @swagger
 * /submission/all:
 *   get:
 *     summary: Get all inbound submissions (Mentor view)
 *     tags: [Submissions]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 */
router.get(
    '/all',
    validateToken,
    checkRole('Mentor'),
    submissionController.getMentorSubmissions
);

/**
 * @swagger
 * /submission/status/{id}:
 *   put:
 *     summary: Update submission status (Shortlist)
 *     tags: [Submissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 */
router.put(
    '/status/:id',
    validateToken,
    checkRole('Mentor'),
    submissionController.updateSubmissionStatus
);

/**
 * @swagger
 * /submission/{id}/reject:
 *   put:
 *     summary: Reject submission with mandatory feedback
 *     tags: [Submissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [feedback]
 *             properties:
 *               feedback:
 *                 type: string
 */
router.put(
    '/:id/reject',
    validateToken,
    checkRole('Mentor'),
    submissionController.rejectSubmission
);

/**
 * @swagger
 * /submission/delete/{id}:
 *   delete:
 *     summary: Admin delete a submission
 *     tags: [Submissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.delete(
    '/delete/:id',
    validateToken,
    checkRole('Mentor'),
    submissionController.deleteSubmission
);

module.exports = router;
