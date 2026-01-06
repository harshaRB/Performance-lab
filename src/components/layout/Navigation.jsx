import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, User, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const navItems = [
    { id: 'dashboard', label: 'Command', icon: LayoutDashboard, path: '/' },
    { id: 'analytics', label: 'Deep Dive', icon: Activity, path: '/analytics' },
    { id: 'settings', label: 'Config', icon: User, path: '/settings' },
];

export const DesktopSidebar = () => {
    return (
        <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-neutral-950 border-r border-white/5 z-50 p-6"
        >
            <div className="mb-10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 animate-pulse" />
                <span className="font-bold text-xl tracking-tight text-white/90">PERF_LAB</span>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.id}
                        to={item.path}
                        className={({ isActive }) => clsx(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                            isActive
                                ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                                : "text-neutral-500 hover:text-white hover:bg-white/5 origin-left"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon
                                    size={20}
                                    className={clsx("transition-colors", isActive ? "text-indigo-400" : "group-hover:text-indigo-300")}
                                />
                                <span className="font-medium text-sm letter-spacing-wide">{item.label}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]"
                                    />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/5">
                <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all">
                    <Plus size={18} />
                    <span className="text-sm font-semibold">Quick Log</span>
                </button>
            </div>
        </motion.div>
    );
};

export const MobileBottomNav = ({ onQuickAdd }) => {
    return (
        <div className="md:hidden fixed bottom-6 left-4 right-4 h-16 bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-between px-6 z-50 shadow-2xl shadow-black/50 ring-1 ring-white/5">
            {navItems.map((item) => (
                <NavLink
                    key={item.id}
                    to={item.path}
                    className={({ isActive }) => clsx(
                        "flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all",
                        isActive ? "text-indigo-400" : "text-neutral-600 hover:text-neutral-400"
                    )}
                >
                    <item.icon size={22} strokeWidth={2} />
                </NavLink>
            ))}

            {/* Floating Quick Add Button intended to sit distinctly */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <button
                    onClick={onQuickAdd}
                    className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] border-4 border-neutral-950 hover:scale-105 active:scale-95 transition-transform"
                >
                    <Plus size={26} strokeWidth={3} />
                </button>
            </div>
        </div>
    );
};
