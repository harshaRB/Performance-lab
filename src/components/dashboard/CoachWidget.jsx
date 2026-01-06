import React, { useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { getCoachInsight } from '../../utils/Coach';
import { Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const CoachWidget = () => {
    const { scores } = useAppStore();

    // Memoize so we don't recalculate on every render unless scores change
    const insight = useMemo(() => getCoachInsight(scores), [scores]);

    const colors = {
        neutral: 'from-indigo-500/10 to-violet-500/10 border-white/5',
        warning: 'from-rose-500/10 to-orange-500/10 border-rose-500/20',
        success: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20'
    };

    const icons = {
        neutral: Sparkles,
        warning: AlertTriangle,
        success: CheckCircle
    };

    const textColors = {
        neutral: 'text-indigo-200',
        warning: 'text-rose-200',
        success: 'text-emerald-200'
    };

    const Icon = icons[insight.type];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={clsx(
                "relative overflow-hidden rounded-3xl p-6 border backdrop-blur-sm bg-gradient-to-br min-h-[140px] flex flex-col justify-center",
                colors[insight.type]
            )}
        >
            <div className="flex items-start gap-4 z-10 relative">
                <div className={clsx("p-3 rounded-2xl bg-black/20 backdrop-blur-md", textColors[insight.type])}>
                    <Icon size={24} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                        AI Coach
                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-mono text-neutral-400">BETA</span>
                    </h3>
                    <p className={clsx("text-sm leading-relaxed font-medium", textColors[insight.type])}>
                        "{insight.text}"
                    </p>
                </div>
            </div>

            {/* Background noise effect */}
            <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />
        </motion.div>
    );
};

export default CoachWidget;
