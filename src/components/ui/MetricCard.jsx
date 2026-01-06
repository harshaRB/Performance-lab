import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import clsx from 'clsx';

const NumberMorph = ({ value }) => {
    // Simple spring animation for the number
    let initial = 0;
    // In a real implementation this would use MotionValue for smooth interpolation from previous
    return <span>{value}</span>;
};

export const MetricCard = ({
    title,
    value,
    subtext,
    icon: Icon,
    color = "indigo", // indigo, violet, emerald, rose, orange
    onClick,
    className
}) => {

    const colorStyles = {
        indigo: "from-indigo-500/10 to-indigo-600/5 border-indigo-500/20 hover:border-indigo-500/40 text-indigo-400 bg-indigo-500/10",
        violet: "from-violet-500/10 to-violet-600/5 border-violet-500/20 hover:border-violet-500/40 text-violet-400 bg-violet-500/10",
        emerald: "from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
        rose: "from-rose-500/10 to-rose-600/5 border-rose-500/20 hover:border-rose-500/40 text-rose-400 bg-rose-500/10",
        orange: "from-orange-500/10 to-orange-600/5 border-orange-500/20 hover:border-orange-500/40 text-orange-400 bg-orange-500/10",
    };

    // Fallback if color not found
    const activeStyle = colorStyles[color] || colorStyles.indigo;
    const [gradient, border, text, badge] = [
        `bg-gradient-to-br ${activeStyle.split(' ')[0]} ${activeStyle.split(' ')[1]}`,
        activeStyle.split(' ')[2] + ' ' + activeStyle.split(' ')[3],
        activeStyle.split(' ')[4],
        activeStyle.split(' ')[5]
    ];

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={clsx(
                "relative overflow-hidden rounded-3xl p-6 cursor-pointer group transition-all duration-300",
                "bg-[#0F1115] border border-white/5",
                // Hover Effects via class manipulation or inline style
                `hover:border-[${color === 'indigo' ? '#6366f1' : color === 'emerald' ? '#10b981' : '#888'}]/30`,
                activeStyle.replace('text-', '').replace('bg-', ''), // Hacky extraction, better to use strict maps
                className
            )}
        >
            {/* Glow Effect */}
            <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-${color}-500`} />

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                    <div className={clsx("p-2.5 rounded-xl transition-colors", `bg-${color}-500/10 text-${color}-400 group-hover:text-white`)}>
                        <Icon size={22} />
                    </div>
                    <ExternalLink size={16} className={clsx("text-neutral-600 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100")} />
                </div>

                <div className="mt-6">
                    <h3 className="text-neutral-400 font-medium text-sm group-hover:text-neutral-300 transition-colors uppercase tracking-wider">{title}</h3>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-bold font-mono text-white tracking-tighter">
                            {value}
                        </span>
                    </div>
                    <p className="text-xs text-neutral-500 font-medium mt-2 flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full bg-${color}-500`}></span>
                        {subtext}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default MetricCard;
