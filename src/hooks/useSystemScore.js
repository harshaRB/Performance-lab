import { useEffect } from 'react';
import { logistic, geometricMean, calculateZScore, calculateMacroScore, calculateFatiguePenalty, calculateFatQualityIndex, calculateAminoAcidScore } from '../utils/Biostatistics';
import { useAppStore } from '../store/useAppStore';

// Screen time penalty constants
const SOCIAL_PENALTY_COEFFICIENT = 0.015;
const ENTERTAINMENT_PENALTY_COEFFICIENT = 0.02;
const SCREEN_TIME_EXPONENT = 1.8;
const PRODUCTIVE_SCREEN_BONUS = 0.1;

// Nutrition constants
const PROTEIN_PER_KG = 2.2;
const FAT_CALORIES_PERCENTAGE = 0.25;
const FAT_QUALITY_WEIGHT = 0.15;
const AMINO_ACID_WEIGHT = 0.10;
const JUNK_PENALTY_MULTIPLIER = 30;

// Hydration constants
const HYDRATION_MIN_MULTIPLIER = 0.9;
const HYDRATION_MAX_MULTIPLIER = 1.05;
const HYDRATION_OPTIMAL_ML = 3000;

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
    }, [dailyLogs, profile, today]);

    const calculateAll = () => {
        // 1. LEARNING
        const readData = dailyLogs[today]?.learning || { active: 0, passive: 0 };
        const ell = (readData.active * 1.5) + readData.passive;
        const zLearning = calculateZScore(ell, 'learning');
        const learningScore = Math.min(100, Math.round(logistic(zLearning, 0.8, 0.5) * 100));

        // 2. SCREEN
        const sData = dailyLogs[today]?.screen || { social: 0, entertainment: 0, productive: 0 };
        const penalty = (SOCIAL_PENALTY_COEFFICIENT * Math.pow(sData.social, SCREEN_TIME_EXPONENT)) +
            (ENTERTAINMENT_PENALTY_COEFFICIENT * Math.pow(sData.entertainment, SCREEN_TIME_EXPONENT));
        const sts = Math.max(0, Math.min(100, 100 - penalty + (sData.productive * PRODUCTIVE_SCREEN_BONUS)));

        // 3. NUTRITION
        const nutritionData = dailyLogs[today]?.nutrition || { breakfast: [], lunch: [], dinner: [], junk: [] };
        const allMeals = [...(nutritionData.breakfast || []), ...(nutritionData.lunch || []), ...(nutritionData.dinner || []), ...(nutritionData.junk || [])];
        const junkMeals = nutritionData.junk || [];

        // Hydration logic - check both dailyLogs and individual state
        const hydration = dailyLogs[today]?.hydration || 0;

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
                protein: acc.protein + ((item.protein || 0) * item.weight / 100),
                carbs: acc.carbs + ((item.carbs || 0) * item.weight / 100),
                fats: acc.fats + ((item.fats || 0) * item.weight / 100),
                mufa: acc.mufa + ((item.mufa || 0) * item.weight / 100),
                pufa: acc.pufa + ((item.pufa || 0) * item.weight / 100),
                transFats: acc.transFats + ((item.transFats || 0) * item.weight / 100),
                essentialAA: acc.essentialAA + ((item.essentialAA || 0) * item.weight / 100),
                nonEssentialAA: acc.nonEssentialAA + ((item.nonEssentialAA || 0) * item.weight / 100),
                calories: acc.calories + ((item.calories || 0) * item.weight / 100)
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

            if (junkMeals.length > 0) {
                const junkCals = junkMeals.reduce((sum, item) =>
                    sum + ((item.calories || 0) * item.weight / 100), 0);
                const junkRatio = junkCals / totals.calories;
                const junkPenalty = (Math.exp(2 * junkRatio) - 1) * JUNK_PENALTY_MULTIPLIER;
                ns = Math.max(0, ns - junkPenalty);
            }
        }

        const hydrationMultiplier = Math.min(HYDRATION_MAX_MULTIPLIER,
            Math.max(HYDRATION_MIN_MULTIPLIER,
                HYDRATION_MIN_MULTIPLIER + (hydration / HYDRATION_OPTIMAL_ML) * (HYDRATION_MAX_MULTIPLIER - HYDRATION_MIN_MULTIPLIER)));
        const nutritionScore = Math.min(100, Math.round(ns * hydrationMultiplier));

        // 4. TRAINING
        const trainingLog = dailyLogs[today]?.training || { totalVolume: 0 };
        const vol = parseFloat(trainingLog.totalVolume || 0);
        let ts = Math.min(100, (vol / OPTIMAL_TRAINING_VOLUME) * 100);
        if (vol > OVERTRAINING_THRESHOLD) ts *= calculateFatiguePenalty(vol, OVERTRAINING_THRESHOLD);
        const trainingScore = Math.round(ts);

        // 5. SLEEP
        const sleepLog = dailyLogs[today]?.sleep || { duration: 0, quality: 5, napDuration: 0 };
        const sleepHrs = parseFloat(sleepLog.duration || 0);
        const sleepQuality = parseFloat(sleepLog.quality || 5);
        const napMins = parseFloat(sleepLog.napDuration || 0);

        const durationScore = Math.max(0, Math.min(100, 100 - ((OPTIMAL_SLEEP_HOURS - sleepHrs) * SLEEP_DEFICIT_PENALTY)));
        const qualityScore = (sleepQuality / 10) * 100;
        const napBonus = Math.min(MAX_NAP_BONUS, (napMins / 60) * NAP_BONUS_RATE);
        const sleepScore = Math.min(100, Math.round((durationScore * SLEEP_DURATION_WEIGHT) + (qualityScore * SLEEP_QUALITY_WEIGHT) + napBonus));

        // SYSTEM
        const moduleScores = [
            { id: 'LEARNING', val: learningScore, weight: 1.2 },
            { id: 'SCREEN', val: Math.round(sts), weight: 1.1 },
            { id: 'NUTRITION', val: nutritionScore, weight: 1.0 },
            { id: 'TRAINING', val: trainingScore, weight: 1.0 },
            { id: 'SLEEP', val: Math.round(sleepScore), weight: 1.2 }
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
            screen: Math.round(sts),
            nutrition: nutritionScore,
            training: trainingScore,
            sleep: Math.round(sleepScore),
            system: Math.round(sys),
            insights: {
                liability: primaryLiability,
                leverage: leverage
            }
        });
    };

    return scores;
};
