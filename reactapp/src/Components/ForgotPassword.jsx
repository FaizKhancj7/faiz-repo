import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RiLockPasswordLine, RiRocketLine, RiArrowLeftLine, RiShieldCheckLine } from 'react-icons/ri';
import api from '../apiConfig';
import Button from './Reusable/Button';
import Input from './Reusable/Input';

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
    }, [formData, navigate]);

    return (
        <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
            
            {/* BACKGROUND — Full Page Image with Deep Overlay */}
            <div className="absolute inset-0 z-0" 
                style={{ 
                    backgroundImage: "url('/a9e3860adaff375666a186570e41a751.jpg')", 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}>
                <div className="absolute inset-0 bg-[#0e1d2a]/90 backdrop-blur-[2px]"></div>
                
                {/* Dynamic Ambient Blurs */}
                <div className="absolute top-20 -left-20 w-[600px] h-[600px] rounded-full opacity-10 blur-[120px]" style={{ background: '#ff7a21' }}></div>
                <div className="absolute bottom-20 -right-20 w-[600px] h-[600px] rounded-full opacity-10 blur-[120px]" style={{ background: '#3b82f6' }}></div>
            </div>

            {/* LOGO — Top Left (Desktop) */}
            <div className="absolute top-10 left-10 z-20 hidden lg:flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
                <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #ff7a21, #ff9a52)' }}>
                    <RiRocketLine className="text-white text-lg" />
                </div>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '18px', color: '#fff' }}>
                    Startup<span style={{ color: '#ff7a21' }}>Nest</span>
                </span>
            </div>

            {/* MAIN CARD */}
            <div className="relative z-10 w-full max-w-[480px] animate-lift">
                <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border-l-[6px] border-[#ff7a21]">
                    
                    {/* Header */}
                    <div className="px-10 pt-10 pb-6 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#ff7a21]/10 border border-[#ff7a21]/20 mb-4">
                            <RiLockPasswordLine className="text-[#ff7a21] text-xs" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff7a21]">Security Protocol</span>
                        </div>
                        <h1 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: '32px', fontWeight: 800, color: '#0e1d2a', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                            Reset Access
                        </h1>
                        <p className="mt-3 text-slate-500 text-sm font-medium">
                            Verify your identity to secure your account.
                        </p>
                    </div>

                    {/* Form Body */}
                    <form onSubmit={handleReset} className="px-10 pb-8 space-y-6">
                        
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
                        <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                            <div className="flex items-center gap-2">
                                <RiShieldCheckLine className="text-[#ff7a21]" size={14} />
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Verification Step</p>
                            </div>
                            <p className="text-sm font-bold text-gray-700 leading-snug">
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
                        <div className="grid grid-cols-1 gap-5 pt-2">
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
                            <Link to="/login" className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all">
                                <RiArrowLeftLine />
                                Return to Login
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Footer Copyright */}
                <p className="mt-8 text-center text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                    © 2026 StartupNest Security Unit
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
