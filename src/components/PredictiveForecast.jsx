import React, { useState, useEffect } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import PredictiveAnalytics from '../utils/PredictiveAnalytics';

const PredictiveForecast = () => {
    const [forecasts, setForecasts] = useState(null);
    const [selectedMetric, setSelectedMetric] = useState('system');

    useEffect(() => {
        const allForecasts = PredictiveAnalytics.forecastAll(7);
        setForecasts(allForecasts);
    }, []);

    if (!forecasts) return <div className="card">Generating forecasts...</div>;

    const forecast = forecasts[selectedMetric];

    if (forecast.error) {
        return (
            <div className="card" style={{ marginTop: '2rem' }}>
                <p style={{ color: 'var(--accent-danger)' }}>{forecast.error}</p>
            </div>
        );
    }

    const chartData = forecast.forecast.map(f => ({
        day: `Day +${f.day}`,
        predicted: f.value,
        confidence: f.confidence
    }));

    return (
        <div className="card" style={{ marginTop: '2rem', border: '2px solid var(--accent-strength)' }}>
            <header style={{ marginBottom: '1.5rem' }}>
                <h3 className="mono" style={{ fontSize: '1rem' }}>7-DAY FORECAST</h3>
                <p className="label">PREDICTIVE PERFORMANCE PROJECTION</p>
            </header>

            {/* Metric Selector */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {['system', 'learning', 'nutrition', 'training', 'sleep'].map(metric => (
                    <button
                        key={metric}
                        onClick={() => setSelectedMetric(metric)}
                        style={{
                            background: selectedMetric === metric ? 'var(--accent-strength)' : 'transparent',
                            color: selectedMetric === metric ? 'black' : 'var(--text-secondary)',
                            border: '1px solid var(--accent-strength)',
                            padding: '0.5rem 1rem',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.7rem',
                            textTransform: 'uppercase'
                        }}
                    >
                        {metric}
                    </button>
                ))}
            </div>

            {/* Trend Indicator */}
            <div style={{ marginBottom: '1rem', padding: '1rem', background: `rgba(139, 92, 246, 0.1)`, textAlign: 'center' }}>
                <p className="label">TREND ANALYSIS</p>
                <div style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>
                    {forecast.trend === 'improving' && <span style={{ color: 'var(--accent-nutrition)' }}>📈 IMPROVING</span>}
                    {forecast.trend === 'declining' && <span style={{ color: 'var(--accent-danger)' }}>📉 DECLINING</span>}
                    {forecast.trend === 'stable' && <span style={{ color: 'var(--text-secondary)' }}>➡️ STABLE</span>}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    Slope: {forecast.slope} points/day
                </p>
            </div>

            {/* Forecast Chart */}
            <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                    <XAxis dataKey="day" stroke="var(--text-secondary)" style={{ fontSize: '0.7rem' }} />
                    <YAxis stroke="var(--text-secondary)" style={{ fontSize: '0.7rem' }} domain={[0, 100]} />
                    <Tooltip
                        contentStyle={{ background: '#161B22', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="predicted"
                        stroke="var(--accent-strength)"
                        fill="rgba(139, 92, 246, 0.2)"
                        name="Predicted Score"
                    />
                </AreaChart>
            </ResponsiveContainer>

            {/* Forecast Table */}
            <div style={{ marginTop: '1.5rem', overflowX: 'auto' }}>
                <table style={{ width: '100%', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>DAY</th>
                            <th style={{ padding: '0.5rem', textAlign: 'center' }}>PREDICTED</th>
                            <th style={{ padding: '0.5rem', textAlign: 'right' }}>CONFIDENCE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {forecast.forecast.map((f, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                <td style={{ padding: '0.5rem' }}>+{f.day}</td>
                                <td style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 'bold' }}>{f.value}</td>
                                <td style={{ padding: '0.5rem', textAlign: 'right', color: f.confidence > 70 ? 'var(--accent-nutrition)' : f.confidence > 40 ? 'var(--accent-learning)' : 'var(--accent-danger)' }}>
                                    {f.confidence}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '1rem', textAlign: 'center' }}>
                Forecast based on 30-day linear regression. Confidence decreases with distance.
            </p>
        </div>
    );
};

export default PredictiveForecast;
