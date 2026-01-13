import { useEffect } from 'react';
import { logistic, geometricMean, calculateZScore, calculateMacroScore, calculateFatiguePenalty, calculateFatQualityIndex, calculateAminoAcidScore } from '../utils/Biostatistics';
import { useAppStore } from '../store/useAppStore';

// ============================================
// PENALTY CONSTANTS
// ============================================

// Data completeness penalties
const MISSING_MEAL_PENALTY = 20;         // Per missing meal (breakfast/lunch/dinner)
const DATA_UNCERTAINTY_PENALTY = 15;      // For unlogged modules
const ASSUMED_SCREEN_ENTERTAINMENT = 120; // Minutes assumed if not logged

// Screen time penalty constants
const SOCIAL_PENALTY_COEFFICIENT = 0.010;
const ENTERTAINMENT_PENALTY_COEFFICIENT = 0.015;
const SCREEN_TIME_EXPONENT = 1.5;
const PRODUCTIVE_SCREEN_BONUS = 0.1;

// Nutrition constants
const PROTEIN_PER_KG = 2.2;
const FAT_CALORIES_PERCENTAGE = 0.25;
const FAT_QUALITY_WEIGHT = 0.15;
const AMINO_ACID_WEIGHT = 0.10;
const JUNK_PENALTY_MULTIPLIER = 30;

// Hydration constants (now as standalone module)
const HYDRATION_OPTIMAL_ML = 3000;
const HYDRATION_MINIMUM_ML = 1000;

// Training constants
const OPTIMAL_TRAINING_VOLUME = 10000;
const OVERTRAINING_THRESHOLD = 15000;

// Sleep constants
const OPTIMAL_SLEEP_HOURS = 8;
const SLEEP_DEFICIT_PENALTY = 15;
const SLEEP_DURATION_WEIGHT = 0.7;
const SLEEP_QUALITY_WEIGHT = 0.3;
const MAX_NAP_BONUS = 20;
const NAP_BONUS_RATE = 15;

