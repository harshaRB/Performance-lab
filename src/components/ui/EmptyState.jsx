import React from 'react';
import { Activity } from 'lucide-react';

/**
 * EmptyState Component
 * 
 * Uses large, muted icons instead of illustrations.
 * Pure CSS/SVG aesthetic.
 */

const EmptyState = ({
    icon: Icon = Activity,
    title = 'No Data',
    message = 'Start tracking to see your data here.',
    color = '#6366f1',
    actionLabel,
    onAction,
}) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem 2rem',
            textAlign: 'center',
            position: 'relative',
            minHeight: '300px',
        }}>
            {/* Massive muted background icon */}
            <div style={{
                position: 'absolute',
                opacity: 0.05,
                transform: 'scale(3)',
            }}>
                <Icon size={120} color={color} strokeWidth={1} />
            </div>

            {/* Foreground icon */}
            <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: `${color}15`,
                border: `1px solid ${color}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                position: 'relative',
                zIndex: 10,
            }}>
                <Icon size={32} color={color} strokeWidth={1.5} />
            </div>

            {/* Title */}
            <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '0.5rem',
                fontFamily: "'JetBrains Mono', monospace",
                position: 'relative',
                zIndex: 10,
            }}>
                {title}
            </h3>

            {/* Message */}
            <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                maxWidth: '300px',
                lineHeight: 1.6,
                position: 'relative',
                zIndex: 10,
            }}>
                {message}
            </p>

            {/* Action button */}
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    style={{
                        marginTop: '1.5rem',
                        padding: '0.75rem 1.5rem',
                        background: color,
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: "'JetBrains Mono', monospace",
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        position: 'relative',
                        zIndex: 10,
                    }}
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
