import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Dumbbell, Brain, Smartphone, Droplets, Flame } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import MetricCard from '../ui/MetricCard';
import CoachWidget from './CoachWidget';
import RadarWidget from './RadarWidget';

// ============================================
// ICON MAPPING FOR DATA POINTS
// ============================================
// Nutrition = Apple (general), Beef (protein)
// Sleep = Moon
// Training = Dumbbell
// Learning = Brain
// Screen = Smartphone
// Hydration = Droplets
// Calories = Flame
// Energy = Zap

// ============================================
// BENTO GRID COMPONENT
// ============================================
export const BentoGrid = ({ onOpenModule }) => {
    const { scores, dailyLogs } = useAppStore();
    const today = new Date().toISOString().split('T')[0];
    const log = dailyLogs[today] || {};

    // Animation variants for stagger
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.06 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: 'spring', stiffness: 300, damping: 25 }
        }
    };

    return (
        <motion.div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.25rem',
            }}
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {/* 1. Nutrition - Apple icon */}
            <motion.div variants={itemVariants}>
                <MetricCard
                    title="NUTRITION"
                    value={log.nutrition?.calories ? `${Math.round(log.nutrition.calories)}` : "--"}
                    subtext={log.nutrition?.calories ? "KCAL CONSUMED" : "LOG MEALS"}
                    icon={Flame}
                    color="nutrition"
                    onClick={() => onOpenModule('nutrition')}
                />
            </motion.div>

            {/* 2. Sleep - Moon icon */}
            <motion.div variants={itemVariants}>
                <MetricCard
                    title="SLEEP"
                    value={log.sleep?.duration ? `${log.sleep.duration}h` : "--"}
                    subtext={log.sleep?.quality ? `QUALITY: ${log.sleep.quality}/10` : "NOT LOGGED"}
                    icon={Moon}
                    color="sleep"
                    onClick={() => onOpenModule('sleep')}
                />
            </motion.div>

            {/* 3. Training - Dumbbell icon */}
            <motion.div variants={itemVariants}>
                <MetricCard
                    title="TRAINING"
                    value={log.training?.totalVolume ? `${Math.round(log.training.totalVolume)}` : "--"}
                    subtext="KG VOLUME LOAD"
                    icon={Dumbbell}
                    color="training"
                    onClick={() => onOpenModule('training')}
                />
            </motion.div>

            {/* 4. Learning - Brain icon */}
            <motion.div variants={itemVariants}>
                <MetricCard
                    title="LEARNING"
                    value={log.learning?.active || log.learning?.passive ?
                        `${(parseFloat(log.learning.active || 0) + parseFloat(log.learning.passive || 0)).toFixed(0)}` : "--"}
                    subtext="MINUTES FOCUSED"
                    icon={Brain}
                    color="learning"
                    onClick={() => onOpenModule('learning')}
                />
            </motion.div>

            {/* 5. Screen Time - Smartphone icon */}
            <motion.div variants={itemVariants}>
                <MetricCard
                    title="SCREEN"
                    value={log.screen?.total ? `${Math.floor(log.screen.total / 60)}h ${log.screen.total % 60}m` : "--"}
                    subtext="DIGITAL EXPOSURE"
                    icon={Smartphone}
                    color="screen"
                    onClick={() => onOpenModule('screen')}
                />
            </motion.div>

            {/* 6. Hydration - Droplets icon */}
            <motion.div variants={itemVariants}>
                <MetricCard
                    title="HYDRATION"
                    value={log.hydration ? `${log.hydration}` : "--"}
                    subtext="ML CONSUMED"
                    icon={Droplets}
                    color="hydration"
                    onClick={() => onOpenModule('hydration')}
                />
            </motion.div>

            {/* 7. Radar Widget */}
            <motion.div variants={itemVariants}>
                <RadarWidget scores={scores} />
            </motion.div>

            {/* 8. AI Coach Widget */}
            <motion.div variants={itemVariants}>
                <CoachWidget />
            </motion.div>
        </motion.div>
    );
};

export default BentoGrid;
