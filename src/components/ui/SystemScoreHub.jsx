import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Moon, Apple, Dumbbell, Brain, Smartphone,
    TrendingUp, TrendingDown, Minus
} from 'lucide-react';

/**
 * SystemScoreHub - The Center of Attraction
 * 
 * An orbital visualization showing the System Score at the center
 * with contributing modules orbiting around it. Displays positive
 * and negative contributors with animated web-like connections.
 */

// Module configuration
const MODULES = [
    { key: 'sleep', label: 'Sleep', icon: Moon, targetScore: 80, weight: 0.25 },
    { key: 'nutrition', label: 'Nutrition', icon: Apple, targetScore: 75, weight: 0.25 },
    { key: 'training', label: 'Training', icon: Dumbbell, targetScore: 70, weight: 0.20 },
    { key: 'learning', label: 'Learning', icon: Brain, targetScore: 60, weight: 0.15 },
    { key: 'screen', label: 'Screen', icon: Smartphone, targetScore: 50, weight: 0.15 },
];

// Calculate orbital position
const getOrbitalPosition = (index, total, radius, centerX, centerY) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // Start from top
    return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        angle: (angle * 180) / Math.PI,
    };
};

// Get contribution status
const getContribution = (score, target) => {
    const diff = score - target;
    if (diff >= 10) return { status: 'positive', icon: TrendingUp, color: '#22c55e' };
    if (diff <= -10) return { status: 'negative', icon: TrendingDown, color: '#ef4444' };
    return { status: 'neutral', icon: Minus, color: '#6b7280' };
};

// Get score color
const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
};

