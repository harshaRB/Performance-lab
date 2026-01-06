import React, { useState, useEffect } from 'react';
import HistoricalDataManager from '../utils/HistoricalDataManager';

const StreakTracking = () => {
    const [streaks, setStreaks] = useState({
        current: 0,
        longest: 0,
        lastLogDate: null
    });

    useEffect(() => {
        calculateStreaks();
    }, []);

    const calculateStreaks = () => {
        const history = HistoricalDataManager.getScoreHistory();
        const dates = Object.keys(history).sort().reverse();

        if (dates.length === 0) {
            setStreaks({ current: 0, longest: 0, lastLogDate: null });
            return;
        }

        // Calculate current streak
        let currentStreak = 0;
        const today = new Date().toISOString().split('T')[0];

        for (let i = 0; i < dates.length; i++) {
            const expectedDate = new Date();
            expectedDate.setDate(expectedDate.getDate() - i);
            const expectedDateStr = expectedDate.toISOString().split('T')[0];

            if (dates[i] === expectedDateStr) {
                currentStreak++;
            } else {
                break;
            }
        }

        // Calculate longest streak
        let longestStreak = 0;
        let tempStreak = 0;

        for (let i = 0; i < dates.length - 1; i++) {
            const current = new Date(dates[i]);
            const next = new Date(dates[i + 1]);
            const diffDays = (current - next) / (1000 * 60 * 60 * 24);

            if (diffDays === 1) {
                tempStreak++;
            } else {
                longestStreak = Math.max(longestStreak, tempStreak + 1);
                tempStreak = 0;
            }
        }
        longestStreak = Math.max(longestStreak, tempStreak + 1);

        setStreaks({
            current: currentStreak,
            longest: Math.max(longestStreak, currentStreak),
            lastLogDate: dates[0]
        });
    };

    const getBadge = (streak) => {
        if (streak >= 100) return { name: 'CENTURION', color: '#FFD700' };
        if (streak >= 30) return { name: 'MONTHLY', color: '#8B5CF6' };
        if (streak >= 7) return { name: 'WEEKLY', color: '#22C55E' };
        return null;
    };

    const currentBadge = getBadge(streaks.current);
    const longestBadge = getBadge(streaks.longest);

    return (
        <section className="card" style={{ marginTop: '2rem', border: '2px solid #FFD700' }}>
            <h3 className="mono" style={{ marginBottom: '1rem' }}>🔥 STREAK TRACKING</h3>

            <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
                <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255, 215, 0, 0.1)' }}>
                    <p className="label">CURRENT STREAK</p>
                    <div className="mono" style={{ fontSize: '3rem', color: '#FFD700' }}>{streaks.current}</div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>days</p>
                    {currentBadge && (
                        <div style={{
                            marginTop: '0.5rem',
                            padding: '0.25rem 0.75rem',
                            background: currentBadge.color,
                            color: 'black',
                            display: 'inline-block',
                            fontSize: '0.7rem',
                            fontWeight: 'bold'
                        }}>
                            {currentBadge.name}
                        </div>
                    )}
                </div>

                <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(139, 92, 246, 0.1)' }}>
                    <p className="label">LONGEST STREAK</p>
                    <div className="mono" style={{ fontSize: '3rem', color: '#8B5CF6' }}>{streaks.longest}</div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>days</p>
                    {longestBadge && (
                        <div style={{
                            marginTop: '0.5rem',
                            padding: '0.25rem 0.75rem',
                            background: longestBadge.color,
                            color: 'black',
                            display: 'inline-block',
                            fontSize: '0.7rem',
                            fontWeight: 'bold'
                        }}>
                            RECORD: {longestBadge.name}
                        </div>
                    )}
                </div>
            </div>

            <div style={{ fontSize: '0.85rem', padding: '1rem', background: 'rgba(125, 133, 144, 0.1)' }}>
                <p className="label">BADGE MILESTONES</p>
                <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                    <li style={{ color: streaks.current >= 7 ? 'var(--accent-nutrition)' : 'var(--text-secondary)' }}>
                        7 days - Weekly Warrior
                    </li>
                    <li style={{ color: streaks.current >= 30 ? 'var(--accent-nutrition)' : 'var(--text-secondary)' }}>
                        30 days - Monthly Master
                    </li>
                    <li style={{ color: streaks.current >= 100 ? 'var(--accent-nutrition)' : 'var(--text-secondary)' }}>
                        100 days - Centurion
                    </li>
                </ul>
            </div>
        </section>
    );
};

export default StreakTracking;
