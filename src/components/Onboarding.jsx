import React, { useState, useEffect } from 'react';

const Onboarding = () => {
    const [show, setShow] = useState(false);
    const [step, setStep] = useState(0);

    useEffect(() => {
        const completed = localStorage.getItem('pl_onboarding_completed');
        if (!completed) setShow(true);
    }, []);

    const steps = [
        {
            title: 'Welcome to Vylos Labs',
            content: 'A medical-grade performance tracking system using rigorous biostatistics.',
            icon: '🔬'
        },
        {
            title: 'Weighted Geometric Mean',
            content: 'Your System Score uses geometric mean - one failing module catastrophically impacts your overall score. Balance is key.',
            icon: '⚖️'
        },
        {
            title: 'Real Baselines',
            content: 'Scores are normalized against your 14-day rolling baseline. The more you log, the more accurate your scores become.',
            icon: '📊'
        },
        {
            title: 'Keyboard Shortcuts',
            content: 'Press ? anytime to see shortcuts. Ctrl+L/S/N/T/R/A to jump to modules.',
            icon: '⌨️'
        },
        {
            title: 'Ready to Start',
            content: 'Fill out your profile first, then start logging your daily performance metrics.',
            icon: '🚀'
        }
    ];

    const complete = () => {
        localStorage.setItem('pl_onboarding_completed', 'true');
        setShow(false);
    };

    if (!show) return null;

    const currentStep = steps[step];

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.95)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <div style={{
                background: 'var(--bg-card)',
                border: '2px solid var(--text-primary)',
                padding: '3rem',
                maxWidth: '600px',
                width: '100%',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{currentStep.icon}</div>
                <h2 className="mono" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                    {currentStep.title}
                </h2>
                <p style={{ fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                    {currentStep.content}
                </p>

                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '2rem' }}>
                    {steps.map((_, i) => (
                        <div key={i} style={{
                            width: '40px',
                            height: '4px',
                            background: i === step ? 'var(--text-primary)' : 'var(--border-subtle)',
                            borderRadius: '2px'
                        }}></div>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    {step > 0 && (
                        <button
                            onClick={() => setStep(step - 1)}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: 'transparent',
                                border: '1px solid var(--text-primary)',
                                color: 'var(--text-primary)',
                                cursor: 'pointer',
                                fontFamily: 'var(--font-mono)'
                            }}
                        >
                            BACK
                        </button>
                    )}
                    {step < steps.length - 1 ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: 'var(--text-primary)',
                                border: 'none',
                                color: 'var(--bg-primary)',
                                cursor: 'pointer',
                                fontFamily: 'var(--font-mono)'
                            }}
                        >
                            NEXT
                        </button>
                    ) : (
                        <button
                            onClick={complete}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: 'var(--accent-nutrition)',
                                border: 'none',
                                color: 'black',
                                cursor: 'pointer',
                                fontFamily: 'var(--font-mono)',
                                fontWeight: 'bold'
                            }}
                        >
                            GET STARTED
                        </button>
                    )}
                </div>

                <button
                    onClick={complete}
                    style={{
                        marginTop: '1rem',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                    }}
                >
                    Skip tutorial
                </button>
            </div>
        </div>
    );
};

export default Onboarding;
