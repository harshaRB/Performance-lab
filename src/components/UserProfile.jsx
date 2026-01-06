import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const UserProfile = () => {
    const { profile: storeProfile, setProfile: setStoreProfile } = useAppStore();
    const [profile, setLocalProfile] = useState(storeProfile);
    const [metrics, setMetrics] = useState({ bmr: 0, maintenance: 0, bulking: 0 });
    const [showSaved, setShowSaved] = useState(false);

    // Sync local state with store on mount
    useEffect(() => {
        setLocalProfile(storeProfile);
    }, [storeProfile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const calculateMetrics = () => {
        const w = parseFloat(profile.weight);
        const h = parseFloat(profile.height);
        const a = parseFloat(profile.age);

        if (!w || !h || !a) return;

        let bmrVal = (10 * w) + (6.25 * h) - (5 * a);
        if (profile.gender === 'male') {
            bmrVal += 5;
        } else {
            bmrVal -= 161;
        }

        const maintenanceVal = bmrVal * 1.55;
        const bulkingVal = maintenanceVal + 500;

        setMetrics({
            bmr: Math.round(bmrVal),
            maintenance: Math.round(maintenanceVal),
            bulking: Math.round(bulkingVal)
        });
    };

    const handleSave = () => {
        setStoreProfile(profile);
        calculateMetrics();
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 2000);
    };

    // Calculate metrics immediately when profile changes
    useEffect(() => {
        if (profile.weight && profile.height && profile.age) {
            calculateMetrics();
        }
    }, [profile]);

    return (
        <div className="animate-fade-in">
            <header style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>SETUP // PROFILE</h1>
                <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                    BIO-METRIC & ANTHROPOMETRIC DATA ENTRY
                </p>

                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all"
                    style={{ marginTop: '1rem' }}
                >
                    <Save size={18} />
                    {showSaved ? 'Saved!' : 'Save Profile'}
                </button>
            </header>

            <div className="grid-2">
                {/* BIOMETRICS CARD */}
                <section className="card">
                    <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        01_BIOMETRICS
                        <span style={{ color: 'var(--accent-learning)' }}>●</span>
                    </h2>

                    <div className="input-group">
                        <label className="label">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={profile.name}
                            onChange={handleChange}
                            placeholder="LASTNAME, FIRSTNAME"
                            autoComplete="off"
                        />
                    </div>

                    <div className="grid-2">
                        <div className="input-group">
                            <label className="label">Age (YRS)</label>
                            <input
                                type="number"
                                name="age"
                                value={profile.age}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-group">
                            <label className="label">Gender</label>
                            <select name="gender" value={profile.gender} onChange={handleChange}>
                                <option value="male">MALE</option>
                                <option value="female">FEMALE</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid-2">
                        <div className="input-group">
                            <label className="label">Weight (KG)</label>
                            <input
                                type="number"
                                name="weight"
                                value={profile.weight}
                                onChange={handleChange}
                                placeholder="00.0"
                            />
                        </div>
                        <div className="input-group">
                            <label className="label">Height (CM)</label>
                            <input
                                type="number"
                                name="height"
                                value={profile.height}
                                onChange={handleChange}
                                placeholder="000"
                            />
                        </div>
                    </div>
                </section>

                {/* ANTHROPOMETRY CARD */}
                <section className="card">
                    <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        02_ANTHROPOMETRY
                        <span style={{ color: 'var(--accent-choice)' }}>●</span>
                    </h2>

                    <div className="grid-2">
                        <div className="input-group">
                            <label className="label">Waist (CM)</label>
                            <input type="number" name="waist" value={profile.waist} onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <label className="label">Hip (CM)</label>
                            <input type="number" name="hip" value={profile.hip} onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <label className="label">Arm (CM)</label>
                            <input type="number" name="arm" value={profile.arm} onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <label className="label">Forearm (CM)</label>
                            <input type="number" name="forearm" value={profile.forearm} onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <label className="label">Legs (CM)</label>
                            <input type="number" name="legs" value={profile.legs} onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <label className="label">Calf (CM)</label>
                            <input type="number" name="calf" value={profile.calf} onChange={handleChange} />
                        </div>
                    </div>
                </section>
            </div>

            {/* COMPUTED METRICS */}
            <section className="card" style={{ marginTop: '1.5rem', borderColor: 'var(--text-secondary)' }}>
                <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>03_DERIVED METABOLIC PROFILE</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
                    <div>
                        <span className="label">BMR (KCAL)</span>
                        <div className="mono" style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>
                            {metrics.bmr}
                        </div>
                    </div>
                    <div>
                        <span className="label">MAINTENANCE</span>
                        <div className="mono" style={{ fontSize: '2rem', color: 'var(--accent-nutrition)' }}>
                            {metrics.maintenance}
                        </div>
                    </div>
                    <div>
                        <span className="label">BULKING TARGET</span>
                        <div className="mono" style={{ fontSize: '2rem', color: 'var(--accent-strength)' }}>
                            {metrics.bulking}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export { UserProfile };
