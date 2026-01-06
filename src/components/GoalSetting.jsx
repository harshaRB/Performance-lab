import React, { useState, useEffect } from 'react';
import { useSystemScore } from '../hooks/useSystemScore';

const GoalSetting = () => {
    const scores = useSystemScore();
    const [goals, setGoals] = useState({
        system: 80,
        learning: 80,
        screen: 80,
        nutrition: 80,
        training: 80,
        sleep: 80
    });

    useEffect(() => {
        const saved = localStorage.getItem('pl_goals');
        if (saved) setGoals(JSON.parse(saved));
    }, []);

    const updateGoal = (module, value) => {
        const updated = { ...goals, [module]: parseFloat(value) };
        setGoals(updated);
        localStorage.setItem('pl_goals', JSON.stringify(updated));
    };

    const getProgress = (current, goal) => {
        if (current >= goal) return 100;
        return Math.round((current / goal) * 100);
    };

    const estimateDaysToGoal = (current, goal) => {
        if (current >= goal) return 0;
        const gap = goal - current;
        // Assume 1 point improvement per day (conservative)
        return Math.ceil(gap);
    };

    return (
        <section className="card" style={{ marginTop: '2rem', border: '2px solid var(--accent-nutrition)' }}>
            <h3 className="mono" style={{ marginBottom: '1rem' }}>GOAL SETTING & PROGRESS</h3>

            {Object.entries(goals).map(([module, goal]) => {
                const current = scores[module] || 0;
                const progress = getProgress(current, goal);
                const daysToGoal = estimateDaysToGoal(current, goal);
                const achieved = current >= goal;

                return (
                    <div key={module} style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span className="mono" style={{ textTransform: 'uppercase' }}>{module}</span>
                            <input
                                type="number"
                                value={goal}
                                onChange={e => updateGoal(module, e.target.value)}
                                style={{ width: '80px', padding: '0.25rem', textAlign: 'center' }}
                            />
                        </div>

                        <div style={{ background: 'var(--border-subtle)', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.3rem' }}>
                            <div style={{
                                background: achieved ? 'var(--accent-nutrition)' : 'var(--accent-learning)',
                                height: '100%',
                                width: `${Math.min(progress, 100)}%`,
                                transition: 'width 0.3s ease'
                            }}></div>
                        </div>

                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{current} / {goal} ({progress}%)</span>
                            {!achieved && daysToGoal > 0 && (
                                <span>~{daysToGoal} days to goal</span>
                            )}
                            {achieved && <span style={{ color: 'var(--accent-nutrition)' }}>✓ ACHIEVED</span>}
                        </div>
                    </div>
                );
            })}
        </section>
    );
};

export default GoalSetting;
