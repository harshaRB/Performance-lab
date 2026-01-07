import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * BiometricRadar Component
 * 
 * A dynamic pentagon radar visualization for the 5 Core Modules.
 * Uses SVG mathematics to calculate polygon vertices.
 * 
 * @param {Object} scores - { learning, screen, nutrition, training, sleep } (0-100 each)
 * @param {number} size - Component size in pixels (responsive)
 * @param {boolean} animated - Enable/disable animations
 * @param {boolean} showLabels - Show metric labels at tips
 */

// Module configuration with labels and colors
const MODULES = [
    { key: 'sleep', label: 'SLP', fullLabel: 'Sleep', color: '#8b5cf6' },
    { key: 'nutrition', label: 'NTR', fullLabel: 'Nutrition', color: '#22c55e' },
    { key: 'training', label: 'TRN', fullLabel: 'Training', color: '#f97316' },
    { key: 'learning', label: 'LRN', fullLabel: 'Learning', color: '#06b6d4' },
    { key: 'screen', label: 'SCR', fullLabel: 'Screen', color: '#eab308' },
];

// Calculate point on circle given angle (in radians) and radius
const getPoint = (centerX, centerY, radius, angleRad) => ({
    x: centerX + radius * Math.cos(angleRad),
    y: centerY + radius * Math.sin(angleRad),
});

// Generate polygon points string for SVG
const generatePolygonPoints = (centerX, centerY, values, maxRadius) => {
    const angleStep = (2 * Math.PI) / 5; // 72 degrees in radians
    const startAngle = -Math.PI / 2; // Start from top (-90 degrees)

    return values.map((value, index) => {
        const angle = startAngle + angleStep * index;
        const radius = (value / 100) * maxRadius;
        const point = getPoint(centerX, centerY, radius, angle);
        return `${point.x},${point.y}`;
    }).join(' ');
};

// Generate concentric pentagon for grid
const generateGridPentagon = (centerX, centerY, radius) => {
    const angleStep = (2 * Math.PI) / 5;
    const startAngle = -Math.PI / 2;

    return Array.from({ length: 5 }, (_, i) => {
        const angle = startAngle + angleStep * i;
        return getPoint(centerX, centerY, radius, angle);
    }).map(p => `${p.x},${p.y}`).join(' ');
};

