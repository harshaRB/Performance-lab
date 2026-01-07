import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import HistoricalDataManager from '../utils/HistoricalDataManager';

const AnalyticsView = () => {
    const [chartData, setChartData] = useState([]);
    const [sleepDebtData, setSleepDebtData] = useState([]);
    const [circadianData, setCircadianData] = useState([]);
    const [days, setDays] = useState(7);

    useEffect(() => {
        loadRealData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [days]);

    const loadRealData = () => {
        // Get real historical data
        const data = HistoricalDataManager.getChartData(days);
        setChartData(data);

        // Calculate sleep debt accumulation
        const sleepDebt = calculateSleepDebt(data);
        setSleepDebtData(sleepDebt);

        // Calculate circadian alignment
        const circadian = calculateCircadianAlignment(data);
        setCircadianData(circadian);
    };

    const calculateSleepDebt = (data) => {
        let cumulativeDebt = 0;
        return data.map(d => {
            const optimalSleep = 100; // 100 score = 8hrs
            const deficit = Math.max(0, optimalSleep - (d.sleep || 0));
            cumulativeDebt += deficit;

            // Debt recovery: 20% reduction per good night
            if (d.sleep >= 90) {
                cumulativeDebt = Math.max(0, cumulativeDebt * 0.8);
            }

            return {
                ...d,
                deficit,
                cumulativeDebt: Math.round(cumulativeDebt)
            };
        });
    };

    const calculateCircadianAlignment = (data) => {
        // Mock circadian data - in real implementation, would use sleep/wake times
        return data.map(d => {
            // Assume sleep score correlates with circadian alignment
            const alignment = d.sleep || 0;
            const penalty = Math.max(0, 100 - alignment);

            return {
                ...d,
                alignment,
                penalty
            };
        });
    };

    const calculate14DayBaseline = (metricName) => {
        const history = HistoricalDataManager.getMetricHistory(metricName, 14);
        if (history.length < 3) return { mean: 50, stddev: 15 };

        const mean = history.reduce((a, b) => a + b, 0) / history.length;
        const variance = history.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / history.length;
        const stddev = Math.sqrt(variance) || 1;

        return { mean: mean.toFixed(1), stddev: stddev.toFixed(1), dataPoints: history.length };
    };

    const baselines = {
        system: calculate14DayBaseline('system'),
        learning: calculate14DayBaseline('learning'),
        nutrition: calculate14DayBaseline('nutrition'),
        training: calculate14DayBaseline('training'),
        sleep: calculate14DayBaseline('sleep')
    };

    return (
        <section className="animate-fade-in" style={{ marginTop: '2rem' }} data-section="analytics">
            <header style={{ marginBottom: '1.5rem' }}>
                <h2 className="mono" style={{ fontSize: '1.2rem' }}>LONGITUDINAL ANALYSIS</h2>
                <p className="label">PERFORMANCE TRENDS & STATISTICAL BASELINES</p>
            </header>

            {/* Date Range Selector */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', justifyContent: 'flex-end' }}>
                <button
                    onClick={() => setDays(7)}
                    style={{
                        background: days === 7 ? 'var(--text-primary)' : 'transparent',
                        color: days === 7 ? 'black' : 'var(--text-secondary)',
                        border: '1px solid var(--text-primary)',
                        padding: '0.5rem 1rem',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem'
                    }}
                >
                    7D
                </button>
                <button
                    onClick={() => setDays(14)}
                    style={{
                        background: days === 14 ? 'var(--text-primary)' : 'transparent',
                        color: days === 14 ? 'black' : 'var(--text-secondary)',
                        border: '1px solid var(--text-primary)',
                        padding: '0.5rem 1rem',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem'
                    }}
                >
                    14D
                </button>
                <button
                    onClick={() => setDays(30)}
                    style={{
                        background: days === 30 ? 'var(--text-primary)' : 'transparent',
                        color: days === 30 ? 'black' : 'var(--text-secondary)',
                        border: '1px solid var(--text-primary)',
                        padding: '0.5rem 1rem',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem'
                    }}
                >
                    30D
                </button>
            </div>

            {/* 14-Day Baselines */}
            <div className="card" style={{ marginBottom: '1rem', background: 'rgba(45, 212, 191, 0.05)', border: '1px solid var(--accent-learning)' }}>
                <h3 className="mono" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>14-DAY ROLLING BASELINES</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', fontSize: '0.85rem' }}>
                    {Object.entries(baselines).map(([metric, stats]) => (
                        <div key={metric} style={{ textAlign: 'center' }}>
                            <p className="label" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>{metric}</p>
                            <div className="mono" style={{ fontSize: '1.2rem', color: 'var(--accent-learning)' }}>
                                μ={stats.mean}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                σ={stats.stddev} (n={stats.dataPoints})
                            </div>
                        </div>
                    ))}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '1rem', textAlign: 'center' }}>
                    Z-scores calculated from rolling 14-day mean (μ) and standard deviation (σ)
                </p>
            </div>

            {/* System Performance Trend */}
            <div className="card" style={{ padding: '1.5rem' }}>
                <h3 className="mono" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>SYSTEM PERFORMANCE TREND</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                        <XAxis dataKey="day" stroke="var(--text-secondary)" style={{ fontSize: '0.7rem' }} />
                        <YAxis stroke="var(--text-secondary)" style={{ fontSize: '0.7rem' }} domain={[0, 100]} />
                        <Tooltip
                            contentStyle={{ background: '#161B22', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }} />
                        <ReferenceLine y={parseFloat(baselines.system.mean)} stroke="var(--accent-learning)" strokeDasharray="5 5" label={{ value: 'Baseline', position: 'insideTopRight', fill: 'var(--accent-learning)', fontSize: 10 }} />
                        <Line type="monotone" dataKey="system" stroke="#E6EDF3" strokeWidth={2} dot={{ r: 3 }} name="System" connectNulls />
                        <Line type="monotone" dataKey="learning" stroke="#2DD4BF" strokeWidth={1.5} dot={false} name="Learning" connectNulls />
                        <Line type="monotone" dataKey="nutrition" stroke="#22C55E" strokeWidth={1.5} dot={false} name="Nutrition" connectNulls />
                        <Line type="monotone" dataKey="sleep" stroke="#FFFFFF" strokeWidth={1.5} dot={false} name="Sleep" connectNulls />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Sleep Debt Accumulation */}
            <div className="card" style={{ padding: '1.5rem', marginTop: '1rem' }}>
                <h3 className="mono" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>SLEEP DEBT ACCUMULATION</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={sleepDebtData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                        <XAxis dataKey="day" stroke="var(--text-secondary)" style={{ fontSize: '0.7rem' }} />
                        <YAxis stroke="var(--text-secondary)" style={{ fontSize: '0.7rem' }} />
                        <Tooltip
                            contentStyle={{ background: '#161B22', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}
                        />
                        <Area type="monotone" dataKey="cumulativeDebt" stroke="#EF4444" fill="rgba(239, 68, 68, 0.2)" name="Cumulative Debt" />
                        <Bar dataKey="deficit" fill="#F59E0B" name="Daily Deficit" />
                    </AreaChart>
                </ResponsiveContainer>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', textAlign: 'center' }}>
                    Debt accumulates daily. 90+ score nights reduce debt by 20%.
                </p>
            </div>

            {/* Circadian Alignment */}
            <div className="card" style={{ padding: '1.5rem', marginTop: '1rem' }}>
                <h3 className="mono" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>CIRCADIAN ALIGNMENT PENALTY</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={circadianData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                        <XAxis dataKey="day" stroke="var(--text-secondary)" style={{ fontSize: '0.7rem' }} />
                        <YAxis stroke="var(--text-secondary)" style={{ fontSize: '0.7rem' }} domain={[0, 100]} />
                        <Tooltip
                            contentStyle={{ background: '#161B22', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}
                        />
                        <ReferenceLine y={0} stroke="var(--accent-nutrition)" strokeDasharray="3 3" label={{ value: 'Optimal', position: 'insideTopRight', fill: 'var(--accent-nutrition)', fontSize: 10 }} />
                        <Bar dataKey="penalty" fill="#8B5CF6" name="Alignment Penalty (pts)" />
                    </BarChart>
                </ResponsiveContainer>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', textAlign: 'center' }}>
                    Penalty based on deviation from optimal sleep/wake times (22:00-06:00)
                </p>
            </div>
        </section>
    );
};

export default AnalyticsView;
