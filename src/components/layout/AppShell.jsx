import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Activity, Settings as SettingsIcon, Plus, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useAppStore } from '../../store/useAppStore';

const NavItem = ({ to, icon: Icon, label }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                isActive
                    ? "text-white bg-white/5 shadow-[0_0_20px_rgba(99,102,241,0.1)] border border-white/10"
                    : "text-neutral-500 hover:text-white hover:bg-white/5"
            )}
        >
            {({ isActive }) => (
                <>
                    <Icon size={20} className={clsx("transition-colors relative z-10", isActive ? "text-indigo-400" : "group-hover:text-indigo-300")} />
                    <span className="font-medium text-sm tracking-wide relative z-10">{label}</span>
                    {isActive && (
                        <motion.div
                            layoutId="nav-glow"
                            className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />
                    )}
                </>
            )}
        </NavLink>
    );
};

const Sidebar = () => (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-[#050505] border-r border-white/5 z-50 p-6">
        <div className="mb-10 flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_0_15px_rgba(99,102,241,0.4)]" />
            <span className="font-bold text-xl tracking-tight text-white/90 font-mono">PERF_LAB</span>
        </div>

        <nav className="flex-1 space-y-2">
            <NavItem to="/" icon={LayoutDashboard} label="Command" />
            <NavItem to="/analytics" icon={Activity} label="Deep Dive" />
            <NavItem to="/settings" icon={SettingsIcon} label="Config" />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
            <div className="px-4 py-3 rounded-xl bg-neutral-900 border border-white/5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-neutral-800" />
                <div className="flex flex-col">
                    <span className="text-sm text-white font-medium">User</span>
                    <span className="text-xs text-neutral-500">Pro Plan</span>
                </div>
            </div>
        </div>
    </aside>
);

const MobileNav = () => (
    <div className="md:hidden fixed bottom-6 left-6 right-6 h-16 bg-[#0F1115]/90 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-between px-8 z-50 shadow-2xl shadow-black/80">
        <NavLink to="/" className={({ isActive }) => clsx("p-2 rounded-xl transition-colors", isActive ? "text-indigo-400 bg-white/5" : "text-neutral-600")}>
            <LayoutDashboard size={24} />
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => clsx("p-2 rounded-xl transition-colors", isActive ? "text-indigo-400 bg-white/5" : "text-neutral-600")}>
            <Activity size={24} />
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => clsx("p-2 rounded-xl transition-colors", isActive ? "text-indigo-400 bg-white/5" : "text-neutral-600")}>
            <SettingsIcon size={24} />
        </NavLink>
    </div>
);

const HUD = () => {
    const { scores } = useAppStore();
    const sysScore = Math.round(scores.system || 0);

    return (
        <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#050505]/80 border-b border-white/5">
            <div className="flex h-16 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
                {/* Mobile Menu Trigger Placeholder */}
                <div className="md:hidden">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600" />
                </div>

                {/* Score Widget */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="flex flex-col items-center group cursor-default">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 group-hover:text-indigo-400 transition-colors">System Status</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold font-mono text-white tracking-widest drop-shadow-[0_0_10px_rgba(99,102,241,0.3)]">
                                {sysScore}
                            </span>
                            <span className="text-xs text-neutral-600">%</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-4 ml-auto">
                    <button className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono hover:bg-indigo-500/20 transition-colors">
                        <Plus size={14} />
                        QUICK LOG
                    </button>
                </div>
            </div>

            {/* Coach Ticker */}
            <div className="w-full bg-[#0F1115] border-b border-white/5 py-1 px-4 overflow-hidden flex justify-center">
                <p className="text-[10px] md:text-xs text-neutral-400 font-mono tracking-wide animate-pulse">
                    AI COACH: Optimal recovery requires 8h sleep tonight. High cognitive load detected.
                </p>
            </div>
        </header>
    );
};

export const AppShell = () => {
    return (
        <div className="min-h-screen bg-[#050505] text-neutral-200 font-inter selection:bg-indigo-500/30">
            <Sidebar />
            <div className="md:pl-64 flex flex-col min-h-screen relative">
                <HUD />
                <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 relative z-0 pb-24 md:pb-8">
                    <Outlet />
                </main>
            </div>
            <MobileNav />
        </div>
    );
};

export default AppShell;
