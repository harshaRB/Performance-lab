/**
 * Cloud Sync Service
 * 
 * Centralized data layer for syncing with Supabase cloud.
 * Provides read/write operations with automatic offline fallback.
 */
import { supabase } from './supabaseClient';

// Get today's date in YYYY-MM-DD format
const getToday = () => new Date().toISOString().split('T')[0];

/**
 * Check if user is authenticated with Supabase
 */
export const isAuthenticated = async () => {
    if (!supabase) return false;
    const { data: { user } } = await supabase.auth.getUser();
    return !!user && !user.id?.startsWith('demo-user-');
};

/**
 * Get current user ID
 */
export const getCurrentUserId = async () => {
    if (!supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
};

// ============================================
// PROFILE OPERATIONS
// ============================================

export const saveProfile = async (profileData) => {
    const userId = await getCurrentUserId();
    if (!userId || !supabase) {
        localStorage.setItem('pl_user_profile', JSON.stringify(profileData));
        return { success: true, source: 'local' };
    }

    try {
        const { error } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                full_name: profileData.name,
                weight: profileData.weight,
                height: profileData.height,
                age: profileData.age,
                gender: profileData.gender,
            }, { onConflict: 'id' });

        if (error) throw error;
        // Also save locally for offline access
        localStorage.setItem('pl_user_profile', JSON.stringify(profileData));
        return { success: true, source: 'cloud' };
    } catch (err) {
        console.error('[CloudSync] Error saving profile:', err);
        localStorage.setItem('pl_user_profile', JSON.stringify(profileData));
        return { success: true, source: 'local', error: err.message };
    }
};

export const loadProfile = async () => {
    const userId = await getCurrentUserId();

    // Try cloud first
    if (userId && supabase) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (!error && data) {
                const profile = {
                    name: data.full_name || '',
                    weight: data.weight || '',
                    height: data.height || '',
                    age: data.age || '',
                    gender: data.gender || 'male',
                };
                localStorage.setItem('pl_user_profile', JSON.stringify(profile));
                return { data: profile, source: 'cloud' };
            }
        } catch (err) {
            console.warn('[CloudSync] Cloud fetch failed, using local:', err);
        }
    }

    // Fallback to localStorage
    const local = localStorage.getItem('pl_user_profile');
    return { data: local ? JSON.parse(local) : null, source: 'local' };
};

// ============================================
// DAILY METRICS OPERATIONS
// ============================================

export const saveDailyMetrics = async (date, metrics) => {
    const userId = await getCurrentUserId();
    const dateKey = date || getToday();

    if (!userId || !supabase) {
        // Save locally
        if (metrics.sleep) {
            localStorage.setItem(`pl_sleep_${dateKey}`, JSON.stringify(metrics.sleep));
        }
        if (metrics.learning !== undefined) {
            localStorage.setItem(`pl_learning_${dateKey}`, String(metrics.learning));
        }
        if (metrics.screen !== undefined) {
            localStorage.setItem(`pl_screen_${dateKey}`, String(metrics.screen));
        }
        return { success: true, source: 'local' };
    }

    try {
        const { error } = await supabase
            .from('daily_metrics')
            .upsert({
                user_id: userId,
                date: dateKey,
                sleep_hours: metrics.sleep?.duration || 0,
                sleep_quality: metrics.sleep?.quality || 0,
                learning_mins: metrics.learning || 0,
                screen_time_mins: metrics.screen || 0,
            }, { onConflict: 'user_id,date' });

        if (error) throw error;
        return { success: true, source: 'cloud' };
    } catch (err) {
        console.error('[CloudSync] Error saving daily metrics:', err);
        return { success: false, error: err.message };
    }
};

export const loadDailyMetrics = async (date) => {
    const userId = await getCurrentUserId();
    const dateKey = date || getToday();

    if (userId && supabase) {
        try {
            const { data, error } = await supabase
                .from('daily_metrics')
                .select('*')
                .eq('user_id', userId)
                .eq('date', dateKey)
                .single();

            if (!error && data) {
                return {
                    data: {
                        sleep: { duration: data.sleep_hours, quality: data.sleep_quality },
                        learning: data.learning_mins,
                        screen: data.screen_time_mins,
                    },
                    source: 'cloud'
                };
            }
        } catch (err) {
            console.warn('[CloudSync] Cloud fetch failed:', err);
        }
    }

    // Fallback to localStorage
    const sleep = JSON.parse(localStorage.getItem(`pl_sleep_${dateKey}`) || '{}');
    const learning = parseInt(localStorage.getItem(`pl_learning_${dateKey}`) || '0');
    const screen = parseInt(localStorage.getItem(`pl_screen_${dateKey}`) || '0');

    return {
        data: { sleep, learning, screen },
        source: 'local'
    };
};

// ============================================
// HYDRATION OPERATIONS
// ============================================

export const saveHydration = async (date, glasses) => {
    const userId = await getCurrentUserId();
    const dateKey = date || getToday();

    localStorage.setItem(`pl_hydration_${dateKey}`, String(glasses));

    if (!userId || !supabase) {
        return { success: true, source: 'local' };
    }

    try {
        const { error } = await supabase
            .from('hydration_logs')
            .upsert({
                user_id: userId,
                date: dateKey,
                glasses: glasses,
            }, { onConflict: 'user_id,date' });

        if (error) throw error;
        return { success: true, source: 'cloud' };
    } catch (err) {
        console.error('[CloudSync] Error saving hydration:', err);
        return { success: true, source: 'local', error: err.message };
    }
};

