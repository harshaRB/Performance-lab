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
        if (!supabase) {
            throw new Error('Authentication service not configured. Please contact support.');
        }

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            console.error('[Auth] Sign in failed:', error.message);
            throw error;
        }

        // Return data for MFA handling - caller needs to check for MFA challenge
        return data;
    };

    const signUp = async (email, password) => {
        if (!supabase) {
            throw new Error('Authentication service not configured. Please contact support.');
        }

        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) {
            console.error('[Auth] Sign up failed:', error.message);
            throw error;
        }

        return data;
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
