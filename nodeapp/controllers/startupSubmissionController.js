const StartupSubmission = require('../models/StartupSubmission');
const StartupProfile = require('../models/StartupProfile');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { getPagination } = require('../utils/pagination');

// Allows an Entrepreneur to submit a startup idea for a specific Mentor profile.
exports.createSubmission = asyncHandler(async (req, res) => {
    const { startupProfileId, marketPotential, launchYear, expectedFunding, address } = req.body;

    const profile = await StartupProfile.findById(startupProfileId);
    if (!profile) {
        return sendError(res, "Target startup profile not found.", 404);
    }

    if (Number(expectedFunding) > profile.fundingLimit) {
        return sendError(res, `Expected funding cannot exceed the mentor's limit of ₹${profile.fundingLimit.toLocaleString()}`, 400);
    }

    if (!req.file) {
        return sendError(res, "Validation failed: Pitch deck (PDF) is mandatory.", 400);
    }

    const newSubmission = await StartupSubmission.create({
        userId: req.user.id,
        userName: req.user.userName,
        startupProfileId,
        marketPotential,
        launchYear,
        expectedFunding,
        address,
        pitchDeckFile: req.file.path
    });

    return sendSuccess(res, "Startup idea submitted successfully!", newSubmission, 201);
});

// Fetches all submissions linked to the profiles created by the logged-in Mentor.
exports.getMentorSubmissions = asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query);

    const mentorProfiles = await StartupProfile.find({ mentorId: req.user.id }).select('_id');
    const profileIds = mentorProfiles.map(p => p._id);

    const query = { startupProfileId: { $in: profileIds } };
    if (req.query.status) {
        query.status = req.query.status;
    }

    // SMART SEARCH — searches across all submission fields
    const keyword = req.query.keyword || '';
    if (keyword) {
        // Find profiles matching keyword in category/industry
        const matchingProfiles = await StartupProfile.find({
            _id: { $in: profileIds },
            $or: [
                { category: { $regex: keyword, $options: 'i' } },
                { targetIndustry: { $regex: keyword, $options: 'i' } },
                { preferredStage: { $regex: keyword, $options: 'i' } }
            ]
        }).select('_id');
        const matchedProfileIds = matchingProfiles.map(p => p._id);

        query.$or = [
            { userName: { $regex: keyword, $options: 'i' } },
            { address: { $regex: keyword, $options: 'i' } },
            { status: { $regex: keyword, $options: 'i' } },
            ...(matchedProfileIds.length > 0 ? [{ startupProfileId: { $in: matchedProfileIds } }] : [])
        ];
    }

    const order = req.query.order === 'asc' ? 1 : -1;

    const submissions = await StartupSubmission.find(query)
        .populate('startupProfileId', 'category')
        .sort({ submissionDate: order })
        .skip(skip)
        .limit(limit);

    const totalRecords = await StartupSubmission.countDocuments(query);

    return res.status(200).json({
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
});

// Allows a Mentor to Shortlist (approved) or Reject a submission.
exports.updateSubmissionStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['approved', 'rejected'];
    if (!validStatuses.includes(status)) {
        return sendError(res, "Invalid status. Use 'approved' or 'rejected'.", 400);
    }

    const submission = await StartupSubmission.findById(id).populate('startupProfileId');
    if (!submission) {
        return sendError(res, "Submission not found.", 404);
    }

    if (submission.startupProfileId.mentorId.toString() !== req.user.id) {
        return sendError(res, "Access Denied: You do not own the profile for this submission.", 403);
    }

    submission.status = status;
    
    // Clear rejection feedback if approving a previously rejected idea
    if (status === 'approved') {
        submission.rejectionFeedback = '';
    }

    await submission.save();

    return sendSuccess(res, `Submission status updated to ${status}.`, submission);
});

// FEATURE: Mentor Rejection Feedback
exports.rejectSubmission = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { feedback } = req.body;

    if (!feedback || feedback.trim().length < 10) {
        return sendError(res, "Feedback is required when rejecting a submission (min 10 characters).", 400);
    }

    const submission = await StartupSubmission.findById(id).populate('startupProfileId');
    if (!submission) {
        return sendError(res, "Submission not found.", 404);
    }

    // Authorization check
    if (submission.startupProfileId.mentorId.toString() !== req.user.id) {
        return sendError(res, "You are not authorized to reject this submission.", 403);
    }

    submission.status = 'rejected';
    submission.rejectionFeedback = feedback;
    await submission.save();

    return sendSuccess(res, "Submission rejected successfully.", submission);
});

