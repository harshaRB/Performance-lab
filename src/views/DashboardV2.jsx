import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Apple, Moon, Dumbbell, Brain, Smartphone, Droplets } from 'lucide-react';
import { colors, typography, radius, shadows } from '../styles/designSystem';
import { useAppStore } from '../store/useAppStore';

// Import components
import BentoGrid from '../components/dashboard/BentoGrid';
import SystemScoreHub from '../components/ui/SystemScoreHub';
import { NutritionTracker } from '../components/NutritionTracker';
import { ReadingTracker } from '../components/ReadingTracker';
import { ScreenTimeTracker } from '../components/ScreenTimeTracker';
import { HydrationTracker } from '../components/HydrationTracker';
import { TrainingTracker, SleepTracker } from '../components/PhysicalRecovery';

// ============================================
// STYLES
// ============================================
const styles = {
    container: {
        width: '100%',
    },

    header: {
        marginBottom: '2rem',
    },
    greeting: {
        fontSize: '2rem',
        fontWeight: '800',
        color: colors.text.primary,
        marginBottom: '0.25rem',
        lineHeight: 1.2,
    },
    greetingHello: {
        fontSize: '1rem',
        fontWeight: '500',
        color: colors.text.muted,
        marginBottom: '0.25rem',
    },
    userName: {
        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        display: 'inline',
    },
    emoji: {
        display: 'inline-block',
        marginLeft: '0.5rem',
        fontSize: '1.5rem',
    },
    subtitle: {
        fontSize: typography.fontSize.sm,
        color: colors.text.muted,
        marginTop: '0.5rem',
    },

    // Modal
    modalOverlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '1rem',
    },
    modalContent: {
        position: 'relative',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '85vh',
        overflowY: 'auto',
        background: colors.background.secondary,
        border: `1px solid ${colors.border.default}`,
        borderRadius: radius['2xl'],
        boxShadow: shadows.xl,
    },
    modalHeader: {
        position: 'sticky',
        top: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.25rem 1.5rem',
        background: colors.background.secondary,
        borderBottom: `1px solid ${colors.border.subtle}`,
        zIndex: 10,
    },
    modalTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.text.primary,
    },
    closeBtn: {
        padding: '0.5rem',
        background: 'transparent',
        border: 'none',
        borderRadius: radius.md,
        color: colors.text.muted,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    modalBody: {
        padding: '1.5rem',
    },
};

// ============================================
// MODULE CONFIGS
// ============================================
const moduleConfigs = {
    nutrition: {
        title: 'Nutrition Log',
        icon: Apple,
        color: colors.modules.nutrition,
        component: NutritionTracker
    },
    sleep: {
        title: 'Sleep Tracker',
        icon: Moon,
        color: colors.modules.sleep,
        component: SleepTracker
    },
    training: {
        title: 'Training Log',
        icon: Dumbbell,
        color: colors.modules.training,
        component: TrainingTracker
    },
    learning: {
        title: 'Reading & Learning',
        icon: Brain,
        color: colors.modules.learning,
        component: ReadingTracker
    },
    screen: {
        title: 'Screen Time',
        icon: Smartphone,
        color: colors.modules.screen,
        component: ScreenTimeTracker
    },
    hydration: {
        title: 'Hydration',
        icon: Droplets,
        color: colors.modules.hydration,
        component: HydrationTracker
    },
};

