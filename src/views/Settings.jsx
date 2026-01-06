import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { UserProfile } from '../components/UserProfile';

const Settings = () => {
    const { resetStore } = useAppStore();

    return (
        <div className="space-y-8 max-w-3xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Configuration</h1>
                <p className="text-neutral-500">Manage your profile, biometric data, and application preferences.</p>
            </header>

            {/* Profile Section */}
            <section className="bg-neutral-900/50 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                    <div className="w-2 h-8 rounded-full bg-indigo-500" />
                    Biometrics & Profile
                </h2>
                <UserProfile />
            </section>

            {/* Weights / Focus Modes (Placeholder for now as per prompt instructions to show intent) */}
            <section className="bg-neutral-900/50 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-sm opacity-50 pointer-events-none grayscale">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                        <div className="w-2 h-8 rounded-full bg-emerald-500" />
                        Module Weights
                    </h2>
                    <span className="text-xs font-mono border border-white/20 px-2 py-1 rounded text-neutral-500">COMING SOON</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['Cognitive', 'Physical', 'Metabolic'].map(mode => (
                        <div key={mode} className="p-4 border border-white/5 rounded-xl bg-black/20">
                            <h3 className="text-neutral-400 font-medium">{mode} Focus</h3>
                        </div>
                    ))}
                </div>
            </section>

            {/* Data Management */}
            <section className="bg-neutral-900/50 border border-red-500/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-rose-500 mb-6 flex items-center gap-3">
                    <div className="w-2 h-8 rounded-full bg-rose-500" />
                    Danger Zone
                </h2>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-rose-500/5 border border-rose-500/10">
                    <div>
                        <h3 className="text-white font-medium">Reset Application Data</h3>
                        <p className="text-sm text-neutral-500 mt-1">This will delete all logs, profile data, and history locally.</p>
                    </div>
                    <button
                        onClick={() => {
                            if (confirm("Are you sure you want to completely wipe all data? This cannot be undone.")) {
                                resetStore();
                                window.location.reload();
                            }
                        }}
                        className="px-4 py-2 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all font-medium text-sm"
                    >
                        Factory Reset
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Settings;
