import React, { useState, useEffect } from 'react';
import StatAnalysis from '../utils/StatAnalysis';

const CorrelationMatrix = () => {
    const [matrix, setMatrix] = useState(null);
    const [strongestCorrelations, setStrongestCorrelations] = useState([]);

    useEffect(() => {
        const correlationMatrix = StatAnalysis.generateCorrelationMatrix(30);
        setMatrix(correlationMatrix);

        const strongest = StatAnalysis.findStrongestCorrelations(correlationMatrix);
        setStrongestCorrelations(strongest);
    }, []);

    if (!matrix) return <div className="card">Loading correlation data...</div>;

    const metrics = Object.keys(matrix);

    const getColor = (value) => {
        if (value > 0.7) return '#22C55E';
        if (value > 0.4) return '#2DD4BF';
        if (value > -0.4) return '#7D8590';
        if (value > -0.7) return '#F59E0B';
        return '#EF4444';
    };

    return (
        <div className="card" style={{ marginTop: '2rem', border: '2px solid var(--accent-learning)' }}>
            <header style={{ marginBottom: '1.5rem' }}>
                <h3 className="mono" style={{ fontSize: '1rem' }}>CORRELATION MATRIX</h3>
                <p className="label">DISCOVER PERFORMANCE PATTERNS</p>
            </header>

            {/* Correlation Table */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '0.5rem', textAlign: 'left', fontFamily: 'var(--font-mono)' }}></th>
                            {metrics.map(m => (
                                <th key={m} style={{ padding: '0.5rem', textAlign: 'center', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                                    {m.slice(0, 4)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {metrics.map(metric1 => (
                            <tr key={metric1}>
                                <td style={{ padding: '0.5rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                                    {metric1}
                                </td>
                                {metrics.map(metric2 => {
                                    const value = matrix[metric1][metric2];
                                    return (
                                        <td
                                            key={metric2}
                                            style={{
                                                padding: '0.5rem',
                                                textAlign: 'center',
                                                background: metric1 === metric2 ? 'rgba(125, 133, 144, 0.2)' : `${getColor(value)}22`,
                                                color: getColor(value),
                                                fontFamily: 'var(--font-mono)',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {value.toFixed(2)}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Legend */}
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.7rem' }}>
                <span style={{ color: '#22C55E' }}>● Strong (+)</span>
                <span style={{ color: '#2DD4BF' }}>● Moderate (+)</span>
                <span style={{ color: '#7D8590' }}>● Weak</span>
                <span style={{ color: '#F59E0B' }}>● Moderate (-)</span>
                <span style={{ color: '#EF4444' }}>● Strong (-)</span>
            </div>

            {/* Strongest Correlations */}
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(45, 212, 191, 0.1)' }}>
                <h4 className="label" style={{ marginBottom: '1rem' }}>TOP CORRELATIONS</h4>
                {strongestCorrelations.slice(0, 3).map((corr, i) => (
                    <div key={i} style={{ marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: i < 2 ? '1px solid var(--border-subtle)' : 'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="mono" style={{ textTransform: 'uppercase' }}>
                                {corr.metric1} ↔ {corr.metric2}
                            </span>
                            <span style={{ color: getColor(corr.correlation), fontWeight: 'bold' }}>
                                r = {corr.correlation.toFixed(3)}
                            </span>
                        </div>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                            {StatAnalysis.interpretCorrelation(corr.correlation)} {corr.correlation > 0 ? 'positive' : 'negative'} relationship
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CorrelationMatrix;
