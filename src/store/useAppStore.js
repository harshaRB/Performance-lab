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
    goal: 'maintenance',
    avatarId: 'operator'
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
        (set, _get) => ({
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

            // Helper to seed demo data
            seedDemoData: () => {
                const today = new Date().toISOString().split('T')[0];
                const demoLogs = {};

                // Generate 7 days of mock data
                for (let i = 0; i < 7; i++) {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    const dateStr = d.toISOString().split('T')[0];

                    demoLogs[dateStr] = {
                        sleep: { duration: Number((7 + Math.random()).toFixed(1)), quality: Math.floor(8 + Math.random() * 2) },
                        learning: { active: Math.floor(45 + Math.random() * 30), passive: 15 },
                        screen: { total: Math.floor(120 + Math.random() * 60) },
                        nutrition: {
                            totalCalories: Math.floor(2200 + Math.random() * 300),
                            macros: { protein: 160, carbs: 200, fats: 70 }
                        }
                    };
                }

                set((state) => ({
                    profile: {
                        ...state.profile,
                        name: 'Demo Admin',
                        age: 28,
                        weight: 75,
                        height: 180,
                        activityLevel: 'active',
                        goal: 'hypertrophy'
                    },
                    dailyLogs: demoLogs,
                    scores: {
                        learning: 85,
                        screen: 92,
                        nutrition: 88,
                        training: 75,
                        sleep: 82,
                        system: 84
                    }
                }));
                console.log('✨ Demo Data Seeded Successfully');
            },

            // Supabase Sync Action - Full Cloud Sync
            syncWithSupabase: async (userId) => {
                const isDemoUser = userId?.startsWith('demo-user-');

                if (!userId) return;

                // INTERCEPT: If Demo User OR Supabase not configured, SEED DATA Instead
                if (isDemoUser || !supabase) {
                    // Check if we already have data, if not, seed it
                    const currentLogs = _get().dailyLogs;
                    if (Object.keys(currentLogs).length === 0) {
                        _get().seedDemoData();
                    }
                    return;
                }

                console.log('[AppStore] Starting cloud sync for user:', userId);

                try {
                    // 1. Fetch Profile
                    const { data: profileData } = await supabase.from('profiles').select('*').eq('id', userId).single();
                    if (profileData) {
                        set((state) => ({
                            profile: {
                                ...state.profile,
                                name: profileData.full_name || state.profile.name,
                                weight: profileData.weight || state.profile.weight,
                                height: profileData.height || state.profile.height,
                                age: profileData.age || state.profile.age,
                                gender: profileData.gender || state.profile.gender,
                            }
                        }));
                    }

                    // 2. Fetch Daily Metrics (Sleep, Screen, Learning)
                    const { data: metrics } = await supabase
                        .from('daily_metrics')
                        .select('*')
                        .eq('user_id', userId)
                        .order('date', { ascending: false })
                        .limit(30);

                    // 3. Fetch Nutrition
                    const { data: nutrition } = await supabase
                        .from('nutrition_logs')
                        .select('*')
                        .eq('user_id', userId)
                        .order('date', { ascending: false })
                        .limit(30);

                    // 4. Fetch Hydration
                    const { data: hydration } = await supabase
                        .from('hydration_logs')
                        .select('*')
                        .eq('user_id', userId)
                        .order('date', { ascending: false })
                        .limit(30);

                    // 5. Fetch Score History
                    const { data: scoreData } = await supabase
                        .from('score_history')
                        .select('*')
                        .eq('user_id', userId)
                        .order('date', { ascending: false })
                        .limit(30);

                    // 6. Merge into Local State
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

                    // Process Hydration
                    hydration?.forEach(h => {
                        if (!logsMap[h.date]) logsMap[h.date] = {};
                        logsMap[h.date].hydration = h.glasses;
                        // Also save to localStorage for component access
                        localStorage.setItem(`pl_hydration_${h.date}`, String(h.glasses));
                    });

                    // Process Score History
                    const scoreHistory = {};
                    scoreData?.forEach(s => {
                        scoreHistory[s.date] = {
                            sleep: s.sleep_score,
                            nutrition: s.nutrition_score,
                            training: s.training_score,
                            learning: s.learning_score,
                            screen: s.screen_score,
                            system: s.system_score,
                        };
                    });
                    if (Object.keys(scoreHistory).length > 0) {
                        localStorage.setItem('pl_score_history', JSON.stringify(scoreHistory));
                    }

                    set((state) => ({
                        dailyLogs: { ...state.dailyLogs, ...logsMap }
                    }));

                    console.log('[AppStore] Cloud sync complete');
                } catch (err) {
                    console.error('[AppStore] Sync error:', err);
                }
            },
        }),
        {
            name: 'performance-lab-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                profile: state.profile,
                dailyLogs: state.dailyLogs,
                scores: state.scores
            }),
        }
    )
);
