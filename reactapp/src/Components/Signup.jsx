// This file is the Signup Page of the application.
// It allows new users to create an account by providing their details.
// It uses regex to validate inputs and sends the data to the backend.

import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../apiConfig';
import Button from './Reusable/Button';
import Input from './Reusable/Input';

const Signup = () => {
    // Hook to navigate between pages
    const navigate = useNavigate();

    // State to store all the input field values
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        role: 'Entrepreneur', // Default role
        secretQuestionAnswer: ''
    });

    // State to store error messages for each field
    const [errors, setErrors] = useState({});

    // This function updates the state as the user types
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Clear the error for this field if it was already showing one
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    // This function checks if all fields follow our security and format rules (Regex)
    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        // Username check: at least 3 chars, letters/numbers/underscores only
        const userNameRegex = /^[a-zA-Z0-9_]{3,}$/;
        if (!userNameRegex.test(formData.userName)) {
            newErrors.userName = 'Username must be at least 3 characters (letters, numbers, or underscores).';
            isValid = false;
        }

        // Email check: must be a valid email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address.';
            isValid = false;
        }

        // Mobile check: exactly 10 digits starting with 6-9
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(formData.mobile)) {
            newErrors.mobile = 'Please enter a valid 10-digit mobile number.';
            isValid = false;
        }

        // Password check: min 8 chars, 1 uppercase, 1 digit, 1 special char
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            newErrors.password = 'Password needs: min 8 chars, 1 uppercase, 1 number, and 1 special character.';
            isValid = false;
        }

        // Password match check
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
            isValid = false;
        }

        // Secret question answer check
        if (!formData.secretQuestionAnswer) {
            newErrors.secretQuestionAnswer = 'Please provide an answer for the secret question.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // This function handles the signup process when the form is submitted
    const handleSignup = useCallback(async (e) => {
        e.preventDefault();

        // Validate the form before calling the API
        if (!validateForm()) {
            toast.error("Please fix the errors in the form.");
            return;
        }

        try {
            // Send the registration data to our backend
            const response = await api.post('/user/signup', formData);

            if (response.data.success) {
                // If successful, show a message and go directly to the Home page
                toast.success(response.data.message);
                navigate('/'); // Redirecting to home page instead of login
            }
        } catch (error) {
            // If the server sends an error (like email already exists)
            const message = error.response?.data?.message || "Failed to create account. Please try again.";
            toast.error(message);
        }
    }, [formData, navigate,validateForm]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 py-12">
            {/* The main card for the signup form */}
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border border-slate-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-[#1E3A5F] mb-2">Create Account</h2>
                    <p className="text-slate-500">Join StartupNest and start your journey</p>
                </div>

                {/* The Signup Form */}
                <form onSubmit={handleSignup} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input 
                            label="Username"
                            name="userName"
                            placeholder="johndoe_99"
                            value={formData.userName}
                            onChange={handleChange}
                            error={errors.userName}
                        />
                        <Input 
                            label="Mobile Number"
                            name="mobile"
                            placeholder="9876543210"
                            value={formData.mobile}
                            onChange={handleChange}
                            error={errors.mobile}
                        />
                    </div>

                    <Input 
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                    />

                    {/* Role Selection Dropdown */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-slate-700">Select Role *</label>
                        <select 
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full border-2 border-slate-200 bg-white rounded-lg px-4 py-2 outline-none focus:border-[#1E3A5F] transition-all"
                        >
                            <option value="Entrepreneur">Entrepreneur</option>
                            <option value="Mentor">Mentor</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input 
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                        />
                        <Input 
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={errors.confirmPassword}
                        />
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-3">Security Question</p>
                        <p className="text-sm text-slate-700 mb-3">What was the name of your first school?</p>
                        <Input 
                            label="Your Answer"
                            name="secretQuestionAnswer"
                            placeholder="St. Mary's School"
                            value={formData.secretQuestionAnswer}
                            onChange={handleChange}
                            error={errors.secretQuestionAnswer}
                        />
                    </div>

                    <Button text="Register Account" type="submit" />
                </form>

                {/* Link to go back to the Login page */}
                <div className="mt-8 text-center pt-6 border-t border-slate-100">
                    <p className="text-slate-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-[#1E3A5F] hover:underline">
                            Login Here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;