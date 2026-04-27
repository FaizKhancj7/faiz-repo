/**
 * StartupProfile Controller
 * This file handles the logic for creating and retrieving startup opportunity profiles.
 * It strictly follows the rules in PRD Section 5.3.1 and 6.2.
 */

const StartupProfile = require('../models/StartupProfile');

/**
 * createProfile
 * Mentors use this to create a new startup opportunity.
 */
exports.createProfile = async (req, res) => {
    try {
        const { category, description, fundingLimit, avgEquityExpectation, targetIndustry, preferredStage } = req.body;

        // Create a new profile instance
        // We get the mentorId from req.user (populated by validateToken middleware)
        const newProfile = new StartupProfile({
            mentorId: req.user.id,
            category,
            description,
            fundingLimit,
            avgEquityExpectation,
            targetIndustry,
            preferredStage
        });

        // Save to database
        const savedProfile = await newProfile.save();

        // Send success response in the correct PRD shape
        res.status(201).json({
            success: true,
            message: "Startup profile created successfully!",
            data: savedProfile
        });

    } catch (error) {
        // Log the error and send a clear failure response
        console.error("Create Profile Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to create startup profile: " + error.message,
            data: {}
        });
    }
};

/**
 * getAllProfiles
 * Fetches profiles with server-side pagination (20 per page), search, and sort support.
 * Accessible by both Mentors (own) and Entrepreneurs (browsing).
 */
exports.getAllProfiles = async (req, res) => {
    try {
        // 1. PAGINATION SETUP (PRD 6.2)
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;

        // 2. SEARCH LOGIC (PRD 6.3)
        // We use regex for a case-insensitive search across category and description
        const keyword = req.query.keyword || '';
        const searchQuery = keyword 
            ? { 
                $or: [
                    { category: { $regex: keyword, $options: 'i' } },
                    { description: { $regex: keyword, $options: 'i' } },
                    { targetIndustry: { $regex: keyword, $options: 'i' } }
                ] 
              } 
            : {};

        // 3. SORT LOGIC
        // Default sort is newest first, but can be customized
        const sortBy = req.query.sortBy || 'createdAt';
        const order = req.query.order === 'asc' ? 1 : -1;
        const sortOptions = { [sortBy]: order };

        // 4. FETCH DATA
        const profiles = await StartupProfile.find(searchQuery)
            .populate('mentorId', 'userName email')
            .skip(skip)
            .limit(limit)
            .sort(sortOptions);

        // 5. METADATA
        const totalRecords = await StartupProfile.countDocuments(searchQuery);
        const totalPages = Math.ceil(totalRecords / limit);

        // 6. RESPONSE (PRD 6.2)
        res.status(200).json({
            success: true,
            message: "Profiles fetched successfully.",
            data: profiles,
            pagination: {
                currentPage: page,
                pageSize: limit,
                totalRecords: totalRecords,
                totalPages: totalPages
            }
        });

    } catch (error) {
        console.error("Get All Profiles Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch startup profiles.",
            data: []
        });
    }
};
/**
 * updateProfile
 * Mentors use this to update their existing startup opportunities.
 */
exports.updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Find and update the profile
        // We only allow the update if it belongs to the mentor who created it
        const updatedProfile = await StartupProfile.findOneAndUpdate(
            { _id: id, mentorId: req.user.id },
            { $set: updates },
            { new: true, runValidators: true } // Returns the new doc and runs schema validation
        );

        if (!updatedProfile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found or you are not authorized to edit it."
            });
        }

        res.status(200).json({
            success: true,
            message: "Startup profile updated successfully!",
            data: updatedProfile
        });

    } catch (error) {
        console.error("Update Profile Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to update profile: " + error.message
        });
    }
};

/**
 * deleteProfile
 * Mentors use this to remove their startup opportunities.
 */
exports.deleteProfile = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete
        // Again, we check mentorId for security
        const deletedProfile = await StartupProfile.findOneAndDelete({
            _id: id,
            mentorId: req.user.id
        });

        if (!deletedProfile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found or you are not authorized to delete it."
            });
        }

        res.status(200).json({
            success: true,
            message: "Startup profile deleted successfully!"
        });

    } catch (error) {
        console.error("Delete Profile Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to delete profile: " + error.message
        });
    }
};
