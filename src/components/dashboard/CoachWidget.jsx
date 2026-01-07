import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { getCoachInsight } from '../../utils/Coach';
import { colors, typography, radius, animations } from '../../styles/designSystem';

// ============================================
// STYLES
// ============================================
const styles = {
    card: {
        position: 'relative',
        overflow: 'hidden',
        borderRadius: radius.xl,
        padding: '1.5rem',
        minHeight: '140px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },

    content: {
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
    },

    iconWrapper: {
        padding: '0.75rem',
        borderRadius: radius.xl,
        background: 'rgba(0,0,0,0.2)',
        backdropFilter: 'blur(10px)',
    },

    textContent: {
        flex: 1,
    },

    label: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.bold,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },

    badge: {
        fontSize: '0.6rem',
        padding: '0.15rem 0.5rem',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: radius.full,
        fontFamily: typography.fontFamily.mono,
    },

    message: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        lineHeight: typography.lineHeight.relaxed,
    },

    // Noise overlay
    noise: {
        position: 'absolute',
        inset: 0,
        opacity: 0.15,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        pointerEvents: 'none',
    },
};

// Color themes for different insight types
const themes = {
    neutral: {
        background: `linear-gradient(135deg, ${colors.brand.primary}20 0%, ${colors.brand.secondary}10 100%)`,
        border: `${colors.brand.primary}30`,
        text: colors.brand.primary,
        icon: Sparkles,
    },
    warning: {
        background: `linear-gradient(135deg, ${colors.accent.warning}20 0%, ${colors.accent.danger}10 100%)`,
        border: `${colors.accent.warning}30`,
        text: colors.accent.warning,
        icon: AlertTriangle,
    },
    success: {
        background: `linear-gradient(135deg, ${colors.accent.success}20 0%, ${colors.modules.learning}10 100%)`,
        border: `${colors.accent.success}30`,
        text: colors.accent.success,
        icon: CheckCircle,
    },
};

// ============================================
// COACH WIDGET COMPONENT
// ============================================
const CoachWidget = () => {
    const { scores } = useAppStore();

    // Memoize insight calculation to prevent recalculation on every render
    const insight = useMemo(() => getCoachInsight(scores), [scores]);
    const theme = themes[insight.type] || themes.neutral;
    const Icon = theme.icon;

    return (
        <motion.div
            style={{
                ...styles.card,
                background: theme.background,
                border: `1px solid ${theme.border}`,
            }}
            whileHover={{ scale: 1.01 }}
            {...animations.fadeIn}
        >
            {/* Noise Texture */}
            <div style={styles.noise} />

            {/* Content */}
            <div style={styles.content}>
                <motion.div
                    style={styles.iconWrapper}
                    animate={{
                        scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    <Icon size={24} color={theme.text} />
                </motion.div>

                <div style={styles.textContent}>
                    <div style={{ ...styles.label, color: colors.text.primary }}>
                        AI Coach
                        <span style={styles.badge}>BETA</span>
                    </div>
                    <p style={{ ...styles.message, color: theme.text }}>
                        {insight.text}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default React.memo(CoachWidget);
