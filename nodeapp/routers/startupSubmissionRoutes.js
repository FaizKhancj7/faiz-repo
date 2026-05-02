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

router.post(
    '/create', 
    validateToken, 
    checkRole('Entrepreneur'), 
    upload.single('pitchDeckFile'), 
    submissionController.createSubmission
);

router.get(
    '/my-submissions',
    validateToken,
    checkRole('Entrepreneur'),
    submissionController.getEntrepreneurSubmissions
);

router.delete(
    '/delete/:id',
    validateToken,
    checkRole('Entrepreneur'),
    submissionController.deleteEntrepreneurSubmission
);

router.put(
    '/:id/withdraw',
    validateToken,
    checkRole('Entrepreneur'),
    submissionController.withdrawSubmission
);

// --- MENTOR ROUTES ---

router.get(
    '/all',
    validateToken,
    checkRole('Mentor'),
    submissionController.getMentorSubmissions
);

router.put(
    '/status/:id',
    validateToken,
    checkRole('Mentor'),
    submissionController.updateSubmissionStatus
);

router.put(
    '/:id/reject',
    validateToken,
    checkRole('Mentor'),
    submissionController.rejectSubmission
);

router.delete(
    '/delete/:id',
    validateToken,
    checkRole('Mentor'),
    submissionController.deleteSubmission
);

module.exports = router;
