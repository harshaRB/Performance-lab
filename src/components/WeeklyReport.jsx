import React, { useState, useEffect } from 'react';
import HistoricalDataManager from '../utils/HistoricalDataManager';

const WeeklyReport = () => {
    const [report, setReport] = useState(null);

    useEffect(() => {
        generateReport();
    }, []);

    const generateReport = () => {
        const weekData = HistoricalDataManager.getChartData(7);

        if (weekData.length === 0) {
            setReport(null);
            return;
        }

        // Filter out null values
        const validDays = weekData.filter(d => d.system !== null);

        if (validDays.length === 0) {
            setReport(null);
            return;
        }

        // Calculate metrics
        const scores = validDays.map(d => d.system);
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        const maxScore = Math.max(...scores);
        const minScore = Math.min(...scores);

        // Find best and worst days
        const bestDay = validDays.reduce((a, b) => a.system > b.system ? a : b);
        const worstDay = validDays.reduce((a, b) => a.system < b.system ? a : b);

        // Calculate consistency (lower variance = more consistent)
        const variance = scores.reduce((a, b) => a + Math.pow(b - avgScore, 2), 0) / scores.length;
        const stddev = Math.sqrt(variance);
        const consistencyScore = Math.max(0, 100 - stddev * 2); // Lower stddev = higher consistency

        // Week-over-week trend (if we have previous week data)
        const prevWeekData = HistoricalDataManager.getChartData(14).slice(0, 7);
        const prevValidDays = prevWeekData.filter(d => d.system !== null);
        let weekOverWeek = null;

        if (prevValidDays.length > 0) {
            const prevAvg = prevValidDays.reduce((a, b) => a + b.system, 0) / prevValidDays.length;
            weekOverWeek = avgScore - prevAvg;
        }

        setReport({
            avgScore: Math.round(avgScore),
            maxScore,
            minScore,
            bestDay,
            worstDay,
            consistencyScore: Math.round(consistencyScore),
            weekOverWeek: weekOverWeek ? weekOverWeek.toFixed(1) : null,
            daysLogged: validDays.length
        });
    };

    if (!report) {
        return (
            <section className="card" style={{ marginTop: '2rem', padding: '2rem', textAlign: 'center' }}>
                <p className="label">WEEKLY REPORT</p>
                <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
                    Not enough data. Log at least 3 days to generate report.
                </p>
            </section>
        );
    }

    return (
        <section className="card" style={{ marginTop: '2rem', border: '2px solid var(--text-primary)' }}>
            <header style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                <h2 className="mono" style={{ fontSize: '1.2rem' }}>WEEKLY PERFORMANCE REPORT</h2>
                <p className="label">LAST 7 DAYS ANALYSIS</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ textAlign: 'center' }}>
                    <p className="label">AVERAGE SCORE</p>
                    <div className="mono" style={{ fontSize: '2.5rem', color: 'var(--accent-nutrition)' }}>
                        {report.avgScore}
                    </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <p className="label">CONSISTENCY</p>
                    <div className="mono" style={{ fontSize: '2.5rem', color: 'var(--accent-learning)' }}>
                        {report.consistencyScore}
                    </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <p className="label">WEEK/WEEK</p>
                    <div className="mono" style={{
                        fontSize: '2.5rem',
                        color: report.weekOverWeek > 0 ? 'var(--accent-nutrition)' : 'var(--accent-danger)'
                    }}>
                        {report.weekOverWeek ? (report.weekOverWeek > 0 ? '+' : '') + report.weekOverWeek : 'N/A'}
                    </div>
                </div>
            </div>

            <div className="grid-2" style={{ marginTop: '1.5rem' }}>
                <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '1rem', borderLeft: '4px solid var(--accent-nutrition)' }}>
                    <p className="label" style={{ color: 'var(--accent-nutrition)' }}>BEST DAY</p>
                    <div className="mono" style={{ fontSize: '1.2rem' }}>{report.bestDay.day}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Score: <strong style={{ color: 'white' }}>{report.bestDay.system}</strong>
                    </div>
                </div>

                <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderLeft: '4px solid var(--accent-danger)' }}>
                    <p className="label" style={{ color: 'var(--accent-danger)' }}>WORST DAY</p>
                    <div className="mono" style={{ fontSize: '1.2rem' }}>{report.worstDay.day}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Score: <strong style={{ color: 'white' }}>{report.worstDay.system}</strong>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(125, 133, 144, 0.1)' }}>
                <p className="label">INSIGHTS</p>
                <ul style={{ fontSize: '0.85rem', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
                    <li>Logged {report.daysLogged} of 7 days this week</li>
                    <li>Score range: {report.minScore} - {report.maxScore} ({report.maxScore - report.minScore} point spread)</li>
                    <li>Consistency: {report.consistencyScore >= 80 ? 'Excellent' : report.consistencyScore >= 60 ? 'Good' : 'Needs improvement'}</li>
                    {report.weekOverWeek && (
                        <li>
                            {report.weekOverWeek > 0
                                ? `↑ Improved by ${report.weekOverWeek} points from last week`
                                : `↓ Declined by ${Math.abs(report.weekOverWeek)} points from last week`}
                        </li>
                    )}
                </ul>
            </div>
        </section>
    );
};

export default WeeklyReport;
