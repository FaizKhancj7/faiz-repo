/**
 * StartupProfile Routes
 * This file defines the endpoints for managing and browsing startup opportunity profiles.
 */

const express = require('express');
const router = express.Router();

// Import the controller logic
const startupController = require('../controllers/startupProfileController');

// Import authentication and authorization middleware
const { validateToken, checkRole } = require('../authUtils');

/**
 * MENTOR ROUTES
 * These routes are strictly for users with the 'Mentor' role.
 */

router.post(
    '/create', 
    validateToken, 
    checkRole('Mentor'), 
    startupController.createProfile
);

router.put(
    '/update/:id', 
    validateToken, 
    checkRole('Mentor'), 
    startupController.updateProfile
);

router.delete(
    '/delete/:id', 
    validateToken, 
    checkRole('Mentor'), 
    startupController.deleteProfile
);

router.get(
    '/all', 
    validateToken, 
    startupController.getAllProfiles
);

module.exports = router;
