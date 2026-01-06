import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const RadarChartWidget = ({ currentData, optimalData }) => {
    const data = [
        { module: 'LEARNING', current: currentData.learning || 0, optimal: optimalData.learning || 80 },
        { module: 'SCREEN', current: currentData.screen || 0, optimal: optimalData.screen || 80 },
        { module: 'NUTRITION', current: currentData.nutrition || 0, optimal: optimalData.nutrition || 80 },
        { module: 'TRAINING', current: currentData.training || 0, optimal: optimalData.training || 80 },
        { module: 'SLEEP', current: currentData.sleep || 0, optimal: optimalData.sleep || 80 },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="metric-card col-span-2"
        >
            <h3 className="header-text mb-6">MODULE BALANCE ANALYSIS</h3>

            <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={data}>
                    <PolarGrid stroke="rgba(255, 255, 255, 0.05)" />
                    <PolarAngleAxis
                        dataKey="module"
                        tick={{ fill: '#9CA3AF', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                    />
                    <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={{ fill: '#6B7280', fontSize: 9 }}
                        stroke="rgba(255, 255, 255, 0.1)"
                    />

                    {/* Optimal Baseline (Dotted) */}
                    <Radar
                        name="Optimal"
                        dataKey="optimal"
                        stroke="#6B7280"
                        fill="transparent"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                    />

                    {/* Current Status (Solid Fill) */}
                    <Radar
                        name="Current"
                        dataKey="current"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.3}
                        strokeWidth={2}
                    />

                    <Tooltip
                        contentStyle={{
                            background: '#0F1115',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '4px',
                            fontFamily: 'JetBrains Mono',
                            fontSize: '11px'
                        }}
                    />
                </RadarChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-4 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-electric-blue opacity-30 rounded-sm"></div>
                    <span className="text-gray-400">Current Status</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-gray-500 border-dashed"></div>
                    <span className="text-gray-400">Optimal Baseline</span>
                </div>
            </div>
        </motion.div>
    );
};

export default RadarChartWidget;
