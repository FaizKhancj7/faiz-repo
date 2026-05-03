/**
 * ThemeContext.jsx — Global Theme Provider
 * 
 * This context reads the user's preferred theme from localStorage,
 * applies the corresponding CSS custom properties to the document root,
 * and provides a toggle function to all children components.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import themes, { THEME_KEYS } from '../config/themeConfig';

const ThemeContext = createContext();

/**
 * Custom hook to access theme state and controls.
 * Returns: { theme, setTheme, cycleTheme, themeConfig }
 */
export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
    return ctx;
};

/**
 * Apply all CSS variables from a theme object onto document.documentElement.
 */
const applyThemeToDOM = (themeKey) => {
    const themeVars = themes[themeKey];
    if (!themeVars) return;

    const root = document.documentElement;
    Object.entries(themeVars).forEach(([key, value]) => {
        if (key.startsWith('--')) {
            root.style.setProperty(key, value);
        }
    });

    // Set a data attribute for potential CSS-only selectors
    root.setAttribute('data-theme', themeKey);
};

export const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState(() => {
        const saved = localStorage.getItem('startupnest-theme');
        return THEME_KEYS.includes(saved) ? saved : 'light';
    });

    // Apply theme whenever it changes
    useEffect(() => {
        applyThemeToDOM(theme);
        localStorage.setItem('startupnest-theme', theme);
    }, [theme]);

    // Safe setter with validation
    const setTheme = useCallback((newTheme) => {
        if (THEME_KEYS.includes(newTheme)) {
            setThemeState(newTheme);
        }
    }, []);

    // Cycle through themes: light ↔ dark
    const cycleTheme = useCallback(() => {
        setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
    }, []);

    const value = {
        theme,
        setTheme,
        cycleTheme,
        themeConfig: themes[theme],
        themeName: themes[theme]?.name || 'Light',
        themeIcon: themes[theme]?.icon || '☀️',
        allThemes: THEME_KEYS.map(key => ({
            key,
            name: themes[key].name,
            icon: themes[key].icon
        }))
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
