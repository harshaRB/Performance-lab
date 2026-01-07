import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

const ReadingTracker = () => {
    const { dailyLogs, setDailyLog } = useAppStore();
    const today = new Date().toISOString().split('T')[0];

    // Default state - use empty strings for display to avoid leading zeros
    const [inputs, setInputs] = useState(() => {
        const saved = dailyLogs[today]?.learning || { passive: 0, active: 0 };
        return {
            passive: saved.passive || '',
            active: saved.active || ''
        };
    });
    const [score, setScore] = useState(0);

    // Sync from store
    useEffect(() => {
        if (dailyLogs[today]?.learning) {
            const saved = dailyLogs[today].learning;
            setInputs({
                passive: saved.passive || '',
                active: saved.active || ''
            });
        }
    }, [dailyLogs, today]);

    // Save & Calculate
    useEffect(() => {
        // Only save non-empty values as numbers
        const saveData = {
            passive: inputs.passive === '' ? 0 : parseFloat(inputs.passive),
            active: inputs.active === '' ? 0 : parseFloat(inputs.active)
        };
        setDailyLog(today, 'learning', saveData);

        // Logic: (Active * 1.5) + Passive
        const ell = (saveData.active * 1.5) + saveData.passive;
        setScore(ell.toFixed(1));
    }, [inputs, today, setDailyLog]);

    const handleChange = (field, value) => {
        // Allow empty string or valid numbers only
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setInputs(prev => ({ ...prev, [field]: value }));
        }
    };

    return (
        <section className="animate-fade-in" style={{ marginTop: '2rem' }}>
            <header style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 className="mono" style={{ fontSize: '1.2rem', color: 'var(--accent-learning)' }}>MODULE:01 // COGNITION</h2>
                    <p className="label">LEARNING LOAD TRACKER</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span className="label">EFFECTIVE LOAD</span>
                    <div className="mono" style={{ fontSize: '2.5rem', lineHeight: 1 }}>{score}</div>
                </div>
            </header>

            <div className="grid-2">
                {/* PASSIVE */}
                <div className="card" style={{ borderLeft: '4px solid var(--border-subtle)' }}>
                    <h3 style={{ marginBottom: '1rem' }}>PASSIVE LEARNING</h3>
                    <p className="label" style={{ marginBottom: '1.5rem' }}>READING, LISTENING, WATCHING</p>

                    <div className="input-group">
                        <label className="label">Minutes</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={inputs.passive}
                            onChange={(e) => handleChange('passive', e.target.value)}
                            placeholder="0"
                        />
                    </div>
                </div>

                {/* ACTIVE */}
                <div className="card" style={{
                    border: '1px solid var(--accent-learning)',
                    boxShadow: '0 0 15px rgba(45, 212, 191, 0.1)',
                    transform: 'scale(1.02)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--accent-learning)' }}>ACTIVE LEARNING</h3>
                        <span className="mono" style={{ background: 'var(--accent-learning)', color: 'black', padding: '0.2rem 0.5rem', fontSize: '0.8rem', borderRadius: '2px' }}>×1.5 BONUS</span>
                    </div>
                    <p className="label" style={{ marginBottom: '1.5rem' }}>NOTES, RECALL, PROBLEM SOLVING</p>

                    <div className="input-group">
                        <label className="label" style={{ color: 'var(--accent-learning)' }}>Minutes</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={inputs.active}
                            onChange={(e) => handleChange('active', e.target.value)}
                            placeholder="0"
                            style={{ borderColor: 'var(--accent-learning)' }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export { ReadingTracker };
