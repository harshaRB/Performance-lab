import React, { useState, useEffect } from 'react';

const AdaptiveWeights = ({ onWeightsChange }) => {
    const presets = {
        balanced: { learning: 1.2, screen: 1.1, nutrition: 1.0, training: 1.0, sleep: 1.2 },
        academic: { learning: 1.5, screen: 1.3, nutrition: 0.8, training: 0.7, sleep: 1.2 },
        athletic: { learning: 0.8, screen: 0.9, nutrition: 1.3, training: 1.5, sleep: 1.3 },
        recovery: { learning: 0.7, screen: 0.8, nutrition: 1.2, training: 0.6, sleep: 1.6 }
    };

    const [selectedMode, setSelectedMode] = useState('balanced');
    const [customWeights, setCustomWeights] = useState(presets.balanced);

    useEffect(() => {
        const saved = localStorage.getItem('pl_weight_mode');
        if (saved) setSelectedMode(saved);
    }, []);

    const applyMode = (mode) => {
        setSelectedMode(mode);
        setCustomWeights(presets[mode]);
        localStorage.setItem('pl_weight_mode', mode);
        localStorage.setItem('pl_custom_weights', JSON.stringify(presets[mode]));
        if (onWeightsChange) onWeightsChange(presets[mode]);
    };

    return (
        <div className="card" style={{ marginTop: '2rem', border: '2px solid var(--accent-learning)' }}>
            <h3 className="mono" style={{ marginBottom: '1rem' }}>ADAPTIVE MODULE WEIGHTS</h3>
            <p className="label" style={{ marginBottom: '1rem' }}>FOCUS MODE SELECTION</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {Object.keys(presets).map(mode => (
                    <button
                        key={mode}
                        onClick={() => applyMode(mode)}
                        style={{
                            background: selectedMode === mode ? 'var(--accent-learning)' : 'transparent',
                            color: selectedMode === mode ? 'black' : 'var(--text-secondary)',
                            border: `1px solid var(--accent-learning)`,
                            padding: '0.75rem',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            fontSize: '0.75rem',
                            fontFamily: 'var(--font-mono)'
                        }}
                    >
                        {mode}
                    </button>
                ))}
            </div>

            <div style={{ fontSize: '0.85rem' }}>
                <p className="label">CURRENT WEIGHTS:</p>
                {Object.entries(customWeights).map(([module, weight]) => (
                    <div key={module} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span className="mono" style={{ textTransform: 'uppercase' }}>{module}</span>
                        <span style={{ color: 'var(--accent-learning)' }}>{weight.toFixed(1)}×</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdaptiveWeights;
