import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

export const TrainingTracker = () => {
    const { dailyLogs, setDailyLog } = useAppStore();
    const today = new Date().toISOString().split('T')[0];
    const trainingLog = dailyLogs[today]?.training || { totalVolume: 0, vo2Proxy: 0 };

    const [sets, setSets] = useState('');
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const [running, setRunning] = useState('');
    const [walking, setWalking] = useState('');
    const [totalVolume, setTotalVolume] = useState(trainingLog.totalVolume);
    const [vo2Proxy, setVo2Proxy] = useState(trainingLog.vo2Proxy);
    const [overtrainingRisk, setOvertrainingRisk] = useState(false);

    useEffect(() => {
        if (dailyLogs[today]?.training) {
            setTotalVolume(dailyLogs[today].training.totalVolume || 0);
            setVo2Proxy(dailyLogs[today].training.vo2Proxy || 0);
            checkOvertraining(dailyLogs[today].training.totalVolume || 0);
        }
    }, [dailyLogs, today]);

    const updateStore = (volume, vo2) => {
        setDailyLog(today, 'training', { totalVolume: volume, vo2Proxy: vo2 });
        checkOvertraining(volume);
    };

    const logStrength = () => {
        const s = parseFloat(sets) || 0;
        const r = parseFloat(reps) || 0;
        const w = parseFloat(weight) || 0;
        const volume = s * r * w;

        const newTotal = totalVolume + volume;
        setTotalVolume(newTotal);
        updateStore(newTotal, vo2Proxy);

        setSets('');
        setReps('');
        setWeight('');
    };

    const logCardio = () => {
        const runMins = parseFloat(running) || 0;
        const steps = parseFloat(walking) || 0;

        const runVO2 = runMins * 1.0;
        const walkVO2 = (steps / 3000) * 10;
        const totalVO2 = runVO2 + walkVO2;

        setVo2Proxy(totalVO2.toFixed(1));
        updateStore(totalVolume, totalVO2.toFixed(1));

        setRunning('');
        setWalking('');
    };

    const checkOvertraining = (volume) => {
        // Access sleep from store via dailyLogs content
        const sleepLog = dailyLogs[today]?.sleep || { quality: 5 };
        const isOvertraining = volume > 15000 && sleepLog.quality < 6;
        setOvertrainingRisk(isOvertraining);
    };

    return (
        <section className="animate-fade-in" style={{ marginTop: '2rem' }} data-section="training">
            <header style={{ marginBottom: '1.5rem' }}>
                <h2 className="mono" style={{ fontSize: '1.2rem' }}>MODULE:04 // PHYSICALITY</h2>
                <p className="label">TRAINING LOAD & CARDIOVASCULAR METRICS</p>
            </header>

            {overtrainingRisk && (
                <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '2px solid var(--accent-danger)',
                    padding: '1rem_marginBottom: 1rem',
                    textAlign: 'center'
                }}>
                    <div className="mono" style={{ color: 'var(--accent-danger)', fontSize: '1rem' }}>
                        ⚠️ OVERTRAINING RISK DETECTED
                    </div>
                </div>
            )}

            <div className="card" style={{ borderTop: '4px solid var(--accent-strength)' }}>
                {/* ... existing UI ... */}
                <h3 style={{ marginBottom: '1rem' }}>STRENGTH TRAINING</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                    <div className="input-group">
                        <label className="label">SETS</label>
                        <input type="number" value={sets} onChange={e => setSets(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label className="label">REPS</label>
                        <input type="number" value={reps} onChange={e => setReps(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label className="label">WEIGHT (KG)</label>
                        <input type="number" value={weight} onChange={e => setWeight(e.target.value)} />
                    </div>
                </div>
                <button className="primary-btn" onClick={logStrength} style={{ background: 'var(--accent-strength)', color: 'black' }}>
                    LOG SET
                </button>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <p className="label">TOTAL VOLUME LOAD</p>
                    <div className="mono" style={{ fontSize: '2.5rem', color: 'var(--accent-strength)' }}>
                        {totalVolume.toFixed(0)} kg
                    </div>
                </div>

                <hr style={{ borderColor: 'var(--border-subtle)', margin: '1.5rem 0' }} />

                <h3 style={{ marginBottom: '1rem' }}>CARDIO</h3>
                <div className="grid-2">
                    <div className="input-group">
                        <label className="label">RUNNING (MINUTES)</label>
                        <input type="number" value={running} onChange={e => setRunning(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label className="label">WALKING (STEPS)</label>
                        <input type="number" value={walking} onChange={e => setWalking(e.target.value)} />
                    </div>
                </div>
                <button className="primary-btn" onClick={logCardio} style={{ background: 'var(--accent-strength)', color: 'black' }}>
                    LOG CARDIO
                </button>

                {vo2Proxy > 0 && (
                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid var(--accent-strength)' }}>
                        <p className="label">VO2 PROXY ESTIMATE</p>
                        <div className="mono" style={{ fontSize: '1.5rem', color: 'var(--accent-strength)' }}>
                            {vo2Proxy} units
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export const SleepTracker = () => {
    const { dailyLogs, setDailyLog } = useAppStore();
    const today = new Date().toISOString().split('T')[0];

    // Default values
    const defaultSleep = { quality: 5, sleepTime: '', wakeTime: '', duration: 0, napDuration: 0 };
    const sleepData = dailyLogs[today]?.sleep || defaultSleep;

    const updateStore = (newData) => {
        setDailyLog(today, 'sleep', { ...sleepData, ...newData });
    };

    return (
        <section className="animate-fade-in" style={{ marginTop: '2rem', marginBottom: '4rem' }} data-section="sleep">
            <header style={{ marginBottom: '1.5rem' }}>
                <h2 className="mono" style={{ fontSize: '1.2rem' }}>MODULE:05 // RECOVERY</h2>
                <p className="label">SLEEP ARCHITECTURE & CIRCADIAN RHYTHM</p>
            </header>
            <div className="card" style={{ borderTop: '4px solid var(--text-primary)' }}>
                <div className="grid-2">
                    <div className="input-group">
                        <label className="label">HOURS SLEPT</label>
                        <input
                            type="number"
                            placeholder="Hours"
                            value={sleepData.duration || ''}
                            onChange={e => updateStore({ duration: parseFloat(e.target.value) || 0 })}
                        />
                    </div>
                    <div className="input-group">
                        <label className="label">QUALITY (1-10)</label>
                        <input
                            type="range" min="1" max="10"
                            value={sleepData.quality}
                            onChange={e => updateStore({ quality: parseFloat(e.target.value) })}
                        />
                        <div className="mono" style={{ textAlign: 'center', fontSize: '1.5rem' }}>{sleepData.quality}</div>
                    </div>
                </div>

                <hr style={{ borderColor: 'var(--border-subtle)', margin: '1.5rem 0', opacity: 0.3 }} />

                <h4 className="label" style={{ marginBottom: '1rem' }}>CIRCADIAN TRACKING</h4>
                <div className="grid-2">
                    <div className="input-group">
                        <label className="label">SLEEP TIME (HH:MM)</label>
                        <input
                            type="time"
                            value={sleepData.sleepTime}
                            onChange={e => updateStore({ sleepTime: e.target.value })}
                        />
                    </div>
                    <div className="input-group">
                        <label className="label">WAKE TIME (HH:MM)</label>
                        <input
                            type="time"
                            value={sleepData.wakeTime}
                            onChange={e => updateStore({ wakeTime: e.target.value })}
                        />
                    </div>
                </div>

                <hr style={{ borderColor: 'var(--border-subtle)', margin: '1.5rem 0', opacity: 0.3 }} />

                <div className="input-group">
                    <label className="label">AFTERNOON NAP (MINUTES)</label>
                    <input
                        type="number"
                        placeholder="0"
                        value={sleepData.napDuration || ''}
                        onChange={e => updateStore({ napDuration: parseFloat(e.target.value) || 0 })}
                    />
                </div>
            </div>
        </section>
    );
};
