import React from 'react';
import { motion } from 'framer-motion';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { colors, typography, radius, animations } from '../styles/designSystem';

// ============================================
// STYLES
// ============================================
const styles = {
    container: {
        width: '100%',
    },

    header: {
        marginBottom: '2rem',
    },
    title: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.text.primary,
        marginBottom: '0.5rem',
    },
    subtitle: {
        fontSize: typography.fontSize.sm,
        color: colors.text.muted,
    },

    // Stats Cards Row
    statsRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
    },
    statCard: {
        background: colors.background.secondary,
        border: `1px solid ${colors.border.subtle}`,
        borderRadius: radius.xl,
        padding: '1.25rem',
    },
    statLabel: {
        fontSize: typography.fontSize.xs,
        color: colors.text.dim,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: '0.5rem',
    },
    statValue: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.bold,
        fontFamily: typography.fontFamily.mono,
        color: colors.text.primary,
        marginBottom: '0.25rem',
    },
    statChange: {
        fontSize: typography.fontSize.xs,
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
    },

    // Chart Cards
    chartGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '1.5rem',
    },
    chartCard: {
        background: colors.background.secondary,
        border: `1px solid ${colors.border.subtle}`,
        borderRadius: radius.xl,
        padding: '1.5rem',
    },
    chartHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
    },
    chartTitle: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.primary,
    },
    chartBadge: {
        fontSize: '0.65rem',
        padding: '0.25rem 0.5rem',
        background: `${colors.brand.primary}15`,
        border: `1px solid ${colors.brand.primary}30`,
        borderRadius: radius.full,
        color: colors.brand.primary,
        fontFamily: typography.fontFamily.mono,
    },
    chartWrapper: {
        height: '250px',
    },
};

// Mock data for charts
const weeklyData = [
    { name: 'Mon', score: 72, sleep: 7.5, calories: 2100 },
    { name: 'Tue', score: 68, sleep: 6.8, calories: 2300 },
    { name: 'Wed', score: 75, sleep: 8.0, calories: 1950 },
    { name: 'Thu', score: 80, sleep: 7.2, calories: 2200 },
    { name: 'Fri', score: 77, sleep: 7.8, calories: 2400 },
    { name: 'Sat', score: 85, sleep: 8.5, calories: 2050 },
    { name: 'Sun', score: 82, sleep: 7.0, calories: 1900 },
];

// ============================================
// STAT CARD COMPONENT
// ============================================
const StatCard = ({ label, value, change, positive }) => (
    <motion.div
        style={styles.statCard}
        whileHover={{
            borderColor: `${colors.brand.primary}30`,
            scale: 1.02,
        }}
    >
        <div style={styles.statLabel}>{label}</div>
        <div style={styles.statValue}>{value}</div>
        <div style={{
            ...styles.statChange,
            color: positive ? colors.accent.success : colors.accent.danger
        }}>
            {positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {change}
        </div>
    </motion.div>
);

// ============================================
// ANALYTICS PAGE COMPONENT
// ============================================
const Analytics = () => {
    const { scores } = useAppStore();

    const radarData = [
        { subject: 'NUTRITION', value: scores?.nutrition || 60, fullMark: 100 },
        { subject: 'SLEEP', value: scores?.sleep || 50, fullMark: 100 },
        { subject: 'TRAINING', value: scores?.training || 50, fullMark: 100 },
        { subject: 'FOCUS', value: scores?.learning || 40, fullMark: 100 },
        { subject: 'WELLNESS', value: scores?.screen || 30, fullMark: 100 },
    ];

    return (
        <div style={styles.container}>
            {/* Header */}
            <motion.div
                style={styles.header}
                {...animations.slideUp}
            >
                <h1 style={styles.title}>Analytics</h1>
                <p style={styles.subtitle}>Deep dive into your performance trends</p>
            </motion.div>

            {/* Stats Row */}
            <motion.div
                style={styles.statsRow}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <StatCard
                    label="Weekly Average"
                    value="76%"
                    change="+5% vs last week"
                    positive={true}
                />
                <StatCard
                    label="Best Day"
                    value="Saturday"
                    change="85% score"
                    positive={true}
                />
                <StatCard
                    label="Avg Sleep"
                    value="7.4h"
                    change="+0.3h vs avg"
                    positive={true}
                />
                <StatCard
                    label="Streak"
                    value="12 days"
                    change="Personal best!"
                    positive={true}
                />
            </motion.div>

            {/* Charts Grid */}
            <motion.div
                style={styles.chartGrid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                {/* Performance Trend */}
                <div style={styles.chartCard}>
                    <div style={styles.chartHeader}>
                        <span style={styles.chartTitle}>Performance Trend</span>
                        <span style={styles.chartBadge}>7 DAYS</span>
                    </div>
                    <div style={styles.chartWrapper}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weeklyData}>
                                <defs>
                                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={colors.brand.primary} stopOpacity={0.3} />
                                        <stop offset="100%" stopColor={colors.brand.primary} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={colors.border.subtle} />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: colors.text.dim, fontSize: 11 }}
                                    axisLine={{ stroke: colors.border.subtle }}
                                />
                                <YAxis
                                    tick={{ fill: colors.text.dim, fontSize: 11 }}
                                    axisLine={{ stroke: colors.border.subtle }}
                                    domain={[0, 100]}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: colors.background.tertiary,
                                        border: `1px solid ${colors.border.default}`,
                                        borderRadius: radius.lg,
                                    }}
                                    labelStyle={{ color: colors.text.primary }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="score"
                                    stroke={colors.brand.primary}
                                    strokeWidth={2}
                                    fill="url(#scoreGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Performance Radar */}
                <div style={styles.chartCard}>
                    <div style={styles.chartHeader}>
                        <span style={styles.chartTitle}>Balance Radar</span>
                        <span style={styles.chartBadge}>CURRENT</span>
                    </div>
                    <div style={styles.chartWrapper}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={radarData}>
                                <PolarGrid stroke={colors.border.subtle} />
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
                                    stroke={colors.brand.secondary}
                                    fill={colors.brand.secondary}
                                    fillOpacity={0.3}
                                    strokeWidth={2}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Analytics;
