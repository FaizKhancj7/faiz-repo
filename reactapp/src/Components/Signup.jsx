// Signup Page — Ascent Modernism Design System
// Fixed viewport (no scroll). Same visual language as LandingPage.
// Functionality is 100% unchanged.

import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RiRocketLine, RiArrowRightLine } from 'react-icons/ri';
import api from '../apiConfig';
import Input from './Reusable/Input';

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        userName: '', email: '', mobile: '', password: '',
        confirmPassword: '', role: 'Entrepreneur', secretQuestionAnswer: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: '' });
    };

    const validateForm = () => {
        let newErrors = {}; let isValid = true;
        if (!/^[a-zA-Z0-9_]{3,}$/.test(formData.userName)) { newErrors.userName = 'Min 3 chars (letters, numbers, underscores).'; isValid = false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { newErrors.email = 'Please enter a valid email.'; isValid = false; }
        if (!/^[6-9]\d{9}$/.test(formData.mobile)) { newErrors.mobile = 'Valid 10-digit mobile number required.'; isValid = false; }
        if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) { newErrors.password = '8+ chars, 1 uppercase, 1 number, 1 special.'; isValid = false; }
        if (formData.password !== formData.confirmPassword) { newErrors.confirmPassword = 'Passwords do not match.'; isValid = false; }
        if (!formData.secretQuestionAnswer) { newErrors.secretQuestionAnswer = 'Answer is required.'; isValid = false; }
        setErrors(newErrors); return isValid;
    };

    const handleSignup = useCallback(async (e) => {
        e.preventDefault();
        if (!validateForm()) { toast.error("Please fix the errors in the form."); return; }
        try {
            const response = await api.post('/user/signup', formData);
            if (response.data.success) { toast.success(response.data.message); navigate('/'); }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create account.");
        }
    }, [formData, navigate, validateForm]);

    // Shared inline style objects
    const labelStyle = { fontSize: '10px', fontWeight: 700, color: '#75777d', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Plus Jakarta Sans', sans-serif" };
    const inputFocusStyle = '2px solid #0e1d2a';

    return (
        <div className="h-screen overflow-hidden flex" style={{ background: 'linear-gradient(135deg, #f7f9ff 0%, #e8effd 60%, #f7f9ff 100%)', fontFamily: "'Inter', sans-serif" }}>

            {/* Ambient blurs */}
            <div className="absolute top-10 -left-20 w-80 h-80 rounded-full opacity-15 blur-[100px] pointer-events-none" style={{ background: '#ff7a21' }}></div>
            <div className="absolute bottom-10 right-0 w-80 h-80 rounded-full opacity-10 blur-[100px] pointer-events-none" style={{ background: '#3b82f6' }}></div>

            {/* LEFT — Branding Panel */}
            <div className="hidden lg:flex w-[420px] flex-shrink-0 flex-col justify-between relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0e1d2a 0%, #0a1420 100%)' }}>
                <div className="p-10">
                    <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate('/')}>
                        <div className="p-2 rounded-xl transition-all duration-300 group-hover:rotate-12" style={{ background: 'linear-gradient(135deg, #ff7a21, #ff9a52)' }}>
                            <RiRocketLine className="text-white text-lg" />
                        </div>
                        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '18px', color: '#fff' }}>
                            Startup<span style={{ color: '#ff7a21' }}>Nest</span>
                        </span>
                    </div>
                </div>

                <div className="p-10 flex-grow flex flex-col justify-center">
                    <h2 className="animate-lift" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '36px', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em', color: '#fff' }}>
                        Launch your{' '}<span style={{ color: '#ff7a21', fontStyle: 'italic' }}>vision</span>{' '}today.
                    </h2>
                    <p className="animate-lift delay-100 mt-5" style={{ fontSize: '14px', lineHeight: 1.7, color: '#7a8499' }}>
                        Join 500+ founders and investors building the future on StartupNest.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mt-10 animate-lift delay-200">
                        {[{ v: '500+', l: 'Startups' }, { v: '$2.4B', l: 'Funded' }, { v: '45k+', l: 'Community' }, { v: '12', l: 'Hubs' }].map((s) => (
                            <div key={s.l} className="transition-all duration-300 hover:-translate-y-1" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px' }}>
                                <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: '20px', fontWeight: 800, color: '#ff7a21', letterSpacing: '-0.02em' }}>{s.v}</p>
                                <p style={{ fontSize: '10px', fontWeight: 600, color: '#7a8499', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: '2px' }}>{s.l}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-10">
                    <p style={{ fontSize: '10px', color: '#45474c', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>© 2026 StartupNest Ecosystem</p>
                </div>
            </div>

            {/* RIGHT — Signup Form */}
            <div className="flex-grow flex items-center justify-center p-6 relative">
                <div className="w-full max-w-lg animate-lift delay-100">

                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-2.5 mb-8 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #ff7a21, #ff9a52)' }}>
                            <RiRocketLine className="text-white text-lg" />
                        </div>
                        <span style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, fontSize: '18px', color: '#0e1d2a' }}>Startup<span style={{ color: '#ff7a21' }}>Nest</span></span>
                    </div>

                    {/* Header */}
                    <div className="mb-6">
                        <h2 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: '28px', fontWeight: 800, letterSpacing: '-0.03em', color: '#0e1d2a' }}>Create Account</h2>
                        <p className="mt-1" style={{ fontSize: '14px', color: '#45474c' }}>Start building your startup journey</p>
                    </div>

                    {/* Form Card */}
                    <form onSubmit={handleSignup} className="space-y-4" style={{ background: '#fff', padding: '28px', borderRadius: '24px', border: '1px solid #e5e7eb' }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Username" name="userName" placeholder="johndoe_99" value={formData.userName} onChange={handleChange} error={errors.userName} />
                            <Input label="Mobile" name="mobile" placeholder="9876543210" value={formData.mobile} onChange={handleChange} error={errors.mobile} />
                        </div>

                        <Input label="Email Address" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} error={errors.email} />

                        {/* Role Selector */}
                        <div className="flex flex-col gap-1.5">
                            <label style={labelStyle}>Select Role</label>
                            <select name="role" value={formData.role} onChange={handleChange}
                                className="w-full outline-none transition-all duration-300"
                                style={{ border: '1.5px solid #c5c6cd', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', fontWeight: 500, color: '#0e1d2a', background: '#f7f9ff' }}
                                onFocus={(e) => { e.target.style.border = inputFocusStyle; e.target.style.boxShadow = '0 0 0 3px rgba(255,122,33,0.15)'; }}
                                onBlur={(e) => { e.target.style.border = '1.5px solid #c5c6cd'; e.target.style.boxShadow = 'none'; }}>
                                <option value="Entrepreneur">Entrepreneur</option>
                                <option value="Mentor">Mentor</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Password" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} error={errors.password} />
                            <Input label="Confirm Password" name="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
                        </div>

                        {/* Security Question */}
                        <div style={{ background: '#f7f9ff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '14px' }}>
                            <p style={labelStyle} className="mb-2">Security Question</p>
                            <p style={{ fontSize: '13px', color: '#45474c', marginBottom: '10px' }}>What was the name of your first school?</p>
                            <Input label="Your Answer" name="secretQuestionAnswer" placeholder="St. Mary's School" value={formData.secretQuestionAnswer} onChange={handleChange} error={errors.secretQuestionAnswer} />
                        </div>

                        {/* Submit */}
                        <button type="submit" className="w-full flex items-center justify-center gap-2 text-white text-sm font-bold uppercase transition-all duration-300 active:scale-95"
                            style={{ fontFamily: "'Plus Jakarta Sans'", letterSpacing: '0.1em', background: 'linear-gradient(135deg, #ff7a21, #ff9a52)', padding: '14px', borderRadius: '9999px', boxShadow: '0 6px 24px rgba(255,122,33,0.3)', marginTop: '8px' }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(255,122,33,0.45)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(255,122,33,0.3)'; }}>
                            <span>Register Account</span>
                            <RiArrowRightLine className="text-lg" />
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-5 text-center">
                        <p style={{ fontSize: '14px', color: '#45474c' }}>
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold transition-colors duration-300 hover:underline" style={{ color: '#ff7a21' }}>Login Here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;