export const loadHydration = async (date) => {
    const userId = await getCurrentUserId();
    const dateKey = date || getToday();

    if (userId && supabase) {
        try {
            const { data, error } = await supabase
                .from('hydration_logs')
                .select('glasses')
                .eq('user_id', userId)
                .eq('date', dateKey)
                .single();

            if (!error && data) {
                localStorage.setItem(`pl_hydration_${dateKey}`, String(data.glasses));
                return { data: data.glasses, source: 'cloud' };
            }
        } catch (err) {
            console.warn('[CloudSync] Hydration fetch failed:', err);
        }
    }

    const local = parseInt(localStorage.getItem(`pl_hydration_${dateKey}`) || '0');
    return { data: local, source: 'local' };
};

// ============================================
// NUTRITION OPERATIONS
// ============================================

export const saveNutrition = async (date, nutritionData) => {
    const userId = await getCurrentUserId();
    const dateKey = date || getToday();

    localStorage.setItem(`pl_nutrition_log_${dateKey}`, JSON.stringify(nutritionData));

    if (!userId || !supabase) {
        return { success: true, source: 'local' };
    }

    try {
        const { error } = await supabase
            .from('nutrition_logs')
            .upsert({
                user_id: userId,
                date: dateKey,
                calories: nutritionData.totalCalories || 0,
                protein: nutritionData.macros?.protein || 0,
                carbs: nutritionData.macros?.carbs || 0,
                fats: nutritionData.macros?.fats || 0,
                junk_penalty: nutritionData.junkPenalty || 0,
            }, { onConflict: 'user_id,date' });

        if (error) throw error;
        return { success: true, source: 'cloud' };
    } catch (err) {
        console.error('[CloudSync] Error saving nutrition:', err);
        return { success: true, source: 'local', error: err.message };
    }
};

export const loadNutrition = async (date) => {
    const userId = await getCurrentUserId();
    const dateKey = date || getToday();

    if (userId && supabase) {
        try {
            const { data, error } = await supabase
                .from('nutrition_logs')
                .select('*')
                .eq('user_id', userId)
                .eq('date', dateKey)
                .single();

            if (!error && data) {
                const nutrition = {
                    totalCalories: data.calories,
                    macros: { protein: data.protein, carbs: data.carbs, fats: data.fats },
                    junkPenalty: data.junk_penalty,
                };
                localStorage.setItem(`pl_nutrition_log_${dateKey}`, JSON.stringify(nutrition));
                return { data: nutrition, source: 'cloud' };
            }
        } catch (err) {
            console.warn('[CloudSync] Nutrition fetch failed:', err);
        }
    }

    const local = JSON.parse(localStorage.getItem(`pl_nutrition_log_${dateKey}`) || '{}');
    return { data: local, source: 'local' };
};

// ============================================
// SCORE HISTORY OPERATIONS
// ============================================

export const saveScores = async (date, scores) => {
    const userId = await getCurrentUserId();
    const dateKey = date || getToday();

    // Always save locally
    const history = JSON.parse(localStorage.getItem('pl_score_history') || '{}');
    history[dateKey] = scores;
    localStorage.setItem('pl_score_history', JSON.stringify(history));

    if (!userId || !supabase) {
        return { success: true, source: 'local' };
    }

    try {
        const { error } = await supabase
            .from('score_history')
            .upsert({
                user_id: userId,
                date: dateKey,
                sleep_score: scores.sleep || 0,
                nutrition_score: scores.nutrition || 0,
                training_score: scores.training || 0,
                learning_score: scores.learning || 0,
                screen_score: scores.screen || 0,
                system_score: scores.system || 0,
            }, { onConflict: 'user_id,date' });

        if (error) throw error;
        return { success: true, source: 'cloud' };
    } catch (err) {
        console.error('[CloudSync] Error saving scores:', err);
        return { success: true, source: 'local', error: err.message };
    }
};

export const loadScoreHistory = async (days = 30) => {
    const userId = await getCurrentUserId();

    if (userId && supabase) {
        try {
            const { data, error } = await supabase
                .from('score_history')
                .select('*')
                .eq('user_id', userId)
                .order('date', { ascending: false })
                .limit(days);

            if (!error && data?.length > 0) {
                const history = {};
                data.forEach(row => {
                    history[row.date] = {
                        sleep: row.sleep_score,
                        nutrition: row.nutrition_score,
                        training: row.training_score,
                        learning: row.learning_score,
                        screen: row.screen_score,
                        system: row.system_score,
                    };
                });
                localStorage.setItem('pl_score_history', JSON.stringify(history));
                return { data: history, source: 'cloud' };
            }
        } catch (err) {
            console.warn('[CloudSync] Score history fetch failed:', err);
        }
    }

    const local = JSON.parse(localStorage.getItem('pl_score_history') || '{}');
    return { data: local, source: 'local' };
};

// ============================================
// FULL SYNC (On Login)
// ============================================

export const syncAllData = async () => {
    const userId = await getCurrentUserId();
    if (!userId || !supabase) {
        console.log('[CloudSync] Skipping sync - no user or supabase');
        return { success: false, reason: 'Not authenticated' };
    }

    console.log('[CloudSync] Starting full sync...');

    try {
        // Sync profile
        await loadProfile();

        // Sync today's data
        await loadDailyMetrics();
        await loadHydration();
        await loadNutrition();

        // Sync score history
        await loadScoreHistory(30);

        console.log('[CloudSync] Full sync complete');
        return { success: true };
    } catch (err) {
        console.error('[CloudSync] Sync error:', err);
        return { success: false, error: err.message };
    }
};

export default {
    isAuthenticated,
    getCurrentUserId,
    saveProfile,
    loadProfile,
    saveDailyMetrics,
    loadDailyMetrics,
    saveHydration,
    loadHydration,
    saveNutrition,
    loadNutrition,
    saveScores,
    loadScoreHistory,
    syncAllData,
};
