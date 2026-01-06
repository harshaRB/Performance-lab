import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, Zap, Droplet } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const NutritionTracker = () => {
    // Global Store
    const { dailyLogs, setDailyLog: setStoreLog } = useAppStore();
    const today = new Date().toISOString().split('T')[0];

    // Local State
    const [view, setView] = useState('LOG'); // LOG or BUILDER
    const [database, setDatabase] = useState([]);
    const [dailyLog, setDailyLog] = useState(dailyLogs[today]?.nutrition || { breakfast: [], lunch: [], dinner: [], junk: [] });
    const [hydration, setHydration] = useState(dailyLogs[today]?.hydration || 0);
    const [selectedMealType, setSelectedMealType] = useState('breakfast');

    // Sync from store
    useEffect(() => {
        if (dailyLogs[today]?.nutrition) {
            setDailyLog(dailyLogs[today].nutrition);
        }
        if (dailyLogs[today]?.hydration) {
            setHydration(dailyLogs[today].hydration);
        }
    }, [dailyLogs, today]);

    // Save to store whenever log changes
    useEffect(() => {
        setStoreLog(today, 'nutrition', dailyLog);
    }, [dailyLog, today, setStoreLog]);

    useEffect(() => {
        setStoreLog(today, 'hydration', hydration);
    }, [hydration, today, setStoreLog]);

    // Load static DB from localStorage (keep this separate from daily logs)
    useEffect(() => {
        try {
            const savedDB = localStorage.getItem('pl_nutrition_db');
            if (savedDB) setDatabase(JSON.parse(savedDB));
        } catch (error) {
            console.error('Failed to load nutrition data:', error);
        }
    }, []);

    // Builder State - Extended Nutrients
    const [newIng, setNewIng] = useState({
        name: '',
        calories: '',
        // Macros
        carbs: '',
        totalSugar: '',
        fats: '',
        mufa: '',
        pufa: '',
        transFats: '',
        cholesterol: '',
        protein: '',
        // Amino Acids
        essentialAA: '',
        nonEssentialAA: '',
        // Micronutrients
        fiber: '',
        vitaminA: '',
        vitaminC: '',
        vitaminD: '',
        calcium: '',
        iron: '',
        magnesium: ''
    });

    const [selectedIngredient, setSelectedIngredient] = useState('');
    const [weight, setWeight] = useState('');

    const saveIngredient = () => {
        if (!newIng.name || !newIng.calories) return;

        const ingredient = {
            id: Date.now(),
            ...newIng,
            // Convert strings to numbers
            calories: parseFloat(newIng.calories) || 0,
            carbs: parseFloat(newIng.carbs) || 0,
            totalSugar: parseFloat(newIng.totalSugar) || 0,
            fats: parseFloat(newIng.fats) || 0,
            mufa: parseFloat(newIng.mufa) || 0,
            pufa: parseFloat(newIng.pufa) || 0,
            transFats: parseFloat(newIng.transFats) || 0,
            cholesterol: parseFloat(newIng.cholesterol) || 0,
            protein: parseFloat(newIng.protein) || 0,
            essentialAA: parseFloat(newIng.essentialAA) || 0,
            nonEssentialAA: parseFloat(newIng.nonEssentialAA) || 0,
            fiber: parseFloat(newIng.fiber) || 0,
            vitaminA: parseFloat(newIng.vitaminA) || 0,
            vitaminC: parseFloat(newIng.vitaminC) || 0,
            vitaminD: parseFloat(newIng.vitaminD) || 0,
            calcium: parseFloat(newIng.calcium) || 0,
            iron: parseFloat(newIng.iron) || 0,
            magnesium: parseFloat(newIng.magnesium) || 0
        };

        const updated = [...database, ingredient];
        setDatabase(updated);
        try {
            localStorage.setItem('pl_nutrition_db', JSON.stringify(updated));
        } catch (error) {
            console.error('Failed to save ingredient to database:', error);
        }

        // Reset form
        setNewIng({
            name: '', calories: '', carbs: '', totalSugar: '', fats: '', mufa: '', pufa: '',
            transFats: '', cholesterol: '', protein: '', essentialAA: '', nonEssentialAA: '',
            fiber: '', vitaminA: '', vitaminC: '', vitaminD: '', calcium: '', iron: '', magnesium: ''
        });
    };

    const logMeal = () => {
        if (!selectedIngredient || !weight) return;

        const ingredient = database.find(d => d.id == selectedIngredient);
        if (!ingredient) return;

        const mealEntry = {
            ...ingredient,
            weight: parseFloat(weight),
            timestamp: Date.now()
        };

        const updated = {
            ...dailyLog,
            [selectedMealType]: [...(dailyLog[selectedMealType] || []), mealEntry]
        };

        setDailyLog(updated);
        const today = new Date().toISOString().split('T')[0];
        try {
            localStorage.setItem(`pl_nutrition_log_${today}`, JSON.stringify(updated));
        } catch (error) {
            console.error('Failed to save nutrition log:', error);
        }

        setWeight('');
        setSelectedIngredient('');
    };

    const deleteMeal = (mealType, index) => {
        const updated = {
            ...dailyLog,
            [mealType]: dailyLog[mealType].filter((_, i) => i !== index)
        };
        setDailyLog(updated);
        const today = new Date().toISOString().split('T')[0];
        try {
            localStorage.setItem(`pl_nutrition_log_${today}`, JSON.stringify(updated));
        } catch (error) {
            console.error('Failed to delete meal from log:', error);
        }
    };

    // Calculate totals
    const allMeals = [...(dailyLog.breakfast || []), ...(dailyLog.lunch || []), ...(dailyLog.dinner || []), ...(dailyLog.junk || [])];
    const junkMeals = dailyLog.junk || [];

    const totals = allMeals.reduce((acc, item) => ({
        calories: acc.calories + ((item.calories || 0) * item.weight / 100),
        protein: acc.protein + ((item.protein || 0) * item.weight / 100),
        carbs: acc.carbs + ((item.carbs || 0) * item.weight / 100),
        fats: acc.fats + ((item.fats || 0) * item.weight / 100),
        mufa: acc.mufa + ((item.mufa || 0) * item.weight / 100),
        pufa: acc.pufa + ((item.pufa || 0) * item.weight / 100),
        transFats: acc.transFats + ((item.transFats || 0) * item.weight / 100),
        essentialAA: acc.essentialAA + ((item.essentialAA || 0) * item.weight / 100),
        nonEssentialAA: acc.nonEssentialAA + ((item.nonEssentialAA || 0) * item.weight / 100),
        fiber: acc.fiber + ((item.fiber || 0) * item.weight / 100)
    }), { calories: 0, protein: 0, carbs: 0, fats: 0, mufa: 0, pufa: 0, transFats: 0, essentialAA: 0, nonEssentialAA: 0, fiber: 0 });

    const junkCals = junkMeals.reduce((sum, item) => sum + ((item.calories || 0) * item.weight / 100), 0);
    const junkPercentage = totals.calories > 0 ? ((junkCals / totals.calories) * 100).toFixed(1) : 0;

    // Calculate indices
    const calculateFatQualityIndex = () => {
        if (totals.fats === 0) return 0;
        const goodFats = totals.mufa + totals.pufa;
        const goodRatio = goodFats / totals.fats;
        const transPenalty = Math.exp(totals.transFats * 0.5);
        return Math.min(100, Math.max(0, (goodRatio * 100) / transPenalty));
    };

    const calculateAAIndex = () => {
        if (totals.protein === 0) return 0;
        const totalAA = totals.essentialAA + totals.nonEssentialAA;
        if (totalAA === 0) return 50; // No data
        const essentialRatio = totals.essentialAA / totalAA;
        const optimalRatio = 0.45;
        const deviation = Math.abs(essentialRatio - optimalRatio);
        return Math.min(100, Math.max(0, Math.exp(-deviation * 10) * 100));
    };

    const fatQualityIndex = calculateFatQualityIndex();
    const aaIndex = calculateAAIndex();

    return (
        <section className="animate-fade-in" style={{ marginTop: '2rem' }} data-section="nutrition">
            <header style={{ marginBottom: '1.5rem' }}>
                <h2 className="mono" style={{ fontSize: '1.2rem' }}>MODULE:03 // METABOLISM</h2>
                <p className="label">NUTRITION TRACKING & BIOCHEMICAL INDICES</p>
            </header>

            {/* View Toggle */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <button
                    onClick={() => setView('LOG')}
                    style={{
                        flex: 1,
                        background: view === 'LOG' ? 'var(--accent-nutrition)' : 'transparent',
                        color: view === 'LOG' ? 'black' : 'var(--text-secondary)',
                        border: `1px solid var(--accent-nutrition)`,
                        padding: '0.75rem',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.85rem'
                    }}
                >
                    MEAL LOG
                </button>
                <button
                    onClick={() => setView('BUILDER')}
                    style={{
                        flex: 1,
                        background: view === 'BUILDER' ? 'var(--accent-nutrition)' : 'transparent',
                        color: view === 'BUILDER' ? 'black' : 'var(--text-secondary)',
                        border: `1px solid var(--accent-nutrition)`,
                        padding: '0.75rem',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.85rem'
                    }}
                >
                    DATABASE BUILDER
                </button>
            </div>

            {view === 'BUILDER' && (
                <div className="card" style={{ borderTop: '4px solid var(--accent-nutrition)' }}>
                    <h3 style={{ marginBottom: '1rem' }}>ADD INGREDIENT</h3>

                    <input
                        type="text"
                        placeholder="Ingredient Name"
                        value={newIng.name}
                        onChange={e => setNewIng({ ...newIng, name: e.target.value })}
                        style={{ marginBottom: '0.5rem' }}
                    />

                    <h4 className="label" style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>MACRONUTRIENTS (per 100g)</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                        <input type="number" placeholder="Calories" value={newIng.calories} onChange={e => setNewIng({ ...newIng, calories: e.target.value })} />
                        <input type="number" placeholder="Protein (g)" value={newIng.protein} onChange={e => setNewIng({ ...newIng, protein: e.target.value })} />
                        <input type="number" placeholder="Carbs (g)" value={newIng.carbs} onChange={e => setNewIng({ ...newIng, carbs: e.target.value })} />
                        <input type="number" placeholder="Total Sugar (g)" value={newIng.totalSugar} onChange={e => setNewIng({ ...newIng, totalSugar: e.target.value })} />
                        <input type="number" placeholder="Fats (g)" value={newIng.fats} onChange={e => setNewIng({ ...newIng, fats: e.target.value })} />
                        <input type="number" placeholder="Fiber (g)" value={newIng.fiber} onChange={e => setNewIng({ ...newIng, fiber: e.target.value })} />
                    </div>

                    <details style={{ marginTop: '1rem' }}>
                        <summary style={{ cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                            ADVANCED PROFILE (Fat Quality, Amino Acids, Micros)
                        </summary>

                        <h4 className="label" style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>FAT COMPOSITION</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                            <input type="number" placeholder="MUFA (g)" value={newIng.mufa} onChange={e => setNewIng({ ...newIng, mufa: e.target.value })} />
                            <input type="number" placeholder="PUFA (g)" value={newIng.pufa} onChange={e => setNewIng({ ...newIng, pufa: e.target.value })} />
                            <input type="number" placeholder="Trans (g)" value={newIng.transFats} onChange={e => setNewIng({ ...newIng, transFats: e.target.value })} />
                            <input type="number" placeholder="Cholesterol (mg)" value={newIng.cholesterol} onChange={e => setNewIng({ ...newIng, cholesterol: e.target.value })} />
                        </div>

                        <h4 className="label" style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>AMINO ACIDS</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                            <input type="number" placeholder="Essential AA (g)" value={newIng.essentialAA} onChange={e => setNewIng({ ...newIng, essentialAA: e.target.value })} />
                            <input type="number" placeholder="Non-Essential AA (g)" value={newIng.nonEssentialAA} onChange={e => setNewIng({ ...newIng, nonEssentialAA: e.target.value })} />
                        </div>

                        <h4 className="label" style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>MICRONUTRIENTS</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                            <input type="number" placeholder="Vitamin A (μg)" value={newIng.vitaminA} onChange={e => setNewIng({ ...newIng, vitaminA: e.target.value })} />
                            <input type="number" placeholder="Vitamin C (mg)" value={newIng.vitaminC} onChange={e => setNewIng({ ...newIng, vitaminC: e.target.value })} />
                            <input type="number" placeholder="Vitamin D (μg)" value={newIng.vitaminD} onChange={e => setNewIng({ ...newIng, vitaminD: e.target.value })} />
                            <input type="number" placeholder="Calcium (mg)" value={newIng.calcium} onChange={e => setNewIng({ ...newIng, calcium: e.target.value })} />
                            <input type="number" placeholder="Iron (mg)" value={newIng.iron} onChange={e => setNewIng({ ...newIng, iron: e.target.value })} />
                            <input type="number" placeholder="Magnesium (mg)" value={newIng.magnesium} onChange={e => setNewIng({ ...newIng, magnesium: e.target.value })} />
                        </div>
                    </details>

                    <button className="primary-btn" onClick={saveIngredient} style={{ marginTop: '1rem' }}>
                        SAVE TO DATABASE
                    </button>

                    {database.length > 0 && (
                        <div style={{ marginTop: '1.5rem' }}>
                            <p className="label">DATABASE ({database.length} ingredients)</p>
                            <div style={{ maxHeight: '200px', overflowY: 'auto', fontSize: '0.85rem' }}>
                                {database.map(ing => (
                                    <div key={ing.id} style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                                        {ing.name} - {ing.calories} cal, {ing.protein}g protein
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {view === 'LOG' && (
                <div className="card" style={{ borderTop: '4px solid var(--accent-nutrition)' }}>
                    {/* Meal Type Selector */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        {['breakfast', 'lunch', 'dinner', 'junk'].map(type => (
                            <button
                                key={type}
                                onClick={() => setSelectedMealType(type)}
                                style={{
                                    background: selectedMealType === type ? 'var(--accent-nutrition)' : 'transparent',
                                    color: selectedMealType === type ? 'black' : 'var(--text-secondary)',
                                    border: `1px solid ${type === 'junk' ? 'var(--accent-danger)' : 'var(--accent-nutrition)'}`,
                                    padding: '0.75rem',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    fontSize: '0.75rem',
                                    fontFamily: 'var(--font-mono)'
                                }}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    {database.length > 0 ? (
                        <>
                            <div className="grid-2">
                                <select
                                    value={selectedIngredient}
                                    onChange={e => setSelectedIngredient(e.target.value)}
                                >
                                    <option value="">Select ingredient...</option>
                                    {database.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    placeholder="Weight (grams)"
                                    value={weight}
                                    onChange={e => setWeight(e.target.value)}
                                />
                            </div>
                            <button className="primary-btn" onClick={logMeal}>LOG TO {selectedMealType.toUpperCase()}</button>
                        </>
                    ) : (
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                            No ingredients in database. Switch to BUILDER to add ingredients.
                        </p>
                    )}

                    {/* Daily Totals */}
                    {allMeals.length > 0 && (
                        <>
                            <hr style={{ borderColor: 'var(--border-subtle)', margin: '1.5rem 0' }} />
                            <h3 style={{ marginBottom: '1rem' }}>DAILY TOTALS</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <p className="label">CALORIES</p>
                                    <div className="mono" style={{ fontSize: '1.5rem' }}>{Math.round(totals.calories)}</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p className="label">PROTEIN</p>
                                    <div className="mono" style={{ fontSize: '1.5rem' }}>{Math.round(totals.protein)}g</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p className="label">CARBS</p>
                                    <div className="mono" style={{ fontSize: '1.5rem' }}>{Math.round(totals.carbs)}g</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p className="label">FATS</p>
                                    <div className="mono" style={{ fontSize: '1.5rem' }}>{Math.round(totals.fats)}g</div>
                                </div>
                            </div>

                            {/* Junk Penalty Indicator */}
                            {junkCals > 0 && (
                                <div style={{
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid var(--accent-danger)',
                                    padding: '1rem',
                                    marginBottom: '1rem'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span className="mono" style={{ color: 'var(--accent-danger)' }}>⚠️ JUNK PENALTY</span>
                                        <span className="mono" style={{ fontSize: '1.2rem', color: 'var(--accent-danger)' }}>
                                            {junkPercentage}% of daily intake
                                        </span>
                                    </div>
                                    <div style={{ marginTop: '0.5rem', background: 'var(--border-subtle)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{
                                            background: 'var(--accent-danger)',
                                            height: '100%',
                                            width: `${Math.min(junkPercentage, 100)}%`
                                        }}></div>
                                    </div>
                                </div>
                            )}

                            {/* Biochemical Indices */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ padding: '1rem', background: 'rgba(45, 212, 191, 0.1)', border: '1px solid var(--accent-learning)' }}>
                                    <p className="label">FAT QUALITY INDEX</p>
                                    <div className="mono" style={{ fontSize: '1.5rem', color: 'var(--accent-learning)' }}>
                                        {Math.round(fatQualityIndex)}
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                                        MUFA+PUFA bonus, Trans penalty
                                    </p>
                                </div>
                                <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid var(--accent-nutrition)' }}>
                                    <p className="label">AA COMPLETENESS</p>
                                    <div className="mono" style={{ fontSize: '1.5rem', color: 'var(--accent-nutrition)' }}>
                                        {Math.round(aaIndex)}
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                                        Essential/Total ratio
                                    </p>
                                </div>
                            </div>

                            {/* Meal Logs */}
                            {Object.entries(dailyLog).map(([mealType, meals]) => (
                                meals.length > 0 && (
                                    <div key={mealType} style={{ marginTop: '1rem' }}>
                                        <h4 className="label" style={{ textTransform: 'uppercase', color: mealType === 'junk' ? 'var(--accent-danger)' : 'var(--text-primary)' }}>
                                            {mealType} ({meals.length} items)
                                        </h4>
                                        {meals.map((meal, i) => (
                                            <div key={i} style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                padding: '0.5rem',
                                                background: mealType === 'junk' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(125, 133, 144, 0.05)',
                                                marginBottom: '0.3rem',
                                                fontSize: '0.85rem'
                                            }}>
                                                <span>{meal.name} ({meal.weight}g)</span>
                                                <div>
                                                    <span className="mono" style={{ marginRight: '1rem' }}>
                                                        {Math.round((meal.calories || 0) * meal.weight / 100)} cal
                                                    </span>
                                                    <button
                                                        onClick={() => deleteMeal(mealType, i)}
                                                        style={{
                                                            background: 'transparent',
                                                            border: 'none',
                                                            color: 'var(--accent-danger)',
                                                            cursor: 'pointer',
                                                            fontSize: '0.9rem'
                                                        }}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            ))}
                        </>
                    )}
                </div>
            )}
        </section>
    );
};

export { NutritionTracker };
