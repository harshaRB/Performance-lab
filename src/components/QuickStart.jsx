import React from 'react';

const QuickStart = () => {
    const populateSampleData = () => {
        const today = new Date().toISOString().split('T')[0];

        // Sample profile
        localStorage.setItem('pl_profile', JSON.stringify({
            name: 'Demo User',
            age: 25,
            gender: 'male',
            weight: 75,
            height: 175,
            waist: 80,
            hip: 95,
            arm: 32,
            forearm: 28,
            legs: 60,
            calf: 38
        }));

        // Sample learning
        localStorage.setItem(`pl_reading_${today}`, JSON.stringify({
            active: 60,
            passive: 90
        }));

        // Sample screen time
        localStorage.setItem(`pl_screen_${today}`, JSON.stringify({
            social: 30,
            entertainment: 60,
            productive: 120
        }));

        // Sample hydration
        localStorage.setItem(`pl_hydration_${today}`, '2500');

        // Sample sleep
        localStorage.setItem('pl_sleep_duration', '7.5');
        localStorage.setItem('pl_sleep_quality', '8');
        localStorage.setItem('pl_nap_duration', '0');

        // Sample training
        localStorage.setItem('pl_training_volume', '8500');

        alert('✅ Sample data loaded! Refresh the page to see your demo performance metrics.');
        window.location.reload();
    };

    return (
        <div className="card" style={{ marginTop: '2rem', border: '2px solid var(--accent-learning)' }}>
            <h3 className="mono" style={{ marginBottom: '1rem' }}>🚀 QUICK START</h3>
            <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                New to Vylos Labs? Load sample data to see how the system works.
            </p>
            <button
                onClick={populateSampleData}
                style={{
                    padding: '0.75rem 1.5rem',
                    background: 'var(--accent-learning)',
                    color: 'black',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 'bold',
                    width: '100%'
                }}
            >
                LOAD SAMPLE DATA
            </button>
        </div>
    );
};

export default QuickStart;
