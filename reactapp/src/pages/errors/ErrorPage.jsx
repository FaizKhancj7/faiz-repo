import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RiHome4Line, RiArrowGoBackLine } from 'react-icons/ri';

const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden p-6" style={{ background: 'var(--theme-bg-primary)' }}>
            {/* Background elements to maintain visual consistency */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px]" style={{ background: 'var(--theme-accent)' }}></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px]" style={{ background: 'var(--theme-accent)' }}></div>
            </div>

            <div className="relative z-10 max-w-2xl w-full text-center flex flex-col items-center animate-lift">
                {/* 404 Image */}
                <div className="mb-8 relative">
                    <img 
                        src="/—Pngtree—404 error page_2596650.png" 
                        alt="404 Error" 
                        className="w-full max-w-md h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 hover:scale-105"
                    />
                </div>

                {/* Error Text */}
                <h1 
                    className="text-4xl md:text-5xl font-black mb-4 transition-all duration-300"
                    style={{ 
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        color: 'var(--theme-text-primary)',
                        letterSpacing: '-0.04em'
                    }}
                >
                    Lost in Space?
                </h1>
                
                <p 
                    className="text-lg md:text-xl mb-10 max-w-md mx-auto leading-relaxed transition-all duration-300"
                    style={{ color: 'var(--theme-text-muted)' }}
                >
                    The page you are looking for has floated away into the digital void. Don't worry, let's get you back to safety.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-xs sm:max-w-none">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 px-8 py-3 rounded-full font-bold transition-all duration-300 hover:scale-105 active:scale-95 group"
                        style={{ 
                            background: 'var(--theme-bg-secondary)',
                            color: 'var(--theme-text-primary)',
                            border: '2px solid var(--theme-border)'
                        }}
                    >
                        <RiArrowGoBackLine className="text-xl group-hover:-translate-x-1 transition-transform" />
                        Go Back
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center justify-center gap-2 px-8 py-3 rounded-full font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg group"
                        style={{ 
                            background: 'var(--theme-accent-gradient)',
                            color: '#fff',
                            boxShadow: '0 10px 20px -10px var(--theme-accent)'
                        }}
                    >
                        <RiHome4Line className="text-xl group-hover:scale-110 transition-transform" />
                        Return Home
                    </button>
                </div>
            </div>

            {/* Subtle Grid Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--theme-accent) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>
    );
};

export default ErrorPage;
