import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

const HydrationTracker = () => {
    const { dailyLogs, setDailyLog } = useAppStore();
    const today = new Date().toISOString().split('T')[0];
    const [intake, setIntake] = useState(dailyLogs[today]?.hydration || 0);
    const target = 3000; // ml

    useEffect(() => {
        if (dailyLogs[today]?.hydration !== undefined) {
            setIntake(dailyLogs[today].hydration);
        }
    }, [dailyLogs, today]);

    const addWater = (amount) => {
        const newVal = intake + amount;
        setIntake(newVal);
        setDailyLog(today, 'hydration', newVal);
    };

    const percentage = Math.min((intake / target) * 100, 100);

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--accent-nutrition)' }}>HYDRATION STATUS</h3>

            {/* Visual Indicator */}
            <div style={{
                width: '60px',
                height: '150px',
                background: '#0d1117',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: '1rem'
            }}>
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    height: `${percentage}%`,
                    background: percentage >= 100 ? 'var(--accent-nutrition)' : 'var(--text-secondary)',
                    opacity: 0.5,
                    transition: 'height 500ms ease-out'
                }} />

                {/* Lines for measurement */}
                <div style={{ position: 'absolute', bottom: '25%', width: '100%', borderTop: '1px dotted rgba(255,255,255,0.1)' }} />
                <div style={{ position: 'absolute', bottom: '50%', width: '100%', borderTop: '1px dotted rgba(255,255,255,0.1)' }} />
                <div style={{ position: 'absolute', bottom: '75%', width: '100%', borderTop: '1px dotted rgba(255,255,255,0.1)' }} />
            </div>

            <div className="mono" style={{ fontSize: '1.2rem' }}>
                {intake} / {target} <span style={{ fontSize: '0.8rem' }}>ML</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', width: '100%', marginTop: '1rem' }}>
                <button onClick={() => addWater(250)} style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'white', padding: '0.5rem', cursor: 'pointer' }}>+250ml</button>
                <button onClick={() => addWater(500)} style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'white', padding: '0.5rem', cursor: 'pointer' }}>+500ml</button>
            </div>
        </div>
    );
};

export { HydrationTracker };
