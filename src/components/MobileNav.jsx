import React, { useState } from 'react';

const MobileNav = () => {
    const [isOpen, setIsOpen] = useState(false);

    const sections = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'learning', label: 'Learning', icon: '📚' },
        { id: 'screen', label: 'Screen Time', icon: '📱' },
        { id: 'nutrition', label: 'Nutrition', icon: '🥗' },
        { id: 'training', label: 'Training', icon: '💪' },
        { id: 'sleep', label: 'Sleep', icon: '😴' },
        { id: 'analytics', label: 'Analytics', icon: '📈' }
    ];

    const scrollToSection = (id) => {
        const element = document.querySelector(`[data-section="${id}"]`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed',
                    top: '1rem',
                    left: '1rem',
                    zIndex: 2000,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    padding: '0.75rem',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    fontSize: '1.5rem',
                    display: 'none'
                }}
                className="mobile-nav-toggle"
            >
                {isOpen ? '✕' : '☰'}
            </button>

            {/* Mobile Drawer */}
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0,0,0,0.8)',
                        zIndex: 1999,
                        display: 'none'
                    }}
                    className="mobile-nav-overlay"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        style={{
                            background: 'var(--bg-card)',
                            width: '80%',
                            maxWidth: '300px',
                            height: '100%',
                            padding: '4rem 1rem 1rem 1rem',
                            overflowY: 'auto'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {sections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-primary)',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    fontFamily: 'var(--font-mono)',
                                    borderBottom: '1px solid var(--border-subtle)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem'
                                }}
                            >
                                <span style={{ fontSize: '1.5rem' }}>{section.icon}</span>
                                {section.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <style>{`
                @media (max-width: 768px) {
                    .mobile-nav-toggle,
                    .mobile-nav-overlay {
                        display: block !important;
                    }
                }
            `}</style>
        </>
    );
};

export default MobileNav;