const BiometricRadar = ({
    scores = { learning: 50, screen: 50, nutrition: 50, training: 50, sleep: 50 },
    size = 200,
    animated = true,
    showLabels = true,
}) => {
    const center = size / 2;
    const maxRadius = size * 0.38; // Leave room for labels
    const labelRadius = size * 0.46;

    // Extract values in module order
    const values = useMemo(() =>
        MODULES.map(m => Math.min(100, Math.max(0, scores[m.key] || 0))),
        [scores]
    );

    // Calculate average for center display
    const average = useMemo(() =>
        Math.round(values.reduce((a, b) => a + b, 0) / values.length),
        [values]
    );

    // Generate points for data polygon
    const dataPoints = useMemo(() =>
        generatePolygonPoints(center, center, values, maxRadius),
        [center, values, maxRadius]
    );

    // Grid levels (20%, 40%, 60%, 80%, 100%)
    const gridLevels = [20, 40, 60, 80, 100];

    // Calculate label positions
    const labelPositions = useMemo(() => {
        const angleStep = (2 * Math.PI) / 5;
        const startAngle = -Math.PI / 2;

        return MODULES.map((module, i) => {
            const angle = startAngle + angleStep * i;
            const pos = getPoint(center, center, labelRadius, angle);
            return { ...module, ...pos, value: values[i] };
        });
    }, [center, labelRadius, values]);

    // Axis lines positions
    const axisLines = useMemo(() => {
        const angleStep = (2 * Math.PI) / 5;
        const startAngle = -Math.PI / 2;

        return Array.from({ length: 5 }, (_, i) => {
            const angle = startAngle + angleStep * i;
            const end = getPoint(center, center, maxRadius, angle);
            return { x1: center, y1: center, x2: end.x, y2: end.y };
        });
    }, [center, maxRadius]);

    return (
        <div style={{
            position: 'relative',
            width: size,
            height: size,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                style={{ overflow: 'visible' }}
            >
                <defs>
                    {/* Glow filter for data shape */}
                    <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Radial gradient for fill */}
                    <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(59, 130, 246, 0.4)" />
                        <stop offset="100%" stopColor="rgba(59, 130, 246, 0.1)" />
                    </radialGradient>

                    {/* Pulse animation gradient */}
                    <radialGradient id="pulseGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(59, 130, 246, 0.6)">
                            <animate
                                attributeName="stop-color"
                                values="rgba(59, 130, 246, 0.6);rgba(59, 130, 246, 0.2);rgba(59, 130, 246, 0.6)"
                                dur="3s"
                                repeatCount="indefinite"
                            />
                        </stop>
                        <stop offset="100%" stopColor="rgba(59, 130, 246, 0.05)" />
                    </radialGradient>
                </defs>

                {/* Background Grid - Concentric Pentagons */}
                {gridLevels.map(level => (
                    <polygon
                        key={level}
                        points={generateGridPentagon(center, center, (level / 100) * maxRadius)}
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.05)"
                        strokeWidth="1"
                    />
                ))}

                {/* Axis Lines */}
                {axisLines.map((line, i) => (
                    <line
                        key={i}
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        stroke="rgba(255, 255, 255, 0.08)"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                    />
                ))}

                {/* Data Shape - Animated */}
                <motion.polygon
                    points={dataPoints}
                    fill="url(#pulseGradient)"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    filter="url(#neonGlow)"
                    initial={animated ? {
                        opacity: 0,
                        scale: 0,
                    } : {}}
                    animate={animated ? {
                        opacity: 1,
                        scale: 1,
                    } : {}}
                    transition={{
                        duration: 0.8,
                        ease: [0.34, 1.56, 0.64, 1], // Spring-like
                    }}
                    style={{ transformOrigin: 'center' }}
                />

                {/* Data Points - Vertices */}
                {labelPositions.map((pos, i) => {
                    const angleStep = (2 * Math.PI) / 5;
                    const startAngle = -Math.PI / 2;
                    const angle = startAngle + angleStep * i;
                    const pointRadius = (pos.value / 100) * maxRadius;
                    const dataPoint = getPoint(center, center, pointRadius, angle);

                    return (
                        <motion.circle
                            key={pos.key}
                            cx={dataPoint.x}
                            cy={dataPoint.y}
                            r="4"
                            fill="#3B82F6"
                            stroke="#fff"
                            strokeWidth="1.5"
                            filter="url(#neonGlow)"
                            initial={animated ? { scale: 0, opacity: 0 } : {}}
                            animate={animated ? { scale: 1, opacity: 1 } : {}}
                            transition={{
                                delay: 0.5 + i * 0.1,
                                duration: 0.3,
                                type: 'spring',
                                stiffness: 500,
                            }}
                        />
                    );
                })}

                {/* Labels at tips */}
                {showLabels && labelPositions.map((pos, i) => (
                    <motion.g
                        key={`label-${pos.key}`}
                        initial={animated ? { opacity: 0 } : {}}
                        animate={animated ? { opacity: 1 } : {}}
                        transition={{ delay: 0.8 + i * 0.05 }}
                    >
                        <text
                            x={pos.x}
                            y={pos.y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill={pos.color}
                            fontSize="9"
                            fontFamily="'JetBrains Mono', monospace"
                            fontWeight="700"
                            style={{ textShadow: `0 0 6px ${pos.color}50` }}
                        >
                            {pos.label}
                        </text>
                        <text
                            x={pos.x}
                            y={pos.y + 11}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="rgba(255,255,255,0.5)"
                            fontSize="7"
                            fontFamily="'JetBrains Mono', monospace"
                        >
                            {pos.value}%
                        </text>
                    </motion.g>
                ))}

                {/* Center Score */}
                <motion.g
                    initial={animated ? { scale: 0, opacity: 0 } : {}}
                    animate={animated ? { scale: 1, opacity: 1 } : {}}
                    transition={{ delay: 1, duration: 0.3, type: 'spring' }}
                >
                    {/* Center glow */}
                    <circle
                        cx={center}
                        cy={center}
                        r="18"
                        fill="rgba(59, 130, 246, 0.15)"
                        stroke="rgba(59, 130, 246, 0.3)"
                        strokeWidth="1"
                    />

                    <text
                        x={center}
                        y={center - 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#fff"
                        fontSize="14"
                        fontFamily="'JetBrains Mono', monospace"
                        fontWeight="800"
                    >
                        {average}
                    </text>
                    <text
                        x={center}
                        y={center + 10}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="rgba(255,255,255,0.4)"
                        fontSize="5"
                        fontFamily="'JetBrains Mono', monospace"
                        letterSpacing="0.1em"
                    >
                        AVG
                    </text>
                </motion.g>
            </svg>
        </div>
    );
};

export default BiometricRadar;
