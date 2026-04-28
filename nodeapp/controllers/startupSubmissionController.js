/**
 * startupSubmissionController.js
 * This controller handles the business logic for startup idea submissions.
 * It follows the PRD requirements for Entrepreneur submissions.
 */

const StartupSubmission = require('../models/StartupSubmission');
const StartupProfile = require('../models/StartupProfile');

/**
 * createSubmission
 * This function allows an Entrepreneur to submit a startup idea for a specific Mentor profile.
 * It saves the form data and the path to the uploaded pitch deck.
 */
exports.createSubmission = async (req, res) => {
    try {
        // We extract the fields from the request body
        const { 
            startupProfileId, 
            marketPotential, 
            launchYear, 
            expectedFunding, 
            address 
        } = req.body;

        // --- 1. VALIDATION ---
        
        // We check if the target startup profile actually exists
        const profile = await StartupProfile.findById(startupProfileId);
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Target startup profile not found.",
                data: {}
            });
        }

        // --- 1.1 FUNDING VALIDATION ---
        // Expected funding cannot exceed the mentor's funding limit
        if (Number(expectedFunding) > profile.fundingLimit) {
            return res.status(400).json({
                success: false,
                message: `Expected funding cannot exceed the mentor's limit of ₹${profile.fundingLimit.toLocaleString()}`,
                data: {}
            });
        }

        // We check if a file was uploaded by multer
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Validation failed: Pitch deck (PDF) is mandatory.",
                data: {}
            });
        }

        // --- 2. DATABASE SAVING ---

        // We create a new submission instance
        // userId and userName come from the validateToken middleware
        const newSubmission = new StartupSubmission({
            userId: req.user.id,
            userName: req.user.userName,
            startupProfileId,
            marketPotential,
            launchYear,
            expectedFunding,
            address,
            pitchDeckFile: req.file.path // Store the path where multer saved the file
        });

        // We save the submission to MongoDB
        // The unique index in the model will prevent duplicate submissions
        const savedSubmission = await newSubmission.save();

        // --- 3. SUCCESS RESPONSE ---
        res.status(201).json({
            success: true,
            message: "Startup idea submitted successfully!",
            data: savedSubmission
        });

    } catch (error) {
        // If there's a duplicate submission error (Mongo error code 11000)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "You have already submitted an idea for this opportunity.",
                data: {}
            });
        }

        // For any other server error
        console.error("Create Submission Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong on the server: " + error.message,
            data: {}
        });
    }
};

/**
 * getMentorSubmissions
 * Fetches all submissions linked to the profiles created by the logged-in Mentor.
 * Features: Pagination (10/page), Filter by status, Sort by date.
 */
exports.getMentorSubmissions = async (req, res) => {
    try {
        // 1. Pagination setup (10 records per page as requested)
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        // 2. Fetch all profiles owned by this Mentor to filter submissions
        const mentorProfiles = await StartupProfile.find({ mentorId: req.user.id }).select('_id');
        const profileIds = mentorProfiles.map(p => p._id);

        // 3. Build Query (filter by status and owner profiles)
        const query = { startupProfileId: { $in: profileIds } };
        if (req.query.status) {
            query.status = Number(req.query.status);
        }

        // 4. Sort (default to newest first)
        const order = req.query.order === 'asc' ? 1 : -1;

        // 5. Execute Fetch with Population
        const submissions = await StartupSubmission.find(query)
            .populate('startupProfileId', 'category') // To show the 'Startup Name/Category'
            .sort({ submissionDate: order })
            .skip(skip)
            .limit(limit);

        // 6. Get total count for pagination metadata
        const totalRecords = await StartupSubmission.countDocuments(query);

        res.status(200).json({
            success: true,
            message: "Mentor submissions fetched successfully.",
            data: submissions,
            pagination: {
                currentPage: page,
                pageSize: limit,
                totalRecords,
                totalPages: Math.ceil(totalRecords / limit)
            }
        });

    } catch (error) {
        console.error("Get Mentor Submissions Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch submissions: " + error.message,
            data: {}
        });
    }
};

