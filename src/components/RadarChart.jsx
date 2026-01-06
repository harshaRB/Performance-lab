import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useSystemScore } from '../hooks/useSystemScore';

const ModuleRadarChart = () => {
    const scores = useSystemScore();

    const data = [
        { module: 'Learning', score: scores.learning, fullMark: 100 },
        { module: 'Screen', score: scores.screen, fullMark: 100 },
        { module: 'Nutrition', score: scores.nutrition, fullMark: 100 },
        { module: 'Training', score: scores.training, fullMark: 100 },
        { module: 'Sleep', score: scores.sleep, fullMark: 100 }
    ];

    // Calculate balance score (lower variance = more balanced)
    const variance = data.reduce((acc, d) => {
        const diff = d.score - scores.system;
        return acc + Math.pow(diff, 2);
    }, 0) / data.length;

    const balanceScore = Math.max(0, 100 - Math.sqrt(variance));

    return (
        <div className="card" style={{ marginTop: '2rem', border: '2px solid var(--accent-learning)' }}>
            <header style={{ marginBottom: '1.5rem' }}>
                <h3 className="mono" style={{ fontSize: '1rem' }}>MODULE BALANCE ANALYSIS</h3>
                <p className="label">RADAR VISUALIZATION</p>
            </header>

            <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={data}>
                    <PolarGrid stroke="var(--border-subtle)" />
                    <PolarAngleAxis
                        dataKey="module"
                        tick={{ fill: 'var(--text-primary)', fontSize: 12, fontFamily: 'var(--font-mono)' }}
                    />
                    <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
                    />
                    <Radar
                        name="Current Scores"
                        dataKey="score"
                        stroke="var(--accent-learning)"
                        fill="var(--accent-learning)"
                        fillOpacity={0.3}
                        strokeWidth={2}
                    />
                    <Tooltip
                        contentStyle={{
                            background: '#161B22',
                            border: '1px solid var(--border-subtle)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.75rem'
                        }}
                    />
                </RadarChart>
            </ResponsiveContainer>

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(45, 212, 191, 0.1)', textAlign: 'center' }}>
                <p className="label">BALANCE SCORE</p>
                <div className="mono" style={{ fontSize: '2rem', color: 'var(--accent-learning)' }}>
                    {Math.round(balanceScore)}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    {balanceScore >= 80 ? 'Excellent balance across modules' :
                        balanceScore >= 60 ? 'Good balance, minor gaps' :
                            'Significant imbalance detected'}
                </p>
            </div>
        </div>
    );
};

export default ModuleRadarChart;
