import React, { useState, useEffect } from 'react';
import RecommendationEngine from '../utils/RecommendationEngine';
import { useSystemScore } from '../hooks/useSystemScore';

const DailyCoach = () => {
    const scores = useSystemScore();
    const [recommendations, setRecommendations] = useState([]);
    const [quote, setQuote] = useState(null);

    useEffect(() => {
        const profile = JSON.parse(localStorage.getItem('pl_profile') || '{}');
        const recs = RecommendationEngine.generateRecommendations(scores, profile);
        setRecommendations(recs);

        const motivationalQuote = RecommendationEngine.getMotivationalQuote(scores.system);
        setQuote(motivationalQuote);
    }, [scores]);

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'critical': return '#EF4444';
            case 'high': return '#F59E0B';
            case 'medium': return '#2DD4BF';
            case 'low': return '#7D8590';
            default: return '#7D8590';
        }
    };

    return (
        <div className="card" style={{ marginTop: '2rem', border: '2px solid var(--accent-learning)' }}>
            <header style={{ marginBottom: '1.5rem' }}>
                <h3 className="mono" style={{ fontSize: '1rem' }}>🤖 DAILY COACH</h3>
                <p className="label">AI-POWERED RECOMMENDATIONS</p>
            </header>

            {/* Motivational Quote */}
            {quote && (
                <div style={{
                    padding: '1.5rem',
                    background: 'rgba(45, 212, 191, 0.1)',
                    borderLeft: '4px solid var(--accent-learning)',
                    marginBottom: '1.5rem',
                    fontStyle: 'italic'
                }}>
                    <p style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>"{quote.quote}"</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', textAlign: 'right' }}>
                        — {quote.author}
                    </p>
                </div>
            )}

            {/* Recommendations */}
            {recommendations.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No recommendations. Keep up the great work!
                </p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {recommendations.map((rec, i) => (
                        <div
                            key={i}
                            style={{
                                padding: '1rem',
                                background: 'rgba(125, 133, 144, 0.05)',
                                border: `2px solid ${getPriorityColor(rec.priority)}`,
                                borderLeft: `6px solid ${getPriorityColor(rec.priority)}`
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '1.5rem' }}>{rec.icon}</span>
                                    <div>
                                        <h4 className="mono" style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                            {rec.title}
                                        </h4>
                                        <span
                                            style={{
                                                fontSize: '0.65rem',
                                                textTransform: 'uppercase',
                                                color: getPriorityColor(rec.priority),
                                                fontFamily: 'var(--font-mono)',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {rec.priority} PRIORITY
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <p style={{ fontSize: '0.85rem', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                                {rec.message}
                            </p>

                            <div style={{
                                padding: '0.5rem 1rem',
                                background: `${getPriorityColor(rec.priority)}22`,
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                fontFamily: 'var(--font-mono)'
                            }}>
                                <strong>Action:</strong> {rec.action}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DailyCoach;
