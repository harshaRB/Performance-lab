import React from 'react';
import { motion } from 'framer-motion';
import { colors, typography, radius } from '../../styles/designSystem';

/**
 * MetricCard Component - Data-First Design
 * 
 * Features:
 * - MASSIVE numerical values (tactical data terminal aesthetic)
 * - JetBrains Mono typography
 * - Glitch animation on hover
 * - CSS-only glow effects
 * - No images - pure CSS/SVG
 */

// Glitch animation keyframes (CSS-in-JS)
const glitchKeyframes = `
@keyframes glitch {
    0% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(-2px, -2px); }
    60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); }
    100% { transform: translate(0); }
}

@keyframes glitchColor {
    0% { text-shadow: 2px 0 #ff0000, -2px 0 #00ffff; }
    25% { text-shadow: -2px 0 #ff0000, 2px 0 #00ffff; }
    50% { text-shadow: 2px 0 #00ffff, -2px 0 #ff0000; }
    75% { text-shadow: -2px 0 #00ffff, 2px 0 #ff0000; }
    100% { text-shadow: 2px 0 #ff0000, -2px 0 #00ffff; }
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
}
`;

const styles = {
    card: {
        position: 'relative',
        overflow: 'hidden',
        background: 'rgba(15, 17, 21, 0.6)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: radius.xl,
        padding: '1.5rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },

    // Background glow effect
    glow: {
        position: 'absolute',
        bottom: '-50%',
        right: '-50%',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        filter: 'blur(80px)',
        opacity: 0.15,
        transition: 'opacity 0.5s ease',
    },

    // Noise texture overlay
    noise: {
        position: 'absolute',
        inset: 0,
        opacity: 0.03,
        pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    },

    // Grid lines on card
    gridOverlay: {
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: `
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
    },

    content: {
        position: 'relative',
        zIndex: 10,
    },

    iconWrapper: {
        width: '48px',
        height: '48px',
        borderRadius: radius.lg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem',
        position: 'relative',
    },

    // Icon pulse ring
    iconRing: {
        position: 'absolute',
        inset: '-4px',
        borderRadius: radius.lg,
        border: '1px solid',
        opacity: 0.3,
    },

    title: {
        fontSize: '0.65rem',
        fontWeight: 700,
        color: colors.text.dim,
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        marginBottom: '0.75rem',
        fontFamily: typography.fontFamily.mono,
    },

    // MASSIVE value display
    value: {
        fontSize: '3rem', // Massive!
        fontWeight: 800,
        fontFamily: "'JetBrains Mono', monospace",
        color: colors.text.primary,
        letterSpacing: '-0.03em',
        lineHeight: 1,
        marginBottom: '0.5rem',
        transition: 'all 0.1s ease',
    },

    // Glitch effect on hover
    valueGlitch: {
        animation: 'glitch 0.3s ease-in-out, glitchColor 0.3s ease-in-out',
    },

    subtext: {
        fontSize: '0.7rem',
        color: colors.text.muted,
        fontFamily: typography.fontFamily.mono,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },

    indicator: {
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        animation: 'pulse 2s ease-in-out infinite',
    },

    // Corner accent
    cornerAccent: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '40px',
        height: '40px',
        borderTop: '2px solid',
        borderRight: '2px solid',
        borderTopRightRadius: radius.lg,
        opacity: 0.3,
    },
};

// Module color mapping
const getModuleColor = (color) => {
    const colorMap = {
        nutrition: '#22c55e',
        sleep: '#8b5cf6',
        training: '#f97316',
        learning: '#06b6d4',
        screen: '#eab308',
        hydration: '#3b82f6',
        primary: '#6366f1',
    };
    return colorMap[color] || colorMap.primary;
};

const MetricCard = ({
    title,
    value,
    subtext,
    icon: Icon,
    color = 'primary',
    onClick,
}) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const moduleColor = getModuleColor(color);

    return (
        <>
            {/* Inject keyframes */}
            <style>{glitchKeyframes}</style>

            <motion.div
                style={styles.card}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={onClick}
                whileHover={{
                    scale: 1.02,
                    y: -4,
                    borderColor: `${moduleColor}40`,
                    boxShadow: `0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px ${moduleColor}30`,
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {/* Background Effects */}
                <div style={{ ...styles.glow, background: moduleColor, opacity: isHovered ? 0.25 : 0.1 }} />
                <div style={styles.noise} />
                <div style={styles.gridOverlay} />
                <div style={{ ...styles.cornerAccent, borderColor: moduleColor }} />

                {/* Content */}
                <div style={styles.content}>
                    {/* Icon */}
                    <div style={{ ...styles.iconWrapper, background: `${moduleColor}15` }}>
                        <div style={{ ...styles.iconRing, borderColor: moduleColor }} />
                        <Icon size={24} color={moduleColor} strokeWidth={1.5} />
                    </div>

                    {/* Title */}
                    <h3 style={styles.title}>{title}</h3>

                    {/* MASSIVE Value with Glitch Effect */}
                    <motion.div
                        style={{
                            ...styles.value,
                            color: isHovered ? moduleColor : colors.text.primary,
                            textShadow: isHovered ? `0 0 30px ${moduleColor}50` : 'none',
                            ...(isHovered ? styles.valueGlitch : {}),
                        }}
                        key={value}
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 500 }}
                    >
                        {value}
                    </motion.div>

                    {/* Subtext */}
                    <div style={styles.subtext}>
                        <span style={{ ...styles.indicator, background: moduleColor }} />
                        {subtext}
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default React.memo(MetricCard);
