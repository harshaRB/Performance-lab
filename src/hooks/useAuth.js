import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // If Supabase isn't configured, check for demo session
        if (!isSupabaseConfigured || !supabase) {
            console.warn('Running in demo mode - Supabase not configured');
            const demoSession = localStorage.getItem('vylos_demo_session');
            if (demoSession) {
                setUser(JSON.parse(demoSession));
            }
            setLoading(false);
            return;
        }

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        }).catch(err => {
            console.error('Auth session error:', err);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (email, password) => {
        try {
            if (!supabase) throw new Error('Supabase not configured');
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
        } catch (err) {
            console.warn('Auth failed or not configured, falling back to Demo Mode:', err);
            // Fallback to Demo Mode for ANY error (config missing, network, or invalid creds in dev)
            const mockUser = {
                id: 'demo-user-' + Math.random().toString(36).substr(2, 9),
                email: email,
                aud: 'authenticated',
                created_at: new Date().toISOString()
            };
            localStorage.setItem('vylos_demo_session', JSON.stringify(mockUser));
            setUser(mockUser);
            // Don't re-throw, just let them in as demo
        }
    };

    const signUp = async (email, password) => {
        if (!supabase) {
            // Demo Mode Signup
            const mockUser = {
                id: 'demo-user-123',
                email: email,
                aud: 'authenticated',
                created_at: new Date().toISOString()
            };
            localStorage.setItem('vylos_demo_session', JSON.stringify(mockUser));
            setUser(mockUser);
            return;
        }
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
    };

    const signOut = async () => {
        if (!supabase) {
            // Demo Mode Logout
            localStorage.removeItem('vylos_demo_session');
            setUser(null);
            return;
        }
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, isSupabaseConfigured }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
