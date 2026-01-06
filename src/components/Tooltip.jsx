import React, { useState } from 'react';

const Tooltip = ({ children, content, position = 'top' }) => {
    const [visible, setVisible] = useState(false);

    const positionStyles = {
        top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '0.5rem' },
        bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '0.5rem' },
        left: { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '0.5rem' },
        right: { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: '0.5rem' }
    };

    return (
        <div
            style={{ position: 'relative', display: 'inline-block' }}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            {children}
            {visible && (
                <div style={{
                    position: 'absolute',
                    ...positionStyles[position],
                    background: '#161B22',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.75rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    lineHeight: '1.4',
                    maxWidth: '250px',
                    zIndex: 1000,
                    pointerEvents: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                }}>
                    {content}
                </div>
            )}
        </div>
    );
};

export default Tooltip;
