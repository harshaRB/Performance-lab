import React, { useState, useEffect } from 'react';
import HistoricalDataManager from '../utils/HistoricalDataManager';

const AchievementBadges = () => {
    const [achievements, setAchievements] = useState([]);
    const [newUnlocks, setNewUnlocks] = useState([]);

    const allAchievements = [
        { id: 'first_log', name: 'First Steps', description: 'Log your first day', icon: '🌱', condition: (stats) => stats.totalDays >= 1 },
        { id: 'week_warrior', name: 'Week Warrior', description: '7-day streak', icon: '🔥', condition: (stats) => stats.currentStreak >= 7 },
        { id: 'month_master', name: 'Month Master', description: '30-day streak', icon: '💪', condition: (stats) => stats.currentStreak >= 30 },
        { id: 'centurion', name: 'Centurion', description: '100-day streak', icon: '👑', condition: (stats) => stats.currentStreak >= 100 },
        { id: 'perfect_score', name: 'Perfectionist', description: 'Score 100 in any module', icon: '⭐', condition: (stats) => stats.maxScore >= 100 },
        { id: 'balanced', name: 'Balanced', description: 'All modules above 70', icon: '⚖️', condition: (stats) => stats.minScore >= 70 },
        { id: 'elite', name: 'Elite Performer', description: 'System score above 90', icon: '🏆', condition: (stats) => stats.systemScore >= 90 },
        { id: 'data_driven', name: 'Data Driven', description: '30 days of data', icon: '📊', condition: (stats) => stats.totalDays >= 30 },
        { id: 'comeback', name: 'Comeback Kid', description: 'Recover from sub-50 score', icon: '🎯', condition: (stats) => stats.hasComeback },
        { id: 'consistency', name: 'Mr. Consistent', description: '90% logging rate', icon: '📈', condition: (stats) => stats.consistencyRate >= 0.9 }
    ];

    useEffect(() => {
        checkAchievements();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkAchievements = () => {
        const stats = calculateStats();
        const unlocked = localStorage.getItem('pl_achievements');
        const previouslyUnlocked = unlocked ? JSON.parse(unlocked) : [];

        const newlyUnlocked = [];
        const currentUnlocked = [];

        allAchievements.forEach(achievement => {
            if (achievement.condition(stats)) {
                currentUnlocked.push(achievement.id);
                if (!previouslyUnlocked.includes(achievement.id)) {
                    newlyUnlocked.push(achievement);
                }
            }
        });

        if (newlyUnlocked.length > 0) {
            setNewUnlocks(newlyUnlocked);
            setTimeout(() => setNewUnlocks([]), 5000); // Clear after 5s
        }

        localStorage.setItem('pl_achievements', JSON.stringify(currentUnlocked));
        setAchievements(currentUnlocked);
    };

    const calculateStats = () => {
        const history = HistoricalDataManager.getScoreHistory();
        const dates = Object.keys(history).sort();

        let currentStreak = 0;
        const _today = new Date().toISOString().split('T')[0];

        for (let i = 0; i <= 365; i++) {
            const checkDate = new Date();
            checkDate.setDate(checkDate.getDate() - i);
            const dateStr = checkDate.toISOString().split('T')[0];

            if (history[dateStr]) {
                currentStreak++;
            } else {
                break;
            }
        }

        const allScores = Object.values(history).flatMap(day =>
            [day.learning, day.screen, day.nutrition, day.training, day.sleep].filter(s => s !== undefined)
        );

        const systemScores = Object.values(history).map(d => d.system).filter(s => s !== undefined);
        const hasComeback = systemScores.some((score, i) =>
            score < 50 && systemScores[i + 1] && systemScores[i + 1] >= 70
        );

        return {
            totalDays: dates.length,
            currentStreak,
            maxScore: Math.max(...allScores, 0),
            minScore: Math.min(...allScores.filter(s => s > 0), 100),
            systemScore: systemScores[systemScores.length - 1] || 0,
            hasComeback,
            consistencyRate: dates.length / 30 // Last 30 days
        };
    };

    const unlockedAchievements = allAchievements.filter(a => achievements.includes(a.id));
    const lockedAchievements = allAchievements.filter(a => !achievements.includes(a.id));

    return (
        <>
            {/* New Unlock Notification */}
            {newUnlocks.length > 0 && (
                <div style={{
                    position: 'fixed',
                    top: '2rem',
                    right: '2rem',
                    zIndex: 10000,
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    color: 'black',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    boxShadow: '0 8px 32px rgba(255, 215, 0, 0.5)',
                    animation: 'slideIn 0.5s ease-out',
                    maxWidth: '300px'
                }}>
                    <div style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '0.5rem' }}>
                        {newUnlocks[0].icon}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold', textAlign: 'center', marginBottom: '0.25rem' }}>
                        ACHIEVEMENT UNLOCKED!
                    </div>
                    <div style={{ textAlign: 'center', fontSize: '0.9rem' }}>
                        {newUnlocks[0].name}
                    </div>
                </div>
            )}

            <div className="card" style={{ marginTop: '2rem', border: '2px solid #FFD700' }}>
                <header style={{ marginBottom: '1.5rem' }}>
                    <h3 className="mono" style={{ fontSize: '1rem' }}>🏆 ACHIEVEMENTS</h3>
                    <p className="label">{unlockedAchievements.length}/{allAchievements.length} UNLOCKED</p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                    {unlockedAchievements.map(achievement => (
                        <div key={achievement.id} style={{
                            padding: '1rem',
                            background: 'rgba(255, 215, 0, 0.1)',
                            border: '2px solid #FFD700',
                            borderRadius: '4px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{achievement.icon}</div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                                {achievement.name}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                {achievement.description}
                            </div>
                        </div>
                    ))}

                    {lockedAchievements.map(achievement => (
                        <div key={achievement.id} style={{
                            padding: '1rem',
                            background: 'rgba(125, 133, 144, 0.05)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '4px',
                            textAlign: 'center',
                            opacity: 0.5
                        }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', filter: 'grayscale(1)' }}>
                                {achievement.icon}
                            </div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                                ???
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                {achievement.description}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </>
    );
};

export default AchievementBadges;
