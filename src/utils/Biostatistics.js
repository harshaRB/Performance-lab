/**
 * BIOSTATISTICS UTILITY LIBRARY
 * Vyclo Labs Algorithm Core
 */

import HistoricalDataManager from './HistoricalDataManager';

// Logistic Saturation Function
export const logistic = (z, k = 1, c = 0) => {
    return 1 / (1 + Math.exp(-k * (z - c)));
};

// Weighted Geometric Mean
export const geometricMean = (scores, weights) => {
    if (scores.length !== weights.length) return 0;
    let product = 1;
    let _totalWeight = 0;
    for (let i = 0; i < scores.length; i++) {
        const val = Math.max(1, scores[i]);
        const w = weights[i];
        const normalizedScore = val / 100;
        product *= Math.pow(normalizedScore, w);
        _totalWeight += w;
    }
    return product * 100;
};

// Rolling Z-Score Calculation with REAL baseline
export const calculateZScore = (current, metricName) => {
    const baseline = HistoricalDataManager.calculateBaseline(metricName, 14);

    if (baseline.dataPoints < 3) {
        // Not enough history, return neutral z-score
        return 0;
    }

    return (current - baseline.mean) / baseline.stddev;
};

// Baseline Storage Helper (DEPRECATED - now using HistoricalDataManager)
export const getBaseline = (_metricKey) => {
    // Fallback for backward compatibility
    return [10, 20, 15, 30, 25, 10, 20, 15, 30, 25, 15, 20, 25, 30];
};

/**
 * NUTRITION SPECIFIC MATH
 */

// Distance-from-optimal modeling
export const calculateMacroScore = (actual, optimal, sigma = 50) => {
    let distSum = 0;

    distSum += Math.abs(actual.protein - optimal.protein);
    distSum += Math.abs(actual.carbs - optimal.carbs);
    distSum += Math.abs(actual.fats - optimal.fats);

    return Math.exp(-distSum / sigma) * 100;
}

// Fat Quality Index
export const calculateFatQualityIndex = (fats) => {
    const { mufa = 0, pufa = 0, transFats = 0, total = 1 } = fats;

    // MUFA and PUFA are good (bonus)
    const goodFats = mufa + pufa;
    const goodRatio = goodFats / total;

    // Trans fats are terrible (exponential penalty)
    const transPenalty = Math.exp(transFats * 0.5); // Exponential growth

    // Score: 0-100, higher is better
    const baseScore = goodRatio * 100;
    const finalScore = baseScore / transPenalty;

    return Math.min(100, Math.max(0, finalScore));
};

// Amino Acid Completeness (Limiting Amino Acid Model)
export const calculateAminoAcidScore = (aminoAcids) => {
    const { essential = 0, nonEssential: _nonEssential = 0, totalProtein = 1 } = aminoAcids;

    // Essential AA should be ~40-50% of total protein
    const essentialRatio = essential / totalProtein;
    const optimalRatio = 0.45;

    // Distance from optimal
    const deviation = Math.abs(essentialRatio - optimalRatio);
    const score = Math.exp(-deviation * 10) * 100;

    return Math.min(100, Math.max(0, score));
};

/**
 * TRAINING SPECIFIC MATH
 */
// Fatigue Curve
export const calculateFatiguePenalty = (volume, optimalVolume) => {
    if (volume <= optimalVolume) return 1; // No penalty

    const excess = volume - optimalVolume;
    const penalty = 1 - (Math.pow(excess, 2) / Math.pow(optimalVolume, 2));
    return Math.max(0, penalty);
}
