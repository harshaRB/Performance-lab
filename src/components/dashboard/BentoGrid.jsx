import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Droplets, Brain, Smartphone, Dumbbell, Moon } from 'lucide-react';
import MetricCard from '../ui/MetricCard';
import RadarWidget from '../visualizations/RadarWidget';
import CoachWidget from './CoachWidget';

export const BentoGrid = ({ onOpenModule }) => {
    const { scores, dailyLogs } = useAppStore();
    const today = new Date().toISOString().split('T')[0];
    const log = dailyLogs[today] || {};

    // Radar Data - mapped to flat scores structure
    const radarData = [
        { subject: 'NUTRI', A: scores.nutrition || 60, fullMark: 100 },
        { subject: 'SLEEP', A: scores.sleep || 50, fullMark: 100 },
        { subject: 'TRAIN', A: scores.training || 50, fullMark: 100 },
        { subject: 'FOCUS', A: scores.learning || 0, fullMark: 100 },
        { subject: 'TECH', A: scores.screen || 0, fullMark: 100 },
    ];

    // Helper to get nutrition summary
    const calories = log.nutrition?.totalCalories || 0;
    const protein = log.nutrition?.macros?.protein || 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-auto gap-4 md:gap-6">

            {/* 1. Main Radar - Spans 2x2 */}
            <div className="md:col-span-2 md:row-span-2 bg-[#0F1115] border border-white/5 rounded-3xl p-6 flex flex-col relative overflow-hidden group">
                <div className="flex justify-between items-center mb-4 relative z-10">
                    <h3 className="text-white font-medium flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                        System Analysis
                    </h3>
                    <span className="text-xs font-mono text-neutral-500 border border-white/10 px-2 py-1 rounded">LIVE</span>
                </div>
                <div className="flex-1 relative z-10">
                    <RadarWidget data={radarData} />
                </div>
                {/* Bg decorative */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-900/5 pointer-events-none" />
            </div>

            {/* 2. Nutrition */}
            <MetricCard
                title="Nutrition"
                value={`${calories} kcal`}
                subtext={`${protein}g Protein`}
                icon={Droplets}
                color="emerald"
                onClick={() => onOpenModule('nutrition')}
            />

            {/* 3. Training */}
            <MetricCard
                title="Training"
                value={log.training?.totalVolume ? `${log.training.totalVolume} kg` : "Rest"}
                subtext="Load Volume"
                icon={Dumbbell}
                color="rose"
                onClick={() => onOpenModule('training')}
            />

            {/* 4. Sleep (Wide on mobile, regular on desktop) */}
            <MetricCard
                title="Sleep"
                value={log.sleep?.duration ? `${log.sleep.duration}h` : "--"}
                subtext={`Quality: ${log.sleep?.quality || '-'}/10`}
                icon={Moon}
                color="indigo"
                onClick={() => onOpenModule('sleep')}
            />

            {/* 5. Cognitive */}
            <MetricCard
                title="Cognitive"
                value={`${(log.learning?.active || 0) + (log.learning?.passive || 0)} min`}
                subtext="Active Logic"
                icon={Brain}
                color="violet"
                onClick={() => onOpenModule('learning')}
            />

            {/* 6. Screen Time */}
            <MetricCard
                title="Screen API"
                value="4h 12m"
                subtext="Input Stream"
                icon={Smartphone}
                color="orange"
                onClick={() => onOpenModule('screen')}
            />

            {/* 7. AI Coach Widget */}
            <div className="md:col-span-2">
                <CoachWidget />
            </div>

        </div>
    );
};

export default BentoGrid;