const SystemScoreHub = ({
    scores = {},
    size = 400,
}) => {
    const center = size / 2;
    const orbitRadius = size * 0.35;
    const nodeRadius = 28;

    // Calculate system score
    // Use pre-calculated system score from props if available
    const systemScore = useMemo(() => {
        if (scores.system !== undefined) return scores.system;

        // Fallback: Weighted Arithmetic Mean (Legacy behavior)
        let total = 0;
        let weightSum = 0;
        MODULES.forEach(m => {
            const score = scores[m.key] || 0;
            total += score * m.weight;
            weightSum += m.weight;
        });
        return Math.round(total / (weightSum || 1));
    }, [scores]);

    // Get module data with positions and contributions
    const moduleData = useMemo(() => {
        return MODULES.map((module, index) => {
            const score = scores[module.key] || 0;
            const position = getOrbitalPosition(index, MODULES.length, orbitRadius, center, center);
            const contribution = getContribution(score, module.targetScore);
            return {
                ...module,
                score,
                position,
                contribution,
            };
        });
    }, [scores, orbitRadius, center]);

    // Separate positive and negative contributors
    const positiveContributors = moduleData.filter(m => m.contribution.status === 'positive');
    const negativeContributors = moduleData.filter(m => m.contribution.status === 'negative');

    const scoreColor = getScoreColor(systemScore);

    return (
        <motion.div
            style={{
                position: 'relative',
                width: size,
                height: size + 120, // Extra space for legend
                margin: '0 auto',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Main SVG Canvas */}
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                style={{ overflow: 'visible' }}
            >
                <defs>
                    {/* Center glow gradient */}
                    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={scoreColor} stopOpacity="0.4" />
                        <stop offset="50%" stopColor={scoreColor} stopOpacity="0.1" />
                        <stop offset="100%" stopColor={scoreColor} stopOpacity="0" />
                    </radialGradient>

                    {/* Web line gradient */}
                    <linearGradient id="webLine" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                        <stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
                    </linearGradient>

                    {/* Glow filters */}
                    <filter id="centerBlur" x="-100%" y="-100%" width="300%" height="300%">
                        <feGaussianBlur stdDeviation="20" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Pulse animation */}
                    <animate id="pulse" attributeName="r" values="60;65;60" dur="2s" repeatCount="indefinite" />
                </defs>

                {/* Orbital Rings */}
                {[0.6, 0.8, 1].map((scale, i) => (
                    <motion.circle
                        key={i}
                        cx={center}
                        cy={center}
                        r={orbitRadius * scale}
                        fill="none"
                        stroke="rgba(255,255,255,0.03)"
                        strokeWidth="1"
                        strokeDasharray={i === 2 ? "8 8" : "none"}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                    />
                ))}

                {/* Web Connections - Lines from center to nodes */}
                {moduleData.map((module, i) => (
                    <motion.line
                        key={`line-${module.key}`}
                        x1={center}
                        y1={center}
                        x2={module.position.x}
                        y2={module.position.y}
                        stroke={module.contribution.color}
                        strokeWidth="2"
                        strokeOpacity="0.3"
                        strokeDasharray="4 4"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                    />
                ))}

                {/* Energy flow particles along lines */}
                {moduleData.map((module, i) => (
                    <motion.circle
                        key={`particle-${module.key}`}
                        r="3"
                        fill={module.contribution.color}
                        filter="url(#nodeGlow)"
                        initial={{ opacity: 0 }}
                        animate={{
                            cx: [center, module.position.x],
                            cy: [center, module.position.y],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 2,
                            delay: i * 0.4,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                ))}

                {/* Center Score Hub */}
                <motion.g
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                >
                    {/* Outer glow ring */}
                    <circle
                        cx={center}
                        cy={center}
                        r="70"
                        fill="url(#centerGlow)"
                    />

                    {/* Pulsing ring */}
                    <motion.circle
                        cx={center}
                        cy={center}
                        r="60"
                        fill="none"
                        stroke={scoreColor}
                        strokeWidth="2"
                        strokeOpacity="0.5"
                        animate={{ r: [58, 65, 58] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />

                    {/* Main circle */}
                    <circle
                        cx={center}
                        cy={center}
                        r="55"
                        fill="rgba(15, 17, 21, 0.95)"
                        stroke={scoreColor}
                        strokeWidth="3"
                        filter="url(#centerBlur)"
                    />

                    {/* Inner accent ring */}
                    <circle
                        cx={center}
                        cy={center}
                        r="45"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="1"
                    />

                    {/* Score text */}
                    <text
                        x={center}
                        y={center - 8}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={scoreColor}
                        fontSize="32"
                        fontFamily="'JetBrains Mono', monospace"
                        fontWeight="800"
                        style={{ textShadow: `0 0 20px ${scoreColor}` }}
                    >
                        {systemScore}
                    </text>
                    <text
                        x={center}
                        y={center + 18}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="rgba(255,255,255,0.5)"
                        fontSize="10"
                        fontFamily="'JetBrains Mono', monospace"
                        letterSpacing="0.2em"
                    >
                        SYSTEM
                    </text>
                </motion.g>

                {/* Module Nodes - Orbital */}
                {moduleData.map((module, i) => {
                    // Icon and ContribIcon available but not currently used in SVG

                    return (
                        <motion.g
                            key={module.key}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
                        >
                            {/* Node background */}
                            <circle
                                cx={module.position.x}
                                cy={module.position.y}
                                r={nodeRadius}
                                fill="rgba(15, 17, 21, 0.9)"
                                stroke={module.contribution.color}
                                strokeWidth="2"
                                filter="url(#nodeGlow)"
                            />

                            {/* Score in node */}
                            <text
                                x={module.position.x}
                                y={module.position.y + 1}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill={module.contribution.color}
                                fontSize="14"
                                fontFamily="'JetBrains Mono', monospace"
                                fontWeight="700"
                            >
                                {module.score}
                            </text>

                            {/* Module label */}
                            <text
                                x={module.position.x}
                                y={module.position.y + nodeRadius + 14}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="rgba(255,255,255,0.6)"
                                fontSize="9"
                                fontFamily="'JetBrains Mono', monospace"
                                fontWeight="600"
                                letterSpacing="0.1em"
                            >
                                {module.label.toUpperCase()}
                            </text>

                            {/* Contribution indicator */}
                            <circle
                                cx={module.position.x + nodeRadius - 6}
                                cy={module.position.y - nodeRadius + 6}
                                r="8"
                                fill={module.contribution.color}
                            />
                        </motion.g>
                    );
                })}
            </svg>

            {/* Bottom Legend - Contributors */}
            <motion.div
                style={{
                    marginTop: '1.5rem',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '2rem',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
            >
                {/* Positive Contributors */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem',
                        color: '#22c55e',
                        fontSize: '0.7rem',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 700,
                    }}>
                        <TrendingUp size={14} />
                        BOOSTING
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {positiveContributors.length > 0 ? (
                            positiveContributors.map(m => (
                                <div
                                    key={m.key}
                                    style={{
                                        padding: '0.4rem 0.75rem',
                                        background: 'rgba(34, 197, 94, 0.1)',
                                        border: '1px solid rgba(34, 197, 94, 0.3)',
                                        borderRadius: '6px',
                                        fontSize: '0.7rem',
                                        color: '#22c55e',
                                        fontFamily: "'JetBrains Mono', monospace",
                                    }}
                                >
                                    {m.label}
                                </div>
                            ))
                        ) : (
                            <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>None</span>
                        )}
                    </div>
                </div>

                {/* Negative Contributors */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem',
                        color: '#ef4444',
                        fontSize: '0.7rem',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 700,
                    }}>
                        <TrendingDown size={14} />
                        DRAGGING
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {negativeContributors.length > 0 ? (
                            negativeContributors.map(m => (
                                <div
                                    key={m.key}
                                    style={{
                                        padding: '0.4rem 0.75rem',
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                        borderRadius: '6px',
                                        fontSize: '0.7rem',
                                        color: '#ef4444',
                                        fontFamily: "'JetBrains Mono', monospace",
                                    }}
                                >
                                    {m.label}
                                </div>
                            ))
                        ) : (
                            <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>None</span>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default SystemScoreHub;
