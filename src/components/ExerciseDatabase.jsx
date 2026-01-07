import React, { useState, useEffect } from 'react';

const ExerciseDatabase = () => {
    const [exercises, setExercises] = useState([]);
    const [newExercise, setNewExercise] = useState({
        name: '',
        category: 'strength',
        muscleGroup: 'chest'
    });
    const [workoutLog, setWorkoutLog] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState('');
    const [sets, setSets] = useState('');
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');

    useEffect(() => {
        const savedExercises = localStorage.getItem('pl_exercise_db');
        if (savedExercises) setExercises(JSON.parse(savedExercises));

        const today = new Date().toISOString().split('T')[0];
        const savedLog = localStorage.getItem(`pl_workout_log_${today}`);
        if (savedLog) setWorkoutLog(JSON.parse(savedLog));
    }, []);

    const saveExercise = () => {
        if (!newExercise.name) return;

        const exercise = {
            ...newExercise,
            id: Date.now(),
            prs: { maxWeight: 0, maxVolume: 0, max1RM: 0 }
        };

        const updated = [...exercises, exercise];
        setExercises(updated);
        localStorage.setItem('pl_exercise_db', JSON.stringify(updated));
        setNewExercise({ name: '', category: 'strength', muscleGroup: 'chest' });
    };

    const calculate1RM = (weight, reps) => {
        // Epley formula: 1RM = weight × (1 + reps/30)
        return Math.round(weight * (1 + reps / 30));
    };

    const logSet = () => {
        if (!selectedExercise || !sets || !reps || !weight) return;

        const exercise = exercises.find(e => e.id == selectedExercise);
        if (!exercise) return;

        const setData = {
            exerciseId: selectedExercise,
            exerciseName: exercise.name,
            sets: parseFloat(sets),
            reps: parseFloat(reps),
            weight: parseFloat(weight),
            volume: parseFloat(sets) * parseFloat(reps) * parseFloat(weight),
            estimated1RM: calculate1RM(parseFloat(weight), parseFloat(reps)),
            timestamp: Date.now()
        };

        const newLog = [...workoutLog, setData];
        setWorkoutLog(newLog);

        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem(`pl_workout_log_${today}`, JSON.stringify(newLog));

        // Update PRs
        const updatedExercises = exercises.map(ex => {
            if (ex.id == selectedExercise) {
                return {
                    ...ex,
                    prs: {
                        maxWeight: Math.max(ex.prs.maxWeight, parseFloat(weight)),
                        maxVolume: Math.max(ex.prs.maxVolume, setData.volume),
                        max1RM: Math.max(ex.prs.max1RM, setData.estimated1RM)
                    }
                };
            }
            return ex;
        });
        setExercises(updatedExercises);
        localStorage.setItem('pl_exercise_db', JSON.stringify(updatedExercises));

        setSets('');
        setReps('');
        setWeight('');
    };

    const getMuscleGroupDistribution = () => {
        const distribution = {};
        workoutLog.forEach(log => {
            const ex = exercises.find(e => e.id == log.exerciseId);
            if (ex) {
                distribution[ex.muscleGroup] = (distribution[ex.muscleGroup] || 0) + log.volume;
            }
        });
        return distribution;
    };

    const muscleDistribution = getMuscleGroupDistribution();

    return (
        <section className="animate-fade-in" style={{ marginTop: '2rem' }}>
            <header style={{ marginBottom: '1.5rem' }}>
                <h2 className="mono" style={{ fontSize: '1.2rem', color: 'var(--accent-strength)' }}>EXERCISE DATABASE</h2>
                <p className="label">CUSTOM MOVEMENTS & PR TRACKING</p>
            </header>

            {/* Exercise Builder */}
            <div className="card" style={{ marginBottom: '1rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>ADD EXERCISE</h3>
                <input
                    type="text"
                    placeholder="Exercise Name"
                    value={newExercise.name}
                    onChange={e => setNewExercise({ ...newExercise, name: e.target.value })}
                    style={{ marginBottom: '0.5rem' }}
                />
                <div className="grid-2">
                    <select
                        value={newExercise.category}
                        onChange={e => setNewExercise({ ...newExercise, category: e.target.value })}
                    >
                        <option value="strength">Strength</option>
                        <option value="cardio">Cardio</option>
                        <option value="mobility">Mobility</option>
                    </select>
                    <select
                        value={newExercise.muscleGroup}
                        onChange={e => setNewExercise({ ...newExercise, muscleGroup: e.target.value })}
                    >
                        <option value="chest">Chest</option>
                        <option value="back">Back</option>
                        <option value="legs">Legs</option>
                        <option value="shoulders">Shoulders</option>
                        <option value="arms">Arms</option>
                        <option value="core">Core</option>
                    </select>
                </div>
                <button className="primary-btn" onClick={saveExercise}>SAVE EXERCISE</button>
            </div>

            {/* Workout Logger */}
            {exercises.length > 0 && (
                <div className="card">
                    <h3 style={{ marginBottom: '1rem' }}>LOG SET</h3>
                    <select
                        value={selectedExercise}
                        onChange={e => setSelectedExercise(e.target.value)}
                        style={{ marginBottom: '0.5rem' }}
                    >
                        <option value="">Select Exercise...</option>
                        {exercises.map(ex => (
                            <option key={ex.id} value={ex.id}>
                                {ex.name} ({ex.muscleGroup})
                            </option>
                        ))}
                    </select>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                        <input type="number" placeholder="Sets" value={sets} onChange={e => setSets(e.target.value)} />
                        <input type="number" placeholder="Reps" value={reps} onChange={e => setReps(e.target.value)} />
                        <input type="number" placeholder="Weight (kg)" value={weight} onChange={e => setWeight(e.target.value)} />
                    </div>

                    {weight && reps && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                            Estimated 1RM: <strong style={{ color: 'var(--accent-strength)' }}>{calculate1RM(parseFloat(weight), parseFloat(reps))}kg</strong>
                        </p>
                    )}

                    <button className="primary-btn" onClick={logSet} style={{ background: 'var(--accent-strength)', color: 'black' }}>
                        LOG SET
                    </button>
                </div>
            )}

            {/* PRs Display */}
            {exercises.some(ex => ex.prs.max1RM > 0) && (
                <div className="card" style={{ marginTop: '1rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>PERSONAL RECORDS</h3>
                    {exercises.filter(ex => ex.prs.max1RM > 0).map(ex => (
                        <div key={ex.id} style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(139, 92, 246, 0.1)', borderLeft: '3px solid var(--accent-strength)' }}>
                            <div className="mono" style={{ fontSize: '0.9rem', marginBottom: '0.3rem' }}>{ex.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                1RM: <strong style={{ color: 'white' }}>{ex.prs.max1RM}kg</strong> |
                                Max Weight: <strong style={{ color: 'white' }}>{ex.prs.maxWeight}kg</strong> |
                                Max Volume: <strong style={{ color: 'white' }}>{ex.prs.maxVolume}kg</strong>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Muscle Distribution */}
            {Object.keys(muscleDistribution).length > 0 && (
                <div className="card" style={{ marginTop: '1rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>TODAY&apos;S MUSCLE DISTRIBUTION</h3>
                    {Object.entries(muscleDistribution).map(([muscle, volume]) => {
                        const total = Object.values(muscleDistribution).reduce((a, b) => a + b, 0);
                        const percentage = ((volume / total) * 100).toFixed(1);
                        return (
                            <div key={muscle} style={{ marginBottom: '0.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                                    <span className="mono" style={{ textTransform: 'uppercase' }}>{muscle}</span>
                                    <span>{percentage}%</span>
                                </div>
                                <div style={{ background: 'var(--border-subtle)', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
                                    <div style={{ background: 'var(--accent-strength)', height: '100%', width: `${percentage}%` }}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default ExerciseDatabase;
