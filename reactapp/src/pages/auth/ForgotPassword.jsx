// ForgotPassword Page — Corporate Memphis Redesign (Sharpened)
// Features: HD illustrations, theme-aware colors, and full navigation.

import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RiLockPasswordLine, RiRocketLine, RiArrowLeftLine, RiShieldCheckLine, RiArrowRightLine } from 'react-icons/ri';
import api from '../../config/apiConfig';
import Input from '../../components/ui/Input';

// --- CORPORATE MEMPHIS SVG ILLUSTRATIONS (Sharpened & Theme-Aware) ---

const MemphisSecurity = () => (
    <svg viewBox="0 0 400 400" className="w-full max-w-[320px] h-auto transition-all duration-500">
        <defs>
            <filter id="hd-shadow-security" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
                <feOffset dx="0" dy="12" result="offsetblur" />
                <feComponentTransfer><feFuncA type="linear" slope="0.3" /></feComponentTransfer>
                <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
        </defs>
        <g filter="url(#hd-shadow-security)">
            <circle cx="200" cy="200" r="180" fill="var(--theme-accent-light)" opacity="0.3" />
            {/* Shield (Detailed) */}
            <path d="M200 60 L300 110 V200 Q300 300 200 350 Q100 300 100 200 V110 Z" fill="var(--theme-accent)" stroke="var(--theme-text-primary)" strokeWidth="3" />
            <path d="M200 90 L270 125 V200 Q270 270 200 310 Q130 270 130 200 V125 Z" fill="white" opacity="0.2" />
            {/* Person - Inspecting (Kinetic Palette) */}
            <path d="M150 320 Q130 220 170 200" fill="none" stroke="#ff8c00" strokeWidth="16" strokeLinecap="round" />
            <circle cx="180" cy="180" r="14" fill="#ff8c00" stroke="var(--theme-text-primary)" strokeWidth="2" />
            {/* Magnifying glass (HD) */}
            <circle cx="230" cy="200" r="45" fill="var(--theme-bg-card)" stroke="var(--theme-text-primary)" strokeWidth="3" />
            <circle cx="230" cy="200" r="30" fill="var(--theme-accent)" opacity="0.6" />
            <path d="M260 230 L290 260" stroke="var(--theme-text-primary)" strokeWidth="8" strokeLinecap="round" />
        </g>
    </svg>
);

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
            newErrors.email = 'Enter a valid email.';
            isValid = false;
        }

        if (!formData.secretQuestionAnswer) {
            newErrors.secretQuestionAnswer = 'Security answer is required.';
            isValid = false;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(formData.newPassword)) {
            newErrors.newPassword = '8+ chars, Upper, Digit, Special.';
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
    }, [formData, navigate]);

    return (
        <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden transition-all duration-300" 
            style={{ 
                fontFamily: "'Plus Jakarta Sans', sans-serif", 
                background: 'var(--theme-bg-primary)',
                color: 'var(--theme-text-primary)'
            }}>
            
            {/* Background Memphis Blobs */}
            <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 animate-liquid" style={{ background: '#ff8c00' }}></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-20 animate-liquid" style={{ background: 'var(--theme-accent)' }}></div>

            {/* LOGO — Top Center (Mobile) / Top Left (Desktop) */}
            <div className="absolute top-10 md:left-12 z-20 flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                <div className="p-2.5 rounded-2xl transition-all duration-500 group-hover:rotate-12" style={{ background: 'var(--theme-accent-gradient)' }}>
                    <RiRocketLine className="text-white text-xl" />
                </div>
                <span className="text-xl font-black tracking-tighter" style={{ color: 'var(--theme-text-primary)' }}>StartupNest</span>
            </div>

            {/* MAIN CONTENT */}
            <div className="relative z-10 w-full max-w-5xl flex flex-col lg:flex-row items-center gap-16 animate-lift">
                
                {/* Illustration Column */}
                <div className="flex-1 hidden lg:flex flex-col items-center text-center">
                    <MemphisSecurity />
                    <h2 className="mt-12 text-4xl font-black tracking-tight leading-tight">
                        Securing your<br />
                        <span style={{ color: 'var(--theme-accent)' }}>Identity.</span>
                    </h2>
                    <button onClick={() => navigate('/')} className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-[var(--theme-accent)] transition-all">
                        <RiArrowLeftLine /> Back to Landing Page
                    </button>
                </div>

                {/* Form Column */}
                <div className="flex-1 w-full max-w-[500px]">
                    <div className="p-8 md:p-12 shadow-2xl transition-all duration-300 border-2"
                        style={{
                            background: 'var(--theme-bg-card)',
                            borderRadius: '48px',
                            borderColor: 'var(--theme-border)',
                            boxShadow: 'var(--theme-shadow-lg)'
                        }}
                    >
                        <div className="mb-10 text-center">
                            <h1 className="text-3xl font-black tracking-tight mb-2" style={{ color: 'var(--theme-text-primary)' }}>Reset Access</h1>
                            <p className="text-sm font-medium" style={{ color: 'var(--theme-text-secondary)' }}>Follow the steps to recover your account.</p>
                        </div>

                        <form onSubmit={handleReset} className="space-y-6">
                            <Input label="Email Address" name="email" type="email" placeholder="john@startupnest.com" value={formData.email} onChange={handleChange} error={errors.email} />

                            <div className="p-6 rounded-3xl border-2" style={{ background: 'var(--theme-bg-input)', borderColor: 'var(--theme-border)' }}>
                                <p className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-60">Security Verification</p>
                                <p className="text-sm font-bold mb-4">What was the name of your first school?</p>
                                <Input label="Security Answer" name="secretQuestionAnswer" placeholder="Enter your answer" value={formData.secretQuestionAnswer} onChange={handleChange} error={errors.secretQuestionAnswer} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input label="New Password" name="newPassword" type="password" placeholder="••••••••" value={formData.newPassword} onChange={handleChange} error={errors.newPassword} />
                                <Input label="Confirm New Password" name="confirmNewPassword" type="password" placeholder="••••••••" value={formData.confirmNewPassword} onChange={handleChange} error={errors.confirmNewPassword} />
                            </div>

                            <button type="submit" className="group w-full flex items-center justify-center gap-3 py-5 rounded-2xl text-white font-black uppercase tracking-widest text-xs transition-all hover:scale-[1.01] active:scale-95 shadow-xl"
                                style={{ background: 'var(--theme-accent-gradient)', boxShadow: '0 20px 40px -10px var(--theme-accent-glow)' }}>
                                <span>Reset Password</span>
                                <RiArrowRightLine className="text-xl transition-transform group-hover:translate-x-1" />
                            </button>

                            <Link to="/login" className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest hover:text-[var(--theme-accent)] transition-colors opacity-60 hover:opacity-100">
                                <RiArrowLeftLine />
                                Return to Login
                            </Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
