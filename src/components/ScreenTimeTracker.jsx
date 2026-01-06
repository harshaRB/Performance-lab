import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

const ScreenTimeTracker = () => {
    const { dailyLogs, setDailyLog } = useAppStore();
    const today = new Date().toISOString().split('T')[0];

    const [inputs, setInputs] = useState(dailyLogs[today]?.screen || {
        productive: 0,
        social: 0,
        entertainment: 0
    });

    const [penalty, setPenalty] = useState(0);

    // Sync from store
    useEffect(() => {
        if (dailyLogs[today]?.screen) {
            setInputs(dailyLogs[today].screen);
        }
    }, [dailyLogs, today]);

    useEffect(() => {
        setDailyLog(today, 'screen', inputs);

        // Quadratic Penalty: α(S²) + β(E²)
        // Let alpha = 0.05, beta = 0.08 for demo
        const s = parseFloat(inputs.social || 0);
        const e = parseFloat(inputs.entertainment || 0);

        // Simple penalty visualization
        const p = (0.05 * Math.pow(s, 1.5)) + (0.08 * Math.pow(e, 1.5));
        setPenalty(p.toFixed(1));

    }, [inputs, today, setDailyLog]);

    return (
        <section className="animate-fade-in" style={{ marginTop: '2rem' }}>
            <header style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 className="mono" style={{ fontSize: '1.2rem', color: 'var(--accent-screen)' }}>MODULE:02 // ATTENTION</h2>
                    <p className="label">SCREEN TIME ANALYSIS</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span className="label" style={{ color: 'var(--accent-danger)' }}>PENALTY SCORE</span>
                    <div className="mono" style={{ fontSize: '2.5rem', lineHeight: 1, color: 'var(--accent-danger)' }}>-{penalty}</div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>

                {/* PRODUCTIVE */}
                <div className="card">
                    <h3 style={{ fontSize: '0.9rem' }}>PRODUCTIVE</h3>
                    <p className="label">WORK, DEV, WRITING</p>
                    <input
                        type="number"
                        value={inputs.productive}
                        className="mono"
                        onChange={(e) => setInputs(prev => ({ ...prev, productive: parseFloat(e.target.value) || 0 }))}
                    />
                </div>

                {/* SOCIAL */}
                <div className="card" style={{ borderColor: inputs.social > 60 ? 'var(--accent-danger)' : 'var(--border-subtle)' }}>
                    <h3 style={{ fontSize: '0.9rem', color: inputs.social > 60 ? 'var(--accent-danger)' : 'inherit' }}>SOCIAL</h3>
                    <p className="label">FB, IG, TW, REDDIT</p>
                    <input
                        type="number"
                        value={inputs.social}
                        className="mono"
                        onChange={(e) => setInputs(prev => ({ ...prev, social: parseFloat(e.target.value) || 0 }))}
                    />
                </div>

                {/* ENTERTAINMENT */}
                <div className="card" style={{ borderColor: inputs.entertainment > 90 ? 'var(--accent-danger)' : 'var(--border-subtle)' }}>
                    <h3 style={{ fontSize: '0.9rem', color: inputs.entertainment > 90 ? 'var(--accent-danger)' : 'inherit' }}>ENTERTAINMENT</h3>
                    <p className="label">NETFLIX, YT, MOVIES</p>
                    <input
                        type="number"
                        value={inputs.entertainment}
                        className="mono"
                        onChange={(e) => setInputs(prev => ({ ...prev, entertainment: parseFloat(e.target.value) || 0 }))}
                    />
                </div>
            </div>
        </section>
    )
}

export { ScreenTimeTracker };
