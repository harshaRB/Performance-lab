import React from 'react';
import { motion } from 'framer-motion';

const DashboardLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-void p-8">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-4xl font-bold text-electric-blue data-text mb-2">
                    VYCLO LABS
                </h1>
                <p className="header-text text-gray-500">
                    BIOMETRIC INTELLIGENCE SYSTEM // v2.0
                </p>
            </motion.header>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-auto">
                {React.Children.map(children, (child, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className={getGridSpan(index)}
                    >
                        {child}
                    </motion.div>
                ))}
            </div>

            {/* Tactical Grid Overlay (Optional Visual Enhancement) */}
            <div className="fixed inset-0 pointer-events-none opacity-5">
                <div className="absolute inset-0"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
                        backgroundSize: '50px 50px'
                    }}
                />
            </div>
        </div>
    );
};

// Dynamic grid spanning for Bento layout
const getGridSpan = (index) => {
    const spans = [
        'col-span-1 row-span-1', // Profile
        'col-span-1 row-span-1', // Learning
        'col-span-1 row-span-1', // Screen Time
        'col-span-2 row-span-2', // Nutrition (larger)
        'col-span-1 row-span-1', // Training
        'col-span-1 row-span-1', // Sleep
        'col-span-2 row-span-1', // Radar Chart
        'col-span-1 row-span-1', // Additional metrics
    ];
    return spans[index % spans.length] || 'col-span-1 row-span-1';
};

export default DashboardLayout;
