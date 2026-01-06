import React, { useState, useEffect } from 'react';
import HistoricalDataManager from '../utils/HistoricalDataManager';

const HeatmapCalendar = () => {
    const [calendarData, setCalendarData] = useState([]);

    useEffect(() => {
        generateCalendarData();
    }, []);

    const generateCalendarData = () => {
        const history = HistoricalDataManager.getScoreHistory();
        const today = new Date();
        const data = [];

        // Generate last 12 weeks (84 days)
        for (let i = 83; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const dayData = history[dateStr];
            data.push({
                date: dateStr,
                day: date.getDate(),
                month: date.getMonth(),
                dayOfWeek: date.getDay(),
                score: dayData ? dayData.system : null,
                hasData: !!dayData
            });
        }

        setCalendarData(data);
    };

    const getColor = (score) => {
        if (score === null) return 'var(--bg-card)';
        if (score >= 90) return '#22C55E';
        if (score >= 70) return '#2DD4BF';
        if (score >= 50) return '#F59E0B';
        return '#EF4444';
    };

    const getIntensity = (score) => {
        if (score === null) return 0.1;
        return 0.3 + (score / 100) * 0.7;
    };

    // Group by weeks
    const weeks = [];
    for (let i = 0; i < calendarData.length; i += 7) {
        weeks.push(calendarData.slice(i, i + 7));
    }

    const consistency = calendarData.filter(d => d.hasData).length;
    const consistencyPercent = ((consistency / calendarData.length) * 100).toFixed(1);

    return (
        <div className="card" style={{ marginTop: '2rem', border: '2px solid var(--accent-nutrition)' }}>
            <header style={{ marginBottom: '1.5rem' }}>
                <h3 className="mono" style={{ fontSize: '1rem' }}>CONSISTENCY HEATMAP</h3>
                <p className="label">12-WEEK ACTIVITY CALENDAR</p>
            </header>

            <div style={{ overflowX: 'auto' }}>
                <div style={{ display: 'flex', gap: '2px', minWidth: '600px' }}>
                    {weeks.map((week, weekIdx) => (
                        <div key={weekIdx} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            {week.map((day, dayIdx) => (
                                <div
                                    key={dayIdx}
                                    title={`${day.date}: ${day.score !== null ? day.score : 'No data'}`}
                                    style={{
                                        width: '12px',
                                        height: '12px',
                                        background: day.hasData ? getColor(day.score) : 'var(--border-subtle)',
                                        opacity: getIntensity(day.score),
                                        border: '1px solid var(--bg-primary)',
                                        cursor: 'pointer'
                                    }}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span>Less</span>
                        <div style={{ display: 'flex', gap: '2px' }}>
                            {[0.2, 0.4, 0.6, 0.8, 1.0].map((opacity, i) => (
                                <div key={i} style={{
                                    width: '12px',
                                    height: '12px',
                                    background: 'var(--accent-nutrition)',
                                    opacity
                                }} />
                            ))}
                        </div>
                        <span>More</span>
                    </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <p className="label">CONSISTENCY</p>
                    <div className="mono" style={{ fontSize: '1.5rem', color: 'var(--accent-nutrition)' }}>
                        {consistencyPercent}%
                    </div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                        {consistency}/{calendarData.length} days logged
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HeatmapCalendar;
