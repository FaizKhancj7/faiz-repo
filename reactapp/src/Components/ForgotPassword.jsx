// This file is the Forgot Password Page of the application.
// It allows users to reset their password if they can provide their email 
// and the exact answer to their secret security question.

import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RiLockPasswordLine } from 'react-icons/ri';
import api from '../apiConfig';
import Button from './Reusable/Button';
import Input from './Reusable/Input';

const ForgotPassword = () => {
    // Hook to navigate back to login after success
    const navigate = useNavigate();

    // State to store form inputs
    const [formData, setFormData] = useState({
        email: '',
        secretQuestionAnswer: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    // State to store field-level error messages
    const [errors, setErrors] = useState({});

    // This function updates the state as the user types
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Clear errors for the field being typed in
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    // This function validates the inputs using Regex and matching rules
    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        // Email regex check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address.';
            isValid = false;
        }

        // Secret question answer check (cannot be empty)
        if (!formData.secretQuestionAnswer) {
            newErrors.secretQuestionAnswer = 'Please provide the answer to your secret question.';
            isValid = false;
        }

        // Password strength check (min 8 chars, 1 upper, 1 digit, 1 special)
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(formData.newPassword)) {
            newErrors.newPassword = 'Password needs: min 8 chars, 1 uppercase, 1 number, and 1 special character.';
            isValid = false;
        }

        // Confirm password match check
        if (formData.newPassword !== formData.confirmNewPassword) {
            newErrors.confirmNewPassword = 'Passwords do not match.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // This function handles the form submission
    const handleReset = useCallback(async (e) => {
        e.preventDefault();

        // Validate the form before calling the API
        if (!validateForm()) {
            toast.error("Please fix the errors in the form.");
            return;
        }

        try {
            // We call the forgotPassword endpoint on our backend
            const response = await api.post('/user/forgotPassword', formData);

            if (response.data.success) {
                // If successful, show a message and send them to the login page
                toast.success(response.data.message);
                navigate('/login');
            }
        } catch (error) {
            // If the reset fails (wrong email or wrong secret answer), show the error
            const message = error.response?.data?.message || "Failed to reset password. Please try again.";
            toast.error(message);
        }
    }, [formData, navigate]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 py-12">
            {/* The main card for the password reset form */}
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
                <div className="text-center mb-8">
                    <div className="bg-[#F97316]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <RiLockPasswordLine className="text-[#F97316] text-3xl" />
                    </div>
                    <h2 className="text-3xl font-black text-[#1E3A5F] mb-2">Reset Password</h2>
                    <p className="text-slate-500">Provide your details to set a new password</p>
                </div>

                {/* The Reset Form */}
                <form onSubmit={handleReset} className="space-y-5">
                    <Input 
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                    />

                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-3">Security Question</p>
                        <p className="text-sm text-slate-700 mb-3">What was the name of your first school?</p>
                        <Input 
                            label="Your Answer"
                            name="secretQuestionAnswer"
                            placeholder="Exact answer you gave at signup"
                            value={formData.secretQuestionAnswer}
                            onChange={handleChange}
                            error={errors.secretQuestionAnswer}
                        />
                    </div>

                    <Input 
                        label="New Password"
                        name="newPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.newPassword}
                        onChange={handleChange}
                        error={errors.newPassword}
                    />

                    <Input 
                        label="Confirm New Password"
                        name="confirmNewPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmNewPassword}
                        onChange={handleChange}
                        error={errors.confirmNewPassword}
                    />

                    <Button text="Update Password" type="submit" />
                </form>

                {/* Link to go back to the Login page */}
                <div className="mt-8 text-center pt-6 border-t border-slate-100">
                    <p className="text-slate-600">
                        Remember your password?{' '}
                        <Link to="/login" className="font-bold text-[#1E3A5F] hover:underline">
                            Back to Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
