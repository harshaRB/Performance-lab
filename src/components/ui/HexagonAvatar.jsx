import React from 'react';

/**
 * HexagonAvatar Component
 * 
 * Stylized user initials badge in a hexagon SVG frame.
 * Pure CSS/SVG - no images.
 */

const HexagonAvatar = ({
    name = 'User',
    size = 48,
    color = '#6366f1',
    glowing = true
}) => {
    // Get initials (first 2 characters or first letters of words)
    const getInitials = (name) => {
        const words = name.trim().split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const initials = getInitials(name);
    const fontSize = size * 0.35;

    return (
        <div style={{
            position: 'relative',
            width: size,
            height: size,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            {/* Hexagon SVG */}
            <svg
                width={size}
                height={size}
                viewBox="0 0 100 100"
                style={{ position: 'absolute' }}
            >
                <defs>
                    {/* Glow filter */}
                    <filter id="hexGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Gradient fill */}
                    <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.1" />
                    </linearGradient>
                </defs>

                {/* Outer hexagon frame */}
                <polygon
                    points="50,3 93,25 93,75 50,97 7,75 7,25"
                    fill="url(#hexGradient)"
                    stroke={color}
                    strokeWidth="2"
                    filter={glowing ? "url(#hexGlow)" : "none"}
                />

                {/* Inner hexagon accent */}
                <polygon
                    points="50,15 80,32 80,68 50,85 20,68 20,32"
                    fill="none"
                    stroke={color}
                    strokeWidth="1"
                    strokeOpacity="0.3"
                />
            </svg>

            {/* Initials */}
            <span style={{
                position: 'relative',
                fontSize: fontSize,
                fontWeight: 700,
                fontFamily: "'JetBrains Mono', monospace",
                color: color,
                textShadow: glowing ? `0 0 10px ${color}50` : 'none',
                letterSpacing: '0.05em',
            }}>
                {initials}
            </span>
        </div>
    );
};

export default HexagonAvatar;
