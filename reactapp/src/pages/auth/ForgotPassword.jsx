// ForgotPassword Page — Theme-Aware Implementation
// Uses CSS custom properties for background overlay, cards, text, and buttons.

import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RiLockPasswordLine, RiRocketLine, RiArrowLeftLine, RiShieldCheckLine } from 'react-icons/ri';
import api from '../../config/apiConfig';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import AnimatedBackground from '../../components/ui/AnimatedBackground';

const ForgotPassword = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        secretQuestionAnswer: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: '' });
    };

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address.';
            isValid = false;
        }

        if (!formData.secretQuestionAnswer) {
            newErrors.secretQuestionAnswer = 'Security answer is required.';
            isValid = false;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(formData.newPassword)) {
            newErrors.newPassword = 'Password must be strong (8+ chars, Upper, Digit, Special).';
            isValid = false;
        }

        if (formData.newPassword !== formData.confirmNewPassword) {
            newErrors.confirmNewPassword = 'Passwords do not match.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleReset = useCallback(async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Please correct the highlighted errors.");
            return;
        }

        try {
            const response = await api.post('/user/forgotPassword', formData);
            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/login');
            }
        } catch (error) {
            const message = error.response?.data?.message || "Failed to reset password.";
            toast.error(message);
        }
    }, [formData, navigate, validateForm]);

    return (
        <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden transition-all duration-300" style={{ fontFamily: "'Inter', sans-serif", background: 'var(--theme-bg-primary)' }}>
            
            {/* High-Energy Global Background */}
            <AnimatedBackground showOrnaments={true} />

            {/* LOGO — Top Left (Desktop) */}
            <div className="absolute top-10 left-10 z-20 hidden lg:flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
                <div className="p-2 rounded-xl active:scale-95 transition-all duration-300" style={{ background: 'var(--theme-accent-gradient)' }}>
                    <RiRocketLine className="text-white text-lg" />
                </div>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '18px', color: 'var(--theme-text-primary)' }}>
                    Startup<span style={{ color: 'var(--theme-accent)' }}>Nest</span>
                </span>
            </div>

            {/* MAIN CARD */}
            <div className="relative z-10 w-full max-w-[480px] animate-lift custom-scrollbar" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                <div className="overflow-hidden transition-all duration-300"
                    style={{
                        background: 'var(--theme-bg-card)',
                        borderRadius: 'var(--theme-radius-xl)',
                        borderLeft: '6px solid var(--theme-accent)',
                        boxShadow: 'var(--theme-shadow-lg)'
                    }}
                >
                    
                    {/* Header */}
                    <div className="px-6 md:px-10 pt-8 md:pt-10 pb-4 md:pb-6 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4"
                            style={{
                                background: 'var(--theme-accent-light)',
                                borderRadius: 'var(--theme-radius)',
                                border: '1px solid var(--theme-border)'
                            }}
                        >
                            <RiLockPasswordLine style={{ color: 'var(--theme-accent)' }} className="text-xs" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--theme-accent)' }}>Security Protocol</span>
                        </div>
                        <h1 style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, color: 'var(--theme-text-primary)', letterSpacing: '-0.04em', lineHeight: 1.1 }} className="text-2xl md:text-[32px]">
                            Reset Access
                        </h1>
                        <p className="mt-2 md:mt-3 text-xs md:text-sm font-medium" style={{ color: 'var(--theme-text-secondary)' }}>
                            Verify your identity to secure your account.
                        </p>
                    </div>

                    {/* Form Body */}
                    <form onSubmit={handleReset} className="px-6 md:px-10 pb-8 space-y-4 md:space-y-6">
                        
                        <Input 
                            label="EMAIL ADDRESS"
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                        />

                        {/* Security Question Section */}
                        <div className="p-4 md:p-5 border space-y-3 md:space-y-4 transition-all duration-300"
                            style={{
                                background: 'var(--theme-bg-input)',
                                borderRadius: 'var(--theme-radius-lg)',
                                borderColor: 'var(--theme-border)'
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <RiShieldCheckLine style={{ color: 'var(--theme-accent)' }} size={14} />
                                <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--theme-text-muted)' }}>Verification Step</p>
                            </div>
                            <p className="text-xs md:text-sm font-bold leading-snug" style={{ color: 'var(--theme-text-secondary)' }}>
                                What was the name of your first school?
                            </p>
                            <Input 
                                label="SECURITY ANSWER"
                                name="secretQuestionAnswer"
                                placeholder="Enter your answer"
                                value={formData.secretQuestionAnswer}
                                onChange={handleChange}
                                error={errors.secretQuestionAnswer}
                            />
                        </div>

                        {/* New Password Fields */}
                        <div className="grid grid-cols-1 gap-4 md:gap-5 pt-2">
                            <Input 
                                label="NEW PASSWORD"
                                name="newPassword"
                                type="password"
                                placeholder="••••••••"
                                value={formData.newPassword}
                                onChange={handleChange}
                                error={errors.newPassword}
                            />
                            <Input 
                                label="CONFIRM PASSWORD"
                                name="confirmNewPassword"
                                type="password"
                                placeholder="••••••••"
                                value={formData.confirmNewPassword}
                                onChange={handleChange}
                                error={errors.confirmNewPassword}
                            />
                        </div>

                        {/* Actions */}
                        <div className="pt-4 flex flex-col gap-4">
                            <Button text="Launch Password Reset" type="submit" />
                            <Link to="/login" className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all py-2"
                                style={{ color: 'var(--theme-text-muted)' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--theme-text-primary)'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--theme-text-muted)'}
                            >
                                <RiArrowLeftLine />
                                Return to Login
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Footer Copyright */}
                <p className="mt-8 text-center text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--theme-text-muted)' }}>
                    © 2026 StartupNest Security Unit
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
