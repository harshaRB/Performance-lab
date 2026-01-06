import React from 'react';
import { motion } from 'framer-motion';

const MetricCard = ({
    title,
    value,
    trend,
    variant = 'blue',
    isActive = false,
    isImputed = false,
    unit = '',
    subtitle = ''
}) => {
    const variantColors = {
        blue: { glow: 'shadow-glow-blue', text: 'text-electric-blue', border: 'border-electric-blue' },
        pink: { glow: 'shadow-glow-pink', text: 'text-plasma-pink', border: 'border-plasma-pink' },
        green: { glow: 'shadow-glow-green', text: 'text-bio-green', border: 'border-bio-green' },
        violet: { glow: 'shadow-glow-violet', text: 'text-neural-violet', border: 'border-neural-violet' },
        orange: { glow: 'shadow-glow-orange', text: 'text-warning-orange', border: 'border-warning-orange' },
    };

    const colors = variantColors[variant] || variantColors.blue;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`metric-card ${isActive ? `${colors.glow} animate-breathe` : ''}`}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <h3 className="header-text">{title}</h3>
                {trend && (
                    <span className={`text-xs ${trend > 0 ? 'text-bio-green' : 'text-warning-orange'}`}>
                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </span>
                )}
            </div>

            {/* Value */}
            <motion.div
                key={value}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`data-text text-5xl font-bold ${colors.text} ${isImputed ? 'opacity-60' : ''}`}
            >
                {value}
                {unit && <span className="text-2xl ml-1 text-gray-500">{unit}</span>}
            </motion.div>

            {/* Imputed Indicator */}
            {isImputed && (
                <div className="mt-2 text-xs text-gray-500 border-b border-dashed border-gray-700 inline-block">
                    Estimated via Bayesian inference
                </div>
            )}

            {/* Subtitle */}
            {subtitle && (
                <p className="mt-3 text-sm text-gray-400">{subtitle}</p>
            )}

            {/* Phantom accent line */}
            <div className={`mt-4 h-0.5 w-12 ${colors.text} opacity-50`}></div>
        </motion.div>
    );
};

export default MetricCard;
