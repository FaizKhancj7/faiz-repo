import React from 'react';
import { RiRocketLine, RiShieldUserLine } from 'react-icons/ri';

/**
 * AnimatedBackground — Reusable High-Energy Visual System
 * 
 * Includes:
 * - Animated Tech Grid
 * - Hue-Shifting Mesh Gradients
 * - Digital Particle System
 * - Floating Ornaments (Optional)
 */
const AnimatedBackground = ({ showOrnaments = false }) => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none transition-all duration-300 z-0">
            {/* 1. Animated Tech Grid */}
            <div className="absolute inset-0 opacity-[0.03] animate-grid" 
                style={{ 
                    backgroundImage: 'linear-gradient(var(--theme-accent) 1px, transparent 1px), linear-gradient(90deg, var(--theme-accent) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}></div>

            {/* 2. Sweeping Energy Beams */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-[200%] h-[1px] animate-beam" 
                    style={{ background: 'linear-gradient(90deg, transparent, var(--theme-accent), transparent)' }}></div>
                <div className="absolute top-1/2 left-0 w-[200%] h-[1px] animate-beam" 
                    style={{ background: 'linear-gradient(90deg, transparent, var(--theme-accent), transparent)', animationDelay: '-2s' }}></div>
            </div>

            {/* 3. Hue-Shifting Mesh Gradients (Peak Density) */}
            <div className="absolute inset-0 animate-hue opacity-90 scale-110">
                <div className="absolute top-0 left-1/4 w-[700px] h-[700px] rounded-full opacity-50 blur-[120px] animate-liquid" style={{ background: 'var(--theme-accent)' }}></div>
                <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] rounded-full opacity-40 blur-[100px] animate-liquid" style={{ background: 'var(--theme-text-primary)', animationDelay: '-2s' }}></div>
                <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-30 blur-[150px] animate-liquid" style={{ background: 'var(--theme-accent)', animationDelay: '-4s' }}></div>
                <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full opacity-35 blur-[100px] animate-liquid" style={{ background: 'var(--theme-text-primary)', animationDelay: '-6s' }}></div>
                <div className="absolute bottom-1/3 right-1/2 w-[600px] h-[600px] rounded-full opacity-25 blur-[120px] animate-liquid" style={{ background: 'var(--theme-accent)', animationDelay: '-8s' }}></div>
            </div>

            {/* 4. Digital Particle System (Peak Volume - 200 Particles) */}
            <div className="absolute inset-0 overflow-hidden opacity-90">
                {[...Array(200)].map((_, i) => (
                    <div key={i} className="absolute w-[2.5px] h-[2.5px] rounded-full animate-particle" 
                        style={{ 
                            background: 'var(--theme-accent)',
                            left: `${(i * 0.7) % 100}%`,
                            bottom: '-30px',
                            animationDelay: `${(i * 0.05) % 6}s`,
                            animationDuration: `${1.5 + (i % 3)}s`
                        }}></div>
                ))}
            </div>

            {/* 5. Floating Ornaments (Optional) */}
            {showOrnaments && (
                <>
                    <div className="absolute top-1/4 left-10 opacity-[0.05] animate-float pointer-events-none hidden lg:block" style={{ color: 'var(--theme-accent)' }}>
                        <RiRocketLine size={120} />
                    </div>
                    <div className="absolute bottom-1/4 right-20 opacity-[0.03] animate-float pointer-events-none hidden lg:block" style={{ color: 'var(--theme-text-primary)', animationDelay: '-3s' }}>
                        <RiShieldUserLine size={180} />
                    </div>
                </>
            )}
        </div>
    );
};

export default AnimatedBackground;
