import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Smartphone, Clock, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const styles = {
    container: {
        marginTop: '2rem',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        overflow: 'hidden'
    },
    hero: {
        padding: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        background: 'rgba(0,0,0,0.2)'
    },
    metric: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        fontSize: '0.7rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'rgba(255, 255, 255, 0.5)',
        marginBottom: '0.25rem',
        fontFamily: "'JetBrains Mono', monospace",
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem'
    },
    value: {
        fontSize: '1.75rem',
        fontWeight: '700',
        color: '#fff',
        fontFamily: "'JetBrains Mono', monospace",
        lineHeight: 1
    },
    subValue: {
        fontSize: '0.8rem',
        color: 'rgba(255,255,255,0.4)',
        marginTop: '0.25rem'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        padding: '1.5rem',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(0,0,0,0.3)'
    },
    inputCard: {
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '12px',
        padding: '1rem',
        border: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
    },
    inputLabel: {
        fontSize: '0.65rem',
        fontWeight: '700',
        color: 'rgba(255,255,255,0.6)',
        marginBottom: '0.5rem',
        textTransform: 'uppercase'
    },
    input: {
        background: 'transparent',
        border: 'none',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        color: '#fff',
        fontSize: '1.2rem',
        fontFamily: "'JetBrains Mono', monospace",
        width: '100%',
        padding: '0.25rem 0',
        outline: 'none'
    }
};

const ScreenTimeTracker = () => {
    const { dailyLogs, setDailyLog, scores } = useAppStore();
    const today = new Date().toISOString().split('T')[0];
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    // Initialize from store only once
    const [inputs, setInputs] = useState(() => {
        const stored = dailyLogs[today]?.screen;
        return stored || { productive: 0, social: 0, entertainment: 0 };
    });

    // Check if already logged
    useEffect(() => {
        if (dailyLogs[today]?.screenLogged) {
            setIsSaved(true);
        }
    }, [dailyLogs, today]);

    // Sync from store ONLY when dailyLogs changes externally (not from our own updates)
    const isLocalUpdate = React.useRef(false);

    useEffect(() => {
        if (dailyLogs[today]?.screen && !isLocalUpdate.current) {
            const stored = dailyLogs[today].screen;
            const hasChanged =
                stored.productive !== inputs.productive ||
                stored.social !== inputs.social ||
                stored.entertainment !== inputs.entertainment;
            if (hasChanged) {
                setInputs(stored);
            }
        }
        isLocalUpdate.current = false;
    }, [dailyLogs, today]);

    // Handle input changes - update both local state and store
    const handleInputChange = (field, value) => {
        const numValue = value === '' ? 0 : parseFloat(value) || 0;
        const newInputs = { ...inputs, [field]: numValue };
        setInputs(newInputs);
        isLocalUpdate.current = true;
        setDailyLog(today, 'screen', newInputs);
        setIsSaved(false); // Reset saved state when editing
    };

    // Save and mark as logged
    const handleSave = () => {
        isLocalUpdate.current = true;
        setDailyLog(today, 'screen', inputs);
        setDailyLog(today, 'screenLogged', true); // Mark as explicitly logged
        setIsSaved(true);
    };

    // Derived Metrics
    // Ensure we handle potential undefined/NaN gracefully
    const totalMinutes = (Number(inputs?.productive) || 0) + (Number(inputs?.social) || 0) + (Number(inputs?.entertainment) || 0);
    const totalHours = (totalMinutes / 60).toFixed(1); // 1 decimal place, e.g., "4.5"

    const score = Math.round(scores?.screen || 0); // No decimals for score

    const getScoreColor = (s) => {
        if (s >= 80) return '#22c55e'; // Green
        if (s >= 60) return '#f59e0b'; // Orange
        return '#ef4444'; // Red
    };

    return (
        <section style={styles.container}>
            {/* Header / Hero Section (Always Visible) */}
            <div style={styles.hero} onClick={() => setIsExpanded(!isExpanded)}>
                <div style={styles.metric}>
                    <span style={styles.label}>
                        <Smartphone size={14} /> SCREEN SCORE
                    </span>
                    <span style={{ ...styles.value, color: getScoreColor(score) }}>
                        {score}
                    </span>
                    <span style={styles.subValue}>
                        {score >= 80 ? 'OPTIMAL' : score >= 60 ? 'MODERATE' : 'HIGH USAGE'}
                    </span>
                </div>

                <div style={{ ...styles.metric, alignItems: 'flex-end', textAlign: 'right' }}>
                    <span style={styles.label}>
                        TOTAL EXPOSURE <Clock size={14} />
                    </span>
                    <span style={styles.value}>
                        {totalHours}<span style={{ fontSize: '1rem', opacity: 0.5 }}>h</span>
                    </span>
                    <span style={styles.subValue}>
                        {totalMinutes} mins
                    </span>
                </div>
            </div>

            {/* Expandable Input Section */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={styles.grid}>
                            <div style={styles.inputCard}>
                                <label style={styles.inputLabel}>Productive</label>
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    value={Math.round(inputs.productive || 0)}
                                    onChange={(e) => handleInputChange('productive', e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                    style={styles.input}
                                    placeholder="0"
                                />
                                <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.2rem' }}>MINUTES</span>
                            </div>

                            <div style={styles.inputCard}>
                                <label style={{ ...styles.inputLabel, color: '#f59e0b' }}>Social</label>
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    value={Math.round(inputs.social || 0)}
                                    onChange={(e) => handleInputChange('social', e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                    style={styles.input}
                                    placeholder="0"
                                />
                                <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.2rem' }}>MINUTES</span>
                            </div>

                            <div style={styles.inputCard}>
                                <label style={{ ...styles.inputLabel, color: '#ef4444' }}>Entertain</label>
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    value={Math.round(inputs.entertainment || 0)}
                                    onChange={(e) => handleInputChange('entertainment', e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                    style={styles.input}
                                    placeholder="0"
                                />
                                <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.2rem' }}>MINUTES</span>
                            </div>

                            {/* Save Button */}
                            <motion.button
                                onClick={handleSave}
                                style={{
                                    gridColumn: '1 / -1',
                                    padding: '0.875rem',
                                    background: isSaved ? 'rgba(34, 197, 94, 0.2)' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                    border: isSaved ? '1px solid rgba(34, 197, 94, 0.5)' : 'none',
                                    borderRadius: '12px',
                                    color: isSaved ? '#22c55e' : '#fff',
                                    fontSize: '0.8rem',
                                    fontWeight: '700',
                                    fontFamily: "'JetBrains Mono', monospace",
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isSaved ? '✓ SAVED' : 'SAVE SCREEN TIME'}
                            </motion.button>

                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '0.25rem' }}>
                                <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>
                                    Press Enter in any field or tap Save • Tap header to collapse
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Collapse Indicator (if hidden) */}
            {!isExpanded && (
                <div
                    onClick={() => setIsExpanded(true)}
                    style={{
                        textAlign: 'center',
                        padding: '0.5rem',
                        cursor: 'pointer',
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        opacity: 0.5,
                        fontSize: '0.7rem'
                    }}
                >
                    <ChevronDown size={14} />
                </div>
            )}
        </section>
    );
};

export { ScreenTimeTracker };