/**
 * updateSubmissionStatus
 * Allows a Mentor to Shortlist (2) or Reject (3) a submission.
 * Verifies that the submission belongs to a profile owned by the Mentor.
 */
exports.updateSubmissionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status code
        if (![2, 3].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Use 2 (Shortlist) or 3 (Reject).",
                data: {}
            });
        }

        // Find the submission and populate the profile to check ownership
        const submission = await StartupSubmission.findById(id).populate('startupProfileId');
        
        if (!submission) {
            return res.status(404).json({
                success: false,
                message: "Submission not found.",
                data: {}
            });
        }

        // Security Check: Does the Mentor own the profile this submission was sent to?
        if (submission.startupProfileId.mentorId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Access Denied: You do not own the profile for this submission.",
                data: {}
            });
        }

        // Update and save
        submission.status = status;
        await submission.save();

        res.status(200).json({
            success: true,
            message: `Submission status updated to ${status === 2 ? 'Shortlisted' : 'Rejected'}.`,
            data: submission
        });

    } catch (error) {
        console.error("Update Status Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to update status: " + error.message,
            data: {}
        });
    }
};

/**
 * deleteSubmission
 * Allows a Mentor to delete a submission received for their profiles.
 */
exports.deleteSubmission = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the submission first to verify ownership
        const submission = await StartupSubmission.findById(id).populate('startupProfileId');
        
        if (!submission) {
            return res.status(404).json({
                success: false,
                message: "Submission not found.",
                data: {}
            });
        }

        // Security Check
        if (submission.startupProfileId.mentorId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Access Denied: Cannot delete submission from another mentor's profile.",
                data: {}
            });
        }

        await StartupSubmission.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Submission deleted successfully.",
            data: {}
        });

    } catch (error) {
        console.error("Delete Submission Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to delete submission.",
            data: {}
        });
    }
};

/**
 * getEntrepreneurSubmissions
 * Fetches all submissions made by the logged-in Entrepreneur.
 * Features: Pagination (10/page), Category search (regex), Sort by date.
 */
exports.getEntrepreneurSubmissions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const search = req.query.category || "";

        // Build base query
        const query = { userId: req.user.id };

        // If a category search is provided, we first find matching profile IDs
        if (search) {
            const matchingProfiles = await StartupProfile.find({
                category: { $regex: search, $options: 'i' }
            }).select('_id');
            const profileIds = matchingProfiles.map(p => p._id);
            query.startupProfileId = { $in: profileIds };
        }

        const submissions = await StartupSubmission.find(query)
            .populate({
                path: 'startupProfileId',
                select: 'category description fundingLimit avgEquityExpectation targetIndustry preferredStage mentorId',
                populate: {
                    path: 'mentorId',
                    select: 'userName email'
                }
            })
            .sort({ submissionDate: -1 })
            .skip(skip)
            .limit(limit);

        const totalRecords = await StartupSubmission.countDocuments(query);

        res.status(200).json({
            success: true,
            message: "Your submissions fetched successfully.",
            data: submissions,
            pagination: {
                currentPage: page,
                pageSize: limit,
                totalRecords,
                totalPages: Math.ceil(totalRecords / limit)
            }
        });
    } catch (error) {
        console.error("Get Entrepreneur Submissions Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch your submissions: " + error.message,
            data: {}
        });
    }
};

/**
 * deleteEntrepreneurSubmission
 * Allows an Entrepreneur to delete their own submission.
 */
exports.deleteEntrepreneurSubmission = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the submission
        const submission = await StartupSubmission.findById(id);
        
        if (!submission) {
            return res.status(404).json({
                success: false,
                message: "Submission not found.",
                data: {}
            });
        }

        // Security Check: Only the owner can delete
        if (submission.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Access Denied: You can only delete your own submissions.",
                data: {}
            });
        }

        await StartupSubmission.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Submission removed successfully.",
            data: {}
        });

    } catch (error) {
        console.error("Delete Entrepreneur Submission Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to delete submission.",
            data: {}
        });
    }
};
