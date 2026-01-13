import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useAuth } from './hooks/useAuth';
import { useAppStore } from './store/useAppStore';
import AppShell from './components/layout/AppShell';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy Load Views
const Dashboard = lazy(() => import('./views/DashboardV2'));
const Analytics = lazy(() => import('./views/Analytics'));
const Settings = lazy(() => import('./views/Settings'));
const AboutPage = lazy(() => import('./views/AboutPage'));
const LoginPage = lazy(() => import('./views/LoginPage'));
const SignupPage = lazy(() => import('./views/SignupPage'));

function App() {
    const { user, loading } = useAuth(); // Use centralized hook
    const syncWithSupabase = useAppStore(state => state.syncWithSupabase);
    const location = useLocation();

    // Sync data after successful auth
    useEffect(() => {
        if (user?.id) {
            syncWithSupabase(user.id).catch(err =>
                console.error('Supabase sync failed:', err)
            );
        }
    }, [user?.id, syncWithSupabase]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 animate-pulse shadow-[0_0_30px_rgba(99,102,241,0.5)]" />
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <Suspense fallback={
                <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600 animate-pulse shadow-[0_0_30px_rgba(99,102,241,0.5)]" />
                </div>
            }>
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        {/* Public Auth Routes */}
                        {!user ? (
                            <>
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/signup" element={<SignupPage />} />
                                <Route path="*" element={<Navigate to="/login" replace />} />
                            </>
                        ) : (
                            /* Protected App Routes */
                            <Route path="/" element={<AppShell />}>
                                <Route index element={<Dashboard />} />
                                <Route path="analytics" element={<Analytics />} />
                                <Route path="settings" element={<Settings />} />
                                <Route path="about" element={<AboutPage />} />
                                <Route path="login" element={<Navigate to="/" replace />} />
                                <Route path="signup" element={<Navigate to="/" replace />} />
                            </Route>
                        )}
                    </Routes>
                </AnimatePresence>
            </Suspense>
            <SpeedInsights />
        </ErrorBoundary>
    );
}

export default App;
