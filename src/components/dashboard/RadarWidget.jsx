import React from 'react';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { colors, typography, radius, animations } from '../../styles/designSystem';

// ============================================
// STYLES
// ============================================
const styles = {
    card: {
        background: colors.background.secondary,
        border: `1px solid ${colors.border.subtle}`,
        borderRadius: radius.xl,
        padding: '1.5rem',
        minHeight: '280px',
    },

    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
    },

    title: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.dim,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
    },

    badge: {
        fontSize: '0.6rem',
        padding: '0.25rem 0.5rem',
        background: `${colors.brand.primary}15`,
        border: `1px solid ${colors.brand.primary}30`,
        borderRadius: radius.full,
        color: colors.brand.primary,
        fontFamily: typography.fontFamily.mono,
    },

    chartWrapper: {
        height: '220px',
        width: '100%',
    },
};

// ============================================
// RADAR WIDGET COMPONENT
// ============================================
const RadarWidget = ({ scores = {} }) => {
    const radarData = [
        { subject: 'NUTRITION', value: scores?.nutrition || 0, fullMark: 100 },
        { subject: 'SLEEP', value: scores?.sleep || 0, fullMark: 100 },
        { subject: 'TRAINING', value: scores?.training || 0, fullMark: 100 },
        { subject: 'FOCUS', value: scores?.learning || 0, fullMark: 100 },
        { subject: 'WELLNESS', value: scores?.screen || 0, fullMark: 100 },
    ];

    return (
        <motion.div
            style={styles.card}
            whileHover={{
                borderColor: `${colors.brand.primary}30`,
            }}
            {...animations.fadeIn}
        >
            {/* Header */}
            <div style={styles.header}>
                <span style={styles.title}>Performance Radar</span>
                <span style={styles.badge}>LIVE</span>
            </div>

            {/* Chart */}
            <div style={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                        <PolarGrid
                            stroke={colors.border.subtle}
                            strokeDasharray="3 3"
                        />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{
                                fill: colors.text.dim,
                                fontSize: 10,
                                fontFamily: typography.fontFamily.mono,
                            }}
                        />
                        <Radar
                            name="Score"
                            dataKey="value"
                            stroke={colors.brand.primary}
                            fill={colors.brand.primary}
                            fillOpacity={0.3}
                            strokeWidth={2}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default RadarWidget;
