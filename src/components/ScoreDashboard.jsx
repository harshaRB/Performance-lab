import React from 'react';
import { useSystemScore } from '../hooks/useSystemScore';
import NumberMorph from './NumberMorph';
import Tooltip from './Tooltip';

const ScoreDashboard = () => {
    const scores = useSystemScore();

    const getScoreColor = (score) => {
        if (score >= 90) return '#22C55E';
        if (score >= 70) return '#2DD4BF';
        if (score >= 50) return '#F59E0B';
        return '#EF4444';
    };

    const moduleExplanations = {
        learning: "Active learning (1.5× weight) + Passive learning. Z-score normalized against 14-day baseline. Logistic saturation prevents unbounded scaling.",
        screen: "Quadratic penalties for social media (×1.8) and entertainment (×1.8). Small bonus for productive time. Designed to punish attention fragmentation.",
        nutrition: "Distance-from-optimal macro scoring based on your BMR. Targets: 2.2g protein/kg, 25% fat, remainder carbs. Hydration acts as 0.9-1.05× multiplier.",
        training: "Volume Load = Sets × Reps × Weight. Fatigue penalty applied above 15000kg. Walking steps contribute to cardio score.",
        sleep: "70% duration + 30% quality. 8hrs = 100pts. Naps provide max 20pt compensation. Sleep debt accumulates across days."
    };

    return (
        <div style={{ marginBottom: '3rem' }}>
            <header className="card" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(180deg, #161B22 0%, #0E1116 100%)',
                border: '1px solid var(--border-subtle)'
            }}>
                <div>
                    <h1 style={{ letterSpacing: '-0.05em', fontSize: '1.5rem' }}>SYSTEM STATUS</h1>
                    <p className="label">DAILY PERFORMANCE INDEX</p>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <Tooltip content="Weighted Geometric Mean: Π(Score_i/100)^w_i × 100. Forces balance - one failing module catastrophically drags down the system." position="left">
                        <div className="mono" style={{
                            fontSize: '4rem',
                            lineHeight: 1,
                            fontWeight: 'bold',
                            color: getScoreColor(scores.system),
                            cursor: 'help'
                        }}>
                            <NumberMorph value={scores.system} />
                        </div>
                    </Tooltip>
                    <p className="label" style={{ marginTop: '0.5rem' }}>AGGREGATE SCORE</p>
                </div>
            </header>

            {/* MINI SCOREBOARD */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', marginTop: '1rem' }}>

                <Tooltip content={moduleExplanations.learning}>
                    <div className="card" style={{ padding: '1rem', textAlign: 'center', borderColor: 'var(--accent-learning)', cursor: 'help' }}>
                        <p className="label" style={{ fontSize: '0.6rem' }}>LEARNING</p>
                        <div className="mono" style={{ fontSize: '1.5rem' }}><NumberMorph value={scores.learning} /></div>
                    </div>
                </Tooltip>

                <Tooltip content={moduleExplanations.screen}>
                    <div className="card" style={{ padding: '1rem', textAlign: 'center', borderColor: 'var(--accent-screen)', cursor: 'help' }}>
                        <p className="label" style={{ fontSize: '0.6rem' }}>SCREEN</p>
                        <div className="mono" style={{ fontSize: '1.5rem' }}><NumberMorph value={scores.screen} /></div>
                    </div>
                </Tooltip>

                <Tooltip content={moduleExplanations.nutrition}>
                    <div className="card" style={{ padding: '1rem', textAlign: 'center', borderColor: 'var(--accent-nutrition)', cursor: 'help' }}>
                        <p className="label" style={{ fontSize: '0.6rem' }}>NUTRITION</p>
                        <div className="mono" style={{ fontSize: '1.5rem' }}><NumberMorph value={scores.nutrition} /></div>
                    </div>
                </Tooltip>

                <Tooltip content={moduleExplanations.training}>
                    <div className="card" style={{ padding: '1rem', textAlign: 'center', borderColor: 'var(--accent-strength)', cursor: 'help' }}>
                        <p className="label" style={{ fontSize: '0.6rem' }}>TRAINING</p>
                        <div className="mono" style={{ fontSize: '1.5rem' }}><NumberMorph value={scores.training} /></div>
                    </div>
                </Tooltip>

                <Tooltip content={moduleExplanations.sleep}>
                    <div className="card" style={{ padding: '1rem', textAlign: 'center', borderColor: 'white', cursor: 'help' }}>
                        <p className="label" style={{ fontSize: '0.6rem' }}>SLEEP</p>
                        <div className="mono" style={{ fontSize: '1.5rem' }}><NumberMorph value={scores.sleep} /></div>
                    </div>
                </Tooltip>

            </div>
        </div>
    );
};

export default ScoreDashboard;
