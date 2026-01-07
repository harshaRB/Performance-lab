import React from 'react';

/**
 * MacroDonutChart Component
 * 
 * SVG-based donut chart for displaying macro nutrients.
 * Pure CSS/SVG - no images.
 * Glows in the specified color.
 */

const MacroDonutChart = ({
    protein = 0,
    carbs = 0,
    fats = 0,
    size = 120,
    showLabels = true
}) => {
    const total = protein + carbs + fats;
    const radius = 40;
    const circumference = 2 * Math.PI * radius;

    // Calculate percentages
    const proteinPct = total > 0 ? (protein / total) * 100 : 33.33;
    const carbsPct = total > 0 ? (carbs / total) * 100 : 33.33;
    const fatsPct = total > 0 ? (fats / total) * 100 : 33.33;

    // Calculate stroke dash offsets
    const proteinDash = (proteinPct / 100) * circumference;
    const carbsDash = (carbsPct / 100) * circumference;
    const fatsDash = (fatsPct / 100) * circumference;

    // Rotation offsets for each segment
    const proteinRotation = 0;
    const carbsRotation = (proteinPct / 100) * 360;
    const fatsRotation = ((proteinPct + carbsPct) / 100) * 360;

    const colors = {
        protein: '#ef4444',  // Red
        carbs: '#f59e0b',    // Amber
        fats: '#3b82f6',     // Blue
    };

    return (
        <div style={{ position: 'relative', width: size, height: size }}>
            {/* Glow Filter */}
            <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Background circle */}
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="8"
                />

                {/* Protein segment */}
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke={colors.protein}
                    strokeWidth="8"
                    strokeDasharray={`${proteinDash} ${circumference}`}
                    strokeLinecap="round"
                    filter="url(#glow)"
                    style={{ transform: `rotate(${proteinRotation}deg)`, transformOrigin: 'center' }}
                />

                {/* Carbs segment */}
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke={colors.carbs}
                    strokeWidth="8"
                    strokeDasharray={`${carbsDash} ${circumference}`}
                    strokeLinecap="round"
                    filter="url(#glow)"
                    style={{ transform: `rotate(${carbsRotation}deg)`, transformOrigin: 'center' }}
                />

                {/* Fats segment */}
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke={colors.fats}
                    strokeWidth="8"
                    strokeDasharray={`${fatsDash} ${circumference}`}
                    strokeLinecap="round"
                    filter="url(#glow)"
                    style={{ transform: `rotate(${fatsRotation}deg)`, transformOrigin: 'center' }}
                />
            </svg>

            {/* Center label */}
            <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <span style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    fontFamily: "'JetBrains Mono', monospace",
                    color: '#fff'
                }}>
                    {total.toFixed(0)}
                </span>
                <span style={{ fontSize: '0.6rem', color: '#6b7280', textTransform: 'uppercase' }}>
                    GRAMS
                </span>
            </div>

            {/* Labels */}
            {showLabels && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    marginTop: '0.5rem',
                    fontSize: '0.6rem',
                    fontFamily: "'JetBrains Mono', monospace",
                }}>
                    <span style={{ color: colors.protein }}>P:{protein.toFixed(0)}g</span>
                    <span style={{ color: colors.carbs }}>C:{carbs.toFixed(0)}g</span>
                    <span style={{ color: colors.fats }}>F:{fats.toFixed(0)}g</span>
                </div>
            )}
        </div>
    );
};

export default MacroDonutChart;