// ============================================
// DASHBOARD COMPONENT
// ============================================
const DashboardV2 = () => {
    const [activeModule, setActiveModule] = useState(null);
    const { scores, profile } = useAppStore();

    // Get user's name from profile or localStorage
    const userName = useMemo(() => {
        const storedProfile = JSON.parse(localStorage.getItem('pl_user_profile') || '{}');
        const name = profile?.name || storedProfile?.name || 'User';
        // Capitalize first letter
        return name.charAt(0).toUpperCase() + name.slice(1).split(' ')[0];
    }, [profile]);

    // Get time-based greeting with emoji
    const greetingInfo = useMemo(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) {
            return { text: 'Good Morning', emoji: '☀️', period: 'morning' };
        } else if (hour >= 12 && hour < 17) {
            return { text: 'Good Afternoon', emoji: '🌤️', period: 'afternoon' };
        } else if (hour >= 17 && hour < 21) {
            return { text: 'Good Evening', emoji: '🌅', period: 'evening' };
        } else {
            return { text: 'Good Night', emoji: '🌙', period: 'night' };
        }
    }, []);

    const handleOpenModule = (moduleId) => {
        setActiveModule(moduleId);
    };

    const handleCloseModule = () => {
        setActiveModule(null);
    };

    const activeConfig = activeModule ? moduleConfigs[activeModule] : null;
    const ActiveComponent = activeConfig?.component;

    // Map scores for BiometricRadar
    const radarScores = {
        sleep: scores?.sleep || 0,
        nutrition: scores?.nutrition || 0,
        training: scores?.training || 0,
        learning: scores?.learning || 0,
        screen: scores?.screen || 0,
        system: scores?.system || 0,
    };

    return (
        <div style={styles.container}>
            {/* Personalized Greeting */}
            <motion.div
                style={{ marginBottom: '2rem' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <motion.p
                    style={styles.greetingHello}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Hello,
                </motion.p>
                <motion.h1
                    style={styles.greeting}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <span style={styles.userName}>{userName}</span>
                    <motion.span
                        style={styles.emoji}
                        animate={{
                            rotate: [0, 10, -10, 10, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 1.5, delay: 0.8, repeat: Infinity, repeatDelay: 5 }}
                    >
                        😊
                    </motion.span>
                </motion.h1>
                <motion.p
                    style={styles.greeting}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    {greetingInfo.text} {greetingInfo.emoji}
                </motion.p>
                <motion.p
                    style={styles.subtitle}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    Your personal performance command center
                </motion.p>
            </motion.div>

            {/* SYSTEM SCORE HUB - Center of Attraction */}
            <motion.div
                style={{
                    marginBottom: '3rem',
                    padding: '2rem',
                    background: 'linear-gradient(180deg, rgba(15, 17, 21, 0.8) 0%, rgba(15, 17, 21, 0.4) 100%)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: radius['2xl'],
                    position: 'relative',
                    overflow: 'hidden',
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                {/* Background decoration */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at 50% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)',
                    pointerEvents: 'none',
                }} />

                {/* Section Header */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '1rem',
                    position: 'relative',
                    zIndex: 10,
                }}>
                    <h2 style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: colors.text.dim,
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        fontFamily: "'JetBrains Mono', monospace",
                    }}>
                        PERFORMANCE MATRIX
                    </h2>
                </div>

                {/* SystemScoreHub */}
                <SystemScoreHub
                    scores={radarScores}
                    size={360}
                    animated={true}
                />
            </motion.div>

            {/* Section Divider */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '2rem',
            }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: colors.text.dim,
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    fontFamily: "'JetBrains Mono', monospace",
                }}>
                    MODULE DETAILS
                </span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            </div>

            {/* Bento Grid */}
            <BentoGrid onOpenModule={handleOpenModule} />

            {/* Module Modal */}
            <AnimatePresence>
                {activeModule && activeConfig && (
                    <motion.div
                        style={styles.modalOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleCloseModule}
                    >
                        <motion.div
                            style={styles.modalContent}
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div style={styles.modalHeader}>
                                <div style={styles.modalTitle}>
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: radius.lg,
                                        background: `${activeConfig.color}20`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <activeConfig.icon size={20} color={activeConfig.color} />
                                    </div>
                                    {activeConfig.title}
                                </div>
                                <motion.button
                                    style={styles.closeBtn}
                                    onClick={handleCloseModule}
                                    whileHover={{
                                        background: 'rgba(255,255,255,0.1)',
                                        color: colors.text.primary
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <X size={20} />
                                </motion.button>
                            </div>

                            {/* Body */}
                            <div style={styles.modalBody}>
                                {ActiveComponent && <ActiveComponent />}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DashboardV2;
