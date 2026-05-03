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

/**
 * @swagger
 * /startup/create:
 *   post:
 *     summary: Create a new startup opportunity profile
 *     tags: [Startup Profiles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [category, description, fundingLimit, avgEquityExpectation, targetIndustry, preferredStage]
 *             properties:
 *               category:
 *                 type: string
 *                 enum: [FinTech, GreenTech, EdTech, AI/ML, HealthTech, Retail, Other]
 *               description:
 *                 type: string
 *               fundingLimit:
 *                 type: number
 *               avgEquityExpectation:
 *                 type: number
 *               targetIndustry:
 *                 type: string
 *                 enum: [Energy, Education, Financial Services, Retail, Healthcare, Technology]
 *               preferredStage:
 *                 type: string
 *                 enum: [idea, MVP, pre-revenue, scaling, established]
 */
router.post(
    '/create', 
    validateToken, 
    checkRole('Mentor'), 
    startupController.createProfile
);

/**
 * @swagger
 * /startup/update/{id}:
 *   put:
 *     summary: Update an existing startup profile
 *     tags: [Startup Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the profile to update
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 */
router.put(
    '/update/:id', 
    validateToken, 
    checkRole('Mentor'), 
    startupController.updateProfile
);

/**
 * @swagger
 * /startup/delete/{id}:
 *   delete:
 *     summary: Delete a startup profile
 *     tags: [Startup Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the profile to delete
 */
router.delete(
    '/delete/:id', 
    validateToken, 
    checkRole('Mentor'), 
    startupController.deleteProfile
);

/**
 * @swagger
 * /startup/all:
 *   get:
 *     summary: Get all profiles (Paginated + Searchable)
 *     tags: [Startup Profiles]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search keyword
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 */
router.get(
    '/all', 
    validateToken, 
    startupController.getAllProfiles
);

module.exports = router;
