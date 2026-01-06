import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { DesktopSidebar, MobileBottomNav } from './Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
// Assuming useAppScore is available or will be integrated. 
// For now, using a placeholder or connecting if available.

const SystemScoreTicker = () => {
    // This would connect to the real store
    // For visual demo: 
    return (
        <div className="flex items-center gap-4 overflow-hidden mask-linear-fade">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <span className="text-xs font-mono text-indigo-300 tracking-wide uppercase">Coach Active</span>
            </div>
            <p className="text-xs text-neutral-400 whitespace-nowrap animate-marquee">
                Rec: Increase sleep duration by 30min to boost Neural Readiness • Hydration is 200ml below target • High strain detected
            </p>
        </div>
    );
};

const Header = () => {
    const { scores } = useAppStore();
    const systemScore = scores.system || 85;

    return (
        <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-neutral-950/70 border-b border-white/5 supports-[backdrop-filter]:bg-neutral-950/60">
            <div className="flex h-16 items-center justify-between px-4 md:px-8">

                {/* Mobile Menu logic could go here if sidebar wasn't always visible on desktop */}
                <div className="flex items-center gap-6 flex-1">
                    <div className="md:hidden w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600" />

                    <div className="hidden md:flex flex-col">
                        <SystemScoreTicker />
                    </div>
                </div>

                {/* Center Score - The "Heads Up" */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="flex flex-col items-center group cursor-pointer">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 group-hover:text-indigo-400 transition-colors">System Score</span>
                        <span className="text-2xl font-bold font-mono text-white tracking-widest group-hover:drop-shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all">
                            {Math.round(systemScore)}
                        </span>
                    </div>
                </div>

                <div className="flex-1 flex justify-end">
                    {/* Placeholder for future user avatar or notifications */}
                    <div className="w-8 h-8 rounded-full bg-neutral-800 border border-white/10" />
                </div>
            </div>

            {/* Mobile Ticker (below header) */}
            <div className="md:hidden h-8 bg-neutral-900/50 border-b border-white/5 flex items-center px-4 overflow-hidden">
                <SystemScoreTicker />
            </div>
        </header>
    );
};

const DashboardLayout = () => {
    const [isQuickAddOpen, setQuickAddOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#050505] text-neutral-200 font-inter selection:bg-indigo-500/30">
            <DesktopSidebar />

            <div className="md:pl-64 flex flex-col min-h-screen relative">
                <Header />

                <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full pb-28 md:pb-8">
                    <AnimatePresence mode="wait">
                        {/* We wrap Outlet in motion in the actual page usage usually, 
                            but here we provide the container structure */}
                        <div className="w-full h-full">
                            <Outlet />
                        </div>
                    </AnimatePresence>
                </main>
            </div>

            <MobileBottomNav onQuickAdd={() => setQuickAddOpen(true)} />

            {/* Quick Add Modal Placeholder */}
            <AnimatePresence>
                {isQuickAddOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setQuickAddOpen(false)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-neutral-900 border border-white/10 w-full max-w-lg rounded-3xl p-6 shadow-2xl shadow-indigo-500/10"
                        >
                            <h2 className="text-xl font-bold text-white mb-4">Quick Log</h2>
                            <p className="text-neutral-500">Global logging interface coming here...</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DashboardLayout;
