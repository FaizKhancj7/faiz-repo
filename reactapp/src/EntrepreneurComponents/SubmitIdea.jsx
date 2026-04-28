/**
 * SubmitIdea.jsx
 * This page allows Entrepreneurs to submit a startup idea for a specific Mentor opportunity.
 * It features multi-field validation, file upload (PDF), and a confirmation dialog.
 */

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RiRocket2Line, RiUploadCloud2Line, RiErrorWarningLine } from 'react-icons/ri';

// Import our reusable components
import Input from '../Components/Reusable/Input';
import Button from '../Components/Reusable/Button';
import ConfirmDialog from '../Components/Reusable/ConfirmDialog';
import startupSubmissionService from '../services/startupSubmissionService';

const SubmitIdea = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // We extract the profile data passed from the browse page
    // If no state is passed (e.g. direct URL access), we redirect back
    const { profileId, category, fundingLimit } = location.state || {};

    // --- 1. STATE MANAGEMENT ---

    // Form data state
    const [formData, setFormData] = useState({
        marketPotential: '',
        launchYear: '',
        expectedFunding: '',
        address: ''
    });

    // File state
    const [selectedFile, setSelectedFile] = useState(null);

    // Validation error state
    const [errors, setErrors] = useState({});
    
    // Loading state for submission
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Confirmation dialog state
    const [showConfirm, setShowConfirm] = useState(false);
    
    // Success modal state
    const [showSuccess, setShowSuccess] = useState(false);

    // --- 2. VALIDATION LOGIC (PRD 7.1) ---
    // ... rest of validation logic ...

    const validateForm = () => {
        let newErrors = {};

        // Market Potential: Must be between 1 and 100
        if (!formData.marketPotential) {
            newErrors.marketPotential = "Market potential score is required.";
        } else if (formData.marketPotential < 1 || formData.marketPotential > 100) {
            newErrors.marketPotential = "Score must be between 1 and 100.";
        }

        // Launch Year: Must be a valid date and must be in the future (greater than today)
        if (!formData.launchYear) {
            newErrors.launchYear = "Anticipated launch date is required.";
        } else {
            const selectedDate = new Date(formData.launchYear);
            const today = new Date();
            // Set time to 00:00:00 for a fair comparison
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate <= today) {
                newErrors.launchYear = "Anticipated date must be in the future.";
            }
        }

        // Expected Funding: Must be positive and not exceed mentor's funding limit
        if (!formData.expectedFunding) {
            newErrors.expectedFunding = "Funding amount is required.";
        } else if (Number(formData.expectedFunding) <= 0) {
            newErrors.expectedFunding = "Funding must be a positive number.";
        } else if (fundingLimit && Number(formData.expectedFunding) > fundingLimit) {
            newErrors.expectedFunding = `Expected funding cannot exceed the mentor's limit of ₹${fundingLimit.toLocaleString()}`;
        } else if (Number(formData.expectedFunding) > 10000000) {
            newErrors.expectedFunding = "Maximum funding allowed is ₹10,000,000.";
        }

        // Address: Min 10, Max 300 characters
        if (!formData.address) {
            newErrors.address = "Location/Address is required.";
        } else if (formData.address.length < 10) {
            newErrors.address = "Address must be at least 10 characters long.";
        } else if (formData.address.length > 300) {
            newErrors.address = "Address cannot exceed 300 characters.";
        }

        // File Upload: Must be a PDF and exist
        if (!selectedFile) {
            newErrors.pitchDeckFile = "Please upload your pitch deck (PDF).";
        } else if (selectedFile.type !== 'application/pdf') {
            newErrors.pitchDeckFile = "Only PDF files are allowed.";
        } else if (selectedFile.size > 10 * 1024 * 1024) {
            newErrors.pitchDeckFile = "File size exceeds 10MB limit.";
        }

        setErrors(newErrors);
        // Returns true if no errors were found
        return Object.keys(newErrors).length === 0;
    };

    // --- 3. EVENT HANDLERS ---

    // Handle text input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error for this field as the user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setErrors(prev => ({ ...prev, pitchDeckFile: '' }));
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // We validate first
        if (validateForm()) {
            // If valid, we show the confirmation prompt
            setShowConfirm(true);
        } else {
            toast.warning("Please correct the errors before submitting.");
        }
    };

    // Actual API call after confirmation
    const handleConfirmSubmit = async () => {
        setShowConfirm(false);
        setIsSubmitting(true);

        // We use FormData to handle the file upload
        const submissionPayload = new FormData();
        submissionPayload.append('startupProfileId', profileId);
        submissionPayload.append('marketPotential', formData.marketPotential);
        submissionPayload.append('launchYear', formData.launchYear);
        submissionPayload.append('expectedFunding', formData.expectedFunding);
        submissionPayload.append('address', formData.address);
        submissionPayload.append('pitchDeckFile', selectedFile);

        try {
            const response = await startupSubmissionService.createSubmission(submissionPayload);
            if (response.success) {
                // Show success modal instead of toast
                setShowSuccess(true);
            }
        } catch (error) {
            toast.error(error.message || "Submission failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handler for success modal OK button
    const handleSuccessOk = () => {
        setShowSuccess(false);
        navigate('/entrepreneur/my-submissions');
    };

    // If no profile was passed, show a warning
    // ... rest of component ...
    if (!profileId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] p-10">
                <RiErrorWarningLine className="text-6xl text-orange-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">No Opportunity Selected</h2>
                <p className="text-gray-500 mt-2 mb-6 text-center max-w-md">
                    Please select a startup opportunity from the browse page to submit your idea.
                </p>
                <button 
                    onClick={() => navigate('/mentor-opportunities')}
                    className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-orange-600 transition-all"
                >
                    Back to Opportunities
                </button>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-3xl mx-auto min-h-screen">
            {/* Header Section */}
            <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-orange-100 rounded-2xl">
                    <RiRocket2Line className="text-4xl text-orange-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Submit Your Idea</h1>
                    <p className="text-gray-500 font-medium">Applying for: <span className="text-orange-600 font-bold uppercase">{category}</span></p>
                </div>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl border border-gray-50 space-y-6">
                
                {/* Market Potential Input */}
                <Input 
                    label="Market Potential Score (1-100)"
                    type="number"
                    name="marketPotential"
                    value={formData.marketPotential}
                    onChange={handleChange}
                    error={errors.marketPotential}
                    min="0"
                    placeholder="Enter estimated score (e.g., 85)"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Launch Year Date Picker */}
                    <Input 
                        label="Anticipated Launch Date"
                        type="date"
                        name="launchYear"
                        value={formData.launchYear}
                        onChange={handleChange}
                        error={errors.launchYear}
                    />

                    {/* Expected Funding Input */}
                    <Input 
                        label={`Expected Funding (Limit: ₹${fundingLimit?.toLocaleString()})`}
                        type="number"
                        name="expectedFunding"
                        value={formData.expectedFunding}
                        onChange={handleChange}
                        error={errors.expectedFunding}
                        min="0"
                        placeholder="e.g., 500000"
                    />
                </div>

                {/* Address/Location Input */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Office/Project Address</label>
                    <textarea 
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        className={`w-full px-5 py-4 bg-gray-50 border rounded-2xl outline-none transition-all resize-none font-medium text-gray-800 ${
                            errors.address ? 'border-red-500 focus:ring-2 focus:ring-red-100' : 'border-gray-100 focus:border-orange-500 focus:ring-2 focus:ring-orange-100'
                        }`}
                        placeholder="Provide your physical address or location details..."
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-2 ml-1 font-bold animate-pulse">{errors.address}</p>}
                </div>

                {/* File Upload Section */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 ml-1">Pitch Deck (PDF only, Max 10MB)</label>
                    <div className={`relative group border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all ${
                        selectedFile ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50 hover:border-orange-300 hover:bg-orange-50'
                    }`}>
                        <input 
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <RiUploadCloud2Line className={`text-4xl mb-2 ${selectedFile ? 'text-green-500' : 'text-gray-400 group-hover:text-orange-500'}`} />
                        <p className="text-sm font-bold text-gray-700">
                            {selectedFile ? selectedFile.name : "Click to upload or drag & drop"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Only PDF format is supported</p>
                    </div>
                    {errors.pitchDeckFile && <p className="text-red-500 text-xs mt-2 ml-1 font-bold">{errors.pitchDeckFile}</p>}
                </div>

                {/* Action Buttons */}
                <div className="pt-6 flex gap-4">
                    <Button 
                        type="submit" 
                        loading={isSubmitting}
                        disabled={!!errors.expectedFunding}
                        className="flex-1 py-4 text-lg"
                    >
                        Submit Idea
                    </Button>
                    <button 
                        type="button"
                        onClick={() => navigate('/mentor-opportunities')}
                        className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </form>

            {/* Confirmation Dialog */}
            <ConfirmDialog 
                isOpen={showConfirm}
                onCancel={() => setShowConfirm(false)}
                onConfirm={handleConfirmSubmit}
                title="Confirm Submission"
                message="Are you sure you want to submit this startup idea? You cannot change your pitch deck once it is submitted to the mentor."
                confirmText="Yes, Submit Now"
                cancelText="Check Again"
            />
            {/* Success Confirmation Dialog */}
            <ConfirmDialog 
                isOpen={showSuccess}
                onConfirm={handleSuccessOk}
                title="Submission Successful!"
                message="Your startup idea has been successfully submitted to the mentor. You can track its status in your dashboard."
                confirmText="OK, View My Submissions"
                showCancel={false}
            />
        </div>
    );
};

export default SubmitIdea;
