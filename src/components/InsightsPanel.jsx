import React from 'react';
import { useSystemScore } from '../hooks/useSystemScore';

const InsightsPanel = () => {
    const scores = useSystemScore();
    if (!scores.insights) return null;

    const { liability, leverage } = scores.insights;
    const topAsset = leverage[leverage.length - 1]; // Lowest potential gain = highest current saturation

    return (
        <section className="card" style={{ marginTop: '2rem', border: '1px solid var(--text-secondary)' }}>
            <header style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                <h2 className="mono" style={{ fontSize: '1rem' }}>SYSTEM DIAGNOSTICS // SENSITIVITY</h2>
            </header>

            <div className="grid-2">
                {/* LIABILITY CARD */}
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderLeft: '4px solid var(--accent-danger)' }}>
                    <p className="label" style={{ color: 'var(--accent-danger)' }}>PRIMARY LIABILITY</p>
                    <h3 className="mono" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                        {liability.id}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Currently limiting System Score.
                        Performance at <strong style={{ color: 'white' }}>{liability.val}%</strong>.
                        Immediate intervention required.
                    </p>
                </div>

                {/* ASSET CARD */}
                <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '1rem', borderLeft: '4px solid var(--accent-nutrition)' }}>
                    <p className="label" style={{ color: 'var(--accent-nutrition)' }}>PRIMARY ASSET</p>
                    <h3 className="mono" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                        {topAsset.id}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Operating at peak efficiency (<strong style={{ color: 'white' }}>{topAsset.val}%</strong>).
                        Maintenance mode active.
                    </p>
                </div>
            </div>

            {/* LEVERAGE LIST */}
            <div style={{ marginTop: '1.5rem' }}>
                <p className="label">OPTIMIZATION LEVERAGE (ROI)</p>
                {leverage.slice(0, 3).map((item, i) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                        <span className="mono">0{i + 1} {item.id}</span>
                        <span style={{ color: 'var(--text-secondary)' }}>
                            Impact Potential: <span style={{ color: 'var(--text-primary)' }}>High</span>
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default InsightsPanel;
