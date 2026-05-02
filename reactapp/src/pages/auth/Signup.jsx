// Signup Page — Theme-Aware Implementation
// Uses CSS custom properties for layouts, cards, and accent colors.

import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RiRocketLine } from 'react-icons/ri';
import api from '../../config/apiConfig';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import AnimatedBackground from '../../components/ui/AnimatedBackground';

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        role: 'Entrepreneur',
        secretQuestionAnswer: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        const userNameRegex = /^[a-zA-Z0-9_]{3,}$/;
        if (!userNameRegex.test(formData.userName)) {
            newErrors.userName = 'Username must be at least 3 characters (letters, numbers, or underscores).';
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address.';
            isValid = false;
        }

        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(formData.mobile)) {
            newErrors.mobile = 'Please enter a valid 10-digit mobile number.';
            isValid = false;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            newErrors.password = 'Password needs: min 8 chars, 1 uppercase, 1 number, and 1 special character.';
            isValid = false;
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
            isValid = false;
        }

        if (!formData.secretQuestionAnswer) {
            newErrors.secretQuestionAnswer = 'Please provide an answer for the secret question.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSignup = useCallback(async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Please fix the errors in the form.");
            return;
        }

        try {
            const response = await api.post('/user/signup', formData);
            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/');
            }
        } catch (error) {
            const message = error.response?.data?.message || "Failed to create account. Please try again.";
            toast.error(message);
        }
    }, [formData, navigate, validateForm]);

    return (
        <div className="h-screen overflow-hidden flex transition-all duration-300 relative" style={{ fontFamily: "'Inter', sans-serif", background: 'var(--theme-bg-primary)' }}>
            {/* High-Energy Global Background */}
            <AnimatedBackground showOrnaments={true} />

            {/* LEFT — Illustration Panel */}
            <div className="hidden lg:flex w-[480px] flex-shrink-0 flex-col justify-between relative overflow-hidden border-r"
                style={{ background: 'var(--theme-bg-secondary)', backdropFilter: 'var(--theme-glass)', borderColor: 'var(--theme-border)' }}>

                <div className="relative z-10 flex flex-col justify-between h-full">
                    {/* Logo */}
                    <div className="p-10">
                        <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate('/')}>
                            <div className="p-2 rounded-xl transition-all duration-300 group-hover:rotate-12 active:scale-95"
                                style={{ background: 'var(--theme-accent-gradient)' }}>
                                <RiRocketLine className="text-white text-lg" />
                            </div>
                            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '18px', color: 'var(--theme-text-primary)' }}>
                                Startup<span style={{ color: 'var(--theme-accent)' }}>Nest</span>
                            </span>
                        </div>
                    </div>

                    {/* Tagline */}
                    <div className="p-10">
                        <h2 className="animate-lift" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '36px', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em', color: 'var(--theme-text-primary)' }}>
                            Build something{' '}<span style={{ color: 'var(--theme-accent)', fontStyle: 'italic' }}>extraordinary.</span>
                        </h2>
                        <p className="animate-lift delay-100 mt-4" style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--theme-text-secondary)' }}>
                            Join 500+ founders and investors building the future on StartupNest.
                        </p>
                    </div>

                    {/* Copyright */}
                    <div className="p-10">
                        <p style={{ fontSize: '10px', color: 'var(--theme-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
                            © 2026 StartupNest Ecosystem
                        </p>
                    </div>
                </div>
            </div>

            {/* RIGHT — Signup Form */}
            <div className="flex-grow flex items-center justify-center p-6 relative overflow-hidden custom-scrollbar"
                style={{ overflowY: 'auto' }}>

                <div className="w-full max-w-lg relative z-10 animate-lift delay-100 my-auto py-8">

                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-2.5 mb-8 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="p-2 rounded-xl active:scale-95" style={{ background: 'var(--theme-accent-gradient)' }}>
                            <RiRocketLine className="text-white text-lg" />
                        </div>
                        <span style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, fontSize: '18px', color: 'var(--theme-text-primary)' }}>
                            Startup<span style={{ color: 'var(--theme-accent)' }}>Nest</span>
                        </span>
                    </div>

                    {/* Form Card */}
                    <div className="p-5 md:p-10 shadow-2xl transition-all duration-300"
                        style={{
                            background: 'var(--theme-bg-card)',
                            borderRadius: 'var(--theme-radius-xl)',
                            border: '1px solid var(--theme-border)',
                            boxShadow: 'var(--theme-shadow-lg)'
                        }}
                    >
                        <div className="mb-6 text-center">
                            <h2 style={{ fontFamily: "'Plus Jakarta Sans'", letterSpacing: '-0.03em', color: 'var(--theme-text-primary)' }} className="text-2xl md:text-[28px] font-extrabold">Create Account</h2>
                            <p className="mt-1 text-xs md:text-sm" style={{ color: 'var(--theme-text-secondary)' }}>Join StartupNest and start your journey</p>
                        </div>

                        <form onSubmit={handleSignup} className="space-y-4 md:space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
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

                            {/* Role Selection */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] md:text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--theme-text-secondary)' }}>
                                    Select Role <span style={{ color: 'var(--theme-accent)' }}>*</span>
                                </label>
                                <select 
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 md:py-3.5 text-sm font-medium outline-none transition-all appearance-none cursor-pointer"
                                    style={{ 
                                        background: 'var(--theme-bg-input)',
                                        border: '2px solid var(--theme-border)',
                                        borderRadius: 'var(--theme-radius)',
                                        color: 'var(--theme-text-primary)',
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='gray'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 1rem center',
                                        backgroundSize: '1em'
                                    }}
                                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--theme-accent)'; e.currentTarget.style.background = 'var(--theme-bg-card)'; }}
                                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--theme-border)'; e.currentTarget.style.background = 'var(--theme-bg-input)'; }}
                                >
                                    <option value="Entrepreneur">Entrepreneur</option>
                                    <option value="Mentor">Mentor</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
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

                            <div className="p-4 transition-all duration-300" style={{ background: 'var(--theme-bg-input)', borderRadius: 'var(--theme-radius-lg)', border: '1px solid var(--theme-border)' }}>
                                <p className="text-[10px] font-black uppercase mb-2 tracking-widest" style={{ color: 'var(--theme-text-muted)' }}>Security Question</p>
                                <p className="text-xs md:text-[13px] font-semibold mb-3 leading-relaxed" style={{ color: 'var(--theme-text-secondary)' }}>What was the name of your first school?</p>
                                <Input 
                                    label="Your Answer"
                                    name="secretQuestionAnswer"
                                    placeholder="St. Mary's School"
                                    value={formData.secretQuestionAnswer}
                                    onChange={handleChange}
                                    error={errors.secretQuestionAnswer}
                                />
                            </div>

                            <div className="pt-2">
                                <Button text="Register Account" type="submit" className="w-full py-4 text-[13px]" />
                            </div>
                        </form>

                        <div className="mt-6 pt-5 text-center" style={{ borderTop: '1px solid var(--theme-border)' }}>
                            <p className="text-xs md:text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
                                Already have an account?{' '}
                                <Link to="/login" className="font-bold transition-colors duration-300 hover:underline" style={{ color: 'var(--theme-accent)' }}>
                                    Login Here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
