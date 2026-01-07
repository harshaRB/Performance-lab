import React from 'react';

/**
 * PatternBackground Component
 * 
 * CSS-only background with:
 * - Dot Matrix grid pattern (like graph paper)
 * - Vignette effect (shadows in corners)
 * - Scanline overlay for tactical feel
 */

const PatternBackground = ({ children, variant = 'default' }) => {
    const styles = {
        container: {
            position: 'relative',
            minHeight: '100vh',
            background: '#050505',
            overflow: 'hidden',
        },

        // Dot Matrix Pattern
        dotMatrix: {
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 0,
            background: `
                radial-gradient(circle at center, rgba(99, 102, 241, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
        },

        // Grid Lines Overlay
        gridLines: {
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 0,
            background: `
                linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
        },

        // Vignette Effect
        vignette: {
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 1,
            background: `
                radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.4) 100%)
            `,
        },

        // Scanlines (optional tactical effect)
        scanlines: {
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 2,
            background: `
                repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 2px,
                    rgba(0,0,0,0.03) 2px,
                    rgba(0,0,0,0.03) 4px
                )
            `,
        },

        // Subtle glow at top
        topGlow: {
            position: 'fixed',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            height: '300px',
            pointerEvents: 'none',
            zIndex: 0,
            background: 'radial-gradient(ellipse at top, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
        },

        // Content wrapper
        content: {
            position: 'relative',
            zIndex: 10,
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.dotMatrix} />
            <div style={styles.gridLines} />
            <div style={styles.topGlow} />
            <div style={styles.vignette} />
            {variant === 'tactical' && <div style={styles.scanlines} />}
            <div style={styles.content}>
                {children}
            </div>
        </div>
    );
};

export default PatternBackground;
