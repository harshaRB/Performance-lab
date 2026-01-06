import React from 'react';

const DataManagement = () => {
    const exportData = () => {
        const today = new Date().toISOString().split('T')[0];

        const data = {
            date: today,
            profile: JSON.parse(localStorage.getItem('pl_profile') || '{}'),
            reading: JSON.parse(localStorage.getItem(`pl_reading_${today}`) || '{}'),
            screen: JSON.parse(localStorage.getItem(`pl_screen_${today}`) || '{}'),
            nutrition: JSON.parse(localStorage.getItem(`pl_nutrition_log_${today}`) || '{}'),
            hydration: localStorage.getItem(`pl_hydration_${today}`) || '0',
            training: localStorage.getItem('pl_training_volume') || '0',
            sleep: {
                duration: localStorage.getItem('pl_sleep_duration') || '0',
                quality: localStorage.getItem('pl_sleep_quality') || '5',
                nap: localStorage.getItem('pl_nap_duration') || '0'
            }
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `performance-lab-${today}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const resetDaily = () => {
        if (!confirm('Reset all daily data? This will clear today\'s logs but keep your profile and database.')) return;

        const today = new Date().toISOString().split('T')[0];
        localStorage.removeItem(`pl_reading_${today}`);
        localStorage.removeItem(`pl_screen_${today}`);
        localStorage.removeItem(`pl_nutrition_log_${today}`);
        localStorage.removeItem(`pl_hydration_${today}`);
        localStorage.setItem('pl_training_volume', '0');
        localStorage.removeItem('pl_sleep_duration');
        localStorage.removeItem('pl_sleep_quality');
        localStorage.removeItem('pl_nap_duration');

        window.location.reload();
    };

    return (
        <section className="card" style={{ marginTop: '2rem', borderTop: '2px solid var(--border-subtle)' }}>
            <h3 className="mono" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>DATA MANAGEMENT</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button
                    onClick={exportData}
                    style={{
                        background: 'transparent',
                        border: '1px solid var(--text-primary)',
                        color: 'var(--text-primary)',
                        padding: '0.75rem',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem'
                    }}
                >
                    EXPORT TODAY (JSON)
                </button>
                <button
                    onClick={resetDaily}
                    style={{
                        background: 'transparent',
                        border: '1px solid var(--accent-danger)',
                        color: 'var(--accent-danger)',
                        padding: '0.75rem',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem'
                    }}
                >
                    RESET DAILY DATA
                </button>
            </div>
        </section>
    );
};

export default DataManagement;
