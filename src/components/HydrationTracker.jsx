import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { motion } from 'framer-motion';
import { Droplets, Plus, RotateCcw } from 'lucide-react';
import { saveHydration } from '../lib/cloudSync';

const HydrationTracker = () => {
    const { dailyLogs, setDailyLog, scores } = useAppStore();
    const today = new Date().toISOString().split('T')[0];
    const [intake, setIntake] = useState(dailyLogs[today]?.hydration || 0);
    const [customAmount, setCustomAmount] = useState('');
    const target = 3000; // ml - optimal target
    const maxTarget = 5000; // ml - maximum

    useEffect(() => {
        if (dailyLogs[today]?.hydration !== undefined) {
            setIntake(dailyLogs[today].hydration);
        }
    }, [dailyLogs, today]);

    const addWater = async (amount) => {
        const newVal = Math.min(intake + amount, maxTarget);
        setIntake(newVal);
        setDailyLog(today, 'hydration', newVal);
        // Sync to cloud
        await saveHydration(today, newVal);
    };

    const addCustomAmount = () => {
        const amount = parseInt(customAmount) || 0;
        if (amount > 0) {
            addWater(amount);
            setCustomAmount('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            addCustomAmount();
        }
    };

    const resetWater = async () => {
        setIntake(0);
        setDailyLog(today, 'hydration', 0);
        // Sync to cloud
        await saveHydration(today, 0);
    };

    const percentage = Math.min((intake / target) * 100, 100);
    const hydrationScore = scores?.hydration || 0;

    // Get score color
    const getScoreColor = (score) => {
        if (score >= 80) return '#22c55e';
        if (score >= 60) return '#3b82f6';
        if (score >= 40) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem',
            }}>
                <Droplets size={18} color="#3b82f6" />
                <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.6)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontFamily: "'JetBrains Mono', monospace",
                }}>
                    HYDRATION STATUS
                </span>
            </div>

            {/* Score Display */}
            <div style={{
                fontSize: '2rem',
                fontWeight: 800,
                color: getScoreColor(hydrationScore),
                fontFamily: "'JetBrains Mono', monospace",
                marginBottom: '0.5rem',
            }}>
                {hydrationScore}
            </div>

            {/* Visual Indicator */}
            <div style={{
                width: '80px',
                height: '120px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: '1rem',
            }}>
                <motion.div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        background: percentage >= 100
                            ? 'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)'
                            : 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)',
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />
                {/* Measurement lines */}
                {[25, 50, 75].map((line) => (
                    <div
                        key={line}
                        style={{
                            position: 'absolute',
                            bottom: `${line}%`,
                            width: '100%',
                            borderTop: '1px dashed rgba(255,255,255,0.15)',
                        }}
                    />
                ))}
            </div>

            {/* Amount Display */}
            <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '0.25rem',
            }}>
                {intake} <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>/ {target} ML</span>
            </div>

            <div style={{
                fontSize: '0.7rem',
                color: percentage >= 100 ? '#22c55e' : 'rgba(255,255,255,0.5)',
                marginBottom: '1rem',
                fontFamily: "'JetBrains Mono', monospace",
            }}>
                {percentage >= 100 ? '✓ TARGET REACHED' : `${Math.round(100 - percentage)}% TO GO`}
            </div>

            {/* Quick Add Buttons */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.5rem',
                width: '100%',
                marginBottom: '1rem',
            }}>
                {[250, 500, 750].map((amount) => (
                    <motion.button
                        key={amount}
                        onClick={() => addWater(amount)}
                        style={{
                            padding: '0.75rem 0.5rem',
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            borderRadius: '8px',
                            color: '#3b82f6',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            fontFamily: "'JetBrains Mono', monospace",
                            cursor: 'pointer',
                        }}
                        whileHover={{ scale: 1.05, background: 'rgba(59, 130, 246, 0.2)' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        +{amount}
                    </motion.button>
                ))}
            </div>

            {/* Custom Amount Input */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                width: '100%',
                marginBottom: '0.75rem',
            }}>
                <input
                    type="number"
                    inputMode="numeric"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Custom ML"
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '0.9rem',
                        fontFamily: "'JetBrains Mono', monospace",
                        outline: 'none',
                    }}
                />
                <motion.button
                    onClick={addCustomAmount}
                    style={{
                        padding: '0.75rem 1rem',
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Plus size={16} />
                </motion.button>
            </div>

            {/* Reset Button */}
            <motion.button
                onClick={resetWater}
                style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'transparent',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    color: '#ef4444',
                    fontSize: '0.7rem',
                    fontFamily: "'JetBrains Mono', monospace",
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                }}
                whileHover={{ borderColor: '#ef4444' }}
                whileTap={{ scale: 0.98 }}
            >
                <RotateCcw size={12} />
                RESET
            </motion.button>

            {/* Hint */}
            <div style={{
                fontSize: '0.6rem',
                color: 'rgba(255,255,255,0.3)',
                marginTop: '0.75rem',
                textAlign: 'center',
            }}>
                Press Enter after typing custom amount
            </div>
        </div>
    );
};

export { HydrationTracker };
