/**
 * themeConfig.js — Light & Dark Design Token System
 * 
 * Defines the two core visual identities for the StartupNest platform.
 * Each theme is a flat object of CSS custom property values that get applied
 * to document.documentElement by the ThemeContext provider.
 */

const themes = {

    // ═══════════════════════════════════════════════════════
    // THEME 1: LIGHT — Kinetic Mentor (Warm, Energetic, Professional)
    // ═══════════════════════════════════════════════════════
    light: {
        name: 'Light',
        icon: '☀️',

        // Backgrounds
        '--theme-bg-primary': '#fef8f3',
        '--theme-bg-secondary': '#f8f3ee',
        '--theme-bg-card': '#ffffff',
        '--theme-bg-input': '#f3ede8',
        '--theme-bg-overlay': 'rgba(254, 248, 243, 0.9)',

        // Navigation
        '--theme-nav-bg': 'rgba(254, 248, 243, 0.92)',
        '--theme-nav-text': '#1d1b19',
        '--theme-nav-text-muted': '#564334',
        '--theme-nav-border': '#ddc1ae',
        '--theme-nav-dropdown': '#ffffff',

        // Accent
        '--theme-accent': '#904d00',
        '--theme-accent-hover': '#ad2c00',
        '--theme-accent-light': 'rgba(144, 77, 0, 0.08)',
        '--theme-accent-glow': 'rgba(144, 77, 0, 0.25)',
        '--theme-accent-gradient': 'linear-gradient(135deg, #904d00, #ff8c00)',

        // Text
        '--theme-text-primary': '#1d1b19',
        '--theme-text-secondary': '#564334',
        '--theme-text-muted': '#897362',
        '--theme-text-on-accent': '#ffffff',
        '--theme-text-on-dark': '#1d1b19',

        // Borders & Surfaces
        '--theme-border': '#ddc1ae',
        '--theme-border-hover': 'rgba(144, 77, 0, 0.4)',
        '--theme-border-card': '#ede7e2',

        // Shape & Effects
        '--theme-radius': '12px',
        '--theme-radius-lg': '20px',
        '--theme-radius-xl': '32px',
        '--theme-shadow': '0 4px 20px rgba(144, 77, 0, 0.05)',
        '--theme-shadow-lg': '0 12px 48px rgba(144, 77, 0, 0.08)',
        '--theme-glass': 'blur(12px)',

        // Table
        '--theme-table-header': '#f3ede8',
        '--theme-table-header-text': '#904d00',
        '--theme-table-row-hover': 'rgba(144, 77, 0, 0.04)',
        '--theme-table-border': '#ede7e2',

        // Status Badges
        '--theme-status-pending-bg': '#ffebcc',
        '--theme-status-pending-text': '#904d00',
        '--theme-status-approved-bg': '#e6fffa',
        '--theme-status-approved-text': '#047481',
        '--theme-status-rejected-bg': '#fff5f5',
        '--theme-status-rejected-text': '#c53030',

        // Footer
        '--theme-footer-bg': '#fef8f3',
        '--theme-footer-text': '#897362',
        '--theme-footer-text-hover': '#1d1b19',

        // Toast
        '--theme-toast-bg': '#ffffff',
        '--theme-toast-text': '#1d1b19',
        '--theme-toast-border': '#904d00',
    },

    // ═══════════════════════════════════════════════════════
    // THEME 2: DARK — Solar Deep (Rooted in Kinetic Palette)
    // ═══════════════════════════════════════════════════════
    dark: {
        name: 'Dark',
        icon: '🌙',

        // Backgrounds
        '--theme-bg-primary': '#1d1b19',
        '--theme-bg-secondary': '#161d1f',
        '--theme-bg-card': 'rgba(50, 48, 45, 0.8)',
        '--theme-bg-input': 'rgba(22, 29, 31, 0.6)',
        '--theme-bg-overlay': 'rgba(29, 27, 25, 0.9)',

        // Navigation
        '--theme-nav-bg': 'rgba(29, 27, 25, 0.92)',
        '--theme-nav-text': '#ffffff',
        '--theme-nav-text-muted': '#ffffff',
        '--theme-nav-border': '#41484a',
        '--theme-nav-dropdown': '#32302d',

        // Accent
        '--theme-accent': '#ff8c00',
        '--theme-accent-hover': '#ffb77d',
        '--theme-accent-light': 'rgba(255, 140, 0, 0.12)',
        '--theme-accent-glow': 'rgba(255, 140, 0, 0.4)',
        '--theme-accent-gradient': 'linear-gradient(135deg, #ff8c00, #ffb77d)',

        // Text
        '--theme-text-primary': '#ffffff',
        '--theme-text-secondary': '#ffffff',
        '--theme-text-muted': '#6a7275',
        '--theme-text-on-accent': '#1d1b19',
        '--theme-text-on-dark': '#fef8f3',

        // Borders & Surfaces
        '--theme-border': '#41484a',
        '--theme-border-hover': '#ff8c00',
        '--theme-border-card': 'rgba(255, 140, 0, 0.1)',

        // Shape & Effects
        '--theme-radius': '12px',
        '--theme-radius-lg': '20px',
        '--theme-radius-xl': '28px',
        '--theme-shadow': '0 4px 24px rgba(0,0,0,0.2)',
        '--theme-shadow-lg': '0 12px 48px rgba(0,0,0,0.3)',
        '--theme-glass': 'blur(16px)',

        // Table
        '--theme-table-header': 'rgba(255, 140, 0, 0.1)',
        '--theme-table-header-text': '#ff8c00',
        '--theme-table-row-hover': 'rgba(255, 140, 0, 0.05)',
        '--theme-table-border': '#41484a',

        // Status Badges
        '--theme-status-pending-bg': 'rgba(255, 140, 0, 0.15)',
        '--theme-status-pending-text': '#ffb77d',
        '--theme-status-approved-bg': 'rgba(34, 197, 94, 0.15)',
        '--theme-status-approved-text': '#4ade80',
        '--theme-status-rejected-bg': 'rgba(239, 68, 68, 0.15)',
        '--theme-status-rejected-text': '#f87171',

        // Footer
        '--theme-footer-bg': '#161d1f',
        '--theme-footer-text': '#ffffff',
        '--theme-footer-text-hover': '#ffffff',

        // Toast
        '--theme-toast-bg': '#32302d',
        '--theme-toast-text': '#fef8f3',
        '--theme-toast-border': '#ff8c00',
    }
};

export const THEME_KEYS = Object.keys(themes);
export default themes;