export const useSystemScore = () => {
    const { dailyLogs, profile, scores, setScores } = useAppStore();
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        calculateAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dailyLogs, profile, today]);

    const calculateAll = () => {
        const todayLog = dailyLogs[today] || {};

        // ============================================
        // 1. LEARNING SCORE
        // ============================================
        const readData = todayLog.learning || { active: 0, passive: 0 };
        const hasLearningData = (readData.active > 0 || readData.passive > 0);

        let learningScore = 0;
        if (hasLearningData) {
            const ell = (readData.active * 1.5) + readData.passive;
            const zLearning = calculateZScore(ell, 'learning');
            learningScore = Math.min(100, Math.round(logistic(zLearning, 0.8, 0.5) * 100));
        } else {
            // No learning logged - apply uncertainty penalty
            learningScore = Math.max(0, 50 - DATA_UNCERTAINTY_PENALTY);
        }

        // ============================================
        // 2. SCREEN TIME SCORE (Fixed loophole)
        // ============================================
        const sData = todayLog.screen || { social: 0, entertainment: 0, productive: 0 };
        const hasScreenData = todayLog.screenLogged ||
            (sData.social > 0 || sData.entertainment > 0 || sData.productive > 0);

        let screenScore = 0;
        if (hasScreenData) {
            const penalty = (SOCIAL_PENALTY_COEFFICIENT * Math.pow(sData.social, SCREEN_TIME_EXPONENT)) +
                (ENTERTAINMENT_PENALTY_COEFFICIENT * Math.pow(sData.entertainment, SCREEN_TIME_EXPONENT));
            screenScore = Math.max(0, Math.min(100, 100 - penalty + (sData.productive * PRODUCTIVE_SCREEN_BONUS)));
        } else {
            // LOOPHOLE FIX: Assume moderate entertainment usage if not logged
            // This prevents users from getting 100 by not logging screen time
            const assumedPenalty = ENTERTAINMENT_PENALTY_COEFFICIENT * Math.pow(ASSUMED_SCREEN_ENTERTAINMENT, SCREEN_TIME_EXPONENT);
            screenScore = Math.max(0, Math.round(100 - assumedPenalty - DATA_UNCERTAINTY_PENALTY));
        }

        // ============================================
        // 3. NUTRITION SCORE (with meal completion penalty)
        // ============================================
        const nutritionData = todayLog.nutrition || { breakfast: [], lunch: [], dinner: [], junk: [] };
        const allMeals = [
            ...(nutritionData.breakfast || []),
            ...(nutritionData.lunch || []),
            ...(nutritionData.dinner || []),
            ...(nutritionData.junk || [])
        ];
        const junkMeals = nutritionData.junk || [];

        // Check meal completion status
        const mealStatus = {
            breakfast: (nutritionData.breakfast?.length || 0) > 0,
            lunch: (nutritionData.lunch?.length || 0) > 0,
            dinner: (nutritionData.dinner?.length || 0) > 0
        };
        const mealsLogged = Object.values(mealStatus).filter(Boolean).length;
        const mealCompletionPenalty = (3 - mealsLogged) * MISSING_MEAL_PENALTY;

        // Profile Targets
        const weight = parseFloat(profile.weight) || 70;
        const height = parseFloat(profile.height) || 170;
        const age = parseFloat(profile.age) || 25;
        const gender = profile.gender || 'male';

        let bmr = (10 * weight) + (6.25 * height) - (5 * age);
        bmr += gender === 'male' ? 5 : -161;
        const maintenanceCals = bmr * 1.55;

        const targetProtein = weight * PROTEIN_PER_KG;
        const targetFats = (maintenanceCals * FAT_CALORIES_PERCENTAGE) / 9;
        const targetCarbs = (maintenanceCals - (targetProtein * 4) - (targetFats * 9)) / 4;

        let ns = 0;
        if (allMeals.length > 0) {
            const totals = allMeals.reduce((acc, item) => ({
                protein: acc.protein + ((item.protein || 0) * (item.weight || 100) / 100),
                carbs: acc.carbs + ((item.carbs || 0) * (item.weight || 100) / 100),
                fats: acc.fats + ((item.fats || 0) * (item.weight || 100) / 100),
                mufa: acc.mufa + ((item.mufa || 0) * (item.weight || 100) / 100),
                pufa: acc.pufa + ((item.pufa || 0) * (item.weight || 100) / 100),
                transFats: acc.transFats + ((item.transFats || 0) * (item.weight || 100) / 100),
                essentialAA: acc.essentialAA + ((item.essentialAA || 0) * (item.weight || 100) / 100),
                nonEssentialAA: acc.nonEssentialAA + ((item.nonEssentialAA || 0) * (item.weight || 100) / 100),
                calories: acc.calories + ((item.calories || 0) * (item.weight || 100) / 100)
            }), { protein: 0, carbs: 0, fats: 0, mufa: 0, pufa: 0, transFats: 0, essentialAA: 0, nonEssentialAA: 0, calories: 0 });

            ns = calculateMacroScore(totals, {
                protein: targetProtein,
                carbs: targetCarbs,
                fats: targetFats
            }, 100);

            if (totals.fats > 0) {
                const fatQuality = calculateFatQualityIndex({
                    mufa: totals.mufa,
                    pufa: totals.pufa,
                    transFats: totals.transFats,
                    total: totals.fats
                });
                ns = (ns * (1 - FAT_QUALITY_WEIGHT)) + (fatQuality * FAT_QUALITY_WEIGHT);
            }

            if (totals.protein > 0) {
                const aaScore = calculateAminoAcidScore({
                    essential: totals.essentialAA,
                    nonEssential: totals.nonEssentialAA,
                    totalProtein: totals.protein
                });
                ns = (ns * (1 - AMINO_ACID_WEIGHT)) + (aaScore * AMINO_ACID_WEIGHT);
            }

            if (junkMeals.length > 0 && totals.calories > 0) {
                const junkCals = junkMeals.reduce((sum, item) =>
                    sum + ((item.calories || 0) * (item.weight || 100) / 100), 0);
                const junkRatio = junkCals / totals.calories;
                const junkPenalty = (Math.exp(2 * junkRatio) - 1) * JUNK_PENALTY_MULTIPLIER;
                ns = Math.max(0, ns - junkPenalty);
            }
        }

        // Apply meal completion penalty
        ns = Math.max(0, ns - mealCompletionPenalty);
        const nutritionScore = Math.min(100, Math.round(ns));

        // ============================================
        // 4. HYDRATION SCORE (Now standalone module!)
        // ============================================
        const hydration = todayLog.hydration || 0;
        let hydrationScore = 0;

        if (hydration > 0) {
            if (hydration >= HYDRATION_OPTIMAL_ML) {
                hydrationScore = 100;
            } else if (hydration >= HYDRATION_MINIMUM_ML) {
                // Linear scale from 1000ml (50) to 3000ml (100)
                hydrationScore = 50 + ((hydration - HYDRATION_MINIMUM_ML) / (HYDRATION_OPTIMAL_ML - HYDRATION_MINIMUM_ML)) * 50;
            } else {
                // Below minimum: 0-50 range
                hydrationScore = (hydration / HYDRATION_MINIMUM_ML) * 50;
            }
        } else {
            // No hydration logged - assume inadequate hydration
            hydrationScore = Math.max(0, 30 - DATA_UNCERTAINTY_PENALTY);
        }
        hydrationScore = Math.round(hydrationScore);

        // ============================================
        // 5. TRAINING SCORE
        // ============================================
        const trainingLog = todayLog.training || { totalVolume: 0 };
        const vol = parseFloat(trainingLog.totalVolume || 0);
        const hasTrainingData = vol > 0 || todayLog.trainingLogged;

        let trainingScore = 0;
        if (hasTrainingData || vol > 0) {
            let ts = Math.min(100, (vol / OPTIMAL_TRAINING_VOLUME) * 100);
            if (vol > OVERTRAINING_THRESHOLD) {
                ts *= calculateFatiguePenalty(vol, OVERTRAINING_THRESHOLD);
            }
            trainingScore = Math.round(ts);
        } else {
            // Rest day is valid - give neutral score but not 100
            trainingScore = 50; // Neutral for unlogged rest days
        }

        // ============================================
        // 6. SLEEP SCORE
        // ============================================
        const sleepLog = todayLog.sleep || { duration: 0, quality: 5, napDuration: 0 };
        const sleepHrs = parseFloat(sleepLog.duration || 0);
        const sleepQuality = parseFloat(sleepLog.quality || 5);
        const napMins = parseFloat(sleepLog.napDuration || 0);
        const hasSleepData = sleepHrs > 0;

        let sleepScore = 0;
        if (hasSleepData) {
            const durationScore = Math.max(0, Math.min(100, 100 - ((OPTIMAL_SLEEP_HOURS - sleepHrs) * SLEEP_DEFICIT_PENALTY)));
            const qualityScore = (sleepQuality / 10) * 100;
            const napBonus = Math.min(MAX_NAP_BONUS, (napMins / 60) * NAP_BONUS_RATE);
            sleepScore = Math.min(100, Math.round((durationScore * SLEEP_DURATION_WEIGHT) + (qualityScore * SLEEP_QUALITY_WEIGHT) + napBonus));
        } else {
            // No sleep logged - apply uncertainty penalty
            sleepScore = Math.max(0, 50 - DATA_UNCERTAINTY_PENALTY);
        }

        // ============================================
        // SYSTEM SCORE (Now includes HYDRATION!)
        // ============================================
        const moduleScores = [
            { id: 'LEARNING', val: learningScore, weight: 1.0 },
            { id: 'SCREEN', val: Math.round(screenScore), weight: 1.1 },
            { id: 'NUTRITION', val: nutritionScore, weight: 1.0 },
            { id: 'TRAINING', val: trainingScore, weight: 0.9 },
            { id: 'SLEEP', val: sleepScore, weight: 1.2 },
            { id: 'HYDRATION', val: hydrationScore, weight: 0.8 } // NEW MODULE!
        ];

        const sys = geometricMean(
            moduleScores.map(m => m.val),
            moduleScores.map(m => m.weight)
        );

        // INSIGHTS
        const sortedByDeficit = [...moduleScores].sort((a, b) => a.val - b.val);
        const primaryLiability = sortedByDeficit[0];
        const leverage = sortedByDeficit.map(m => ({
            ...m,
            gain: (100 - m.val) * m.weight
        })).sort((a, b) => b.gain - a.gain);

        setScores({
            learning: learningScore,
            screen: Math.round(screenScore),
            nutrition: nutritionScore,
            training: trainingScore,
            sleep: sleepScore,
            hydration: hydrationScore, // NEW!
            system: Math.round(sys),
            // Completion status for UI
            mealStatus,
            dataLogged: {
                learning: hasLearningData,
                screen: hasScreenData,
                nutrition: mealsLogged > 0,
                training: hasTrainingData,
                sleep: hasSleepData,
                hydration: hydration > 0
            },
            insights: {
                liability: primaryLiability,
                leverage: leverage
            }
        });
    };

    return scores;
};
