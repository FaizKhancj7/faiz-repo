import React, { useState, useRef, useEffect } from 'react';
import { RiArrowDownSLine } from 'react-icons/ri';

const Dropdown = ({ value, options, onChange, icon: Icon, error, className = "", style = {} }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value) || options[0];

    const handleSelect = (val) => {
        onChange(val);
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 z-10 transition-all pointer-events-none" style={{ color: 'var(--theme-text-muted)' }} />}
            
            <button
                type="button"
                onClick={() => { setIsOpen(!isOpen); }}
                className={`w-full text-left ${Icon ? 'pl-12' : 'pl-4'} pr-10 py-3 rounded-2xl outline-none transition-all font-bold text-sm flex items-center justify-between`}
                style={{
                    background: error ? 'rgba(239,68,68,0.05)' : (isOpen ? 'var(--theme-bg-card)' : 'var(--theme-bg-input)'),
                    border: error ? '2px solid #ef4444' : '1px solid',
                    borderColor: error ? '#ef4444' : (isOpen ? 'var(--theme-accent)' : 'var(--theme-border)'),
                    color: 'var(--theme-text-primary)',
                    backdropFilter: 'var(--theme-glass)',
                    ...style
                }}
            >
                <span className="truncate">{selectedOption?.label}</span>
                <RiArrowDownSLine 
                    className="absolute right-4 text-lg transition-transform duration-300" 
                    style={{ color: 'var(--theme-text-muted)', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} 
                />
            </button>

            {/* Error Message */}
            {error && <p className="text-[10px] font-bold mt-1 ml-1" style={{ color: 'var(--theme-status-rejected-text)' }}>{error}</p>}

            {/* Dropdown Menu (Animated) */}
            <div 
                className={`absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-2xl border overflow-hidden shadow-xl transition-all duration-200 origin-top`}
                style={{
                    background: 'var(--theme-nav-dropdown)',
                    borderColor: 'var(--theme-border)',
                    backdropFilter: 'var(--theme-glass)',
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? 'scaleY(1)' : 'scaleY(0)',
                    pointerEvents: isOpen ? 'auto' : 'none'
                }}
            >
                <div className="max-h-[240px] overflow-y-auto custom-scrollbar flex flex-col p-1">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => handleSelect(opt.value)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--theme-accent-light)';
                            }}
                            onMouseLeave={(e) => {
                                if (value !== opt.value) e.currentTarget.style.background = 'transparent';
                            }}
                            className="text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all truncate"
                            style={{
                                color: value === opt.value ? 'var(--theme-accent)' : 'var(--theme-text-primary)',
                                background: value === opt.value ? 'var(--theme-accent-light)' : 'transparent',
                            }}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dropdown;
