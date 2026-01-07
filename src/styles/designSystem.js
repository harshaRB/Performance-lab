/**
 * Vylos Labs - Design System
 * Obsidian Bioluminescence Theme
 * 
 * This file contains all shared styles, colors, typography, and animation presets
 * for consistent branding across the entire application.
 */

// ============================================
// COLOR PALETTE
// ============================================
export const colors = {
    // Backgrounds
    background: {
        primary: '#050505',      // Deep black
        secondary: '#0F1115',    // Elevated surface
        tertiary: '#1A1D23',     // Cards/modals
        elevated: '#252830',     // Hovered cards
    },

    // Brand Colors
    brand: {
        primary: '#6366f1',      // Indigo - Main accent
        secondary: '#8b5cf6',    // Violet - Secondary accent
        tertiary: '#a855f7',     // Purple - Highlights
    },

    // Semantic Colors  
    accent: {
        success: '#10b981',      // Emerald
        warning: '#f59e0b',      // Amber
        danger: '#ef4444',       // Red
        info: '#3b82f6',         // Blue
    },

    // Module Colors (for different trackers)
    modules: {
        nutrition: '#22c55e',    // Green
        sleep: '#8b5cf6',        // Violet
        training: '#f97316',     // Orange
        learning: '#06b6d4',     // Cyan
        screen: '#eab308',       // Yellow
        hydration: '#3b82f6',    // Blue
    },

    // Text
    text: {
        primary: '#ffffff',
        secondary: '#e5e5e5',
        muted: '#a3a3a3',
        dim: '#525252',
    },

    // Borders
    border: {
        subtle: 'rgba(255,255,255,0.06)',
        default: 'rgba(255,255,255,0.1)',
        hover: 'rgba(255,255,255,0.15)',
    },

    // Glows
    glow: {
        primary: 'rgba(99,102,241,0.3)',
        secondary: 'rgba(139,92,246,0.3)',
        success: 'rgba(16,185,129,0.3)',
    }
};

// ============================================
// TYPOGRAPHY
// ============================================
export const typography = {
    fontFamily: {
        primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        mono: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
    },

    fontSize: {
        xs: '0.75rem',     // 12px
        sm: '0.875rem',    // 14px
        base: '1rem',      // 16px
        lg: '1.125rem',    // 18px
        xl: '1.25rem',     // 20px
        '2xl': '1.5rem',   // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem',  // 36px
    },

    fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },

    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
    }
};

// ============================================
// SPACING
// ============================================
export const spacing = {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
};

// ============================================
// SHADOWS & EFFECTS
// ============================================
export const shadows = {
    sm: '0 1px 2px rgba(0,0,0,0.5)',
    md: '0 4px 6px rgba(0,0,0,0.4)',
    lg: '0 10px 15px rgba(0,0,0,0.3)',
    xl: '0 25px 50px -12px rgba(0,0,0,0.5)',
    glow: {
        primary: '0 0 20px rgba(99,102,241,0.3)',
        secondary: '0 0 20px rgba(139,92,246,0.3)',
        success: '0 0 20px rgba(16,185,129,0.3)',
    },
    glass: '0 8px 32px rgba(0,0,0,0.4)',
};

// ============================================
// BORDER RADIUS
// ============================================
export const radius = {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    '3xl': '24px',
    full: '9999px',
};

// ============================================
// ANIMATION PRESETS (for Framer Motion)
// ============================================
export const animations = {
    // Page transitions
    pageEnter: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.3, ease: 'easeOut' }
    },

    // Card hover
    cardHover: {
        whileHover: { scale: 1.02, y: -4 },
        whileTap: { scale: 0.98 },
        transition: { type: 'spring', stiffness: 300, damping: 20 }
    },

    // Button hover
    buttonHover: {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
    },

    // Fade in
    fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.3 }
    },

    // Slide up
    slideUp: {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: 'easeOut' }
    },

    // Stagger children
    staggerContainer: {
        animate: { transition: { staggerChildren: 0.05 } }
    },
    staggerItem: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 }
    },

    // Glow pulse
    glowPulse: {
        animate: {
            boxShadow: [
                '0 0 20px rgba(99,102,241,0.2)',
                '0 0 40px rgba(99,102,241,0.4)',
                '0 0 20px rgba(99,102,241,0.2)'
            ]
        },
        transition: { duration: 2, repeat: Infinity }
    }
};

// ============================================
// COMMON COMPONENT STYLES
// ============================================
export const componentStyles = {
    // Page container
    page: {
        minHeight: '100vh',
        background: colors.background.primary,
        fontFamily: typography.fontFamily.primary,
        color: colors.text.secondary,
    },

    // Glass card
    glassCard: {
        background: 'rgba(15, 17, 21, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${colors.border.default}`,
        borderRadius: radius['2xl'],
        padding: spacing.lg,
        boxShadow: shadows.glass,
    },

    // Metric card
    metricCard: {
        background: colors.background.secondary,
        border: `1px solid ${colors.border.subtle}`,
        borderRadius: radius.xl,
        padding: spacing.lg,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
    },

    // Input field
    input: {
        width: '100%',
        padding: '0.875rem 1rem',
        background: 'rgba(255,255,255,0.05)',
        border: `1px solid ${colors.border.default}`,
        borderRadius: radius.lg,
        color: colors.text.primary,
        fontSize: typography.fontSize.sm,
        fontFamily: typography.fontFamily.mono,
        outline: 'none',
        transition: 'all 0.3s ease',
    },

    // Primary button
    buttonPrimary: {
        padding: '0.875rem 1.5rem',
        background: `linear-gradient(135deg, ${colors.brand.primary} 0%, ${colors.brand.secondary} 100%)`,
        border: 'none',
        borderRadius: radius.lg,
        color: colors.text.primary,
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.bold,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        cursor: 'pointer',
        boxShadow: shadows.glow.primary,
        transition: 'all 0.3s ease',
    },

    // Secondary button
    buttonSecondary: {
        padding: '0.875rem 1.5rem',
        background: 'rgba(255,255,255,0.05)',
        border: `1px solid ${colors.border.default}`,
        borderRadius: radius.lg,
        color: colors.text.secondary,
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },

    // Badge
    badge: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.25rem 0.75rem',
        background: 'rgba(99,102,241,0.1)',
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: radius.full,
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.medium,
        color: colors.brand.primary,
    },

    // Section title
    sectionTitle: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.dim,
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        marginBottom: spacing.md,
    },
};

// ============================================
// GRADIENT PRESETS
// ============================================
export const gradients = {
    primary: `linear-gradient(135deg, ${colors.brand.primary} 0%, ${colors.brand.secondary} 100%)`,
    success: `linear-gradient(135deg, #10b981 0%, #059669 100%)`,
    warning: `linear-gradient(135deg, #f59e0b 0%, #d97706 100%)`,
    danger: `linear-gradient(135deg, #ef4444 0%, #dc2626 100%)`,
    dark: `linear-gradient(135deg, ${colors.background.secondary} 0%, ${colors.background.primary} 100%)`,
    radial: `radial-gradient(circle at 50% 50%, ${colors.background.tertiary} 0%, ${colors.background.primary} 100%)`,
};

// Helper function to get module color
export const getModuleColor = (module) => colors.modules[module] || colors.brand.primary;

// Helper function to get module gradient
export const getModuleGradient = (module) => {
    const color = getModuleColor(module);
    return `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`;
};

export default {
    colors,
    typography,
    spacing,
    shadows,
    radius,
    animations,
    componentStyles,
    gradients,
    getModuleColor,
    getModuleGradient,
};
