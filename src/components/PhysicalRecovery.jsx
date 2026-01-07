import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

// ============================================
// TRAINING TRACKER WITH EXERCISE DATABASE
// ============================================
export const TrainingTracker = () => {
    const { dailyLogs, setDailyLog } = useAppStore();
    const today = new Date().toISOString().split('T')[0];
    const trainingLog = dailyLogs[today]?.training || { totalVolume: 0, vo2Proxy: 0, totalCalories: 0 };

    // Exercise Database (persisted in localStorage)
    const [exerciseDB, setExerciseDB] = useState(() => {
        const saved = localStorage.getItem('exerciseDatabase');
        return saved ? JSON.parse(saved) : [
            { name: 'Push-ups', caloriesPerRep: 0.5 },
            { name: 'Squats', caloriesPerRep: 0.6 },
            { name: 'Burpees', caloriesPerRep: 1.2 },
            { name: 'Lunges', caloriesPerRep: 0.4 },
            { name: 'Pull-ups', caloriesPerRep: 1.0 },
        ];
    });

    // Form states
    const [selectedExercise, setSelectedExercise] = useState('');
    const [sets, setSets] = useState('');
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const [running, setRunning] = useState('');
    const [steps, setSteps] = useState('');

    // New exercise form
    const [newExName, setNewExName] = useState('');
    const [newExCal, setNewExCal] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    // Totals
    const [totalVolume, setTotalVolume] = useState(trainingLog.totalVolume);
    const [totalCalories, setTotalCalories] = useState(trainingLog.totalCalories || 0);
    const [vo2Proxy, setVo2Proxy] = useState(trainingLog.vo2Proxy);

    useEffect(() => {
        if (dailyLogs[today]?.training) {
            setTotalVolume(dailyLogs[today].training.totalVolume || 0);
            setTotalCalories(dailyLogs[today].training.totalCalories || 0);
            setVo2Proxy(dailyLogs[today].training.vo2Proxy || 0);
        }
    }, [dailyLogs, today]);

    // Save exercise DB to localStorage
    useEffect(() => {
        localStorage.setItem('exerciseDatabase', JSON.stringify(exerciseDB));
    }, [exerciseDB]);

    const updateStore = (volume, vo2, calories) => {
        setDailyLog(today, 'training', { totalVolume: volume, vo2Proxy: vo2, totalCalories: calories });
    };

    const addExercise = () => {
        if (!newExName.trim() || !newExCal) return;
        setExerciseDB(prev => [...prev, { name: newExName.trim(), caloriesPerRep: parseFloat(newExCal) }]);
        setNewExName('');
        setNewExCal('');
        setShowAddForm(false);
    };

    const deleteExercise = (index) => {
        setExerciseDB(prev => prev.filter((_, i) => i !== index));
    };

    const logStrength = () => {
        const s = parseFloat(sets) || 0;
        const r = parseFloat(reps) || 0;
        const w = parseFloat(weight) || 0;
        const volume = s * r * w;

        // Calculate calories from selected exercise
        const exercise = exerciseDB.find(e => e.name === selectedExercise);
        const caloriesBurned = exercise ? (s * r * exercise.caloriesPerRep) : 0;

        const newTotal = totalVolume + volume;
        const newCalories = totalCalories + caloriesBurned;

        setTotalVolume(newTotal);
        setTotalCalories(newCalories);
        updateStore(newTotal, vo2Proxy, newCalories);

        setSets('');
        setReps('');
        setWeight('');
        setSelectedExercise('');
    };

    const logCardio = () => {
        const runMins = parseFloat(running) || 0;
        const stepCount = parseFloat(steps) || 0;

        // Running: ~10 cal/min, Steps: ~0.04 cal/step
        const runCalories = runMins * 10;
        const stepCalories = stepCount * 0.04;
        const cardioCalories = runCalories + stepCalories;

        const runVO2 = runMins * 1.0;
        const walkVO2 = (stepCount / 3000) * 10;
        const totalVO2 = parseFloat(vo2Proxy) + runVO2 + walkVO2;

        const newCalories = totalCalories + cardioCalories;

        setVo2Proxy(totalVO2.toFixed(1));
        setTotalCalories(newCalories);
        updateStore(totalVolume, totalVO2.toFixed(1), newCalories);

        setRunning('');
        setSteps('');
    };

    return (
        <section style={{ marginTop: '1rem' }}>
            <header style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1rem', fontFamily: 'monospace', color: '#8b5cf6' }}>MODULE:04 // PHYSICALITY</h2>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>TRAINING LOAD & CALORIE BURN</p>
            </header>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: '#1a1a2e', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.65rem', color: '#6b7280', textTransform: 'uppercase' }}>Volume Load</p>
                    <div style={{ fontSize: '1.5rem', fontFamily: 'monospace', color: '#8b5cf6' }}>{totalVolume.toFixed(0)} kg</div>
                </div>
                <div style={{ background: '#1a1a2e', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.65rem', color: '#6b7280', textTransform: 'uppercase' }}>Calories Burned</p>
                    <div style={{ fontSize: '1.5rem', fontFamily: 'monospace', color: '#f97316' }}>{totalCalories.toFixed(0)} kcal</div>
                </div>
            </div>

            {/* Strength Training */}
            <div style={{ background: '#0f1115', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#fff' }}>STRENGTH TRAINING</h3>

                {/* Exercise Selector */}
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Exercise</label>
                    <select
                        value={selectedExercise}
                        onChange={e => setSelectedExercise(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                    >
                        <option value="">Select exercise...</option>
                        {exerciseDB.map((ex, i) => (
                            <option key={i} value={ex.name}>{ex.name} ({ex.caloriesPerRep} cal/rep)</option>
                        ))}
                    </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.65rem', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Sets</label>
                        <input type="number" value={sets} onChange={e => setSets(e.target.value)} placeholder="0" style={{ width: '100%', padding: '0.5rem', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.65rem', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Reps</label>
                        <input type="number" value={reps} onChange={e => setReps(e.target.value)} placeholder="0" style={{ width: '100%', padding: '0.5rem', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.65rem', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Weight (kg)</label>
                        <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="0" style={{ width: '100%', padding: '0.5rem', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff' }} />
                    </div>
                </div>
                <button onClick={logStrength} style={{ width: '100%', padding: '0.75rem', background: '#8b5cf6', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>LOG SET</button>
            </div>

            {/* Exercise Database */}
            <div style={{ background: '#0f1115', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '0.9rem', color: '#fff' }}>EXERCISE DATABASE</h3>
                    <button onClick={() => setShowAddForm(!showAddForm)} style={{ padding: '0.4rem 0.75rem', background: showAddForm ? '#ef4444' : '#10b981', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '0.75rem', cursor: 'pointer' }}>
                        {showAddForm ? 'Cancel' : '+ Add'}
                    </button>
                </div>

                {showAddForm && (
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '0.5rem', marginBottom: '1rem' }}>
                        <input type="text" value={newExName} onChange={e => setNewExName(e.target.value)} placeholder="Exercise name" style={{ padding: '0.5rem', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff' }} />
                        <input type="number" value={newExCal} onChange={e => setNewExCal(e.target.value)} placeholder="Cal/rep" style={{ padding: '0.5rem', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff' }} />
                        <button onClick={addExercise} style={{ padding: '0.5rem 1rem', background: '#10b981', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}>Save</button>
                    </div>
                )}

                <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                    {exerciseDB.map((ex, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <span style={{ color: '#e5e5e5', fontSize: '0.85rem' }}>{ex.name}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{ color: '#f97316', fontSize: '0.75rem', fontFamily: 'monospace' }}>{ex.caloriesPerRep} cal/rep</span>
                                <button onClick={() => deleteExercise(i)} style={{ padding: '0.25rem 0.5rem', background: 'transparent', border: '1px solid #ef4444', borderRadius: '4px', color: '#ef4444', fontSize: '0.65rem', cursor: 'pointer' }}>×</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cardio - Separate Running & Steps */}
            <div style={{ background: '#0f1115', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.25rem' }}>
                <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#fff' }}>CARDIO</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.65rem', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.25rem' }}>🏃 Running (minutes)</label>
                        <input type="number" value={running} onChange={e => setRunning(e.target.value)} placeholder="0" style={{ width: '100%', padding: '0.5rem', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.65rem', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.25rem' }}>👟 Steps (count)</label>
                        <input type="number" value={steps} onChange={e => setSteps(e.target.value)} placeholder="0" style={{ width: '100%', padding: '0.5rem', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff' }} />
                    </div>
                </div>
                <button onClick={logCardio} style={{ width: '100%', padding: '0.75rem', background: '#f97316', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>LOG CARDIO</button>

                {vo2Proxy > 0 && (
                    <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(249,115,22,0.1)', border: '1px solid #f97316', borderRadius: '8px', textAlign: 'center' }}>
                        <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>VO2 PROXY: </span>
                        <span style={{ fontFamily: 'monospace', color: '#f97316' }}>{vo2Proxy}</span>
                    </div>
                )}
            </div>
        </section>
    );
};

// ============================================
// SLEEP TRACKER WITH 12H CLOCK & AUTO-CALCULATOR
// ============================================
export const SleepTracker = () => {
    const { dailyLogs, setDailyLog } = useAppStore();
    const today = new Date().toISOString().split('T')[0];

    const defaultSleep = { quality: 5, sleepHour: '', sleepMinute: '', sleepPeriod: 'PM', wakeHour: '', wakeMinute: '', wakePeriod: 'AM', duration: 0, napDuration: 0 };
    const sleepData = dailyLogs[today]?.sleep || defaultSleep;

    const [localData, setLocalData] = useState(sleepData);

    useEffect(() => {
        if (dailyLogs[today]?.sleep) {
            setLocalData(dailyLogs[today].sleep);
        }
    }, [dailyLogs, today]);

    const updateField = (field, value) => {
        const newData = { ...localData, [field]: value };

        // Auto-calculate duration when both times are set
        if (newData.sleepHour && newData.wakeHour) {
            const duration = calculateDuration(newData);
            newData.duration = duration;
        }

        setLocalData(newData);
        setDailyLog(today, 'sleep', newData);
    };

    const calculateDuration = (data) => {
        let sleepH = parseInt(data.sleepHour) || 0;
        let wakeH = parseInt(data.wakeHour) || 0;
        const sleepM = parseInt(data.sleepMinute) || 0;
        const wakeM = parseInt(data.wakeMinute) || 0;

        // Convert to 24h
        if (data.sleepPeriod === 'PM' && sleepH !== 12) sleepH += 12;
        if (data.sleepPeriod === 'AM' && sleepH === 12) sleepH = 0;
        if (data.wakePeriod === 'PM' && wakeH !== 12) wakeH += 12;
        if (data.wakePeriod === 'AM' && wakeH === 12) wakeH = 0;

        let sleepMins = sleepH * 60 + sleepM;
        let wakeMins = wakeH * 60 + wakeM;

        // Handle overnight sleep
        if (wakeMins < sleepMins) {
            wakeMins += 24 * 60;
        }

        const durationMins = wakeMins - sleepMins;
        return parseFloat((durationMins / 60).toFixed(1));
    };

    const hourOptions = ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    const minuteOptions = ['00', '15', '30', '45'];

    return (
        <section style={{ marginTop: '1rem' }}>
            <header style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1rem', fontFamily: 'monospace', color: '#a78bfa' }}>MODULE:05 // RECOVERY</h2>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>SLEEP ARCHITECTURE</p>
            </header>

            <div style={{ background: '#0f1115', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.25rem' }}>

                {/* Calculated Duration Display */}
                <div style={{ textAlign: 'center', marginBottom: '1.5rem', padding: '1rem', background: '#1a1a2e', borderRadius: '8px' }}>
                    <p style={{ fontSize: '0.65rem', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Hours Slept</p>
                    <div style={{ fontSize: '2.5rem', fontFamily: 'monospace', color: localData.duration >= 7 ? '#10b981' : localData.duration >= 5 ? '#f59e0b' : '#ef4444' }}>
                        {localData.duration || '--'}h
                    </div>
                </div>

                {/* Sleep Time - 12h Format */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.5rem' }}>🌙 Sleep Time</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                        <select value={localData.sleepHour} onChange={e => updateField('sleepHour', e.target.value)} style={{ padding: '0.75rem', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}>
                            {hourOptions.map(h => <option key={h} value={h}>{h || 'Hour'}</option>)}
                        </select>
                        <select value={localData.sleepMinute} onChange={e => updateField('sleepMinute', e.target.value)} style={{ padding: '0.75rem', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}>
                            {minuteOptions.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <select value={localData.sleepPeriod} onChange={e => updateField('sleepPeriod', e.target.value)} style={{ padding: '0.75rem', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}>
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                        </select>
                    </div>
                </div>

                {/* Wake Time - 12h Format */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.5rem' }}>☀️ Wake Time</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                        <select value={localData.wakeHour} onChange={e => updateField('wakeHour', e.target.value)} style={{ padding: '0.75rem', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}>
                            {hourOptions.map(h => <option key={h} value={h}>{h || 'Hour'}</option>)}
                        </select>
                        <select value={localData.wakeMinute} onChange={e => updateField('wakeMinute', e.target.value)} style={{ padding: '0.75rem', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}>
                            {minuteOptions.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <select value={localData.wakePeriod} onChange={e => updateField('wakePeriod', e.target.value)} style={{ padding: '0.75rem', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}>
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                        </select>
                    </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '1.5rem 0' }} />

                {/* Quality Slider */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Quality (1-10)</label>
                    <input type="range" min="1" max="10" value={localData.quality} onChange={e => updateField('quality', parseInt(e.target.value))} style={{ width: '100%' }} />
                    <div style={{ textAlign: 'center', fontSize: '1.5rem', fontFamily: 'monospace', color: '#a78bfa' }}>{localData.quality}</div>
                </div>

                {/* Nap */}
                <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Afternoon Nap (minutes)</label>
                    <input type="number" value={localData.napDuration || ''} onChange={e => updateField('napDuration', parseFloat(e.target.value) || 0)} placeholder="0" style={{ width: '100%', padding: '0.75rem', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                </div>
            </div>
        </section>
    );
};
