/**
 * themeConfig.js — Light & Dark Design Token System
 * 
 * Defines the two core visual identities for the StartupNest platform.
 * Each theme is a flat object of CSS custom property values that get applied
 * to document.documentElement by the ThemeContext provider.
 */

const themes = {

    // ═══════════════════════════════════════════════════════
    // THEME 1: LIGHT — Clean, Professional & Soft
    // ═══════════════════════════════════════════════════════
    light: {
        name: 'Light',
        icon: '☀️',

        // Backgrounds
        '--theme-bg-primary': '#fafafa',
        '--theme-bg-secondary': 'rgba(255, 255, 255, 0.65)',
        '--theme-bg-card': 'rgba(255, 255, 255, 0.75)',
        '--theme-bg-input': 'rgba(244, 244, 245, 0.8)',
        '--theme-bg-overlay': 'rgba(250, 250, 250, 0.85)',

        // Navigation
        '--theme-nav-bg': 'rgba(255, 255, 255, 0.92)',
        '--theme-nav-text': '#18181b',
        '--theme-nav-text-muted': '#71717a',
        '--theme-nav-border': '#e4e4e7',
        '--theme-nav-dropdown': '#ffffff',

        // Accent
        '--theme-accent': '#6366f1',
        '--theme-accent-hover': '#4f46e5',
        '--theme-accent-light': 'rgba(99,102,241,0.08)',
        '--theme-accent-glow': 'rgba(99,102,241,0.25)',
        '--theme-accent-gradient': 'linear-gradient(135deg, #6366f1, #818cf8)',

        // Text
        '--theme-text-primary': '#18181b',
        '--theme-text-secondary': '#71717a',
        '--theme-text-muted': '#a1a1aa',
        '--theme-text-on-accent': '#ffffff',
        '--theme-text-on-dark': '#18181b',

        // Borders & Surfaces
        '--theme-border': '#e4e4e7',
        '--theme-border-hover': 'rgba(99,102,241,0.4)',
        '--theme-border-card': '#f4f4f5',

        // Shape & Effects
        '--theme-radius': '16px',
        '--theme-radius-lg': '24px',
        '--theme-radius-xl': '32px',
        '--theme-shadow': '0 2px 16px rgba(0,0,0,0.04)',
        '--theme-shadow-lg': '0 8px 32px rgba(0,0,0,0.06)',
        '--theme-glass': 'blur(12px)',

        // Table
        '--theme-table-header': '#fafafa',
        '--theme-table-header-text': '#6366f1',
        '--theme-table-row-hover': 'rgba(99,102,241,0.04)',
        '--theme-table-border': '#f4f4f5',

        // Status Badges
        '--theme-status-pending-bg': '#fef9c3',
        '--theme-status-pending-text': '#a16207',
        '--theme-status-approved-bg': '#dcfce7',
        '--theme-status-approved-text': '#15803d',
        '--theme-status-rejected-bg': '#fee2e2',
        '--theme-status-rejected-text': '#b91c1c',

        // Footer
        '--theme-footer-bg': '#fafafa',
        '--theme-footer-text': '#a1a1aa',
        '--theme-footer-text-hover': '#18181b',

        // Toast
        '--theme-toast-bg': '#ffffff',
        '--theme-toast-text': '#18181b',
        '--theme-toast-border': '#6366f1',
    },

    // ═══════════════════════════════════════════════════════
    // THEME 2: DARK — Premium, Futuristic & Deep
    // ═══════════════════════════════════════════════════════
    dark: {
        name: 'Dark',
        icon: '🌙',

        // Backgrounds
        '--theme-bg-primary': '#050510',
        '--theme-bg-secondary': '#0a0a1a',
        '--theme-bg-card': 'rgba(15, 15, 30, 0.8)',
        '--theme-bg-input': 'rgba(20, 20, 40, 0.6)',
        '--theme-bg-overlay': 'rgba(5, 5, 16, 0.9)',

        // Navigation
        '--theme-nav-bg': 'rgba(5, 5, 16, 0.92)',
        '--theme-nav-text': '#e4e4e7',
        '--theme-nav-text-muted': 'rgba(228,228,231,0.6)',
        '--theme-nav-border': 'rgba(124, 58, 237, 0.15)',
        '--theme-nav-dropdown': 'rgba(10,10,26,0.95)',

        // Accent
        '--theme-accent': '#7c3aed',
        '--theme-accent-hover': '#6d28d9',
        '--theme-accent-light': 'rgba(124,58,237,0.12)',
        '--theme-accent-glow': 'rgba(124,58,237,0.4)',
        '--theme-accent-gradient': 'linear-gradient(135deg, #7c3aed, #a78bfa)',

        // Text
        '--theme-text-primary': '#e4e4e7',
        '--theme-text-secondary': '#a1a1aa',
        '--theme-text-muted': '#52525b',
        '--theme-text-on-accent': '#ffffff',
        '--theme-text-on-dark': '#e4e4e7',

        // Borders & Surfaces
        '--theme-border': 'rgba(124, 58, 237, 0.2)',
        '--theme-border-hover': 'rgba(124, 58, 237, 0.5)',
        '--theme-border-card': 'rgba(124, 58, 237, 0.1)',

        // Shape & Effects
        '--theme-radius': '12px',
        '--theme-radius-lg': '20px',
        '--theme-radius-xl': '28px',
        '--theme-shadow': '0 4px 24px rgba(124,58,237,0.1)',
        '--theme-shadow-lg': '0 12px 48px rgba(124,58,237,0.15)',
        '--theme-glass': 'blur(16px)',

        // Table
        '--theme-table-header': 'rgba(124,58,237,0.08)',
        '--theme-table-header-text': '#a78bfa',
        '--theme-table-row-hover': 'rgba(124,58,237,0.06)',
        '--theme-table-border': 'rgba(124,58,237,0.08)',

        // Status Badges
        '--theme-status-pending-bg': 'rgba(234,179,8,0.1)',
        '--theme-status-pending-text': '#facc15',
        '--theme-status-approved-bg': 'rgba(34,197,94,0.1)',
        '--theme-status-approved-text': '#22c55e',
        '--theme-status-rejected-bg': 'rgba(239,68,68,0.1)',
        '--theme-status-rejected-text': '#f87171',

        // Footer
        '--theme-footer-bg': '#050510',
        '--theme-footer-text': '#52525b',
        '--theme-footer-text-hover': '#e4e4e7',

        // Toast
        '--theme-toast-bg': 'rgba(15,15,30,0.95)',
        '--theme-toast-text': '#e4e4e7',
        '--theme-toast-border': '#7c3aed',
    }
};

export const THEME_KEYS = Object.keys(themes);
export default themes;
