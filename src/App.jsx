import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import AppShell from './components/layout/AppShell';
import AuthPage from './components/auth/AuthPage';

// Lazy Load Views for Performance
const Dashboard = lazy(() => import('./views/DashboardV2'));
const Analytics = lazy(() => import('./views/Analytics'));
const Settings = lazy(() => import('./views/Settings'));

function App() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 animate-pulse shadow-[0_0_30px_rgba(99,102,241,0.5)]" />
            </div>
        );
    }

    if (!session) {
        return <AuthPage />;
    }

    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600 animate-pulse shadow-[0_0_30px_rgba(99,102,241,0.5)]" />
                    <span className="text-neutral-500 font-mono text-sm tracking-widest">LOADING CORE...</span>
                </div>
            </div>
        }>
            <Routes>
                <Route path="/" element={<AppShell />}>
                    <Route index element={<Dashboard />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
            </Routes>
        </Suspense>
    );
}

export default App;