// Allows a Mentor to delete a submission.
exports.deleteSubmission = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const submission = await StartupSubmission.findById(id).populate('startupProfileId');
    if (!submission) {
        return sendError(res, "Submission not found.", 404);
    }

    if (submission.startupProfileId.mentorId.toString() !== req.user.id) {
        return sendError(res, "Access Denied: Cannot delete submission from another mentor's profile.", 403);
    }

    await StartupSubmission.findByIdAndDelete(id);
    return sendSuccess(res, "Submission deleted successfully.");
});

// Fetches all submissions made by the logged-in Entrepreneur.
exports.getEntrepreneurSubmissions = asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query);
    const keyword = req.query.keyword || req.query.category || '';

    const query = { userId: req.user.id };

    // Status Filter
    if (req.query.status) {
        if (req.query.status === 'withdrawn') {
            query.isWithdrawn = true;
        } else {
            query.status = req.query.status;
            query.isWithdrawn = { $ne: true }; // Don't show withdrawn if specifically filtering for a status
        }
    }
    if (keyword) {
        // Find profiles matching keyword in category, industry, stage, or description
        const matchingProfiles = await StartupProfile.find({
            $or: [
                { category: { $regex: keyword, $options: 'i' } },
                { targetIndustry: { $regex: keyword, $options: 'i' } },
                { preferredStage: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ]
        }).select('_id');
        const profileIds = matchingProfiles.map(p => p._id);

        query.$or = [
            { userName: { $regex: keyword, $options: 'i' } },
            { address: { $regex: keyword, $options: 'i' } },
            { status: { $regex: keyword, $options: 'i' } },
            ...(profileIds.length > 0 ? [{ startupProfileId: { $in: profileIds } }] : [])
        ];
    }

    const submissions = await StartupSubmission.find(query)
        .populate({
            path: 'startupProfileId',
            select: 'category description fundingLimit avgEquityExpectation targetIndustry preferredStage mentorId',
            populate: { path: 'mentorId', select: 'userName email' }
        })
        .sort({ submissionDate: -1 })
        .skip(skip)
        .limit(limit);

    const totalRecords = await StartupSubmission.countDocuments(query);

    return res.status(200).json({
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
});

// Allows an Entrepreneur to delete their own submission.
exports.deleteEntrepreneurSubmission = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const submission = await StartupSubmission.findById(id);
    if (!submission) {
        return sendError(res, "Submission not found.", 404);
    }

    if (submission.userId.toString() !== req.user.id) {
        return sendError(res, "Access Denied: You can only delete your own submissions.", 403);
    }

    await StartupSubmission.findByIdAndDelete(id);
    return sendSuccess(res, "Submission removed successfully.");
});

// FEATURE: Entrepreneur Idea Withdrawal
exports.withdrawSubmission = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;

    // 1. Validation - Field required and min length
    if (!reason || reason.trim().length < 10) {
        return sendError(res, "Withdrawal reason is required and must be at least 10 characters.", 400);
    }

    const submission = await StartupSubmission.findById(id);
    if (!submission) {
        return sendError(res, "Submission not found.", 404);
    }

    // 2. Authorization Check - Must be the entrepreneur who submitted it
    if (submission.userId.toString() !== req.user.id) {
        return sendError(res, "You are not authorized to withdraw this submission.", 403);
    }

    // 3. Status Check - Must be strictly 'approved' (shortlisted)
    if (submission.status !== 'approved') {
        return sendError(res, "You can only withdraw a shortlisted submission.", 400);
    }

    // 4. Duplicate Check - Not already withdrawn
    if (submission.isWithdrawn) {
        return sendError(res, "This submission has already been withdrawn.", 400);
    }

    // 5. Update Record
    submission.isWithdrawn = true;
    submission.withdrawalReason = reason;
    submission.withdrawnAt = Date.now();
    await submission.save();

    return sendSuccess(res, "Submission withdrawn successfully.", submission);
});
