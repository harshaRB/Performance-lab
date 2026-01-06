import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '../lib/supabaseClient';

// Initial States
const defaultProfile = {
    name: '',
    age: '',
    gender: 'male',
    weight: '',
    height: '',
    activityLevel: 'sedentary',
    goal: 'maintenance'
};

const defaultScores = {
    learning: 0,
    screen: 0,
    nutrition: 0,
    training: 0,
    sleep: 0,
    system: 0
};

export const useAppStore = create(
    persist(
        (set, get) => ({
            // User Profile
            profile: defaultProfile,
            setProfile: (newProfile) => set((state) => ({
                profile: { ...state.profile, ...newProfile }
            })),

            // Daily Logs (Aggregated by Date)
            dailyLogs: {}, // Key: YYYY-MM-DD
            setDailyLog: (date, logType, data) => set((state) => ({
                dailyLogs: {
                    ...state.dailyLogs,
                    [date]: {
                        ...state.dailyLogs[date],
                        [logType]: data
                    }
                }
            })),

            // System Scores
            scores: defaultScores,
            setScores: (newScores) => set((state) => ({
                scores: { ...state.scores, ...newScores }
            })),

            // Actions
            resetStore: () => set({ profile: defaultProfile, scores: defaultScores }),

            // Supabase Sync Action
            syncWithSupabase: async (userId) => {
                if (!userId) return;

                // 1. Fetch Profile
                const { data: profileData } = await supabase.from('profiles').select('*').eq('id', userId).single();
                if (profileData) {
                    set((state) => ({
                        profile: { ...state.profile, ...profileData }
                    }));
                }

                // 2. Fetch Daily Metrics (Sleep, Screen, Learning)
                const { data: metrics } = await supabase
                    .from('daily_metrics')
                    .select('*')
                    .eq('user_id', userId);

                // 3. Fetch Nutrition
                const { data: nutrition } = await supabase
                    .from('nutrition_logs')
                    .select('*')
                    .eq('user_id', userId);

                // 4. Merge into Local State
                const logsMap = {};

                // Process Metrics
                metrics?.forEach(m => {
                    if (!logsMap[m.date]) logsMap[m.date] = {};
                    logsMap[m.date].sleep = { duration: m.sleep_hours, quality: m.sleep_quality };
                    logsMap[m.date].learning = { active: m.learning_mins, passive: 0 };
                    logsMap[m.date].screen = { total: m.screen_time_mins };
                });

                // Process Nutrition
                nutrition?.forEach(n => {
                    if (!logsMap[n.date]) logsMap[n.date] = {};
                    logsMap[n.date].nutrition = {
                        totalCalories: n.calories,
                        macros: { protein: n.protein, carbs: n.carbs, fats: n.fats }
                    };
                });

                set((state) => ({
                    dailyLogs: { ...state.dailyLogs, ...logsMap }
                }));
            },
        }),
        {
            name: 'performance-lab-storage', // unique name
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                profile: state.profile,
                dailyLogs: state.dailyLogs
                // Don't persist scores, recalculate them on load
            }),
        }
    )
);
